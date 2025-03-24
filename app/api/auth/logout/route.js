// app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  // Create the response object
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
  
  // Clear all authentication cookies
  response.cookies.set("token", "", { 
    maxAge: 0,
    path: "/",
  });
  
  response.cookies.set("clientToken", "", { 
    maxAge: 0,
    path: "/",
  });
  
  // Add a header to instruct the client to clear localStorage
  response.headers.set("Clear-Local-Storage", "true");
  
  return response;
}