// /api/auth/like-post/route.js (Next.js 13) 
// veya /api/auth/like-post.js (Next.js 12)
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ message: "Yetkisiz erişim" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { postId } = await req.json();
    if (!postId) {
      return new Response(JSON.stringify({ message: "postId gerekli" }), {
        status: 400,
      });
    }

    let post = await Post.findById(postId);
    if (!post) {
      return new Response(JSON.stringify({ message: "Post bulunamadı" }), {
        status: 404,
      });
    }

    // Beğeni işlemi
    const index = post.likes.findIndex((likeUserId) => likeUserId.equals(userId));
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    // Populate işlemleri
    await post.populate("user", "name avatar");
    await post.populate("comments.user", "name avatar");

    // Frontend'e uygun formatta döndür
    const postObj = post.toObject({ getters: true });
    
    // Doğru formatta döndürebilmek için author alanını ekle
    if (post.user) {
      postObj.author = {
        _id: post.user._id,
        name: post.user.name,
        avatar: post.user.avatar
      };
    }

    return new Response(JSON.stringify({ post: postObj }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Like Post Hatası:", error);
    return new Response(JSON.stringify({ message: "Sunucu hatası" }), {
      status: 500,
    });
  }
}