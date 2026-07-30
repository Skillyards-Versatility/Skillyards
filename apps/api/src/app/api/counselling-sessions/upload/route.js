import { createProtectedRoute } from "@/lib/middleware";
import { uploadImageToR2 } from "@/integrations/r2/r2.client";

async function postHandler(req, { ctx }) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type;
    const extension = file.name.split(".").pop();
    
    // Generate a unique key for the image
    const key = `counselling/${ctx.session.userId}-${Date.now()}.${extension}`;

    await uploadImageToR2({ key, buffer, contentType });

    ctx.log("COUNSELLING_IMAGE_UPLOADED", { key });

    return Response.json({ success: true, imageKey: key }, { status: 201 });
  } catch (error) {
    ctx.error("COUNSELLING_IMAGE_UPLOAD_FAILED", { error: error.message });
    return Response.json({ success: false, message: "Failed to upload image" }, { status: 500 });
  }
}

export const POST = createProtectedRoute(postHandler, {
  isPublic: false,
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
