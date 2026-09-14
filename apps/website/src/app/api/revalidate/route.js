import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    // Validate env
    if (!WEBHOOK_SECRET) {
      console.error("SANITY_WEBHOOK_SECRET is missing");

      return NextResponse.json(
        { message: "Server misconfigured" },
        { status: 500 },
      );
    }

    // Validate auth
    const authHeader = request.headers.get("authorization") || "";
    const sanitySecret = request.headers.get("x-sanity-secret") || "";

    const isValid =
      authHeader === `Bearer ${WEBHOOK_SECRET}` ||
      sanitySecret === WEBHOOK_SECRET;

    if (!isValid) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse body safely
    let body = {};

    try {
      body = await request.json();
    } catch {
      // Ignore empty/invalid JSON body
    }

    console.log("Sanity webhook received:", body);

    // Revalidate FAQ cache
    revalidateTag("faqs");

    return NextResponse.json({
      revalidated: true,
      tag: "faqs",
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Revalidation failed:", error);

    return NextResponse.json(
      {
        message: "Failed to revalidate",
        error: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
