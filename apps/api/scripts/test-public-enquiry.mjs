const API_URL = "http://localhost:3002/api/enquiries";

async function testPublicEnquiry() {
  console.log(
    "🚀 Testing Public Enquiry POST (Structural Fix Verification)...",
  );

  const payload = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "9876543210",
    message: "Structural enforcement testing.",
    captchaToken: "test-token",
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.status === 201) {
      console.log("✅ PASSED: Public route handled correctly without session.");
    } else {
      console.log("❌ FAILED: Unexpected status code.");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error.message);
    process.exit(1);
  }
}

testPublicEnquiry();
