import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function getSession(req) {
  try {
    // `Authorization` başlığından token al
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null; // Token yoksa
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return null; // Token bulunamadıysa
    }

    // Token'i doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return null; // Doğrulama başarısızsa
    }

    // Kullanıcı bilgilerini al
    await dbConnect();
    const user = await User.findById(decoded.id);
    if (!user) {
      return null; // Kullanıcı bulunamadıysa
    }

    // Kullanıcıyı döndür
    return { user };
  } catch (error) {
    console.error("Session alınırken hata:", error);
    return null; // Hata durumunda null döndür
  }
}
