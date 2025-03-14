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
      // Mutlaka tam URL veya new URL kullanın:
      return NextResponse.redirect("http://localhost:3000/login?error=NoCode");
    }

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
    const { id_token } = data;

    if (!id_token) {
      return NextResponse.redirect("http://localhost:3000/login?error=NoIdToken");
    }

    // id_token decode
    const googleUser = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );
    const email = googleUser.email;
    const name = googleUser.name || "Google User";

    // Kullanıcı yoksa oluştur
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        // Artık şemanız password alanını zorunlu istemeyecek veya default: ""
        password: "",
      });
      await user.save();
    }

    // Kendi JWT token'ınızı oluşturun
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Cookie'ye token set ederek /blog'a yönlendiriyoruz
    const response = NextResponse.redirect("http://localhost:3000/blog");
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("Google callback error:", error);
    // new URL ile tam yönlendirme
    return NextResponse.redirect(
      new URL("/login?error=Google+OAuth+failed", request.url)
    );
  }
}
