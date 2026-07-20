import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("SALES").notNull(), // ADMIN, MANAGER, SALES, HR, DEVELOPER, DIGITAL_MARKETER, OUTSIDE_SALES
  team: text("team"), // sales | tech | hr | ceo_office | admin_head | marketing | outside_sales
  isTraining: boolean("is_training").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});