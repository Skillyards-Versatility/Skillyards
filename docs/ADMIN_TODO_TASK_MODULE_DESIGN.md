# Admin Task / To-Do Module — Technical Specification & Design Document

## 1. System Overview

Centralized internal task tracking, delegation, and accountability module for Skillyards Admin panel (`apps/admin`).

Key Capabilities:
- Role-hierarchical assignment (Admins & Managers assign to same tier or subordinate tiers).
- Multi-reviewer sign-off workflow (Assignee completes → Reviewer audits & approves/requests revisions).
- Real-time web push notifications on all critical lifecycle events.
- Audit trail & activity logs.
- Cross-module entity linking (Students, Enquiries, Batches) and EOD auto-sync.

---

## 2. Role Hierarchy & Permission Architecture

### 2.1 Role Tier Definitions

Mapped against `users.role` in `packages/db/src/schema/users.js`:

| Tier | Roles | Assignment Scope | Reviewer Capability |
|---|---|---|---|
| **Tier 1 (Executive / Super)** | `ADMIN` | Any user across company (Admin, Manager, Staff) | Can review any task |
| **Tier 2 (Management)** | `MANAGER` | Self, fellow Managers, Subordinates within same `team` or managed departments | Can review team & assigned tasks |
| **Tier 3 (Staff / IC)** | `SALES`, `HR`, `DEVELOPER`, `DIGITAL_MARKETER`, `OUTSIDE_SALES`, `EDITOR` | Cannot assign tasks to others (can only self-organize personal subtasks if enabled) | Cannot be formal reviewer |

### 2.2 Permission Enforcement Matrix

```typescript
// Permission check pseudocode in server action
function canAssignTask(creator, targetUser): boolean {
  if (creator.role === "ADMIN") return true;
  
  if (creator.role === "MANAGER") {
    // Can assign to other managers or subordinates
    if (targetUser.role === "ADMIN") return false; // Cannot assign upward
    if (targetUser.role === "MANAGER") return true; // Peer delegation
    return creator.team === targetUser.team || targetUser.team === null;
  }

  return false; // Staff cannot assign
}
```

---

## 3. Database Schema (`@repo/db` Drizzle ORM)

File target: `packages/db/src/schema/tasks.js`

```javascript
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// 1. Core Task Table
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").default("MEDIUM").notNull(), // LOW, MEDIUM, HIGH, URGENT
  status: text("status").default("TODO").notNull(), 
  // Status Enum: TODO, IN_PROGRESS, IN_REVIEW, CHANGES_REQUESTED, COMPLETED, CANCELLED

  dueDate: timestamp("due_date"),
  startDate: timestamp("start_date"),
  
  // Optional Entity Link (polymorphic binding to CRM objects)
  entityType: text("entity_type"), // "STUDENT", "ENQUIRY", "BATCH", "PAYMENT"
  entityId: text("entity_id"),

  createdById: uuid("created_by_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Task Assignees (Supports 1 or more assignees)
export const taskAssignees = pgTable("task_assignees", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

// 3. Task Reviewers
export const taskReviewers = pgTable("task_reviewers", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  reviewStatus: text("review_status").default("PENDING").notNull(), 
  // PENDING, APPROVED, CHANGES_REQUESTED
  feedback: text("feedback"),
  reviewedAt: timestamp("reviewed_at"),
});

// 4. Subtasks / Checklist Items
export const taskChecklists = pgTable("task_checklists", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  completedBy: uuid("completed_by").references(() => users.id),
  completedAt: timestamp("completed_at"),
});

// 5. Deliverables / Attachments (S3 / Cloudflare R2)
export const taskAttachments = pgTable("task_attachments", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  uploaderId: uuid("uploader_id")
    .references(() => users.id)
    .notNull(),
  fileKey: text("file_key").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// 6. Activity & Audit Trail
export const taskActivities = pgTable("task_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  actorId: uuid("actor_id")
    .references(() => users.id)
    .notNull(),
  action: text("action").notNull(), 
  // CREATED, STATUS_UPDATED, REVIEWER_ADDED, SUBMITTED_FOR_REVIEW, APPROVED, REJECTED, COMMENTED
  comment: text("comment"),
  meta: jsonb("meta"), // e.g. { fromStatus: "TODO", toStatus: "IN_PROGRESS" }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## 4. Lifecycle & Review State Machine

```
                      ┌───────────────┐
                      │     TODO      │
                      └───────┬───────┘
                              │ Assignee starts work
                              ▼
                      ┌───────────────┐
       ┌─────────────►│  IN_PROGRESS  │◄────────────┐
       │              └───────┬───────┘             │
       │                      │ Work completed      │ Reviewer requests
       │                      ▼                     │ modifications
       │              ┌───────────────┐             │
       │              │   IN_REVIEW   ├─────────────┘
       │              └───────┬───────┘
       │                      │
       │        Reviewer      │ Reviewer
       │        approves      │ approves
       │                      ▼
       │              ┌───────────────┐
       └──────────────┤   COMPLETED   │
        Reopened by   └───────────────┘
        Admin/Manager
