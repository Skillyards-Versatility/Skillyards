const API_URL = "http://localhost:3002/api/internal/receipt/complete";

async function testInternalBypass() {
  console.log(
    "🚀 Testing Internal Callback Protection (By-pass Verification)...",
  );

  // Case B: WRONG KEY
  console.log("\nScenario: Sending WRONG-KEY...");
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": "wrong-key-attempt",
      },
      body: JSON.stringify({
        paymentId: "test-id",
        jobId: "test-job",
        status: "ready",
      }),
    });

    console.log("Status:", response.status);
    if (response.status === 403) {
      console.log("✅ SUCCESS: Bypass blocked with 403 Forbidden.");
    } else {
      console.log(
        "❌ FAILURE: Bypass NOT blocked. Got status:",
        response.status,
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    process.exit(1);
  }

  // Case A: VALID KEY (Local dev key)
  console.log("\nScenario: Sending CORRECT-KEY...");
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": "skillyards-secret-123",
      },
      body: JSON.stringify({
        paymentId: "d78305b0-88e5-4dc0-bc90-4fe7a854a1fe", // Valid UUID
        jobId: "stale-job",
        status: "ready",
      }),
    });

    console.log("Status:", response.status);
    if (response.status === 200 || response.status === 400) {
      console.log("✅ SUCCESS: Correct key allowed request to proceed.");
    } else {
      console.log(
        "❌ FAILURE: Correct key was blocked. Got status:",
        response.status,
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    process.exit(1);
  }
}

testInternalBypass();
