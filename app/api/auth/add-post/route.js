// /api/auth/add-post.js
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { getSession } from "@/utils/authMiddleware";
import { uploadImage } from "@/utils/uploadImage";

export async function POST(req) {
  await dbConnect();

  const session = await getSession(req);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const formData = await req.formData();
    console.log("Gelen formData:", [...formData.entries()]);

    const title = formData.get("title");
    const content = formData.get("content");

    // Çoklu resim için "images" alanından tüm dosyaları alıyoruz.
    const imageFiles = formData.getAll("images");

    // Kategori bilgisi JSON string olarak gönderilecek
    const categoriesString = formData.get("categories");
    const categories = categoriesString ? JSON.parse(categoriesString) : [];

    let imageUrls = [];
    if (imageFiles && imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        if (imageFile && imageFile instanceof Blob) {
          try {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const imageUrl = await uploadImage(buffer);
            console.log("✅ Cloudinary Resim URL:", imageUrl);
            imageUrls.push(imageUrl);
          } catch (error) {
            console.error("❌ Cloudinary yükleme hatası:", error);
          }
        }
      }
    }

    // Post oluşturulurken, session.user.avatar kullanılarak yazarın avatarı ekleniyor.
    const newPost = await Post.create({
      title,
      content,
      images: imageUrls,
      user: session.user.id,
      userName: session.user.name,
      avatar: session.user.avatar, // Burada avatar ekleniyor.
      categories,
    });

    return new Response(
      JSON.stringify({ message: "Post eklendi", post: newPost }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Post eklenirken hata:", error);
    return new Response(JSON.stringify({ message: "Post eklenemedi" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
