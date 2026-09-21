import { API } from "@/lib/api";
import { getRawToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const { key } = await params;
    const fileKey = Array.isArray(key) ? key.join("/") : key;

    const token = await getRawToken();
    const res = await fetch(`${API}/api/files/${fileKey}`, {
      headers: token ? { Cookie: `session=${token}` } : {},
      cache: "no-store",
    });

    if (!res.ok) {
      return new Response(res.statusText, { status: res.status });
    }

    const headers = new Headers();
    const contentType = res.headers.get("content-type");
    const contentLength = res.headers.get("content-length");
    const cacheControl = res.headers.get("cache-control");

    if (contentType) headers.set("Content-Type", contentType);
    if (contentLength) headers.set("Content-Length", contentLength);
    headers.set(
      "Cache-Control",
      cacheControl || "private, max-age=86400, stale-while-revalidate=86400",
    );

    return new Response(res.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("FILE_PROXY_ERROR", error);
    return new Response("Internal server error", { status: 500 });
  }
}

