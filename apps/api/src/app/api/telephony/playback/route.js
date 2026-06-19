import { s3Client } from "@/integrations/r2/r2.client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createProtectedRoute } from "@/lib/middleware";

async function getHandler(req, { ctx }) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return Response.json(
      { success: false, message: "Missing key parameter" },
      { status: 400 }
    );
  }

  // Security constraint: Only allow keys starting with "recordings/"
  if (!key.startsWith("recordings/")) {
    return Response.json(
      { success: false, message: "Unauthorized key path" },
      { status: 403 }
    );
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    });

    const response = await s3Client.send(command);
    
    if (!response.Body) {
      return Response.json(
        { success: false, message: "Empty recording body" },
        { status: 404 }
      );
    }

    const ext = key.split(".").pop();
    let contentType = "audio/mpeg";
    if (ext === "m4a") contentType = "audio/x-m4a";
    else if (ext === "wav") contentType = "audio/wav";

    return new Response(response.Body.transformToWebStream(), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": response.ContentLength?.toString() || "",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (err) {
    ctx.error("PLAYBACK_STREAM_ERROR", { error: err.message, key });
    return Response.json(
      { success: false, message: "Error fetching audio stream" },
      { status: 500 }
    );
  }
}

export const GET = createProtectedRoute(getHandler, {
  isPublic: true,
  policy: () => ({ authorized: true }),
});
