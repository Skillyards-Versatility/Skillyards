import fetch from "node-fetch";

const PAYMENT_ID = "00000000-0000-0000-0000-000000000000"; // hypothetical
const API_URL = "http://localhost:3000/api/payments";

async function simulateTraffic(count) {
  console.log(
    `Simulating ${count} concurrent requests for payment ${PAYMENT_ID}...`,
  );

  const start = Date.now();
  const promises = Array.from({ length: count }).map((_, i) =>
    fetch(`${API_URL}/${PAYMENT_ID}/receipt?format=pdf`)
      .then((res) => ({ id: i, status: res.status }))
      .catch((err) => ({ id: i, error: err.message })),
  );

  const results = await Promise.all(promises);
  const end = Date.now();

  console.log(`Results:`, results);
  console.log(`Total duration: ${end - start}ms`);
}

// simulateTraffic(10);
console.log("Stress test ready. (Requires running server)");
