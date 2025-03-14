"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function DesignerCategoriesSlider({ catChunks, slideVariants }) {
  const [catPage, setCatPage] = useState(0);

  return (
    <div className="relative">
      <motion.div
        key={`page-${catPage}`}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {catChunks[catPage].map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 overflow-hidden cursor-pointer"
            >
              <Link href={category.route}>
                <div className="relative w-full h-40">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Navigasyon Butonları */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCatPage((prev) => Math.max(prev - 1, 0))}
          disabled={catPage === 0}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full disabled:opacity-50 font-medium"
        >
          <ArrowLeft className="w-4 h-4 inline-block mr-1" />
          Önceki
        </button>
        <button
          onClick={() =>
            setCatPage((prev) => Math.min(prev + 1, catChunks.length - 1))
          }
          disabled={catPage === catChunks.length - 1}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full disabled:opacity-50 font-medium"
        >
          Sonraki
          <ArrowRight className="w-4 h-4 inline-block ml-1" />
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-1">
        Sayfa {catPage + 1} / {catChunks.length}
      </p>
    </div>
  );
}
