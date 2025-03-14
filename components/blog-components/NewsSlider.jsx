"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";

// react-slick'in CSS dosyalarını global stil dosyanıza eklemeyi unutmayın:
// Örneğin, globals.css içerisine:
// @import "~slick-carousel/slick/slick.css";
// @import "~slick-carousel/slick/slick-theme.css";

export default function NewsSlider() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Slider ayarları
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Geniş ekranlarda 3 kart göster
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // 1024px altı ekranlarda
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640, // 640px altı ekranlarda
        settings: { slidesToShow: 1 },
      },
    ],
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/news", { cache: "no-store" });
        if (!res.ok) {
          console.error("Haber verileri alınamadı.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Haber çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500">Haberler Yükleniyor...</p>
    );
  }

  if (!articles.length) {
    return (
      <p className="text-center text-gray-500">
        Gösterilecek haber bulunamadı.
      </p>
    );
  }

  return (
    <div className="bg-white/70 border border-white/20 backdrop-blur-md p-6 rounded-2xl shadow-xl">
      <h4 className="text-2xl font-extrabold text-gray-800 mb-6 uppercase tracking-wide">
        Web Haberleri
      </h4>
      <Slider {...settings}>
        {articles.map((item,index) => (
          <div key={item.objectID || index} className="px-2">
            <div className="relative rounded-xl overflow-hidden shadow-lg group h-full">
              {/* Hacker News görseli olmadığı için placeholder kullanıyoruz */}
              <div className="relative w-full h-40">
                <Image
                  src="https://via.placeholder.com/600x400?text=No+Image"
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-4 bg-white/70 backdrop-blur-md">
                <h5 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {item.title}
                </h5>
                <p className="text-sm text-gray-600 mb-2">
                  Posted by {item.author}
                </p>
                <Link
                  href={item.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-700 text-sm font-medium hover:underline"
                >
                  Haberin Devamı →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
