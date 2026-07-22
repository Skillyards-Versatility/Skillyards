import { getIstDate, isIstSunday } from "@/lib/ist.js";
import { processEodEmails } from "@/modules/eod/eodProcessor.js";

async function handler(req) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Skip Sundays
  if (isIstSunday()) {
    return Response.json({ success: true, message: "Sunday — skipped" });
  }

  const today = getIstDate();
  const results = await processEodEmails(today);

  return Response.json(results);
}

// Disable body parsing for cron endpoint
export const runtime = "nodejs";

export async function GET(req) {
  return handler(req);
}

export async function POST(req) {
  return handler(req);
}
