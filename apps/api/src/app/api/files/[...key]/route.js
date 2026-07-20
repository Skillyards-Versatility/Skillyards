import { createProtectedRoute } from "@/lib/middleware";
import { getObjectFromR2 } from "@/integrations/r2/r2.client";

const MIME_MAP = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  pdf: "application/pdf",
  mp3: "audio/mpeg",
  wav: "audio/wav",
};

async function getHandler(req, { ctx }) {
  try {
    const url = new URL(req.url);
    const key = url.pathname.replace(/^\/api\/files\//, "");

    if (!key) {
      return new Response("Missing file key", { status: 400 });
    }

    const { body, contentType } = await getObjectFromR2({ key });

    const ext = key.split(".").pop().toLowerCase();
    const mime = MIME_MAP[ext] || contentType || "application/octet-stream";

    return new Response(body, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    if (error.name === "NoSuchKey") {
      return new Response("Not found", { status: 404 });
    }
    ctx.error("FILE_PROXY_FAILED", { error: error.message });
    return new Response("Internal server error", { status: 500 });
  }
}

export const GET = createProtectedRoute(getHandler, {
  isPublic: false,
  policy: (session) => ({
    authorized: !!session?.userId,
    reason: session?.userId ? "Authenticated" : "Login required",
  }),
});
