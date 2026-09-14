import "dotenv/config";
import express from "express";
import { generatePdfFromHtml } from "./pdf.js";
import { uploadToR2, checkReceiptExists } from "./upload.js";

const app = express();

app.use(express.json({ limit: "10mb" }));

// AUTH MIDDLEWARE
function authMiddleware(req, res, next) {
  const key = req.headers["x-internal-key"];

  if (key !== process.env.INTERNAL_API_KEY) {
    console.warn("[AUTH_FAILURE] Invalid or missing API key");
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

const activeJobs = new Map();

// SECURE CALLBACK HELPER
async function notifyAPI(paymentId, jobId, result) {
  const CALLBACK_URL = `${process.env.API_URL || "https://api.skillyards.in"}/api/internal/receipt/complete`;

  for (let i = 0; i < 3; i++) {
    try {
      console.log(`[CALLBACK][ATTEMPT_${i + 1}]`, { paymentId, jobId });
      const res = await fetch(CALLBACK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Key": process.env.INTERNAL_API_KEY,
        },
        body: JSON.stringify({
          paymentId,
          jobId,
          status: result.status, // 'ready' or 'failed'
          key: result.key,
          error: result.error,
        }),
      });

      if (res.ok) {
        console.log("[CALLBACK][SUCCESS]", { paymentId, jobId });
        return;
      }
      throw new Error(`Status ${res.status}`);
    } catch (err) {
      console.warn(`[CALLBACK][FAILED] Attempt ${i + 1}:`, err.message);
      if (i < 2) await new Promise((r) => setTimeout(r, 2000 * (i + 1))); // Linear backoff
    }
  }
  console.error("[CALLBACK][FINAL_FAILURE] Could not notify API", {
    paymentId,
    jobId,
  });
}

app.post("/generate", authMiddleware, async (req, res) => {
  const { html, key, jobId } = req.body;

  // 1. EXTRACT PAYMENT ID FROM KEY (e.g., receipts/v1/paymentId.pdf)
  const paymentId = key?.split("/").pop().split(".")[0];

  console.log("[PDF_REQUEST]", { paymentId, jobId, key });

  // 2. BASIC VALIDATION
  if (!html || !key || !jobId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // 3. DEDUPE (IN-MEMORY)
  if (activeJobs.has(paymentId)) {
    console.log("[DEDUPE_HIT]", paymentId);
    return res.status(202).json({ message: "Job already in progress", jobId });
  }

  // 4. RETURN 202 IMMEDIATELY (ACKNOWLEDGE HANDSHAKE)
  res.status(202).json({ message: "Generation started", jobId });

  // 5. BACKGROUND WORKER
  (async () => {
    activeJobs.set(paymentId, jobId);
    try {
      // IDEMPOTENCY CHECK
      const exists = await checkReceiptExists(key);
      if (exists) {
        console.log("[CACHE_HIT]", key);
        await notifyAPI(paymentId, jobId, { status: "ready", key });
        return;
      }

      // GENERATE
      const pdfBuffer = await generatePdfFromHtml(html);

      // UPLOAD
      await uploadToR2({ key, buffer: pdfBuffer });

      console.log("[JOB_SUCCESS]", { paymentId, jobId });
      await notifyAPI(paymentId, jobId, { status: "ready", key });
    } catch (err) {
      console.error("[JOB_FAILED]", { paymentId, jobId, error: err.message });
      await notifyAPI(paymentId, jobId, {
        status: "failed",
        error: err.message,
      });
    } finally {
      activeJobs.delete(paymentId);
    }
  })();
});

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`PDF service running on port ${PORT}`);
});
