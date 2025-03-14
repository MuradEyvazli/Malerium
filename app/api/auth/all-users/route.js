import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(request) {
  await dbConnect();

  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("search") || "";

  // Kullanıcıları ada göre filtreleme
  let users;
  if (searchQuery) {
    users = await User.find({ name: { $regex: searchQuery, $options: "i" } }).select("name avatar _id");
  } else {
    users = await User.find().select("name avatar _id");
  }

  return NextResponse.json({ success: true, users });
}
