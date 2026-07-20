"use server";

import { db, users } from "@repo/db";
import { eq, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
    const session = await getSession();
    if (session?.role !== "ADMIN") {
        throw new Error("Unauthorized: admin access required");
    }
    return session;
}

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
            await db.execute(
                sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS team TEXT;`
            );
            await db.execute(
                sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;`
            );
            await db.execute(
                sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_key TEXT;`
            );
            await db.execute(
                sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT;`
            );
            await db.execute(
                sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;`
            );
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS eod_reports (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    team TEXT NOT NULL,
                    date TEXT NOT NULL,
                    data JSONB NOT NULL,
                    screenshot_key TEXT,
                    submitted_at TIMESTAMP DEFAULT NOW() NOT NULL,
                    emailed_at TIMESTAMP
                );
            `);
            await db.execute(
                sql`CREATE UNIQUE INDEX IF NOT EXISTS eod_reports_user_date_idx ON eod_reports(user_id, date);`
            );
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS breaks (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    started_at TIMESTAMP DEFAULT NOW() NOT NULL,
                    ended_at TIMESTAMP,
                    duration INTEGER,
                    date TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW() NOT NULL
                );
            `);
            await db.execute(
                sql`CREATE INDEX IF NOT EXISTS breaks_user_date_idx ON breaks(user_id, date);`
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
        team: users.team,
        isTraining: users.isTraining,
        createdAt: users.createdAt
    }).from(users).orderBy(desc(users.createdAt));
}

export async function createUser(_prevState, formData) {
    await requireAdmin();

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role") || "SALES";
    const team = formData.get("team") || null;
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
            team,
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

export async function updateUser(userId, { name, email, role, team, isTraining }) {
    const session = await requireAdmin();

    if (!name || !email) {
        return { error: "Name and email are required" };
    }

    // Prevent self-demotion
    if (session.userId === userId && role !== "ADMIN") {
        return { error: "Cannot change your own role from ADMIN" };
    }

    try {
        await db.update(users).set({
            name,
            email,
            role,
            team: team || null,
            isTraining,
        }).where(eq(users.id, userId));

        revalidatePath("/users");
        return { success: true };
    } catch (err) {
        console.error("User Update Error:", err);
        if (err.message.includes("unique constraint")) {
            return { error: "Email already exists" };
        }
        return { error: "Failed to update user" };
    }
}

export async function deleteUser(id) {
    const session = await requireAdmin();

    if (session.userId === id) {
        return { error: "Cannot delete your own account" };
    }

    try {
        await db.delete(users).where(eq(users.id, id));
        revalidatePath("/users");
        return { success: true };
    } catch (err) {
        console.error("User Deletion Error:", err);
        return { error: "Failed to delete user", details: err.message };
    }
}

export async function resetPassword(userId, newPassword) {
    await requireAdmin();

    if (!newPassword || newPassword.length < 6) {
        return { error: "Password must be at least 6 characters" };
    }

    try {
        const hashed = await bcrypt.hash(newPassword, 10);
        await db.update(users).set({ password: hashed }).where(eq(users.id, userId));
        return { success: true };
    } catch (err) {
        console.error("Password Reset Error:", err);
        return { error: "Failed to reset password" };
    }
}
