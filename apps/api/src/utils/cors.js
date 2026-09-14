export function corsHeaders(request) {
  const origin = request?.headers?.get?.("origin") || "";

  const allowedOrigins = [
    "https://skillyards.in",
    "https://www.skillyards.in",
    "https://admin.skillyards.in",
    "https://skillyards-admin.vercel.app",
    "https://skillyards-website.vercel.app",
    "http://localhost:3002",
    "http://localhost:3001",
    "http://localhost:3000",
  ];

  const isAllowed = origin && allowedOrigins.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "https://skillyards.in",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-internal-key",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Expose-Headers": "Content-Disposition",
    Vary: "Origin",
  };
}
