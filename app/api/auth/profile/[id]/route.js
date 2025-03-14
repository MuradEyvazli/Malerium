// Örnek Next.js API Route: app/api/auth/profile/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  try {
    verifyToken(token);
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, message: "Kullanıcı bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ success: true, profile: user });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}
