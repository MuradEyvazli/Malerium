import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    // URL parametresinden userId al
    const { id } = params;

    // İsteğin Authorization Header'ından token al
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

    // userId parametredeki id ile eşleşiyor mu, istersen kontrol edebilirsin
    // if (decoded.id !== id) {
    //   return new Response(JSON.stringify({ message: "Farklı user!" }), { status: 403 });
    // }

    // Kullanıcının tüm postlarını bul
    const posts = await Post.find({ user: id })
      .sort({ createdAt: -1 })
      .populate("user", "name avatar");

    const result = posts.map((post) => ({
      ...post.toObject(),
      author: {
        name: post.user.name,
        avatar: post.user.avatar,
      },
    }));

    return new Response(JSON.stringify({ posts: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Sunucu hatası" }), {
      status: 500,
    });
  }
}
