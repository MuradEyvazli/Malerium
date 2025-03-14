// components/blog-components/PostCard.js
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const PostCard = ({
  post,
  index,
  activeCommentPostId,
  setActiveCommentPostId,
  commentText,
  setCommentText,
  handleLike,
  handleComment,
}) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  
  // Safely handle different data structures
  const author = post.author || (post.user ? {
    name: post.user.name,
    avatar: post.user.avatar,
    _id: post.user._id,
  } : null);
  
  // Safe image URL
  const imageUrl = post.images && post.images.length > 0 
    ? post.images[0] 
    : post.previewImage || "/fallback-image.png";
  
  // Determine if user has liked this post
  const userHasLiked = currentUser && post.likes 
    ? post.likes.includes(currentUser._id) 
    : false;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden p-4 hover:shadow-2xl transform hover:scale-[1.01] transition relative"
    >
      <Link href={`/blog/${post._id}`} className="block w-full">
        <div className="relative w-full h-60 overflow-hidden rounded">
          <Image
            src={imageUrl}
            alt={post.title || "Blog Post"}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="mt-3">
          <div className="flex items-center mb-2">
            <Image
              src={author?.avatar || "/fallback-avatar.png"}
              alt={author?.name || "Anonim Yazar"}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <p className="font-semibold text-gray-700">
              {author?.name || "Anonim Yazar"}
            </p>
          </div>
          <h3 className="text-xl font-bold mb-1 text-gray-800">
            {post.title || "Başlıksız Post"}
          </h3>
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {post.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
          <p className="text-gray-600 mb-2">
            {post.description || post.content?.substring(0, 80) || ""}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLike(post._id);
          }}
          className={`text-xl font-semibold hover:scale-110 transition ${
            userHasLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
        >
          ♥ {post.likes?.length || 0}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setActiveCommentPostId(
              activeCommentPostId === post._id ? null : post._id
            );
          }}
          className="text-xl text-gray-600 font-semibold hover:scale-110 transition"
        >
          💬 {post.comments?.length || 0}
        </button>
      </div>

      {/* Comments section */}
      {activeCommentPostId === post._id && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3"
        >
          {/* Show existing comments */}
          {post.comments && post.comments.length > 0 && (
            <div className="mb-3 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded">
              {post.comments.map((comment, idx) => {
                // Safely handle different comment user structures
                const commentAuthor = comment.user || { 
                  name: "Anonim", 
                  avatar: "/fallback-avatar.png" 
                };
                
                return (
                  <div key={comment._id || idx} className="flex items-start mb-2 pb-2 border-b border-gray-100 last:border-0">
                    <Image
                      src={commentAuthor.avatar || "/fallback-avatar.png"}
                      alt={commentAuthor.name || "Anonim Kullanıcı"}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">
                        {commentAuthor.name || "Anonim Kullanıcı"}
                      </p>
                      <p className="text-sm text-gray-600">{comment.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Comment input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Yorum yaz..."
              className="border px-2 py-1 text-sm rounded flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                handleComment(post._id);
              }}
              className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition"
              disabled={!commentText.trim()}
            >
              Gönder
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard;