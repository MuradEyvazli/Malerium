"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { TextRotate } from "@/components/ui/text-rotate";

const POPULAR_QUERIES = [
  "Summer",
  "Neutral palette",
  "Primary colors",
  "Neon",
  "Spring",
  "Vintage",
  "Synthwave",
  "Happy",
  "Luxury",
  "Tropical",
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const observer = useRef();

  // API'den fotoğrafları çeken fonksiyon (minimum 2 saniye loading süresi sağlanacak)
  const fetchImages = async (q, pageNum) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    const startTime = Date.now();
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}&page=${pageNum}`);
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Arama hatası");
      }
      const data = await response.json();
      // Eğer gelen sonuç sayısı 20'den az ise, daha fazla sonuç yok demektir.
      if (data.results.length < 20) {
        setHasMore(false);
      }
      // Sayfa 1 ise reset, değilse ekle
      if (pageNum === 1) {
        setImages(data.results);
      } else {
        setImages((prev) => [...prev, ...data.results]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(2000 - elapsed, 0);
      setTimeout(() => {
        setLoading(false);
      }, delay);
    }
  };

  // Arama butonuna tıklandığında veya popüler etiket seçildiğinde çalışır
  const handleSearch = (searchTerm) => {
    const q = searchTerm ?? query;
    if (!q.trim()) return;
    setQuery(q);
    setPage(1);
    setHasMore(true);
    fetchImages(q, 1);
  };

  // Popüler etikete tıklandığında
  const handlePopularClick = (tag) => {
    handleSearch(tag);
  };

  // IntersectionObserver ile son elemanı gözlemle
  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Sayfa numarası değişince, query boş değilse yeni verileri getir
  useEffect(() => {
    if (page === 1) return; // İlk sayfa zaten handleSearch ile çekildi
    fetchImages(query, page);
  }, [page]);

  return (
    <div
      className="
        min-h-screen 
        bg-gradient-to-t 
        from-[#ffffff] to-[#f4f2f2] 
        text-black 
        flex flex-col
      "
    >
      {/* Üst kısım (Başlık + Arama) */}
      <div className="max-w-5xl w-full mx-auto mt-6 px-4">
        {/* Başlık */}
        <div className="w-full h-full text-2xl sm:text-3xl md:text-5xl flex flex-row items-center justify-center font-overusedGrotesk dark:text-muted text-foreground font-light overflow-hidden p-12 sm:p-20 md:p-24">
          <LayoutGroup>
            <motion.div className="flex whitespace-pre" layout>
              <motion.span
                className="pt-0.5 sm:pt-1 md:pt-2"
                layout
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                Ask for{" "}
              </motion.span>
              <TextRotate
                texts={[
                  "color!",
                  "creativity ✽",
                  "elegancy",
                  "fast",
                  "fun",
                  "project",
                  "🕶️🕶️🕶️",
                ]}
                mainClassName="text-white px-2 sm:px-2 md:px-3 bg-[#636363] overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </motion.div>
          </LayoutGroup>
        </div>

        {/* Popüler Etiketler */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {POPULAR_QUERIES.map((tag) => (
            <button
              key={tag}
              onClick={() => handlePopularClick(tag)}
              className="
                text-sm px-3 py-1 
                bg-white border border-gray-300 
                rounded-md 
                hover:bg-gray-200 
                transition
              "
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Arama Alanı */}
        <div className="flex justify-center">
          <div
            className="
              w-full md:w-3/4 
              flex items-center 
              bg-[#fffdfd] 
              border border-gray-300 
              rounded-md 
              overflow-hidden
              shadow-sm
            "
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Örn: mountains, #ccc, minimal..."
              className="
                flex-1 
                px-4 py-3 
                bg-transparent text-gray-700
                placeholder-gray-500
                focus:outline-none
              "
            />
            <button
              onClick={() => handleSearch()}
              className="
                px-5 py-3
                bg-gray-500 text-gray-100
                hover:bg-gray-600 
                transition 
                font-medium
              "
            >
              Ara
            </button>
          </div>
        </div>

        {/* Yükleniyor / Hata */}
        <div className="mt-6 text-center">
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm text-gray-900 animate-pulse">
                Yükleniyor...
              </p>
            </motion.div>
          )}
          {error && (
            <p className="text-sm text-red-400 bg-red-800/40 inline-block px-3 py-2 rounded-md">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Masonry Görseller (Infinite Scroll) */}
      <div className="max-w-6xl w-full mx-auto mt-8 px-4 pb-12">
        <div
          className="
            columns-1 sm:columns-2 lg:columns-3
            gap-4 space-y-4
          "
        >
          {images.map((img, index) => {
            if (images.length === index + 1) {
              return (
                <div
                  key={img.id}
                  ref={lastImageRef}
                  className="
                    w-full mb-4 
                    break-inside-avoid 
                    rounded 
                    shadow-md 
                    bg-[#f6f6f6] 
                    overflow-hidden
                    border border-gray-200
                    hover:border-gray-300
                    hover:scale-[1.01]
                    transition-all duration-200
                    animate-fadeIn
                  "
                >
                  <img
                    src={img.small}
                    alt={img.alt_description || "image"}
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-3 text-sm">
                    <p className="text-gray-700">
                      {img.alt_description || "No description"}
                    </p>
                    <p className="text-xs text-gray-900 mt-1">by {img.user}</p>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={img.id}
                  className="
                    w-full mb-4 
                    break-inside-avoid 
                    rounded 
                    shadow-md 
                    bg-[#f6f6f6] 
                    overflow-hidden
                    border border-gray-200
                    hover:border-gray-300
                    hover:scale-[1.01]
                    transition-all duration-200
                    animate-fadeIn
                  "
                >
                  <img
                    src={img.small}
                    alt={img.alt_description || "image"}
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-3 text-sm">
                    <p className="text-gray-700">
                      {img.alt_description || "No description"}
                    </p>
                    <p className="text-xs text-gray-900 mt-1">by {img.user}</p>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
