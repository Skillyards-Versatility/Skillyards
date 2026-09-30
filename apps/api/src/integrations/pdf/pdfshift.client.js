function parseApiKeys() {
  const keys = [];

  if (process.env.PDFSHIFT_API_KEYS) {
    keys.push(
      ...process.env.PDFSHIFT_API_KEYS.split(",").map((s) => s.trim()),
    );
  }
  if (process.env.PDFSHIFT_API_KEY) {
    keys.push(process.env.PDFSHIFT_API_KEY.trim());
  }
  if (process.env.PDFSHIFT_API_KEY_1) {
    keys.push(process.env.PDFSHIFT_API_KEY_1.trim());
  }
  if (process.env.PDFSHIFT_API_KEY_2) {
    keys.push(process.env.PDFSHIFT_API_KEY_2.trim());
  }

  // Deduplicate and filter out empty entries
  const uniqueKeys = [...new Set(keys.filter(Boolean))];

  if (uniqueKeys.length === 0) {
    throw new Error(
      "No PDFShift API keys configured. Set PDFSHIFT_API_KEYS (comma-separated) or PDFSHIFT_API_KEY / PDFSHIFT_API_KEY_1 / PDFSHIFT_API_KEY_2.",
    );
  }

  return uniqueKeys;
}

// Track key rotation across requests to evenly balance free quota
let currentKeyIndex = 0;

export async function callPdfShift(payload) {
  const keys = parseApiKeys();
  const errors = [];
  const numKeys = keys.length;

  // Round-robin: rotate the starting key on every call so requests alternate evenly
  const startIndex = currentKeyIndex % numKeys;
  currentKeyIndex = (currentKeyIndex + 1) % numKeys;

  for (let offset = 0; offset < numKeys; offset++) {
    const keyIndex = (startIndex + offset) % numKeys;
    const apiKey = keys[keyIndex];

    try {
      console.log(
        `[PDFSHIFT] Generating PDF using key ${keyIndex + 1} of ${numKeys}`,
      );

      const response = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from("api:" + apiKey).toString("base64"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return Buffer.from(await response.arrayBuffer());
      }

      const errText =
        response.status === 429
          ? "rate limited"
          : response.status === 402
            ? "quota/credits exhausted"
            : await response.text();

      throw new Error(`HTTP ${response.status} — ${errText}`);
    } catch (err) {
      errors.push(`Key ${keyIndex + 1}: ${err.message}`);

      if (offset < numKeys - 1) {
        console.warn(
          `[PDFSHIFT] Key ${keyIndex + 1} failed (${err.message}). Shifting to next key...`,
        );
        continue;
      }
    }
  }

  throw new Error(`All PDFShift keys exhausted: ${errors.join("; ")}`);
}
