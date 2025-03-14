import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FriendRequest from "@/models/FriendRequest";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(request) {
  await dbConnect();

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  let userId;
  try {
    userId = verifyToken(token);
  } catch (error) {
    return NextResponse.json({ success: false, message: "Token geçersiz" }, { status: 401 });
  }

  const { receiverId } = await request.json();

  // Aynı isteğin olup olmadığını kontrol et
  const existingRequest = await FriendRequest.findOne({
    sender: userId,
    receiver: receiverId,
  });

  if (existingRequest) {
    return NextResponse.json({ success: false, message: "Zaten arkadaşlık isteği gönderdiniz" }, { status: 400 });
  }

  // Arkadaşlık isteğini oluştur
  const friendRequest = new FriendRequest({
    sender: userId,
    receiver: receiverId,
    status: "pending",
  });

  await friendRequest.save();
  return NextResponse.json({ success: true, message: "Arkadaşlık isteği gönderildi!", friendRequest });
}
