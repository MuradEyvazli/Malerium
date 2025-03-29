"use client";
import React, { useState } from "react";
import BlogNavigation from "@/components/blog/BlogNavigation";
import { HiPlus } from "react-icons/hi";
import Link from "next/link";

const BlogLayout = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blog Navigation Component */}
      <BlogNavigation 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setCurrentPage={setCurrentPage}
      />
      
      {/* Main Content */}
      <div>
        {children}
      </div>
      
      {/* Floating Add Post Button */}
      <div className="fixed bottom-6 right-6 flex items-center space-x-3">
        <Link
          href="/blog/add-post"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 transition-colors hover:shadow-xl transform hover:scale-105"
        >
          <HiPlus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default BlogLayout;