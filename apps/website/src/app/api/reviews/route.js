import { NextResponse } from "next/server";
import { getGoogleReviews } from "@/lib/reviews/getGoogleReviews";

export async function GET() {
  try {
    const data = await getGoogleReviews();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
