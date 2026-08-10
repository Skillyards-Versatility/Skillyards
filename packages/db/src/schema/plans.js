import { pgTable, uuid, integer, text, timestamp, index } from 'drizzle-orm/pg-core';

import { students } from './students.js';

export const plans = pgTable('plans', {
    id: uuid('id').primaryKey().defaultRandom(),

    studentId: uuid('student_id')
        .notNull()
        .references(() => students.id, { onDelete: 'cascade' }),

    totalAmount: integer('total_amount').notNull(),

    type: text('type').notNull(),

    previousPlanId: uuid("previous_plan_id").references(
        () => plans.id,
        { onDelete: "set null" }
    ),

    createdAt: timestamp('created_at').defaultNow().notNull(),

}, (table) => ({
    
    studentIdx: index("plans_student_id_idx").on(table.studentId),
}))

