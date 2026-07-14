import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

async function main() {
  const { db, employees } = await import("@repo/db");
  const { ilike } = await import("drizzle-orm");

  console.log("🔍 Finding employees named Saurabh...");
  const records = await db
    .select()
    .from(employees)
    .where(ilike(employees.name, "%Saurabh%"));

  console.log("Employees found:", records);
}

main().catch(console.error);
