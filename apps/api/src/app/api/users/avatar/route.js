import { createProtectedRoute } from "@/lib/middleware";
import { uploadImageToR2 } from "@/integrations/r2/r2.client";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

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
        { success: false, message: "File size must be under 2MB" },
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
    const key = `profile-photos/${userId}/${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadImageToR2({ key, buffer, contentType });

    ctx.log("PROFILE_PHOTO_UPLOADED", { key, userId });

    return Response.json({ success: true, profileImageKey: key });
  } catch (error) {
    ctx.error("PROFILE_PHOTO_UPLOAD_FAILED", { error: error.message });
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
