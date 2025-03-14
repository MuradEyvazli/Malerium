"use client";
import React from "react";

export default function CategoryBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
      <button
        onClick={() => {
          setSelectedCategory("All");
          setCurrentPage(1);
        }}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
          selectedCategory === "All"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-blue-100"
        }`}
      >
        Tümü
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            setSelectedCategory(cat);
            setCurrentPage(1);
          }}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            selectedCategory === cat
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-blue-100"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
