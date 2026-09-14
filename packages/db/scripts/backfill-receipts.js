import { db } from "../src/client.js";
import { payments } from "../src/schema/payments.js";
import { asc, sql, eq } from "drizzle-orm";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../../.env") });

async function backfill() {
  console.log("Starting receipt backfill...");

  const allPayments = await db
    .select()
    .from(payments)
    .where(sql`receipt_number IS NULL`)
    .orderBy(asc(payments.createdAt));

  console.log(`Found ${allPayments.length} payments to backfill.`);

  const yearlyCounts = {};

  for (const p of allPayments) {
    const year = new Date(p.createdAt).getFullYear();

    if (!yearlyCounts[year]) {
      // Get count of already numbered receipts for this year
      const existing = await db
        .select({ count: sql`count(*)` })
        .from(payments)
        .where(
          sql`EXTRACT(YEAR FROM created_at) = ${year} AND receipt_number IS NOT NULL`,
        );

      yearlyCounts[year] = Number(existing[0]?.count || 0);
    }

    yearlyCounts[year]++;
    const receiptNumber = `SY-${year}-${String(yearlyCounts[year]).padStart(4, "0")}`;

    console.log(`Updating Payment ${p.id} -> ${receiptNumber}`);

    await db
      .update(payments)
      .set({ receiptNumber })
      .where(eq(payments.id, p.id));
  }

  console.log("Backfill complete.");
  process.exit(0);
}

backfill().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
