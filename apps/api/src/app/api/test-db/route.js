import { getAllEnquiries } from "@/modules/enquiries/enquiry.repository";
import { success, error } from "@/utils/response";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessEnquiry } from "@/lib/permissions";

/**
 * SECURED DB TEST HANDLER (Internal)
 */
async function getHandler() {
  try {
    const data = await getAllEnquiries();
    return Response.json(success(data, "Enquiries fetched successfully"));
  } catch (err) {
    return Response.json(
      error("Failed to fetch enquiries", { error: err.message }),
      { status: 400 },
    );
  }
}

// ── STRUCTURAL ENFORCEMENT ──
export const GET = createProtectedRoute(getHandler, {
  policy: canAccessEnquiry,
});
