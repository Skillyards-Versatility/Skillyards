import { toast } from "sonner";

/**
 * Polls the receipt API until the PDF is ready or fails.
 * @param {string} paymentId
 * @param {string} apiUrl
 * @param {Object} options
 * @returns {Promise<{status: string, url: string}>}
 */
export async function waitForReceiptReady(paymentId, apiUrl, options = {}) {
  const { maxAttempts = 15, initialDelay = 1500, isDownload = false } = options;

  let attempts = 0;
  let delay = initialDelay;

  const toastId = toast.loading("Preparing your receipt...");

  try {
    while (attempts < maxAttempts) {
      const url = `${apiUrl}/api/payments/${paymentId}/receipt?format=pdf`;
      console.log(`[RECEIPT_POLL] Fetching: ${url}`);

      const res = await fetch(url, { credentials: "include" });
      console.log(
        `[RECEIPT_POLL] Status: ${res.status} (${res.headers.get("content-type")})`,
      );

      // If ready, it returns the PDF stream (content-type: application/pdf)
      // If not ready, it returns JSON (content-type: application/json)
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/pdf")) {
        toast.success("Receipt ready!", { id: toastId });

        const finalUrl = `${apiUrl}/api/payments/${paymentId}/receipt?format=pdf${isDownload ? "&download=true" : ""}`;
        return { status: "ready", url: finalUrl };
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();

        if (data.status === "failed") {
          toast.error("Failed to generate receipt.", { id: toastId });
          throw new Error("Generation failed");
        }

        // accepted or generating
        toast.loading(
          `Generating... (attempt ${attempts + 1}/${maxAttempts})`,
          { id: toastId },
        );
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempts++;
      delay = Math.min(delay * 1.5, 5000); // Caps at 5s between polls
    }

    toast.error("Generation timed out. Please try again.", { id: toastId });
    throw new Error("Generation timed out");
  } catch (err) {
    if (
      err.message !== "Generation failed" &&
      err.message !== "Generation timed out"
    ) {
      toast.error("An error occurred while fetching the receipt.", {
        id: toastId,
      });
    }
    throw err;
  }
}
