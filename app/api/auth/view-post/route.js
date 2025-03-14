// /api/auth/view-post.js
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { postId } = body;

    if (!postId) {
      return new Response(JSON.stringify({ message: "Post ID gerekli" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Increment the view count
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } }, // Increment views by 1
      { new: true } // Return the updated document
    ).populate("user", "name avatar");

    if (!updatedPost) {
      return new Response(JSON.stringify({ message: "Post bulunamadı" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        post: {
          ...updatedPost.toObject(),
          author: {
            _id: updatedPost.user._id,
            name: updatedPost.user.name,
            avatar: updatedPost.user.avatar,
          },
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Görüntüleme eklenirken hata oluştu:", error);
    return new Response(JSON.stringify({ message: "Sunucu hatası" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}