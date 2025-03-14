import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { uploadImage } from "@/utils/uploadImage";

export async function PATCH(req) {
  await dbConnect();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ message: "Yetkisiz erişim" }), {
      status: 401,
    });
  }

  const token = authHeader.split(" ")[1];
  const secretKey = process.env.JWT_SECRET;

  let decoded;
  try {
    decoded = jwt.verify(token, secretKey);
  } catch (error) {
    return new Response(JSON.stringify({ message: "Geçersiz token" }), {
      status: 403,
    });
  }

  try {
    // İsteği FormData olarak alıyoruz (multipart destekli)
    const formData = await req.formData();

    // Avatar alanını kontrol ediyoruz
    let avatarUrl = "";
    const avatarField = formData.get("avatar");
    if (avatarField instanceof Blob && avatarField.size > 0 && avatarField.type.startsWith("image/")) {
      // Dosya gönderildiyse, Cloudinary’ye yükle
      const buffer = Buffer.from(await avatarField.arrayBuffer());
      try {
        avatarUrl = await uploadImage(buffer);
      } catch (error) {
        console.error("Avatar yükleme hatası:", error);
      }
    } else if (avatarField) {
      // Dosya değilse (örneğin, URL olarak geldiyse)
      avatarUrl = avatarField.toString();
    }

    // Diğer alanları da FormData’dan alıyoruz
    const name = formData.get("name")?.toString() || "";
    const bio = formData.get("bio")?.toString() || "";
    const website = formData.get("website")?.toString() || "";
    const nickName = formData.get("nickName")?.toString() || "";
    const gender = formData.get("gender")?.toString() || "";
    const country = formData.get("country")?.toString() || "";
    const language = formData.get("language")?.toString() || "";
    const timeZone = formData.get("timeZone")?.toString() || "";

    const user = await User.findById(decoded.id);
    if (!user) {
      return new Response(JSON.stringify({ message: "Kullanıcı bulunamadı" }), {
        status: 404,
      });
    }

    // Güncelleme işlemleri: Sadece gelen değer varsa güncelliyoruz
    if (avatarUrl) user.avatar = avatarUrl;
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (website) user.website = website;
    if (nickName) user.nickName = nickName;
    if (gender) user.gender = gender;
    if (country) user.country = country;
    if (language) user.language = language;
    if (timeZone) user.timeZone = timeZone;

    await user.save();
    const updatedUser = user.toJSON();

    return new Response(JSON.stringify({ updatedUser }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Profil güncellenemedi:", error);
    return new Response(JSON.stringify({ message: "Sunucu hatası" }), {
      status: 500,
    });
  }
}

// Dosya yükleme için body parser'ı kapatıyoruz
export const config = {
  api: {
    bodyParser: false,
  },
};
