"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Eye,
  Clock,
  User,
  BookOpen,
  Copy,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ThumbsUp,
  Send,
  ZoomIn,
  X,
  Maximize,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFriends } from "@/app/features/friendSlice";


const MAX_TIME_SEC = 300; 

export default function BlogDetailPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const id = params?.id;
  const currentUser = useSelector((state) => state.user.currentUser);
  const friends = useSelector((state) => state.friend.friends);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const contentRef = useRef(null);
  const previousScrollY = useRef(0);


  const incrementViewCount = async () => {
    if (!id) return;
    
    try {
      const res = await axios.post(
        "/api/auth/view-post",
        { postId: id },
        { headers: { "Content-Type": "application/json" } }
      );
   
    } catch (error) {
      console.error("Görüntüleme kaydedilemedi:", error);
    }
  };


  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

 
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isScrollingToComments, setIsScrollingToComments] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const commentInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchFriends());
  }, [dispatch]);

 
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await axios.get(`/api/auth/posts/${id}`);
        const data = response.data;
        setPost(data);
        setLikes(data.likes?.length || 0);
        setComments(data.comments || []);
        
        incrementViewCount();
      } catch (error) {
        console.error("Blog detayını çekerken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      
      const scrollPercentage = (currentScrollY / (docHeight - windowHeight)) * 100;
      setScrollProgress(scrollPercentage);
      
      setIsHeaderVisible(previousScrollY.current > currentScrollY || currentScrollY < 100);
      previousScrollY.current = currentScrollY;
      
      if (contentRef.current) {
        const sections = contentRef.current.querySelectorAll('h2, h3');
        let currentActiveSection = '';
        
        sections.forEach(section => {
          const sectionTop = section.getBoundingClientRect().top;
          if (sectionTop < windowHeight / 3) {
            currentActiveSection = section.id;
          }
        });
        
        if (currentActiveSection) {
          setActiveSection(currentActiveSection);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isScrollingToComments && commentInputRef.current) {
      commentInputRef.current.scrollIntoView({ behavior: 'smooth' });
      commentInputRef.current.focus();
      setIsScrollingToComments(false);
      setIsCommenting(true);
    }
  }, [isScrollingToComments]);

  const [popularPosts, setPopularPosts] = useState([]);
  const [popPage, setPopPage] = useState(0);
  const POSTS_PER_PAGE = 3;

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get("/api/auth/all-posts");
        const allPosts = res.data.posts || [];
        const sortedByLikes = [...allPosts].sort(
          (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
        );
        setPopularPosts(sortedByLikes);
      } catch (err) {
        console.error("Popüler postlar çekilemedi:", err);
      }
    };

    fetchAllPosts();
  }, []);

  const totalPages = Math.ceil(popularPosts.length / POSTS_PER_PAGE);
  const startIndex = popPage * POSTS_PER_PAGE;
  const currentPopularSlice = popularPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handleNextPopular = () => {
    if (popPage < totalPages - 1) setPopPage(popPage + 1);
  };
  
  const handlePrevPopular = () => {
    if (popPage > 0) setPopPage(popPage - 1);
  };

  const [readingTimeSec, setReadingTimeSec] = useState(0);

  useEffect(() => {
    
    const timer = setInterval(() => {
      setReadingTimeSec((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer); 
  }, []);


  const minutes = Math.floor(readingTimeSec / 60);
  const seconds = readingTimeSec % 60;

  
  const progressPercent = Math.min((readingTimeSec / MAX_TIME_SEC) * 100, 100);

  
  const nextImage = () => {
    if (!post?.images?.length) return;
    setSelectedImageIndex((prev) => (prev + 1) % post.images.length);
  };
  
  const prevImage = () => {
    if (!post?.images?.length) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  const handleLike = async () => {
    if (!post || !id) return;
    if (!currentUser) {
      alert("Beğenmek için giriş yapmalısınız!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/auth/like-post",
        { postId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      
      const updatedPost = res.data.post;
      
     
      setPost(updatedPost);
      setLikes(updatedPost.likes?.length || 0);
      setComments(updatedPost.comments || []);
    } catch (error) {
      console.error("Like başarısız:", error);
    }
  };

  // Yorum
  const handleAddComment = async () => {
    if (!newComment.trim() || !id) return;
    if (!currentUser) {
      alert("Yorum yapmak için giriş yapmalısınız!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/auth/comment-post",
        { 
          postId: id, 
          text: newComment 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      
      const updatedPost = res.data.post;
      
      setPost(updatedPost);
      setComments(updatedPost.comments || []);
      setLikes(updatedPost.likes?.length || 0);

      setNewComment("");
      setIsCommenting(false);
    } catch (error) {
      console.error("Yorum ekleme başarısız:", error);
    }
  };

  const handleShare = (platform) => {
    alert(`${platform} üzerinde paylaşım bağlantısı oluşturuldu!`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link kopyalandı!");
  };

if (loading) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="text-center">
        <div className="flex overflow-hidden justify-center">
          {["M", "A", "L", "E", "R", "I", "U", "M"].map((letter, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: [-20, 0, 0, 20],
                color: [
                  "#4F46E5", 
                  "#8B5CF6", 
                  "#EC4899", 
                  "#3B82F6" 
                ]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                delay: index * 0.15,
                ease: "easeInOut"
              }}
              className="text-3xl sm:text-5xl font-bold px-1"
            >
              {letter}
            </motion.div>
          ))}
        </div>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 mt-4 rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-gray-600"
        >
          İçerik yükleniyor...
        </motion.p>
      </div>
    </div>
  );
}
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">İçerik Bulunamadı</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Aradığınız blog yazısı mevcut değil veya kaldırılmış olabilir.</p>
            <Link href="/blog" className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all text-sm sm:text-base">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Blog Ana Sayfasına Dön
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }


  return (
    <>
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 z-50"
        style={{ scaleX: scrollProgress / 100, transformOrigin: 'left' }}
      />

      {/* Floating header */}
      <AnimatePresence>
        {!isHeaderVisible && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md shadow-sm py-2 sm:py-3 px-2 sm:px-4"
          >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <Link href="/blog" className="flex items-center gap-1 sm:gap-2">
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-600">Blog</span>
              </Link>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 max-w-[150px] sm:max-w-md truncate px-2 sm:px-4">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={handleLike}
                  className={`p-1.5 sm:p-2 rounded-full ${currentUser && post.likes?.includes(currentUser._id) ? 'text-red-500 bg-red-50' : 'text-gray-600 bg-gray-100'} transition-colors`}
                >
                  <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${currentUser && post.likes?.includes(currentUser._id) ? 'fill-red-500' : ''}`} />
                </button>
                <button 
                  onClick={() => setIsScrollingToComments(true)}
                  className="p-1.5 sm:p-2 rounded-full bg-gray-100 text-gray-600 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
        {/* Hero image section */}
        <div className="relative w-full">
          <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
            {post.images && post.images.length > 0 ? (
              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <div 
                  className="absolute inset-0 cursor-pointer group"
                  onClick={() => {
                    setShowLightbox(true);
                    setLightboxIndex(selectedImageIndex);
                  }}
                >
                  <Image
                    src={post.images[selectedImageIndex]}
                    alt={post.title || "Blog Görseli"}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
                  
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-3 sm:p-4 bg-black/50 backdrop-blur-md rounded-full">
                      <Maximize className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 flex items-center justify-center">
                <BookOpen className="text-white/30 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
              </div>
            )}

            {/* Slider Controls - More touch-friendly on mobile */}
            {post.images && post.images.length > 1 && (
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
                <button 
                  onClick={prevImage}
                  className="p-1.5 sm:p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-md rounded-full">
                  {post.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all ${
                        idx === selectedImageIndex 
                          ? 'bg-white w-4 sm:w-6' 
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
                <button 
                  onClick={nextImage}
                  className="p-1.5 sm:p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Card content overlay */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
            className="max-w-5xl mx-auto px-3 sm:px-4 -mt-20 sm:-mt-24 md:-mt-28 lg:-mt-32 relative z-10 mb-8 sm:mb-12"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
              <div className="p-5 sm:p-8 md:p-10 lg:p-12">
                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                    {post.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-600 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title - responsive font size */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Author & Date & Stats - better stacking on mobile */}
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:items-center mb-6 sm:mb-8">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <Image
                        src={post.author?.avatar || post.avatar || "/fallback-avatar.png"}
                        alt={post.author?.name || post.userName || "Yazar"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {post.author?.name || post.userName || "Anonim"}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.createdAt && formatDate(post.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Stats layout improved for mobile */}
                  <div className="md:ml-auto grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-5">
                    <div className="flex items-center gap-2">
                      <div className="bg-pink-50 p-1.5 sm:p-2 rounded-full">
                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          currentUser && post.likes?.includes(currentUser._id) 
                            ? 'fill-pink-500 text-pink-500' 
                            : 'text-pink-500'
                        }`} />
                      </div>
                      <div>
                        <div className="text-gray-900 font-medium text-sm sm:text-base">{likes}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Beğeni</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 p-1.5 sm:p-2 rounded-full">
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-gray-900 font-medium text-sm sm:text-base">{comments.length}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Yorum</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-purple-50 p-1.5 sm:p-2 rounded-full">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-gray-900 font-medium text-sm sm:text-base">{post.views || 0}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Görüntülenme</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-green-50 p-1.5 sm:p-2 rounded-full">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      </div>
                      <div>
                        <div className="text-gray-900 font-medium text-sm sm:text-base">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">Okuma Süresi</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 h-1.5 sm:h-2 rounded-full overflow-hidden mb-6 sm:mb-8">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Share Buttons - more compact on mobile */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Paylaş:</p>
                  <div className="flex gap-1.5 sm:gap-2">
                    <motion.button
                      whileHover={{ y: -3 }}
                      onClick={() => handleShare("Facebook")}
                      className="p-1.5 sm:p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                    >
                      <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -3 }}
                      onClick={() => handleShare("Twitter")}
                      className="p-1.5 sm:p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition"
                    >
                      <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -3 }}
                      onClick={() => handleShare("LinkedIn")}
                      className="p-1.5 sm:p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition"
                    >
                      <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -3 }}
                      onClick={handleCopyLink}
                      className="p-1.5 sm:p-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition"
                    >
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main content and sidebar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-16 sm:pb-20 grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
          {/* Main content column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="mb-8 sm:mb-10">
              <div ref={contentRef} className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {post.content}
                </div>
              </div>
            </div>

            {/* Action buttons - more compact on mobile */}
            <div className="flex flex-wrap gap-2 sm:gap-4 border-t border-b border-gray-200 py-4 sm:py-6 mb-8 sm:mb-12">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full transition text-sm sm:text-base ${
                  currentUser && post.likes?.includes(currentUser._id)
                    ? 'bg-pink-50 text-pink-600'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${currentUser && post.likes?.includes(currentUser._id) ? 'fill-pink-500' : ''}`} />
                <span>{likes} Beğeni</span>
              </button>
              
              <button
                onClick={() => setIsScrollingToComments(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{comments.length} Yorum</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 text-gray-700 rounded-full ml-auto text-sm sm:text-base">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{post.views || 0} Görüntülenme</span>
              </div>
            </div>

            {/* Comments section */}
            <div id="comments-section">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  Yorumlar ({comments.length})
                </h3>
                <button
                  onClick={() => setIsCommenting(true)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all flex items-center gap-1 sm:gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Yorum Yap
                </button>
              </div>

              {/* Comment input */}
              <AnimatePresence>
                {isCommenting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={currentUser?.avatar || "/fallback-avatar.png"}
                          alt={currentUser?.name || "Kullanıcı"}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <textarea
                          ref={commentInputRef}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Düşüncelerinizi paylaşın..."
                          className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all min-h-[100px] sm:min-h-[120px] mb-3 text-sm sm:text-base"
                        />
                        <div className="flex justify-end gap-2 sm:gap-3">
                          <button
                            onClick={() => setIsCommenting(false)}
                            className="px-3 sm:px-5 py-1.5 sm:py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition text-xs sm:text-sm"
                          >
                            İptal
                          </button>
                          <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                              !newComment.trim()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md'
                            }`}
                          >
                            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                            Gönder
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Comments list */}
              {comments.length === 0 ? (
                <div className="text-center py-8 sm:py-10 bg-gray-50 rounded-xl sm:rounded-2xl">
                  <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm sm:text-base">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {comments.map((comment, idx) => {
                    const commentUser = comment.user || {};
                    return (
                      <motion.div
                        key={comment._id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex gap-3 sm:gap-4">
                          <div className="flex-shrink-0">
                            <Image
                              src={commentUser.avatar || "/fallback-avatar.png"}
                              alt={commentUser.name || "Yorum Yapan"}
                              width={32}
                              height={32}
                              className="rounded-full object-cover w-8 h-8 sm:w-10 sm:h-10"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base">{commentUser.name || "Anonim"}</p>
                              <p className="text-[10px] sm:text-xs text-gray-500">
                                {comment.createdAt && formatDate(comment.createdAt)}
                              </p>
                            </div>
                            <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-2 sm:mb-3">{comment.text}</p>
                            <div className="flex items-center gap-4 sm:gap-6 text-gray-500 text-xs sm:text-sm">
                              <button className="flex items-center gap-1 hover:text-blue-600 transition">
                                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Beğen</span>
                              </button>
                              <button className="flex items-center gap-1 hover:text-blue-600 transition">
                                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Yanıtla</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="lg:col-span-1 space-y-5 sm:space-y-8"
          >
            {/* Author's other posts */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                Yazarın Diğer Yazıları
              </h3>
              
              {popularPosts.filter(p => 
                (p.author?._id === post.author?._id || p.user === post.user) && p._id !== post._id
              ).length === 0 ? (
                <p className="text-gray-500 text-xs sm:text-sm">
                  Bu yazarın başka yazısı bulunmuyor.
                </p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {popularPosts
                    .filter(p => (p.author?._id === post.author?._id || p.user === post.user) && p._id !== post._id)
                    .slice(0, 3)
                    .map(relatedPost => (
                      <Link 
                        href={`/blog/${relatedPost._id}`}
                        key={relatedPost._id}
                        className="block group"
                      >
                        <div className="flex gap-2 sm:gap-3">
                          <div className="w-16 sm:w-20 h-12 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <Image
                              src={relatedPost.images?.[0] || "/placeholder.jpg"}
                              alt={relatedPost.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                              {relatedPost.createdAt && formatDate(relatedPost.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              )}
            </div>

            {/* Popular posts */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                Popüler Yazılar
              </h3>
              
              {currentPopularSlice.length === 0 ? (
                <p className="text-gray-500 text-xs sm:text-sm">
                  Henüz popüler yazı yok.
                </p>
              ) : (
                <>
                  <div className="space-y-4 sm:space-y-6">
                    {currentPopularSlice.map((popPost, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={popPost._id}
                      >
                        <Link 
                          href={`/blog/${popPost._id}`}
                          className="block group"
                        >
                          <div className="relative w-full aspect-video rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3">
                            <Image
                              src={popPost.images?.[0] || "/placeholder.jpg"}
                              alt={popPost.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 sm:p-3">
                              <div className="text-white text-[10px] sm:text-xs font-medium">Okumak için tıkla</div>
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition line-clamp-2 mb-1 text-xs sm:text-sm">
                            {popPost.title}
                          </h4>
                          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500">
                            <span className="flex items-center gap-0.5 sm:gap-1">
                              <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {popPost.likes?.length || 0}
                            </span>
                            <span className="flex items-center gap-0.5 sm:gap-1">
                              <MessageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {popPost.comments?.length || 0}
                            </span>
                            <span className="flex items-center gap-0.5 sm:gap-1">
                              <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {popPost.views || 0}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-1 sm:gap-2 mt-4 sm:mt-6">
                      <button
                        onClick={handlePrevPopular}
                        disabled={popPage === 0}
                        className={`p-1.5 sm:p-2 rounded-full ${
                          popPage === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition`}
                      >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <div className="flex items-center px-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-700">
                        {popPage + 1} / {totalPages}
                      </div>
                      <button
                        onClick={handleNextPopular}
                        disabled={popPage === totalPages - 1 || totalPages === 0}
                        className={`p-1.5 sm:p-2 rounded-full ${
                          popPage === totalPages - 1 || totalPages === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition`}
                      >
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Friends */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                Arkadaşlarınız
              </h3>
              
              {!friends || friends.length === 0 ? (
                <div className="text-center py-4 sm:py-6">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 sm:mb-3">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Henüz arkadaşınız yok.
                  </p>
                  <Link 
                    href="/blog/friends"
                    className="mt-2 sm:mt-3 inline-flex items-center gap-0.5 sm:gap-1 text-indigo-600 text-xs sm:text-sm hover:underline"
                  >
                    <span>Arkadaş Ekle</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {friends.map((friend) => {
                    const senderId = friend.sender?._id || friend.sender;
                    const friendUser =
                      senderId === currentUser?._id
                        ? friend.receiver
                        : friend.sender;

                    return (
                      <Link
                        key={friend._id}
                        href={`/profile/${friendUser._id}`}
                        className="flex flex-col items-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-indigo-50 transition-colors group"
                      >
                        <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden mb-1.5 sm:mb-2 border-2 border-white shadow-sm">
                          <Image
                            src={friendUser.avatar || "/fallback-avatar.png"}
                            alt={friendUser.name || "Arkadaş"}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition truncate w-full text-center">
                          {friendUser.name || "Arkadaş"}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating back button */}
      <Link
        href="/blog"
        className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 p-2 sm:p-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-all z-30 group"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
      </Link>

      {/* Lightbox/Gallery Modal */}
      <AnimatePresence>
        {showLightbox && post.images && post.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 z-50 backdrop-blur-lg flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 rounded-full bg-black/50 text-white z-50 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Image counter */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/50 text-white text-xs sm:text-sm font-medium z-50">
              {lightboxIndex + 1} / {post.images.length}
            </div>

            {/* Main image */}
            <motion.div
              key={`lightbox-${lightboxIndex}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl sm:max-w-5xl h-[75vh] sm:h-[85vh] max-h-[85vh] mx-2 sm:mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={post.images[lightboxIndex]}
                  alt={`Görsel ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Navigation controls - improved touch targets */}
              {post.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1));
                    }}
                    className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {post.images.length > 1 && (
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2 z-50 overflow-x-auto px-2 sm:px-4 max-w-full">
                {post.images.map((img, idx) => (
                  <button
                    key={`thumbnail-${idx}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(idx);
                    }}
                    className={`flex-shrink-0 relative w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden ${
                      idx === lightboxIndex ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                    } transition-all`}
                  >
                    <Image
                      src={img}
                      alt={`Küçük resim ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}