```

### Review Rules:
1. **Mandatory Sign-off**: If `taskReviewers` exist, assignee cannot set status directly to `COMPLETED`. Assignee can only transition to `IN_REVIEW`.
2. **Auto-Complete Option**: When all assigned reviewers (or minimum 1 primary reviewer) approve, status moves to `COMPLETED`.
3. **Changes Requested**: Reverts task to `IN_PROGRESS` with mandatory feedback comment recorded in `taskActivities`.

---

## 5. Push Notification Specification (`web-push`)

Utilizes existing setup in `apps/admin/src/actions/chat.js` and `users.pushSubscription`.

### Trigger Events

| Trigger Event | Recipients | Notification Title | Body Template | Target URL |
|---|---|---|---|---|
| **Task Assigned** | All Assignees | `New Task Assigned` | `"{creatorName} assigned you: {taskTitle}"` | `/tasks/{taskId}` |
| **Review Requested** | All Reviewers | `Task Ready for Review` | `"{assigneeName} submitted: {taskTitle}"` | `/tasks/{taskId}?tab=review` |
| **Changes Requested**| Assignees | `Revision Needed` | `"{reviewerName} requested changes on: {taskTitle}"` | `/tasks/{taskId}` |
| **Task Approved** | Assignees + Creator | `Task Approved` | `"{taskTitle} approved by {reviewerName}"` | `/tasks/{taskId}` |
| **Due in 2 Hours** | Assignees | `Deadline Warning` | `"{taskTitle} is due at {dueTime}"` | `/tasks/{taskId}` |
| **Overdue SLA** | Assignees + Creator | `Task Overdue` | `"{taskTitle} missed deadline"` | `/tasks/{taskId}` |

---

## 6. Server Actions & Backend API Blueprint

Location: `apps/admin/src/actions/tasks.js`

1. `createTask(data)`:
   - Validates session & role hierarchy against assignees.
   - Inserts into `tasks`, `taskAssignees`, `taskReviewers`.
   - Dispatches push notifications to assignees.
   - Schedules QStash reminder jobs if `dueDate` specified.
2. `updateTaskStatus(taskId, newStatus, comment)`:
   - Validates state transition rights (Assignee vs Reviewer vs Admin).
   - Records entry into `taskActivities`.
   - Sends notification if state is `IN_REVIEW`.
3. `reviewTask(taskId, reviewStatus, feedback)`:
   - Sets `taskReviewers.reviewStatus`.
   - If `APPROVED`: checks if task should complete, notifies assignee.
   - If `CHANGES_REQUESTED`: updates task status to `CHANGES_REQUESTED`, pushes notification.
4. `toggleChecklistItem(checklistItemId, isCompleted)`:
   - Updates checklist progress.
5. `getTasks(filter)`:
   - Filters: `view: "my_tasks" | "assigned_by_me" | "needs_review" | "team_board"`.
   - Supports pagination, search, status, and priority filters.

---

## 7. Recommended Add-ons for High Operational Efficiency

1. **Subtask Checklist with Progress %**:
   - Small checkboxes inside task. Header shows dynamic bar: `4/6 (67%) done`.
2. **QStash Cron Reminders & SLA Breaches**:
   - Schedule one-off QStash webhook on task creation:
     - Warning: `T - 2 hours` before `dueDate`.
     - Breach: `T + 1 hour` after `dueDate` (alerts manager).
3. **EOD Report Auto-Sync**:
   - When generating employee End-of-Day report (`eodReports`), auto-populate list of tasks progressed/completed that day.
4. **S3 / R2 Deliverable Proof Attachments**:
   - Require screenshot or document upload before task can be moved to `IN_REVIEW`.
5. **Contextual Deep Linking (Polymorphic Entities)**:
   - Link task directly to Student, Enquiry, or Batch record.
   - Example: Task "Call Parent about installment overdue" embeds quick student contact badge.
6. **Views**:
   - **Kanban Board**: Drag and drop cards between status lanes.
   - **Table View**: Bulk sorting by due date, priority, and assignee.
   - **Calendar View**: High-level timeline of team deadlines.

---

## 8. Implementation Steps (When Ready to Build)

1. **DB Migration**: Create `packages/db/src/schema/tasks.js`, export in `packages/db/src/schema/index.js`, run migration.
2. **Server Actions**: Implement `apps/admin/src/actions/tasks.js` with permission guards and push notifications.
3. **UI Components**:
   - Page: `apps/admin/src/app/(authenticated)/tasks/page.jsx`
   - Details Drawer / Modal: Task details, checklist, activity timeline, reviewer approval panel.
   - Creation Modal: Multi-select assignees & reviewers (filtered by permission tier).
4. **Push & Background Jobs**: Hook with `webPush` and Upstash QStash.
