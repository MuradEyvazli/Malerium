"use client";

import React, { useState, useEffect } from "react";
import { Typewriter } from "@/components/ui/typewriter";
import { AnimatedText } from "@/components/ui/animated-underline-text-one";
import { Hero } from "@/components/blocks/hero";
import AnimatedLoadingSkeleton from "@/components/ui/animated-loading-skeleton";

// Örnek metin
const DEFAULT_SAMPLE_TEXT = "Malerium is here to !";

const Page = () => {
  const [fonts, setFonts] = useState([]);
  const [filteredFonts, setFilteredFonts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sampleText, setSampleText] = useState(DEFAULT_SAMPLE_TEXT);

  // Yükleme durumu state
  const [loading, setLoading] = useState(true);

  // Sayfa ve pagination ayarları
  const [currentPage, setCurrentPage] = useState(1);
  const fontsPerPage = 9; // Grid tasarımı için 9 veya 12 gibi bir değer seçebilirsiniz

  // Google Fonts API'den verileri çek
  const fetchFonts = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
      // sort=popularity ile en popüler fontlar
      const response = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${apiKey}`
      );
      const data = await response.json();

      if (data.items) {
        setFonts(data.items);
        setFilteredFonts(data.items);
      }
    } catch (err) {
      console.error("Font API hatası:", err);
    } finally {
      // Yükleme bittiğinde false yap
      setLoading(false);
    }
  };

  // Sayfa ilk yüklendiğinde fontları çek
  useEffect(() => {
    fetchFonts();
  }, []);

  // Arama ve kategori değişimlerinde filtreleme
  useEffect(() => {
    if (!fonts.length) return;

    let filtered = fonts.filter((font) => {
      const matchSearch = font.family
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || font.category === selectedCategory;

      return matchSearch && matchCategory;
    });

    setFilteredFonts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, fonts]);

  // Tüm kategoriler
  const allCategories = [
    "All",
    ...Array.from(new Set(fonts.map((font) => font.category))).sort(),
  ];

  // Pagination hesaplamaları
  const lastIndex = currentPage * fontsPerPage;
  const firstIndex = lastIndex - fontsPerPage;
  const currentFonts = filteredFonts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredFonts.length / fontsPerPage);

  // Sayfa değiştirme
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Font indirme (regular link)
  const downloadFont = (fontItem) => {
    const regularUrl = fontItem.files?.regular;
    if (!regularUrl) {
      alert("This font has no download link available!");
      return;
    }
    window.open(regularUrl, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* HERO / HEADER */}
      <header
        className="text-center bg-gradient-to-b from-white to-gray-100 
                   py-16 md:py-20 lg:py-24 px-4 shadow-sm"
      >
        <div className="container mx-auto">
          {/* Büyük Başlık */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wider mb-2 text-gray-800">
            Welcome to our <span className="text-emerald-600">Malerium</span>
          </h1>

          {/* Typewriter */}
          <div className="flex flex-row items-center justify-center text-lg md:text-2xl lg:text-3xl font-normal mb-4">
            <span className="mr-2 text-gray-600">We&apos;re born</span>
            <Typewriter
              text={[
                "to design",
                "to be elegant",
                "to be creative",
                "to be kind",
                "to create beauty",
              ]}
              speed={70}
              className="text-emerald-600"
              waitTime={1500}
              deleteSpeed={40}
              cursorChar={"_"}
            />
          </div>

          {/* Arama Alanı */}
          <div className="relative mt-8 max-w-md mx-auto w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 7.5 15.5a7.5 7.5 0 0 0 9.15 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 rounded-md bg-white 
                         border border-gray-300 focus:outline-none 
                         focus:ring-2 focus:ring-emerald-500 
                         transition-all text-sm"
              placeholder="Search fonts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* ANA İÇERİK */}
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
          {/* SOL SİDEBAR */}
          <aside className="w-full md:w-1/4 bg-white border border-gray-200 rounded-md shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 tracking-wide text-gray-800">
              Categories
            </h2>
            <ul className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden">
              {allCategories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`px-4 py-2 rounded-md transition-colors text-sm font-medium 
                      ${
                        selectedCategory === cat
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>

            {/* Örnek Metin Alanı */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Sample Text
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-md border border-gray-300 bg-white 
                           text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="E.g. Hello World..."
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
              />
            </div>
          </aside>

          {/* FONT LİSTESİ veya LOADING SKELETON */}
          <main className="w-full md:w-3/4">
            <div className="flex justify-start text-start mb-6">
              <AnimatedText
                text="Explore!"
                textClassName="text-3xl font-bold mb-2 text-green-600"
                underlinePath="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
                underlineHoverPath="M 0,10 Q 75,20 150,10 Q 225,0 300,10"
                underlineDuration={1.5}
              />
            </div>

            {/* Eğer veri yükleniyorsa skeleton göstereceğiz, değilse font kartları */}
            {loading ? (
              <AnimatedLoadingSkeleton />
            ) : (
              <>
                {/* Grid içerisinde font kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentFonts.map((font) => {
                    const googleFontLink = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
                      font.family
                    )}:wght@400;700&display=swap`;

                    return (
                      <div
                        key={font.family}
                        className="rounded-md shadow-sm border border-gray-200 bg-white p-4 flex flex-col 
                                   transition-all duration-200 
                                   hover:shadow-md hover:-translate-y-1"
                      >
                        {/* Dinamik style ile fontu içe aktar */}
                        <style>
                          {`@import url('${googleFontLink}');`}
                        </style>

                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-800">
                            {font.family}
                          </h3>
                          <button
                            onClick={() => downloadFont(font)}
                            className="px-3 py-1 text-sm rounded-md bg-emerald-600 text-white 
                                       hover:bg-emerald-500 transition-colors"
                          >
                            Download
                          </button>
                        </div>

                        <p
                          style={{ fontFamily: font.family }}
                          className="text-sm text-gray-600"
                        >
                          {sampleText}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Eğer hiç sonuç yoksa */}
                {currentFonts.length === 0 && !loading && (
                  <div className="text-center p-6 text-gray-500">
                    No fonts found matching your criteria.
                  </div>
                )}

                {/* Pagination Butonları */}
                {filteredFonts.length > 0 && (
                  <div className="flex justify-center items-center gap-3 mt-10">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      className="px-4 py-2 rounded-md border border-gray-300 bg-white 
                                 hover:bg-gray-100 transition-colors 
                                 disabled:opacity-50 text-sm font-medium"
                      disabled={currentPage <= 1}
                    >
                      &lt; Prev
                    </button>
                    <div className="text-gray-600 text-sm">
                      Page <span className="font-semibold">{currentPage}</span> /{" "}
                      {totalPages || 1}
                    </div>
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      className="px-4 py-2 rounded-md border border-gray-300 bg-white 
                                 hover:bg-gray-100 transition-colors 
                                 disabled:opacity-50 text-sm font-medium"
                      disabled={currentPage >= totalPages}
                    >
                      Next &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Page;
