# Chat Module — Bugs, Loopholes & Slack-Grade Plan

> Generated: 2026-07-30
> Last Updated: 2026-07-30
> Scope: `/chat` feature across `apps/admin` (server actions) and `apps/api` (route handlers)

---

## Status Summary

| Phase | Status |
|-------|--------|
| **Phase 1** — Fix Broken Foundation | ✅ **COMPLETE** |
| **Phase 2** — SSE Real-Time | ✅ **COMPLETE** |
| **Phase 3** — File Attachments | ✅ **COMPLETE** |
| **Phase 4** — Emoji Picker | ✅ **COMPLETE** |
| **Phase 5** — Edit & Delete Messages | ✅ **COMPLETE** |
| **Phase 6** — Typing Indicators | ✅ **COMPLETE** |
| **Phase 7** — Presence & Read Receipts | ✅ **COMPLETE** |
| **Phase 8** — Channel Management | ✅ **COMPLETE** |
| **Phase 9** — UI Polish | 🔶 **PARTIAL** (skeleton, error banner, markdown rendering, scroll-to-bottom FAB done) |

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

The chat system uses **two codebases sharing the same DB schema**:

| Aspect | `apps/admin` (Server Actions) | `apps/api` (Route Handlers) |
|--------|------|------|
| **Tables used** | `conversations`, `conversation_participants`, `messages`, `message_reactions` | Same |
| **Status** | Working | Working (after Phase 1 fixes) |
| **Real-time** | SSE `EventSource` with exponential backoff | SSE endpoints poll DB every 3s |
| **Data model** | DMs + Channels both in `conversations` | Same |
| **Files** | `ChatPageClient.jsx`, `ChatThreadClient.jsx`, `actions/chat.js` | `modules/chat/*`, `app/api/channels/*`, `app/api/conversations/*` |

### DB Schema (current — all columns present)

```
conversations:
  id, type("dm"|"channel"), name, created_by, created_at, updated_at

conversation_participants:
  id, conversation_id, user_id, role("member"|"admin"), last_read_at, joined_at

messages:
  id, conversation_id, sender_id, content, parent_id,
  file_key, file_type, file_name,
  created_at, edited_at, deleted_at

message_reactions:
  id, message_id, user_id, emoji, created_at
  UNIQUE(message_id, user_id, emoji)
```

---

## 2. Critical Bugs (Will Crash)

All critical bugs from the original report have been **fixed**. The schema now has all required columns (`deleted_at`, `edited_at`, `file_key`, `file_type`, `file_name`). The `channels.repository.js` was rewritten to use the `conversations` table instead of a nonexistent `channels` table. SSE event routes use `conversationId` and existing columns.

---

## 3. Functional Bugs (Wrong Behaviour)

### 3.1 — Stale closure in `fetchMessages` — ✅ FIXED
**File:** `apps/admin/src/components/chat/ChatThreadClient.jsx:177-200`
Uses `useRef` (`latestTimestampRef`) instead of depending on `messages`. No interval thrashing.

### 3.2 — `getMessages` uses `>` for since filter — ✅ FIXED
**File:** `apps/admin/src/actions/chat.js:468`
Changed from `>=` to `>` to prevent duplicate fetches.

### 3.3 — Thread replies API hardcodes `reactions: []` — ✅ FIXED
**File:** `apps/api/src/app/api/messages/[id]/replies/route.js`
Now queries real reactions from DB with proper `COUNT` and `bool_or` aggregation.

### 3.4 — Optimistic send clears input before API resolves — ✅ FIXED
**File:** `apps/admin/src/components/chat/ChatThreadClient.jsx`
Input now only cleared after successful API response. On failure, message stays in input. No flicker.

### 3.5 — Channel member count shows `"..."` until manual click — ✅ FIXED
**File:** `apps/admin/src/components/chat/ChatThreadClient.jsx:171-175`
`useEffect` now auto-loads members on mount. No longer shows `"..."`.

### 3.6 — `handleSend` disabled state unreliable — ✅ FIXED
**File:** `apps/admin/src/components/chat/ChatThreadClient.jsx`
Input no longer cleared before API resolves. `sending` flag prevents double-send. Button stays disabled throughout.

### 3.7 — `ensureTeamChannels` creates channels per-user but doesn't refresh conv list — ✅ FIXED
**File:** `apps/admin/src/components/chat/ChatPageClient.jsx`
`ensureTeamChannels` runs once on mount, then `getMyConversations` is called. 30s polling replaced with 60s refresh and visibility/focus-based refresh.

