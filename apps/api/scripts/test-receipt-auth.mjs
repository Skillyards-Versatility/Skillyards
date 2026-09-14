import { SignJWT } from "jose";

const SECRET = "skillyards_secret_key_change_me_in_prod";
const encodedKey = new TextEncoder().encode(SECRET);
const API_URL = "http://localhost:3000/api/payments";
const VALID_PAYMENT_ID = "d78305b0-88e5-4dc0-bc90-4fe7a854a1fe";
const VALID_STUDENT_ID = "d78305b0-88e5-4dc0-bc90-4fe7a854a1fe"; // Using same ID for mock simplicity if needed

async function signToken(payload, expires = "7d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(encodedKey);
}

async function runTests() {
  console.log("🚀 Starting Structural Enforcement Tests (GET & POST)...\n");
  const adminToken = await signToken({ userId: "admin-1", role: "ADMIN" });

  // 1. RECEIPT GET (Existing Tests)
  console.log("Test 1: GET RECEIPT (Admin Cookie)");
  const res1 = await fetch(`${API_URL}/${VALID_PAYMENT_ID}/receipt`, {
    headers: { Cookie: `session=${adminToken}` },
  });
  console.log(`Status: ${res1.status} (Expected: 200 or 202)`);
  if ([200, 202].includes(res1.status)) console.log("✅ Passed");
  else console.log("❌ Failed");

  // 2. PAYMENT POST (Structural Test)
  console.log("\nTest 2: POST PAYMENT (Admin Cookie)");
  const res2 = await fetch(`${API_URL}/${VALID_STUDENT_ID}`, {
    method: "POST",
    headers: {
      Cookie: `session=${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: 1000,
      method: "cash",
      note: "Test payment",
    }),
  });
  // Note: if student exists, should be 201. If missing, 404.
  // The goal is to see it REPLACES the raw 500 or 401 with something controlled.
  console.log(`Status: ${res2.status} (Expected: 201 or 404)`);
  if ([201, 404].includes(res2.status)) console.log("✅ Passed");
  else console.log("❌ Failed");

  // 3. SALES DENY (Structural Test)
  console.log("\nTest 3: POST PAYMENT (Sales Cookie - Restricted)");
  const salesToken = await signToken({ userId: "sales-1", role: "SALES" });
  const res3 = await fetch(`${API_URL}/${VALID_STUDENT_ID}`, {
    method: "POST",
    headers: {
      Cookie: `session=${salesToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: 1000 }),
  });
  console.log(`Status: ${res3.status} (Expected: 403)`);
  if (res3.status === 403) console.log("✅ Passed");
  else console.log("❌ Failed");

  console.log("\n🏁 Structural Enforcement Tests Completed.");
}

runTests().catch(console.error);
