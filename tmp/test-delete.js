const { db, users } = require("./packages/db/dist/index.js");
const { eq } = require("drizzle-orm");

async function testDelete() {
  try {
    console.log("Fetching users...");
    const allUsers = await db.select().from(users);
    if (allUsers.length === 0) {
      console.log("No users found to delete.");
      return;
    }

    const target = allUsers.find((u) => u.email !== "admin@skillyards.com");
    if (!target) {
      console.log("No non-admin user found.");
      return;
    }

    console.log("Attempting to delete user:", target.id, target.name);
    const result = await db.delete(users).where(eq(users.id, target.id));
    console.log("Delete success:", result);
  } catch (err) {
    console.error("Delete failed:", err);
  } finally {
    process.exit();
  }
}

testDelete();
