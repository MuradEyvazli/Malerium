// /api/auth/all-posts/route.js
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function GET() {
  await dbConnect();
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("user", "name avatar")
      .populate("comments.user", "name avatar");

    return new Response(
      JSON.stringify({
        posts: posts.map(post => {
          const postObj = post.toObject({ getters: true });
          
          // Eğer post.user varsa author alanını düzgün bir şekilde ekle
          if (post.user) {
            postObj.author = {
              _id: post.user._id,
              name: post.user.name,
              avatar: post.user.avatar
            };
          } else {
            // User yoksa varsayılan değerlerle bir author ekle
            postObj.author = {
              _id: "anonymous",
              name: "Anonim Kullanıcı",
              avatar: "/fallback-avatar.png"
            };
          }
          
          // Yorumlar için populate işlemini kontrol et
          if (postObj.comments && postObj.comments.length > 0) {
            postObj.comments = postObj.comments.map(comment => {
              if (comment.user) {
                return {
                  ...comment,
                  user: {
                    _id: comment.user._id,
                    name: comment.user.name,
                    avatar: comment.user.avatar
                  }
                };
              } else {
                // Eğer user bilgisi eksikse, varsayılan değerler ekle
                return {
                  ...comment,
                  user: {
                    _id: "anonymous",
                    name: "Anonim Kullanıcı", 
                    avatar: "/fallback-avatar.png"
                  }
                };
              }
            });
          } else {
            // Yorumlar boşsa, bir boş array oluştur
            postObj.comments = [];
          }
          
          // Likes alanının var olduğunu kontrol et
          if (!postObj.likes) {
            postObj.likes = [];
          }
          
          // Views alanını kontrol et
          postObj.views = post.views || 0;
          
          // Images alanını kontrol et
          if (!postObj.images || !Array.isArray(postObj.images)) {
            postObj.images = [];
          }
          
          // Categories alanını kontrol et
          if (!postObj.categories || !Array.isArray(postObj.categories)) {
            postObj.categories = [];
          }
          
          return postObj;
        }),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Postları çekerken hata oluştu:", error);
    return new Response(JSON.stringify({ message: "Postlar alınamadı", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}