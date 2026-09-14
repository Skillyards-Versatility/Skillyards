import puppeteer from "puppeteer";

let browserInstance = null;

async function getBrowser() {
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }

  console.log("Launching new optimized browser instance...");
  browserInstance = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
      "--no-first-run",
      "--disable-accelerated-2d-canvas",
      "--disable-cache",
    ],
  });

  browserInstance.on("disconnected", () => {
    console.warn("Puppeteer browser disconnected.");
    browserInstance = null;
  });

  return browserInstance;
}

// Pre-launch browser instance
getBrowser().catch((err) =>
  console.error("FAILED TO PRE-LAUNCH BROWSER:", err),
);

export async function generatePdfFromHtml(html) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });

    return pdfBuffer;
  } finally {
    await page.close();
  }
}
