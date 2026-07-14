import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

async function main() {
  const { db, users } = await import("@repo/db");
  const allUsers = await db.select().from(users);
  console.log("Users:", allUsers.map(u => ({ email: u.email, role: u.role, name: u.name })));
}

main().catch(console.error);
