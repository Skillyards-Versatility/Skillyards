import { NextResponse } from "next/server";
import { corsHeaders } from "./utils/cors";

/**
 * GLOBAL API PROXY (Next.js 16+)
 *
 * Specifically handles:
 * 1. CORS Preflight (OPTIONS) requests which bypass route handlers.
 * 2. Injection of CORS headers into all API responses.
 */
export function proxy(request) {
  // 1. Handle Preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }

  // 2. Handle actual requests
  const response = NextResponse.next();
  const headers = corsHeaders(request);

  // Apply CORS headers to the response
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Ensure it only runs for API routes
export const config = {
  matcher: "/api/:path*",
};
