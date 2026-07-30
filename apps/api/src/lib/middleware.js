import { getRequestContext, checkRateLimit } from "./auth";
import { canAccessReceipt } from "./permissions.js"; // This will be generalized later
import { corsHeaders } from "../utils/cors";

/**
 * SKILLYARDS STRUCTURAL ENFORCEMENT WRAPPER
 * 
 * Enforces:
 * 1. Authentication (via getRequestContext)
 * 2. Resource Fetch (via resourceLoader)
 * 3. Authorization (via canAccessReceipt/policy)
 * 4. Rate Limiting
 * 5. Request Correlation (requestId)
 */

export function createProtectedRoute(handler, { policy, resourceLoader, isPublic = false, internalServiceOnly = false }) {
  return async (req, context) => {
    const ctx = await getRequestContext(req);
    const headers = corsHeaders(req);

    // ── CORS PREFLIGHT ──
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    try {
      // 0. ── INTERNAL SERVICE ENFORCEMENT ──
      // This is a dedicated boundary for service-to-service calls
      if (internalServiceOnly) {
        const authKey = req.headers.get("x-internal-key");
        const expectedKey = process.env.PDF_SERVICE_API_KEY;

        if (!authKey || authKey !== expectedKey) {
          ctx.warn("INTERNAL_AUTH_FAILURE", { url: req.url });
          return new Response(JSON.stringify({ success: false, message: "Forbidden (Internal Only)" }), { status: 403, headers });
        }
        
        // Success: Mark as internal for logging/policy
        ctx.session = { userId: null, role: "INTERNAL" };
      }

      // 1. ── AUTHENTICATION (Bypass allowed ONLY if internal or public) ──
      if (!ctx.session && !isPublic && !internalServiceOnly) {
        ctx.warn("UNAUTHORIZED_ACCESS_ATTEMPT", { url: req.url });
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401, headers });
      }

      // 2. ── RATE PROTECTION (Standardized - Moving to boundary) ──
      const session = ctx.session || {}; 
      const ip = req.headers.get("x-forwarded-for")?.split(',')[0] || "anon";
      
      const rateKey = session.userId 
        ? `${session.userId}:${(await context?.params)?.id || "global"}`
        : `${ip}:${req.url}`; 
        
      const { limited, retryAfterMs } = checkRateLimit(rateKey);
      
      if (limited) {
        ctx.warn("RATE_LIMIT_EXCEEDED", { rateKey, retryAfterMs });
        return new Response(
          JSON.stringify({ success: false, message: "Too many requests. Please wait." }), 
          { status: 429, headers }
        );
      }

      // 3. ── RESOURCE FETCH (Targeted Loading) ──
      const resourceId = (await context?.params)?.id;
      let resource = null;
      if (resourceId && resourceLoader) {
        resource = await resourceLoader(resourceId);
        if (!resource) {
          ctx.warn("RESOURCE_NOT_FOUND", { resourceId });
          return new Response(JSON.stringify({ success: false, message: "Resource not found" }), { status: 404, headers });
        }
      }

      // 4. ── AUTHORIZATION (Policy Engine) ──
      const { authorized, reason } = policy(ctx.session, resource, req);
      
      ctx.log("AUTHZ_DECISION", {
        userId: session.userId || "anonymous",
        role: session.role || "PUBLIC",
        resourceId,
        result: authorized ? "ALLOW" : "DENY",
        reason
      });

      if (!authorized) {
        return new Response(JSON.stringify({ success: false, message: "Forbidden" }), { status: 403, headers });
      }

      // 5. ── SUCCESS: Proceed to handler ──
      const response = await handler(req, { context, ctx, resource });
      
      // ── CORS PRESERVATION ──
      // Ensure successful responses also carry the necessary CORS headers
      if (response instanceof Response) {
        // Force set headers to ensure they are added even if already present
        Object.entries(headers).forEach(([k, v]) => {
          response.headers.set(k, v);
        });
      }
      
      return response;

    } catch (error) {
      ctx.error("CRITICAL_ERROR_IN_WRAPPER", { error: error.message, stack: error.stack });
      return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500, headers });
    }
  };
}
