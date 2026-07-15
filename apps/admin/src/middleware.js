import { NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/students", "/enquiries", "/analytics", "/users", "/calls"];
const publicRoutes = ["/login", "/"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session && !path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/students", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
