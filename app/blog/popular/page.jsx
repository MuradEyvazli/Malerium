"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // Swiper 10 için
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useDispatch, useSelector } from "react-redux";
import { startLoading, postsFetched, postFailed } from "@/app/features/postSlice";
import { clearUser, setUser } from "@/app/features/UserSlice";
import axios from "axios";

/*
  Bu sayfanın mantığı:
  1) /api/auth/all-posts endpoint'inden postları çeker.
  2) Postları beğeni sayısına göre sıralar.
  3) Eşit boyutlu kartlarla (h-[400px]) veya aspect-square vb. gösterir.
  4) Swiper slider ile otomatik veya ok butonlarıyla gezilebilir hale getirir.
*/

const PopularPostsPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.post.loading);
  const posts = useSelector((state) => state.post.posts);
  const currentUser = useSelector((state) => state.user.currentUser);

  const [fetched, setFetched] = useState(false);

  // Popüler postları çekmek + global user kontrol
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // Kullanıcı yoksa
        dispatch(clearUser());
        return;
      }
      try {
        const response = await axios.get("/api/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setUser(response.data.currentUser));
      } catch (error) {
        if (
          error.response?.status === 401 &&
          error.response?.data?.message === "Token expired"
        ) {
          dispatch(clearUser());
          localStorage.removeItem("token");
        }
      }
    };

    const fetchPosts = async () => {
      dispatch(startLoading());
      try {
        const response = await axios.get("/api/auth/all-posts");
        dispatch(postsFetched(response.data.posts));
      } catch (error) {
        dispatch(postFailed(error.message));
      } finally {
        setFetched(true);
      }
    };

    fetchCurrentUser();
    fetchPosts();
  }, [dispatch]);

  // 1) Postları beğeni sayısına göre sırala
  const sortedByLikes = [...posts].sort(
    (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
  );

  // 2) Örnek: en popüler 10 post
  const popularPosts = sortedByLikes.slice(0, 10);

  if (loading && !fetched) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-white to-purple-100 text-gray-800 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Popüler & Trend Postlar
        </h1>
        <p className="text-lg text-gray-600 text-center mb-10">
          Bu sayfada en çok beğeni alan postları görebilirsin!
        </p>

        {popularPosts.length === 0 ? (
          <p className="text-center text-gray-500">
            Henüz beğenisi olan post bulunamadı.
          </p>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="mySwiper"
          >
            {popularPosts.map((post, idx) => (
  <SwiperSlide key={post._id || idx}>
    <Link href={`/blog/${post._id}`}>
      <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition transform hover:-translate-y-1">
        <div className="h-[400px] flex flex-col">
          {/* Resim Alanı */}
          <div className="relative w-full h-1/2 overflow-hidden rounded">
            <Image
              src={post.images && post.images.length > 0 ? post.images[0] : "/placeholder.jpg"}
              alt={post.title}
              fill
              className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* İçerik */}
          <div className="flex-1 mt-3 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {post.title}
              </h3>
              <p className="text-gray-600 mt-2 line-clamp-2">
                {post.content.substring(0, 100)}...
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-red-500 flex items-center gap-1 font-medium">
                <AiFillHeart /> {post.likes?.length || 0}
              </span>
              <span className="text-gray-600 flex items-center gap-1 font-medium">
                <AiOutlineComment /> {post.comments?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  </SwiperSlide>
))}

          </Swiper>
        )}
      </div>
    </div>
  );
};

export default PopularPostsPage;
