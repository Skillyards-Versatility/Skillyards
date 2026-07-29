function parseApiKeys() {
  const raw = process.env.PDFSHIFT_API_KEYS || process.env.PDFSHIFT_API_KEY;
  if (!raw) throw new Error("No PDFShift API keys configured. Set PDFSHIFT_API_KEYS (comma-separated) or PDFSHIFT_API_KEY.");
  return raw.split(",").map(s => s.trim()).filter(Boolean);
}

export async function callPdfShift(payload) {
  const keys = parseApiKeys();
  const errors = [];

  for (const [i, apiKey] of keys.entries()) {
    try {
      const response = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from("api:" + apiKey).toString("base64"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return Buffer.from(await response.arrayBuffer());
      }

      const errText = response.status === 429 ? "rate limited" : await response.text();
      throw new Error(`HTTP ${response.status} — ${errText}`);
    } catch (err) {
      errors.push(`Key ${i + 1}: ${err.message}`);

      if (i < keys.length - 1) {
        console.warn(`[PDFSHIFT] Key ${i + 1} failed, trying next key...`, err.message);
        continue;
      }
    }
  }

  throw new Error(`All PDFShift keys exhausted: ${errors.join("; ")}`);
}
