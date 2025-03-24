import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export const GET = async (request) => {
  try {
    await dbConnect();

    // 1) İlk önce Authorization header var mı diye bak
    let token;
    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Header'da Bearer token varsa onu kullanalım
      token = authHeader.split(" ")[1];
    } else {
      // Yoksa cookie'ye bakalım
      // (Next 13 route handlers için request.cookies.get(...) şeklinde)
      const tokenFromCookie = request.cookies.get("token");
      token = tokenFromCookie ? tokenFromCookie.value : null;
    }

    // Token hiç yoksa 401
    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    // 2) Token'ı doğrula
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return NextResponse.json({ message: "Token expired" }, { status: 401 });
      }
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 3) Veritabanında kullanıcı var mı
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 4) Başarılı
    return NextResponse.json({ currentUser: user }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
