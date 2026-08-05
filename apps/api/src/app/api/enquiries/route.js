import { validateEnquiry } from "@/modules/enquiries/enquiry.schema";
import { createEnquiryService, getAllEnquiriesService } from "@/modules/enquiries/enquiry.service";
import { success, error } from "@/utils/response";
import { createProtectedRoute } from "@/lib/middleware";
import { publicAllow, canAccessEnquiry } from "@/lib/permissions";

// Moderate policy: the form is already reCAPTCHA-protected, so the limiter is a
// secondary net rather than the primary defence.
const ENQUIRY_POST_RATE_LIMIT = {
  prefix: "enquiries",
  burst: { limit: 10, windowMs: 60000 },
  hourly: { limit: 60 },
  daily: { limit: 300 },
};

/**
 * SECURED ENQUIRY LIST HANDLER (Admin/Manager)
 */
async function getHandler(req, { ctx }) {
  const data = await getAllEnquiriesService();
  return Response.json(success(data, "Enquiries fetched successfully"));
}

/**
 * PUBLIC ENQUIRY SUBMISSION HANDLER (Website)
 */
async function postHandler(req, { ctx }) {
  const body = await req.json();
  const validation = validateEnquiry(body);

  if (!validation.success) {
    ctx.warn("ENQUIRY_VALIDATION_FAILURE", { errors: validation.error.flatten() });
    return Response.json(
      error("Validation failed", validation.error.flatten()),
      { status: 400 }
    );
  }

  try {
    const enquiry = await createEnquiryService(validation.data);
    ctx.log("ENQUIRY_SUBMITTED", { enquiryId: enquiry.id });

    return Response.json(
      success(enquiry, "Enquiry submitted successfully"),
      { status: 201 }
    );
  } catch (err) {
    const message = err.message || "Failed to submit enquiry";

    if (message.includes("Captcha verification failed")) {
      ctx.warn("ENQUIRY_CAPTCHA_FAILURE", { email: validation.data.email });
      return Response.json(error("Captcha verification failed"), { status: 400 });
    }

    throw err;
  }
}

// ── STRUCTURAL ENFORCEMENT ──

// GET: Strictly protected for staff/admins
export const GET = createProtectedRoute(getHandler, {
  policy: canAccessEnquiry
});

// POST: Publicly accessible but still through the structural wrapper
// This allows us to have requestId, logging, rate limiting, and CAPTCHA on the website form!
export const POST = createProtectedRoute(postHandler, {
  policy: publicAllow,
  isPublic: true,
  rateLimit: ENQUIRY_POST_RATE_LIMIT
});
