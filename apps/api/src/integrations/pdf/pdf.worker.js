import { db } from "@repo/db";
import {
  getPaymentReceipt,
  generateReceiptHTML,
} from "@/modules/payments/receipt.service";
import { generatePdf } from "./pdf.client";
import {
  updatePayment,
  resetStaleLocks,
} from "@/modules/payments/payment.repository";
import { logPdfFailure } from "@/modules/payments/pdfFailure.repository";

// ── SINGLETON STATE (Survives Dev Reloads) ──
const GLOBAL_KEY = "pdfWorkerState";

if (!global[GLOBAL_KEY]) {
  console.log("[WORKER][INIT] Creating new global state...");
  global[GLOBAL_KEY] = {
    queue: [],
    inProgress: new Set(),
    activeCount: 0,
    readyCache: new Map(),
    booted: false,
  };
}

const state = global[GLOBAL_KEY];
export const readyCache = state.readyCache;

// ── LAZY INITIALIZATION ──
function ensureWorkerBooted() {
  if (state.booted) return;
  state.booted = true;

  console.log("[WORKER][BOOT] Initializing background processes...");

  // 1. Recovery
  resetStaleLocks(db, 10)
    .then(() => console.log("[WORKER][BOOT] Stale lock recovery finished"))
    .catch((err) => console.error("[WORKER][BOOT] Recovery error:", err));

  // 2. Starvation Guard
  setInterval(() => {
    if (state.queue.length > 0 || state.activeCount > 0) {
      console.log("[TRACE][HEARTBEAT]", {
        queue: state.queue.length,
        active: state.activeCount,
        inProgress: Array.from(state.inProgress),
      });
      processQueue();
    }
  }, 5000);

  // 3. Cache Cleanup
  setInterval(() => {
    const now = Date.now();
    let removed = 0;
    for (const [id, data] of state.readyCache.entries()) {
      if (now - data.timestamp > 10 * 60 * 1000) {
        state.readyCache.delete(id);
        removed++;
      }
    }
    if (removed > 0) console.log("[CACHE][CLEANUP]", { removed });
  }, 60 * 1000);
}

const MAX_CONCURRENT = 5;
const MAX_RETRIES = 2;
const JOB_TIMEOUT = 25000;

// ── ENQUEUE ──
export async function enqueuePdfGeneration(
  paymentId,
  key,
  version,
  attempt = 0,
) {
  ensureWorkerBooted();
  console.log("[TRACE][ENQUEUE][HIT]", {
    paymentId,
    currentQueue: state.queue.length,
    active: state.activeCount,
  });

  if (state.inProgress.has(paymentId)) {
    console.log("[TRACE][ENQUEUE][SKIP] Already in progress:", paymentId);
    return;
  }

  if (state.queue.some((job) => job.paymentId === paymentId)) {
    console.log("[TRACE][ENQUEUE][SKIP] Already in queue:", paymentId);
    return;
  }

  state.queue.push({ paymentId, key, version, attempt });

  console.log("[TRACE][ENQUEUE][SUCCESS]", {
    paymentId,
    attempt,
    newQueueLength: state.queue.length,
  });

  processQueue();
}

// ── QUEUE PROCESSOR ──
async function processQueue() {
  if (state.activeCount >= MAX_CONCURRENT) {
    console.log("[TRACE][PROCESS][ABORT] Max concurrency reached");
    return;
  }
  if (state.queue.length === 0) return;

  const job = state.queue.shift();

  state.activeCount++;
  state.inProgress.add(job.paymentId);

  console.log("[TRACE][PROCESS][DISPATCH]", {
    paymentId: job.paymentId,
    activeCount: state.activeCount,
    remaining: state.queue.length,
  });

  runJob(job).finally(() => {
    state.activeCount--;
    state.inProgress.delete(job.paymentId);

    console.log("[TRACE][PROCESS][COMPLETE]", {
      paymentId: job.paymentId,
      activeCount: state.activeCount,
    });

    processQueue();
  });
}

// ── JOB EXECUTION ──
async function runJob({ paymentId, key, version, attempt }) {
  const startTime = Date.now();

  console.log("[JOB][START]", { paymentId, attempt });

  try {
    const receiptData = await getPaymentReceipt(db, paymentId);
    const receiptHTML = generateReceiptHTML(receiptData);

    await Promise.race([
      generatePdf(receiptHTML, key),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("PDF Generation Timeout")),
          JOB_TIMEOUT,
        ),
      ),
    ]);

    await updatePayment(db, paymentId, {
      receiptKey: key,
      receiptStatus: "ready",
      receiptVersion: version,
    });

    readyCache.set(paymentId, { key, version, timestamp: Date.now() });

    console.log("[JOB][SUCCESS]", {
      paymentId,
      timeMs: Date.now() - startTime,
    });
  } catch (err) {
    console.error("[JOB][ERROR]", {
      paymentId,
      attempt,
      error: err.message,
    });

    if (attempt < MAX_RETRIES) {
      const waitTime = 1000 * (attempt + 1);

      console.log("[JOB][RETRY]", {
        paymentId,
        nextAttempt: attempt + 1,
        delayMs: waitTime,
      });

      setTimeout(() => {
        if (
          !state.inProgress.has(paymentId) &&
          !state.queue.some((j) => j.paymentId === paymentId)
        ) {
          state.queue.push({ paymentId, key, version, attempt: attempt + 1 });

          console.log("[REQUEUE]", {
            paymentId,
            newAttempt: attempt + 1,
            queueLength: state.queue.length,
          });

          processQueue();
        }
      }, waitTime);

      return;
    }

    await logPdfFailure(db, {
      paymentId,
      errorMessage: err.message,
    });

    await updatePayment(db, paymentId, { receiptStatus: "failed" });

    console.error("[JOB][FAILED_FINAL]", {
      paymentId,
      attempts: attempt + 1,
    });
  }
}
