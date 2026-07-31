import { getSession } from "@/lib/auth";
import { getObjectFromR2 } from "@/integrations/r2/r2.client";

export const dynamic = "force-dynamic";

export async function GET(_, { params }) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { key } = await params;
    const fileKey = key.join("/");

    const { body, contentType, contentLength } = await getObjectFromR2({ key: fileKey });

    const ext = fileKey.split(".").pop().toLowerCase();
    const MIME_MAP = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      pdf: "application/pdf",
      mp3: "audio/mpeg",
      wav: "audio/wav",
    };
    const mime = MIME_MAP[ext] || contentType || "application/octet-stream";
    
    // AWS SDK v3 returns a Node.js stream for Body. Next.js Response requires Web stream or Buffer.
    const webStream = body.transformToWebStream();

    const headers = {
      "Content-Type": mime,
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
    };
    if (contentLength) {
      headers["Content-Length"] = contentLength.toString();
    }

    return new Response(webStream, { headers });
  } catch (error) {
    if (error.name === "NoSuchKey") {
      return new Response("Not found", { status: 404 });
    }
    console.error("FILE_SERVE_ERROR", error);
    return new Response("Internal server error", { status: 500 });
  }
}
