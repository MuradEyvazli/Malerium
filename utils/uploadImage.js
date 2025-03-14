import cloudinary from "cloudinary";
import streamifier from "streamifier";

// Cloudinary yapılandırması
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Buffer verisini Cloudinary'ye yükler ve resim URL'sini döndürür.
 * @param {Buffer} fileBuffer - Resmin buffer formatı
 * @returns {Promise<string>} - Cloudinary'den dönen URL
 */
export const uploadImage = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { resource_type: "image" }, // İsteğe bağlı: { resource_type: "image", folder: "posts" }
      (error, result) => {
        if (error) {
          console.error("Cloudinary yükleme hatası:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