---

## 4. UX/UI Bugs & Shortcomings

### 4.1 — No edit/delete message UI — ✅ FIXED
Both edit and delete have hover actions, inline edit input, and confirm dialog.

### 4.2 — Emoji picker is extremely limited — ✅ FIXED
Full `emoji-picker-react` picker with search + categories replaces 6 hardcoded emojis.

### 4.3 — No typing indicators — ✅ FIXED
`POST /api/conversations/[id]/typing` route created. In-memory typing store with 4s TTL. SSE emits `typing` events. Frontend shows "[name] is typing..." debounced on keystroke.

### 4.4 — No user presence indicators — ✅ FIXED
Presence heartbeat (PATCH `/api/users/presence`) runs every 60s. Green dot on avatars when `lastSeenAt` < 2min.

### 4.5 — No read receipts — ✅ FIXED
`getReadReceipts` action returns users who have read the conversation. "Seen by X" indicator in header.

### 4.6 — No file/image attachment UI — ✅ FIXED
File input button, image preview, file link rendering all present.

### 4.7 — No "Replying to" indicator in thread — ❌ REMAINS
No visual indicator showing "Replying to [name]" in the thread panel.

### 4.8 — No leave channel button — ✅ FIXED
"Leave Channel" button added in members panel with confirmation dialog.

### 4.9 — No message search — ❌ REMAINS
No way to search messages within or across conversations.

### 4.10 — No loading skeleton — ✅ FIXED
Animated skeleton placeholders shown while messages array is empty.

### 4.11 — No connection status indicator — ✅ FIXED
SSE connection status dot (green/yellow/gray) in the header + error banner when disconnected.

### 4.12 — No error banner — ✅ FIXED
Red error banner shown at top of messages when connection is lost.

### 4.13 — Channel name validation is backend-only — ❌ REMAINS
No real-time validation feedback (min length, allowed chars, availability).

### 4.14 — No markdown rendering — ✅ FIXED
`MarkdownContent` component renders bold, italic, inline code, and links in message content.

### 4.15 — No "Browse Channels" — ✅ FIXED
"Browse Channels" option in New menu. Modal showing available channels with Join/Open buttons.

### 4.16 — SSE never consumed by frontend — ✅ FIXED
Frontend now uses `EventSource` with full event handling.

---

## 5. Missing Slack-Level Features

| Feature | Slack | Current | Priority |
|---------|-------|---------|----------|
| Real-time messaging | WebSocket | SSE ✅ | **Critical** ✅ |
| Typing indicators | ✅ | ✅ | High ✅ |
| Message edit/delete | ✅ | ✅ | High ✅ |
| File/image sharing | ✅ | ✅ | High ✅ |
| Proper emoji picker | 800+ with search | ✅ | Medium ✅ |
| User presence dots | ✅ | ✅ | Medium ✅ |
| Read receipts | ✅ | ✅ | Medium ✅ |
| @mentions | ✅ | ❌ | Medium |
| Markdown rendering | ✅ | ✅ | Medium ✅ |
| Message search | ✅ | ❌ | Medium |
| Channel browser | ✅ | ✅ | Medium ✅ |
| Custom status | ✅ | Backend + API exist, no UI | Low |
| Pinned messages | ✅ | ❌ | Low |
| Message threading | ✅ | ✅ | Low ✅ |
| Reactions | ✅ | ✅ | Low ✅ |
| Unread badges | ✅ | ✅ | ✅ |

---

## 6. Positive Flows (Working Well)

### 6.1 — DM creation
`getOrCreateConversation(userId)` — checks existing DMs before creating new. User picker modal with search. "Existing" label on users you already have a DM with.

### 6.2 — Channel creation
Modal with name input + member multi-select with checkboxes + search. Validation on backend (duplicate name, allowed characters). Admin auto-added.

### 6.3 — Optimistic message sending
Message appears immediately in the list before API responds. Feels instant.

### 6.4 — Reactions toggle
`toggleReaction` handles both add/remove. Optimistic UI updates through `setMessages` + `setThreadReplies`. State consistent between main and thread view.

### 6.5 — Thread panel
Full-screen on mobile, sidebar on desktop. Parent message shown at top with replies below. Separate input for thread replies. Reply count updates on parent.

### 6.6 — Date separators
`shouldShowDateSeparator` correctly inserts "Today", "Yesterday", or date dividers between message groups.

