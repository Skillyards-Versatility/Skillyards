import { pgTable, uuid, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("SALES").notNull(), // ADMIN, MANAGER, SALES, HR, DEVELOPER, DIGITAL_MARKETER, OUTSIDE_SALES, EDITOR
  team: text("team"), // sales | tech | hr | ceo_office | admin_head | marketing | outside_sales
  phone: text("phone"),
  profileImageKey: text("profile_image_key"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  isTraining: boolean("is_training").default(false).notNull(),
  pushSubscription: jsonb("push_subscription"),
  createdAt: timestamp("created_at").defaultNow()
});