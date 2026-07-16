"use server";

import { db, users } from "@repo/db";
import { eq, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

let migrated = false;

export async function getUsers() {
    if (!migrated) {
        try {
            await db.execute(
                sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_training BOOLEAN DEFAULT FALSE NOT NULL;`
            );
            await db.execute(
                sql`ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS is_training BOOLEAN DEFAULT FALSE NOT NULL;`
            );
            migrated = true;
            console.log("Programmatic database migrations applied successfully from getUsers.");
        } catch (migError) {
            console.error("Migration runner failed in getUsers:", migError);
        }
    }
    return await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isTraining: users.isTraining,
        createdAt: users.createdAt
    }).from(users).orderBy(desc(users.createdAt));
}

export async function createUser(_prevState, formData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role") || "STAFF";
    const isTraining = formData.get("isTraining") === "true";

    if (!name || !email || !password) {
        return { error: "All fields are required" };
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role,
            isTraining,
        });

        revalidatePath("/users");
        return { success: true };
    } catch (err) {
        console.error("User Creation Error:", err);
        if (err.message.includes("unique constraint")) {
            return { error: "Email already exists" };
        }
        return { error: "Failed to create user" };
    }
}

export async function deleteUser(id) {
    try {
        await db.delete(users).where(eq(users.id, id));
        revalidatePath("/users");
        return { success: true };
    } catch (err) {
        console.error("User Deletion Error:", err);
        return { error: "Failed to delete user", details: err.message };
    }
}