### 6.7 — Unread badges
Unread count displayed per conversation in sidebar (capped at 99+). `markAsRead` called on mount and after new messages.

### 6.8 — Auto-scroll
`scrollToBottom` only fires when user is near bottom. Doesn't fight user scrolling up.

### 6.9 — Dark mode
Full dark mode support via Tailwind `dark:` variants.

### 6.10 — Responsive modals
All modals are bottom-sheets on mobile, centered dialogs on desktop.

### 6.11 — SSE real-time
Opened on mount, handles 6 event types, exponential backoff reconnect, connection status dot.

### 6.12 — File attachments
Upload button, image preview inline, file links. Backend schema supports file metadata.

### 6.13 — Edit/delete messages
Hover actions on own messages, inline edit, confirm delete. Backend sets `editedAt`/`deletedAt`.

### 6.14 — Push notifications
`webPush.sendNotification` called after each message (non-blocking). Expired subscriptions cleaned up.

### 6.15 — Mark-as-read on return
`markAsRead(conversationId)` runs on mount and after every successful SSE event.

### 6.16 — Typing indicators
Debounced typing emit via POST `/api/conversations/[id]/typing`. In-memory store with 4s TTL. SSE broadcasts `typing` event. Frontend shows "[name] is typing...".

### 6.17 — User presence
PATCH `/api/users/presence` heartbeat every 60s. Green presence dot on avatars when user active within 2min.

### 6.18 — Read receipts
`getReadReceipts` returns users with `lastReadAt`. "Seen by X" indicator in conversation header.

### 6.19 — Browse channels
"Browse Channels" modal shows all public channels with member counts. Join/Open buttons. Uses existing `getAvailableChannels` action.

### 6.20 — Leave channel
Red "Leave Channel" button in members panel with confirmation dialog. Redirects to `/chat` after leaving.

### 6.21 — Markdown rendering
`MarkdownContent` component renders **bold**, *italic*, `inline code`, and clickable links in message bubbles.

### 6.22 — Loading skeleton
Animated pulse skeleton shown while message list is empty. Prevents blank-screen flash.

### 6.23 — Connection error banner
Red banner shows "Connection lost. Retrying..." when SSE disconnects.

### 6.24 — Scroll-to-bottom FAB
"Scroll to bottom" button appears when user scrolls up in the message list.

---

## 7. Implementation Plan

### Phase 1 — Fix the Broken Foundation ✅ DONE

| # | File(s) | Change |
|---|---------|--------|
| 1 | `packages/db/src/schema/chat.js` | Added `deletedAt`, `editedAt`, `fileKey`, `fileType`, `fileName` columns |
| 2 | `apps/api/src/modules/chat/channels.repository.js` | Rewritten to use `conversations` table |
| 3 | `apps/api/src/modules/chat/messages.repository.js` | Removed nonexistent column inserts |
| 4 | `apps/api/src/app/api/channels/[id]/events/route.js` | Fixed to use `conversationId` |
| 5 | `apps/api/src/app/api/conversations/[id]/events/route.js` | Same fixes |
| 6 | `apps/api/src/app/api/messages/[id]/replies/route.js` | Replaced `reactions: []` with real reaction queries |
| 7 | `ChatThreadClient.jsx:158-185` | Fixed stale closure — uses `useRef` for timestamp |

### Phase 2 — SSE Real-Time (Replace Polling) ✅ DONE

| # | File(s) | Change |
|---|---------|--------|
| 8 | `ChatThreadClient.jsx` | Opened `EventSource` to `/api/conversations/[id]/events` |
| 9 | Same | Handles `new_message`, `message_updated`, `message_deleted`, `reaction_added`, `reaction_removed`, `heartbeat` |
| 10 | Same | Removed 30s `setInterval` polling |
| 11 | Same | Reconnection with exponential backoff (1s→2s→4s→...→30s) |
| 12 | Same | Connection status dot: 🟢 connected, 🟡 reconnecting, 🔴 disconnected |

### Phase 3 — File Attachments ✅ DONE

| # | File(s) | Change |
|---|---------|--------|
| 13 | `apps/admin/src/actions/chat.js` | `sendMessage` accepts `fileData` params |
| 14 | `ChatThreadClient.jsx` | Upload button near input |
| 15 | Same | Render attachments (image inline, file as link) |
| 16 | Same | Upload progress state |

### Phase 4 — Emoji Picker ✅ DONE

