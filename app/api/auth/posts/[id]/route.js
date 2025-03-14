// /api/auth/posts/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: "Post ID gerekli" }, { status: 400 });
    }

    // Populate işlemi ile post bilgilerini getir
    const post = await Post.findById(id)
      .populate("user", "name avatar") // Yazarı populate et
      .populate("comments.user", "name avatar"); // Yorum yazarlarını populate et

    if (!post) {
      return NextResponse.json({ message: "Blog bulunamadı" }, { status: 404 });
    }

    // Frontend'e gönderilecek veri formatını hazırla
    const postObj = post.toObject({ getters: true });
    
    // Yazar bilgilerini ekle
    postObj.author = post.user ? {
      _id: post.user._id,
      name: post.user.name,
      avatar: post.user.avatar
    } : null;
    
    // Kolaylık için doğrudan erişilebilen alanlar
    postObj.avatar = post.user?.avatar || null;
    postObj.userName = post.user?.name || "Anonim";
    
    // Yorum bilgilerini düzenle
    if (postObj.comments && postObj.comments.length > 0) {
      postObj.comments = postObj.comments.map(comment => ({
        ...comment,
        user: comment.user ? {
          _id: comment.user._id,
          name: comment.user.name,
          avatar: comment.user.avatar
        } : null
      }));
    }

    return NextResponse.json(postObj);
  } catch (error) {
    console.error("Blog getirirken hata:", error);
    return NextResponse.json({ message: "Server hatası" }, {
      status: 500,
    });
  }
}