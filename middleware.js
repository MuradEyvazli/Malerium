// /middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  // Get the requested path
  const { pathname } = req.nextUrl;
  
  // Skip middleware for all API auth routes
  if (pathname.startsWith('/api/auth/')) {
    console.log('Middleware: Allowing API auth route to proceed:', pathname);
    return NextResponse.next();
  }
  
  // Get token from cookies
  const token = req.cookies.get("token");
  console.log(`Middleware: Path=${pathname}, HasToken=${!!token}`);
  
  // Not logged in
  if (!token) {
    // Trying to reach /blog or any sub-route => redirect to /login
    if (pathname.startsWith("/blog")) {
      console.log('Middleware: No token, redirecting to login');
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    // Logged in
    // If user tries to go to /login or /signup, redirect to /blog
    if (pathname === "/login" || pathname === "/signup") {
      console.log('Middleware: User is logged in, redirecting to blog');
      return NextResponse.redirect(new URL("/blog", req.url));
    }
  }
  
  // Otherwise, continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/blog/:path*",
    "/login",
    "/signup",
    // Exclude API routes from the matcher
  ],
};