import { createProtectedRoute } from "@/lib/middleware";
import { uploadImageToR2 } from "@/integrations/r2/r2.client";
import { getIstDate } from "@/lib/ist.js";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

async function postHandler(req, { ctx }) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return Response.json(
        { success: false, message: "File size must be under 5MB" },
        { status: 400 }
      );
    }

    const contentType = file.type;
    if (!ALLOWED_TYPES[contentType]) {
      return Response.json(
        { success: false, message: "Only PNG, JPEG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    const ext = ALLOWED_TYPES[contentType];
    const userId = ctx.session.userId;
    const date = getIstDate();
    const key = `eod-screenshots/${userId}/${date}-${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadImageToR2({ key, buffer, contentType });

    ctx.log("EOD_SCREENSHOT_UPLOADED", { key, userId });

    return Response.json({ success: true, screenshotKey: key });
  } catch (error) {
    ctx.error("EOD_SCREENSHOT_UPLOAD_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}

export const POST = createProtectedRoute(postHandler, {
  isPublic: false,
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
