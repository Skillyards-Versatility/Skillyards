import { NextResponse, type NextRequest } from "next/server";

const GONE_URLS = new Set<string>([
  "/free-resume",
  "/free-counselling",
  "/social",
  "/opensource",
  "/projects",
  "/instructors",
  "/partners",
  "/certifications",
  "/team/vijaygoswami",
  "/foundation-training-program-in-agra",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 410 Gone logic
  if (GONE_URLS.has(pathname)) {
    return new NextResponse("Gone", { status: 410 });
  }

  // 2. Thank You Contact Validation Logic
  if (pathname === "/thank-you-contact") {
    const tokenFromQuery = request.nextUrl.searchParams.get("token");
    const tokenFromCookie = request.cookies.get(
      "contact_thank_you_token",
    )?.value;

    if (
      !tokenFromQuery ||
      !tokenFromCookie ||
      tokenFromQuery !== tokenFromCookie
    ) {
      return NextResponse.redirect(new URL("/contact", request.url));
    }

    const response = NextResponse.next();
    response.cookies.set("contact_thank_you_token", "", {
      maxAge: 0,
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 410 matches
    "/free-resume",
    "/free-counselling",
    "/social",
    "/opensource",
    "/projects",
    "/instructors",
    "/partners",
    "/certifications",
    "/team/vijaygoswami",
    "/foundation-training-program-in-agra",

    // thank-you validation match
    "/thank-you-contact",
  ],
};
