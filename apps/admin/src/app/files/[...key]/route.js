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

    const { body, contentType } = await getObjectFromR2({ key: fileKey });

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

    return new Response(body, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    if (error.name === "NoSuchKey") {
      return new Response("Not found", { status: 404 });
    }
    console.error("FILE_SERVE_ERROR", error);
    return new Response("Internal server error", { status: 500 });
  }
}
