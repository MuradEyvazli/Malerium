import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await dbConnect();

  try {
    // Header'dan token al
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ message: "Yetkisiz erişim" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Token'ı al ve doğrula
    const token = authHeader.split(" ")[1];
    const secretKey = process.env.JWT_SECRET;
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      return new Response(JSON.stringify({ message: "Geçersiz token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = decoded.id;

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(2)
      .populate("user", "name avatar");

    return new Response(
      JSON.stringify({
        posts: posts.map(post => ({
          ...post.toObject(),
          author: {
            name: post.user.name,
            avatar: post.user.avatar,
          },
          previewImage:
            post.images && post.images.length > 0 ? post.images[0] : null,
        })),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Kullanıcının postlarını çekerken hata oluştu:", error);
    return new Response(
      JSON.stringify({ message: "Postlar alınamadı" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
