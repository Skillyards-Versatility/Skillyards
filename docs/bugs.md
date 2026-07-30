# Chat Module — Bugs, Loopholes & Slack-Grade Plan

> Generated: 2026-07-30
> Scope: `/chat` feature across `apps/admin` (server actions) and `apps/api` (route handlers)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Critical Bugs (Will Crash)](#2-critical-bugs-will-crash)
3. [Functional Bugs (Wrong Behaviour)](#3-functional-bugs-wrong-behaviour)
4. [UX/UI Bugs & Shortcomings](#4-uxui-bugs--shortcomings)
5. [Missing Slack-Level Features](#5-missing-slack-level-features)
6. [Positive Flows (Working Well)](#6-positive-flows-working-well)
7. [Implementation Plan](#7-implementation-plan)
8. [File Dispatch](#8-file-dispatch)

---

## 1. Architecture Overview

The chat system has **two parallel, incompatible codebases**:

| Aspect | `apps/admin` (Server Actions) | `apps/api` (Route Handlers) |
|--------|------|------|
| **Tables used** | `conversations`, `conversation_participants`, `messages`, `message_reactions` | Same imports + **`channels`** table (doesn't exist in schema) |
| **Status** | Mostly works | **Broken** — crashes on import |
| **Real-time** | 30s polling `setInterval` | SSE endpoints (unconsumed) poll DB every 3s |
| **Data model** | DMs + Channels both in `conversations` | Separate `channels` table + `conversations` |
| **Files** | `ChatPageClient.jsx`, `ChatThreadClient.jsx`, `actions/chat.js` | `modules/chat/*`, `app/api/channels/*`, `app/api/conversations/*` |

### DB Schema (as-is)

```
conversations:
  id, type("dm"|"channel"), name, created_by, created_at, updated_at

conversation_participants:
  id, conversation_id, user_id, role("member"|"admin"), last_read_at, joined_at

messages:
  id, conversation_id, sender_id, content, parent_id, created_at
  ❌ NO deleted_at, edited_at, file_key, file_type, file_name

message_reactions:
  id, message_id, user_id, emoji, created_at
  UNIQUE(message_id, user_id, emoji)
```

---

## 2. Critical Bugs (Will Crash)

### 2.1 — Missing `channels` table
**File:** `apps/api/src/modules/chat/channels.repository.js:1`
```js
import { channels, conversationParticipants, users, messages } from "@repo/db";
```
`channels` is NOT exported from `packages/db/src/schema/index.js`. No `channels` table exists anywhere. **This file will crash on import.**
- **Impact:** Every API route that imports `channels.service.js` → `channels.repository.js` is broken:
  - `GET /api/channels`
  - `POST /api/channels`
  - `GET /api/channels/[id]`
  - `PUT /api/channels/[id]`
  - `DELETE /api/channels/[id]`
  - `POST /api/channels/[id]/join`
  - `GET /api/channels/[id]/messages`
  - `GET /api/channels/[id]/events`

### 2.2 — Missing column `channelId` in `conversationParticipants`
**File:** `apps/api/src/modules/chat/channels.repository.js:96`
```sql
WHERE conversationParticipants.channelId = channelId
```
`conversation_participants` table has `conversation_id`, NOT `channel_id`. Every channel query will throw SQL error.

### 2.3 — Missing columns `deletedAt`, `editedAt` in `messages` table
**Files referencing nonexistent columns:**
- `apps/api/src/app/api/conversations/[id]/events/route.js:87` — `isNull(messages.deletedAt)`
- `apps/api/src/app/api/channels/[id]/events/route.js:93` — `isNull(messages.deletedAt)`
- `apps/api/src/app/api/channels/[id]/events/route.js:123` — `gt(messages.editedAt, ...)`
- `apps/api/src/app/api/messages/[id]/replies/route.js` — no deletedAt check (good)
- `apps/api/src/modules/chat/messages.repository.js:7` — `isNull(messages.deletedAt)`
- `apps/api/src/modules/chat/messages.repository.js:82` — `softDeleteMessage` sets `deletedAt`
- `apps/api/src/modules/chat/messages.repository.js:74` — `updateMessageContent` sets `editedAt`

**Impact:** Every query filtering or setting `deletedAt`/`editedAt` throws `column "deleted_at" does not exist` — including edit, delete, and all SSE event streams.

### 2.4 — Missing columns `channelId`, `fileKey`, `fileType`, `fileName`, `type` in `messages` table
**File:** `apps/api/src/modules/chat/messages.repository.js:46-62`
```js
db.insert(messages).values({
  channelId: data.channelId || null,
  fileKey: data.fileKey || null,
  fileType: data.fileType || null,
  fileName: data.fileName || null,
  type: data.type || "text",
  ...
})
```
None of these columns exist in the `messages` schema. **`sendMessage` via the API will crash.**

### 2.5 — SSE event routes reference all missing columns
**Files:** 
- `apps/api/src/app/api/conversations/[id]/events/route.js`
- `apps/api/src/app/api/channels/[id]/events/route.js`

Both query `messages.deletedAt`, `messages.editedAt`, `messages.channelId` — all nonexistent. SSE endpoints return 500 errors immediately.

### 2.6 — `channels/[id]/events` imports `channels` table
**File:** `apps/api/src/app/api/channels/[id]/events/route.js:159`
```js
.innerJoin(messages, eq(messages.channelId, channelId))
```
Uses `messages.channelId` which doesn't exist in the schema.

---

## 3. Functional Bugs (Wrong Behaviour)

### 3.1 — Stale closure in `fetchMessages` causes interval thrashing
**File:** `apps/admin/src/components/chat/ChatThreadClient.jsx:158-185`
```js
const fetchMessages = useCallback(async () => {
    const latestMsg = messages[messages.length - 1];  // depends on messages
    ...
}, [conversationId, messages]);  // messages in deps → recreates callback every poll

useEffect(() => {
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);  // cleanup + re-run every 30s
}, [fetchMessages]);  // dependency changes every poll → interval resets
```
**Behaviour:** Every poll response changes `messages`, which recreates `fetchMessages`, which causes `useEffect` cleanup + re-run. The 30s timer never stabilises. Short windows where no polling happens.

**Fix:** Use a ref to track latest message timestamp, don't depend on `messages` in the callback.

### 3.2 — `getMessages` uses `>=` for since filter → duplicates
**File:** `apps/admin/src/actions/chat.js:468`
```js
conditions.push(sql`${messages.createdAt} >= ${new Date(since)}`);
```
If two messages have the same timestamp (possible with `defaultNow()`), the boundary message gets fetched twice every poll. Should be `>`.

### 3.3 — Thread replies API hardcodes `reactions: []`
**File:** `apps/api/src/app/api/messages/[id]/replies/route.js:29`
```js
reactions: []  // hardcoded empty instead of actual DB query
```
Thread replies never show existing reactions. Users can add reactions via the frontend toggling, but they won't appear in the thread panel.

### 3.4 — Optimistic send clears input before API resolves
**File:** `apps/admin/src/components/chat/ChatThreadClient.jsx:219-221`
```js
setSending(true);
setNewMessage("");   // cleared BEFORE await
const result = await sendMessage(conversationId, content);
// on failure: setNewMessage(content) restores it
```
Causes visual flicker — message disappears from input, then reappears if send fails. Quick typists can lose their message content if the restore races with a new keystroke.

### 3.5 — Channel member count shows `"..."` until manual click
**File:** `apps/admin/src/components/chat/ChatThreadClient.jsx:448-456`
```jsx
{members.length || "..."}
```
`members` is empty until `handleOpenMembers` is called (user clicks the button). No `useEffect` to auto-load on mount. Shows `"..."` for every channel until user opens the members panel.

### 3.6 — `handleSend` disabled state unreliable
**File:** `apps/admin/src/components/chat/ChatThreadClient.jsx:589`
```jsx
disabled={!newMessage.trim() || sending}
```
Since `newMessage` is cleared optimistically (bug 3.4) before `sending` is set to true, the button briefly becomes enabled again during the API call. A double-send is possible.

### 3.7 — `ensureTeamChannels` creates channels per-user but doesn't refresh conv list
**File:** `apps/admin/src/components/chat/ChatPageClient.jsx:35-39`
`ensureTeamChannels()` is called but the team channels it creates are not visible until the next full page reload. The `setConversations(convs)` after the call may not reflect newly created channels because `getMyConversations` is called right after creation and the DB may not have flushed yet.

---

## 4. UX/UI Bugs & Shortcomings

### 4.1 — No edit/delete message UI
Backend fully supports editing (`PUT /api/messages/[id]`) and deletion (`DELETE /api/messages/[id]`). Frontend has zero UI for either — no context menu, no long-press, no edit button.

### 4.2 — Emoji picker is extremely limited
**File:** `ChatThreadClient.jsx:50-51`
```js
const COMMON_EMOJIS = ["👍", "❤️", "😄", "😮", "😢", "😡"];
```
Only 6 hardcoded emojis. No search, no categories, no skin tone variants. Slack offers 800+ emojis with search and skin tones.

### 4.3 — No typing indicators
Users have no idea if someone is typing a reply. Chat feels dead between messages.

### 4.4 — No user presence indicators
`users` table has `lastSeenAt`, `statusEmoji`, `statusText`. API has `GET/PATCH /api/users/presence` and `GET/PATCH /api/users/status`. Frontend shows **none** of these — no online/away dots, no custom status, no "last seen X ago".

### 4.5 — No read receipts
`conversation_participants` has `lastReadAt`. `markAsRead(conversationId)` runs on mount and on new messages. But UI never shows who has read a message — no ✅✅, no "Seen by X".

### 4.6 — No file/image attachment UI
Backend message schema and repository support `fileKey`, `fileType`, `fileName`. Frontend has no upload button, no drag-drop zone, no image/file rendering inside message bubbles.

### 4.7 — No "Replying to" indicator in thread
When thread panel is open and user starts typing, there's no visual indicator saying "Replying to [name]". The connection between the reply input and the parent message is unclear.

### 4.8 — No leave channel button
`leaveChannel(channelId)` exists in `actions/chat.js:327`. No UI button anywhere to call it.

### 4.9 — No message search
No way to search messages within a conversation or across all conversations.

### 4.10 — No loading skeleton
Messages list goes from nothing to rendered. No placeholder/skeleton to indicate content is loading.

### 4.11 — No connection status indicator
When SSE is implemented, there's no visual indicator showing connected / reconnecting / disconnected state.

### 4.12 — No error banner
Failed message loads only show a toast. No inline error state in the message area.

### 4.13 — Channel name validation is backend-only
Channel creation input accepts any text, then backend returns error. No real-time validation feedback (min length, allowed chars, availability check).

### 4.14 — No markdown rendering
Message content is displayed as plain text (`whitespace-pre-wrap break-words`). No code blocks, bold, italic, links, or @mentions.

### 4.15 — No "Browse Channels"
Users can only see channels they're already in. No way to discover public channels and join them.

### 4.16 — SSE never consumed by frontend
Both SSE endpoints (`/api/channels/[id]/events` and `/api/conversations/[id]/events`) exist but are never opened as `EventSource`. Instead, frontend uses 30s polling. Wasted backend infrastructure + poor real-time UX.

---

## 5. Missing Slack-Level Features

| Feature | Slack | Current | Priority |
|---------|-------|---------|----------|
| Real-time messaging | WebSocket | 30s polling | **Critical** |
| Typing indicators | ✅ | ❌ | High |
| Message edit/delete | ✅ | Backend only | High |
| File/image sharing | ✅ | Backend schema only | High |
| Proper emoji picker | 800+ with search | 6 hardcoded | Medium |
| User presence dots | ✅ | Backend + API exist, no UI | Medium |
| Read receipts | ✅ | Backend exists, no UI | Medium |
| @mentions | ✅ | ❌ | Medium |
| Markdown rendering | ✅ | ❌ | Medium |
| Message search | ✅ | ❌ | Medium |
| Channel browser | ✅ | ❌ | Medium |
| Custom status | ✅ | Backend + API exist, no UI | Low |
| Pinned messages | ✅ | ❌ | Low |
| Message threading | ✅ | Basic implementation | Low (works) |
| Reactions | ✅ | Basic implementation | Low (works) |
| Unread badges | ✅ | Working | ✅ |

---

## 6. Positive Flows (Working Well)

### 6.1 — DM creation
`getOrCreateConversation(userId)` — checks existing DMs before creating new. User picker modal with search. "Existing" label on users you already have a DM with.

### 6.2 — Channel creation
Modal with name input + member multi-select with checkboxes + search. Validation on backend (duplicate name, allowed characters). Admin auto-added.

### 6.3 — Optimistic message sending
Message appears immediately in the list before API responds. Feels instant.

### 6.4 — Reactions toggle
`toggleReaction` handles both add/remove. Optimistic UI updates through `setMessages` + `setThreadReplies`. State is consistent between main view and thread view.

### 6.5 — Thread panel
Full-screen on mobile, sidebar on desktop. Parent message shown at top with replies below. Separate input for thread replies. Reply count updates on parent message.

### 6.6 — Date separators
`shouldShowDateSeparator` logic correctly inserts "Today", "Yesterday", or date dividers between message groups.

### 6.7 — Unread badges
Unread count displayed per conversation in sidebar (capped at 99+). `markAsRead` called on conversation mount and after polling fetches new messages.

### 6.8 — Auto-scroll
`scrollToBottom` only fires when user is near bottom (`scrollHeight - scrollTop - clientHeight < 100`). Doesn't fight user scrolling up to read history.

### 6.9 — Dark mode
Full dark mode support via Tailwind `dark:` variants on every element.

### 6.10 — Responsive modals
All modals (user picker, channel create, members, add people) are bottom-sheets on mobile, centered dialogs on desktop.

### 6.11 — Visibility/focus polling
Polls immediately when tab becomes visible (`visibilitychange`) or window gains focus (`focus` event), not just on the 30s interval.

### 6.12 — Channel member management
"Add People" with multi-select + search. "Add Everyone" button with confirmation dialog. Admin-role enforcement on backend.

### 6.13 — Push notifications
`webPush.sendNotification` called after each message (non-blocking). Expired subscriptions cleaned up (410 → set null).

### 6.14 — Mark-as-read on return
`markAsRead(conversationId)` runs on mount and after every successful `fetchMessages` poll.

---

## 7. Implementation Plan

### Phase 1 — Fix the Broken Foundation

| # | File(s) | Change |
|---|---------|--------|
| 1 | `packages/db/src/schema/chat.js` | Add `deletedAt`, `editedAt`, `fileKey`, `fileType`, `fileName` columns |
| 2 | `apps/api/src/modules/chat/channels.repository.js` | Remove — `channels` table doesn't exist; consolidate to `conversations` |
| 3 | `apps/api/src/modules/chat/messages.repository.js` | Remove `channelId`, `fileKey`, `fileType`, `fileName`, `type` from `createMessageRecord` (or add columns to schema) |
| 4 | `apps/api/src/app/api/channels/[id]/events/route.js` | Fix queries to use `conversationId` instead of `channelId`, remove `deletedAt`/`editedAt` refs or add migration |
| 5 | `apps/api/src/app/api/conversations/[id]/events/route.js` | Same fixes |
| 6 | `apps/api/src/app/api/messages/[id]/replies/route.js` | Replace `reactions: []` with real reaction counts from DB |
| 7 | `ChatThreadClient.jsx:158-185` | Fix stale closure — use `useRef` for latest timestamp, remove `messages` from deps |

### Phase 2 — SSE Real-Time (Replace Polling)

| # | File(s) | Change |
|---|---------|--------|
| 8 | `ChatThreadClient.jsx` | Open `EventSource` to `/api/conversations/[id]/events` on mount |
| 9 | Same | Handle events: `new_message`, `message_updated`, `message_deleted`, `reaction_added`, `heartbeat` — merge into state |
| 10 | Same | Remove 30s `setInterval` polling |
| 11 | Same | Add reconnection with exponential backoff (1s → 2s → 4s → 8s → 16s max) |
| 12 | Same | Add connection status dot: 🟢 connected, 🟡 reconnecting, 🔴 disconnected |

### Phase 3 — File Attachments

| # | File(s) | Change |
|---|---------|--------|
| 13 | `apps/admin/src/actions/chat.js` | Add `uploadChatFile(formData)` → returns fileKey |
| 14 | `ChatThreadClient.jsx` | Add upload button + drag-drop zone near input |
| 15 | Same | Show upload progress, render attachments (image inline, file as link) |
| 16 | `sendMessage` action | Accept `fileKey`, `fileType`, `fileName` params |

### Phase 4 — Emoji Picker

| # | File(s) | Change |
|---|---------|--------|
| 17 | Install `emoji-mart` | Full emoji picker with search + categories |
| 18 | `ChatThreadClient.jsx:52-71` | Replace 6-emoji hardcode with proper picker |

### Phase 5 — Edit & Delete Messages

| # | File(s) | Change |
|---|---------|--------|
| 19 | `ChatThreadClient.jsx` | Add hover actions on own messages: Edit, Delete |
| 20 | Same | Edit: inline input replacing message bubble → PUT `/api/messages/[id]` |
| 21 | Same | Delete: confirm dialog → DELETE `/api/messages/[id]` |

### Phase 6 — Typing Indicators

| # | File(s) | Change |
|---|---------|--------|
| 22 | `apps/api` (new route) | `POST /api/conversations/[id]/typing` |
| 23 | `ChatThreadClient.jsx` | Emit typing events on keystroke, show "[name] is typing..." |

### Phase 7 — User Presence & Read Receipts

| # | File(s) | Change |
|---|---------|--------|
| 24 | `ChatThreadClient.jsx` + `ChatPageClient.jsx` | PATCH `/api/users/presence` heartbeat every 60s |
| 25 | Same | Presence dots on avatars (green if `lastSeenAt` < 2min) |
| 26 | `actions/chat.js` | `getReadReceipts(conversationId)` → show "Seen by X" |

### Phase 8 — Channel Management

| # | File(s) | Change |
|---|---------|--------|
| 27 | `ChatPageClient.jsx` | "Browse Channels" option showing joinable public channels |
| 28 | `ChatThreadClient.jsx` | Leave channel button in members panel |
| 29 | Same | Channel description display below header |

### Phase 9 — UI Polish

| # | File(s) | Change |
|---|---------|--------|
| 30 | `ChatThreadClient.jsx` | Loading skeleton for initial messages |
| 31 | Same | Error banner for connection loss / load failure |
| 32 | Same | Timestamps on hover for every message |
| 33 | Same | Scroll-to-bottom FAB when scrolled up |
| 34 | Same | Markdown rendering for message content |

---

## 8. File Dispatch

| File | Action |
|------|--------|
| `packages/db/src/schema/chat.js` | **MODIFY** — add columns |
| `apps/api/src/modules/chat/channels.repository.js` | **DELETE** or rewrite to use conversations |
| `apps/api/src/modules/chat/messages.repository.js` | **MODIFY** — remove missing column inserts |
| `apps/api/src/modules/chat/messages.service.js` | **MODIFY** — remove `channelId` branching |
| `apps/api/src/modules/chat/chat.schema.js` | **NO CHANGE** (schema is fine) |
| `apps/api/src/app/api/channels/*` | **MODIFY** — fix queries or mark as deprecated |
| `apps/api/src/app/api/conversations/[id]/events/route.js` | **MODIFY** — fix queries, add events |
| `apps/api/src/app/api/messages/[id]/replies/route.js` | **MODIFY** — return real reactions |
| `apps/api/src/app/api/messages/[id]/route.js` | **NO CHANGE** (edit/delete already work) |
| `apps/admin/src/actions/chat.js` | **MODIFY** — add upload/edit/delete actions, fix `>=` bug |
| `apps/admin/src/components/chat/ChatPageClient.jsx` | **MODIFY** — browse channels, presence dots |
| `apps/admin/src/components/chat/ChatThreadClient.jsx` | **MODIFY** — SSE, emoji, upload, edit/delete, typing, presence, read receipts, polish |
| `apps/admin/src/app/(authenticated)/chat/page.js` | **NO CHANGE** (server component fine) |
| `apps/admin/src/app/(authenticated)/chat/[id]/page.js` | **NO CHANGE** (server component fine) |