| # | File(s) | Change |
|---|---------|--------|
| 17 | Installed `emoji-picker-react` | Full emoji picker with search + categories |
| 18 | `ChatThreadClient.jsx:52-71` | Replaced 6-emoji hardcode with `EmojiPickerPanel` |

### Phase 5 — Edit & Delete Messages ✅ DONE

| # | File(s) | Change |
|---|---------|--------|
| 19 | `ChatThreadClient.jsx` | Hover actions on own messages: Edit, Delete |
| 20 | Same | Edit: inline input → `editMessage` action |
| 21 | Same | Delete: confirm dialog → `deleteMessage` action |

### Phase 6 — Typing Indicators ✅ DONE

| # | File(s) | Change |
|---|---------|--------|
| 22 | `apps/api/src/modules/chat/typing.store.js` | In-memory typing store with 4s TTL |
| 23 | `apps/api/src/app/api/conversations/[id]/typing/route.js` | `POST /api/conversations/[id]/typing` |
| 24 | `conversations/[id]/events/route.js` | Typing events broadcast via SSE |
| 25 | `ChatThreadClient.jsx` | Debounced emit on keystroke + "[name] is typing..." display |

### Phase 7 — User Presence & Read Receipts ✅ DONE

| # | File(s) | Change |
|---|---------|--------|
| 26 | `ChatThreadClient.jsx` | PATCH `/api/users/presence` heartbeat every 60s |
| 27 | Same | Presence dots on avatars (green dot when `lastSeenAt` < 2min) |
| 28 | `actions/chat.js` | `getReadReceipts` + `otherUserLastSeen` in `getConversationInfo` |
| 29 | `ChatThreadClient.jsx` | "Seen by X" read receipt indicator in header |

### Phase 8 — Channel Management ✅ DONE

| # | File(s) | Change |
|---|---------|--------|
| 30 | `ChatPageClient.jsx` | "Browse Channels" modal with Join/Open |
| 31 | `ChatThreadClient.jsx` | Leave Channel button in members panel with confirm |
| 32 | Same | Channel description display below header |

### Phase 9 — UI Polish 🔶 PARTIAL

| # | File(s) | Change |
|---|---------|--------|
| 33 | `ChatThreadClient.jsx` | Loading skeleton for initial messages ✅ |
| 34 | Same | Error banner for connection loss ✅ |
| 35 | Same | Scroll-to-bottom FAB when scrolled up ✅ |
| 36 | Same | Markdown rendering (bold, italic, code, links) ✅ |
| 37 | Same | "Replying to" indicator in thread ❌ |
| 38 | Same | Message search (CTRL+K or search bar) ❌ |
| 39 | Same | Channel name validation frontend ❌ |

---

## 8. File Dispatch

| File | Status | Action |
|------|--------|--------|
| `packages/db/src/schema/chat.js` | ✅ Done | Columns added |
| `apps/api/src/modules/chat/channels.repository.js` | ✅ Done | Rewritten to use conversations |
| `apps/api/src/modules/chat/messages.repository.js` | ✅ Done | Cleaned up inserts |
| `apps/api/src/modules/chat/messages.service.js` | ✅ Done | Cleaned up |
| `apps/api/src/modules/chat/chat.schema.js` | ✅ Done | No change needed |
| `apps/api/src/app/api/channels/*` | ✅ Done | Fixed queries |
| `apps/api/src/app/api/conversations/[id]/events/route.js` | ✅ Done | Fixed + operational |
| `apps/api/src/app/api/messages/[id]/replies/route.js` | ✅ Done | Real reactions |
| `apps/api/src/app/api/messages/[id]/route.js` | ✅ Done | Works |
| `apps/admin/src/actions/chat.js` | ✅ Done | Edit/delete/upload/reactions/read receipts all present |
| `apps/admin/src/components/chat/ChatPageClient.jsx` | ✅ Done | Browse channels, leave channel, presence, remove polling |
| `apps/admin/src/components/chat/ChatThreadClient.jsx` | ✅ Done | SSE + emoji + upload + edit/delete + typing + presence + read receipts + polish |
| `apps/api/src/modules/chat/typing.store.js` | ✅ Done | In-memory typing store |
| `apps/api/src/app/api/conversations/[id]/typing/route.js` | ✅ Done | Typing POST endpoint |
| `apps/admin/src/app/(authenticated)/chat/page.js` | ✅ Done | Server component, no change needed |
| `apps/admin/src/app/(authenticated)/chat/[id]/page.js` | ✅ Done | Server component, no change needed |
