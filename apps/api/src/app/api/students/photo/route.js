import { createProtectedRoute } from "@/lib/middleware";
import { uploadImageToR2 } from "@/integrations/r2/r2.client";
import crypto from "crypto";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const MIME_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
  "image/webp": "webp",
  "image/jfif": "jpeg",
  "image/pjpeg": "jpeg",
  "image/x-png": "png",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heif",
};

const EXT_MAP = {
  png: { ext: "png", mime: "image/png" },
  jpeg: { ext: "jpeg", mime: "image/jpeg" },
  jpg: { ext: "jpeg", mime: "image/jpeg" },
  webp: { ext: "webp", mime: "image/webp" },
  jfif: { ext: "jpeg", mime: "image/jpeg" },
  avif: { ext: "avif", mime: "image/avif" },
  heic: { ext: "heic", mime: "image/heic" },
  heif: { ext: "heif", mime: "image/heif" },
};

async function postHandler(req, { ctx }) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { success: false, message: "No file provided" },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return Response.json(
        { success: false, message: "File size must be under 5MB" },
        { status: 400 },
      );
    }

    const rawType = (file.type || "").split(";")[0].trim().toLowerCase();
    const rawName = file.name || "";
    const nameExt = rawName.split(".").pop()?.toLowerCase().trim() || "";

    let ext = MIME_MAP[rawType];
    let contentType = rawType;

    if (!ext && EXT_MAP[nameExt]) {
      ext = EXT_MAP[nameExt].ext;
      contentType = EXT_MAP[nameExt].mime;
    }

    if (!ext) {
      return Response.json(
        {
          success: false,
          message: "Only PNG, JPEG, WebP, and AVIF images are allowed",
        },
        { status: 400 },
      );
    }

    const randomId = crypto.randomUUID();
    const key = `student-photos/${Date.now()}-${randomId}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadImageToR2({ key, buffer, contentType });

    ctx.log("STUDENT_PHOTO_UPLOADED", {
      key,
      uploadedBy: ctx.session.userId,
    });

    return Response.json({ success: true, photoKey: key });
  } catch (error) {
    ctx.error("STUDENT_PHOTO_UPLOAD_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Upload failed" },
      { status: 500 },
    );
  }
}

export const POST = createProtectedRoute(postHandler, {
  isPublic: false,
  policy: (session) => {
    if (!session?.userId) {
      return { authorized: false, reason: "LOGIN_REQUIRED" };
    }
    if (session.role === "STUDENT") {
      return { authorized: false, reason: "STUDENT_ROLE_RESTRICTED" };
    }
    return { authorized: true, reason: "AUTHORIZED" };
  },
});
