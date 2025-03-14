import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

// Update the GET function in the all-posts API
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
          
          postObj.author = {
            _id: post.user._id,
            name: post.user.name,
            avatar: post.user.avatar
          };
          
          if (postObj.comments && postObj.comments.length > 0) {
            postObj.comments = postObj.comments.map(comment => ({
              ...comment,
              user: {
                _id: comment.user._id,
                name: comment.user.name,
                avatar: comment.user.avatar
              }
            }));
          }
          
          // Ensure views field is included
          postObj.views = post.views || 0;
          
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
    return new Response(JSON.stringify({ message: "Postlar alınamadı" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

