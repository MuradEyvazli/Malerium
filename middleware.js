// /middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  // Suppose you store a token in a cookie called 'token'
  const token = req.cookies.get("token");
  const { pathname } = req.nextUrl;

  // Not logged in
  if (!token) {
    // Trying to reach /blog or any sub-route => redirect to /login
    if (pathname.startsWith("/blog")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    // Logged in
    // If user tries to go to /login or /signup, redirect to /blog
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/blog", req.url));
    }
  }

  // Otherwise, continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/:path*", "/login/:path*", "/signup/:path*"],
};
