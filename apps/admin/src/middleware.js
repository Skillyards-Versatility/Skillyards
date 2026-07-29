import { NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/students", "/enquiries", "/analytics", "/users", "/calls", "/eod", "/chat"];
const adminRoutes = ["/dashboard", "/students", "/enquiries", "/calls"];
const publicRoutes = ["/login", "/forgot-password", "/reset-password", "/"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isAdminRoute && session && !["ADMIN", "MANAGER"].includes(session.role)) {
    return NextResponse.redirect(new URL("/eod", req.nextUrl));
  }

  if (isPublicRoute && session && !path.startsWith("/dashboard")) {
    const isAdminish = ["ADMIN", "MANAGER"].includes(session.role);
    return NextResponse.redirect(new URL(isAdminish ? "/students" : "/eod", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
