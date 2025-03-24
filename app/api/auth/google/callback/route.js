// app/api/auth/google/callback/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    
    if (!code) {
      return NextResponse.redirect("http://localhost:3000/login?error=NoCode");
    }
    
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/api/auth/google/callback",
        grant_type: "authorization_code",
      }),
    });
    
    const data = await tokenRes.json();
    const { id_token, access_token } = data;
    
    if (!id_token) {
      return NextResponse.redirect("http://localhost:3000/login?error=NoIdToken");
    }
    
    // Decode the id_token to get user info
    const googleUser = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );
    
    console.log("Google User Data:", googleUser);
    
    // Extract user information from Google response
    const { email, name, sub: googleId, picture, given_name, family_name } = googleUser;
    
    // Check if user exists in database
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user with Google information if needed
      if (!user.googleId) {
        user.googleId = googleId;
        
        // Update profile info if missing
        if (!user.avatar && picture) user.avatar = picture;
        if (!user.name && name) user.name = name;
        
        await user.save();
        console.log("Updated existing user with Google data:", user._id);
      }
    } else {
      // Create new user with Google information
      user = new User({
        name: name || "Google User",
        email,
        googleId,
        password: "", // Password not required for OAuth users
        avatar: picture || "https://images.pexels.com/photos/30469688/pexels-photo-30469688.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        // Optional: store additional data
        nickName: given_name,
      });
      await user.save();
      console.log("Created new user from Google data:", user._id);
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    
    console.log("Authentication successful, setting token and redirecting");
    
    // Set cookie and redirect to blog
    const response = NextResponse.redirect("http://localhost:3000/blog");
    
    // Set HTTP-only cookie for server-side auth
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    // Also store in localStorage via a non-HttpOnly cookie for client-side access
    response.cookies.set("clientToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    return response;
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=Google+OAuth+failed", request.url)
    );
  }
}