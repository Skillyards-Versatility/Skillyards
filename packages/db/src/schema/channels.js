import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const channels = pgTable(
  "channels",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull().unique(),

    description: text("description"),

    type: text("type").notNull().default("public"), // public | private | team

    team: text("team"), // for auto-created team channels

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    archivedAt: timestamp("archived_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);
