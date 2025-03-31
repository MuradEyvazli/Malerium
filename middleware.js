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
    // Allow access to the main blog page and blog listing without authentication
    if (pathname === "/blog" || pathname === "/blog/") {
      console.log('Middleware: No token, but allowing access to main blog page');
      return NextResponse.next();
    }
    
    // Specific blog paths that require authentication
    const authRequiredPaths = [
      "/blog/add-post", 
      "/blog/friends", 
      "/blog/premium-content",
      "/profile",
      "/blog/user"
    ];
    
    // Check if current path starts with any of the auth required paths
    const requiresAuth = authRequiredPaths.some(path => pathname.startsWith(path));
    
    // Individual post pages like /blog/123 shouldn't be blocked, handled client-side
    const isIndividualPostPage = pathname.match(/^\/blog\/[a-zA-Z0-9]+$/);
    
    if (requiresAuth) {
      console.log('Middleware: No token, redirecting to login');
      // Store the attempted URL to redirect back after login
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
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
    "/profile/:path*"
  ],
};