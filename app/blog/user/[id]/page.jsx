"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundPaths } from "@/components/ui/background-paths";
import Enterance from "@/components/Enterance";

export default function UserAllPostsPage() {
  const { id } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Kullanıcı");

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/auth/user-posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserPosts(res.data.posts);
        if (res.data.posts.length > 0) {
          setUserName(res.data.posts[0].author?.name || "Kullanıcı");
        }
      } catch (error) {
        console.error("Kullanıcının tüm postları çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUserPosts();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
        <div
        className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260')" }}
      >
        <Enterance/>
      </div>
      {/* Üst Kısım / Başlık */}
      <header className="border-b border-gray-200 mb-8">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-xl md:text-2xl font-bold">
            {userName}’in <span className="text-indigo-400">Tüm Postları ..</span>
          </h1>
        </div>
      </header>

      {/* İçerik */}
      <main className="max-w-5xl mx-auto px-4 pb-12">
        {userPosts.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-600">Bu kullanıcı henüz post paylaşmamış.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userPosts.map((post, idx) => (
              <motion.div
                key={post._id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex flex-col border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition"
              >
                {/* Kapak Görseli */}
<div className="w-full h-52 bg-gray-50 relative">
  <Image
    src={post.images && post.images.length > 0 ? post.images[0] : "/placeholder.jpg"}
    alt={post.title || "Post"}
    fill
    className="object-cover"
  />
</div>

                {/* Metin İçeriği */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {post.author?.name || "Anonim Yazar"}
                    </p>
                    <p className="mt-3 text-gray-600 line-clamp-2">
                      {post.description || post.content?.substring(0, 100)}...
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/blog/${post._id}`}
                      className="inline-block text-indigo-600 font-medium hover:underline"
                    >
                      Devamını Oku
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
