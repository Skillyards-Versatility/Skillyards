import fetch from "node-fetch";

async function testService() {
  const paymentId = "4aed7c50-8f5a-497d-a030-21f6f81a0f53";
  const payload = {
    html: "<h1>Test Receipt</h1>",
    key: `receipts/${paymentId}.pdf`,
  };

  try {
    console.log(`Calling PDF service for ${paymentId}...`);
    const res = await fetch("http://localhost:3001/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

testService();
