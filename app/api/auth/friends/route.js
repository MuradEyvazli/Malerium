import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FriendRequest from "@/models/FriendRequest";
import { verifyToken } from "@/lib/verifyToken";

// GET: Eğer URL'de "list=friends" varsa kabul edilmiş arkadaşlıkları döndürür,
// aksi halde kendisine gelen (pending) arkadaşlık isteklerini döndürür.
export async function GET(request) {
  await dbConnect();

  const url = new URL(request.url);
  const listType = url.searchParams.get("list");

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

  if (listType === "friends") {
    const friends = await FriendRequest.find({
      status: "accepted",
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, friends });
  } else {
    // Hem gönderilen hem de alınan pending istekleri döndür
    const friendRequests = await FriendRequest.find({
      status: "pending",
      $or: [{ receiver: userId }, { sender: userId }],
    })
    .populate("sender")
    .populate("receiver") // receiver'ı da populate ediyoruz
    .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, friendRequests });
  }
}


// POST: Arkadaşlık isteği gönderme (sender: token’dan alınır, receiverId body’den)
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

  const { receiverId, senderName, senderAvatar } = await request.json();

  // Aynı isteğin tekrar gönderilmemesi için kontrol
  const existing = await FriendRequest.findOne({
    sender: userId,
    receiver: receiverId,
  });
  if (existing) {
    return NextResponse.json(
      { success: false, message: "Arkadaşlık isteği zaten gönderildi" },
      { status: 400 }
    );
  }

  const friendRequest = new FriendRequest({
    sender: userId,
    senderName,
    senderAvatar,
    receiver: receiverId,
    status: "pending",
  });
  await friendRequest.save();
  // Gönderici bilgisini populate ederek dönüyoruz.
  const populatedFriendRequest = await FriendRequest.findById(friendRequest._id).populate("sender");
  return NextResponse.json({ success: true, friendRequest: populatedFriendRequest });
}

// PATCH: Arkadaşlık isteğini güncelleme (accept/reject). Sadece isteğin alıcısı işlem yapabilir.
export async function PATCH(request) {
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

  const { requestId, action } = await request.json();
  const friendRequest = await FriendRequest.findById(requestId);
  if (!friendRequest) {
    return NextResponse.json({ success: false, message: "İstek bulunamadı" }, { status: 404 });
  }
  // Sadece alıcı isteği işleyebilir.
  if (friendRequest.receiver.toString() !== userId) {
    return NextResponse.json({ success: false, message: "Yetkisiz işlem" }, { status: 403 });
  }
  if (action === "accept") {
    friendRequest.status = "accepted";
  } else if (action === "reject") {
    friendRequest.status = "rejected";
  } else {
    return NextResponse.json({ success: false, message: "Geçersiz işlem" }, { status: 400 });
  }
  await friendRequest.save();
  // Güncel veriyi sender ve receiver bilgilerini de ekleyerek populate ediyoruz.
  const populatedFriendRequest = await FriendRequest.findById(requestId)
    .populate("sender")
    .populate("receiver");

  if (action === "accept") {
    // Accepted durumda, hem friendRequest hem friend bilgisini döndürüyoruz.
    return NextResponse.json({
      success: true,
      friendRequest: populatedFriendRequest,
      friend: populatedFriendRequest,
    });
  } else {
    return NextResponse.json({ success: true, friendRequest: populatedFriendRequest });
  }
}

// DELETE: Arkadaşlık isteğini veya ilişkiyi silme. Gönderen veya alan silme yetkisine sahip.
export async function DELETE(request) {
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

  const { requestId } = await request.json();
  const friendRequest = await FriendRequest.findById(requestId);
  if (!friendRequest) {
    return NextResponse.json({ success: false, message: "İstek bulunamadı" }, { status: 404 });
  }
  if (
    friendRequest.sender.toString() !== userId &&
    friendRequest.receiver.toString() !== userId
  ) {
    return NextResponse.json({ success: false, message: "Yetkisiz işlem" }, { status: 403 });
  }
  await FriendRequest.deleteOne({ _id: requestId });
  return NextResponse.json({ success: true, message: "İstek silindi" });
}
