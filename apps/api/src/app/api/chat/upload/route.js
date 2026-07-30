import { createProtectedRoute } from "@/lib/middleware";
import { s3Client } from "@/integrations/r2/r2.client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const MIME_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
  "text/plain": "txt",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

function getBucket() {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) throw new Error("R2_BUCKET environment variable is not set");
  return bucket;
}

async function postHandler(req, { ctx }) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const conversationId = formData.get("conversationId");

    if (!file || !conversationId) {
      return Response.json(
        { success: false, message: "File and conversationId are required" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return Response.json(
        { success: false, message: "File size must be under 10MB" },
        { status: 400 }
      );
    }

    const contentType = file.type || "application/octet-stream";
    const ext = MIME_MAP[contentType] || "bin";
    const userId = ctx.session.userId;
    const key = `chat-uploads/${conversationId}/${userId}/${Date.now()}-${file.name}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const command = new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    ctx.log("CHAT_FILE_UPLOADED", { key, conversationId, userId, fileName: file.name, fileType: contentType });

    return Response.json({
      success: true,
      fileKey: key,
      fileName: file.name,
      fileType: contentType,
    });
  } catch (error) {
    ctx.error("CHAT_FILE_UPLOAD_FAILED", { error: error.message });
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
