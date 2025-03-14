"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

import { clearUser, setUser } from "@/app/features/UserSlice";
import {
  startLoading,
  postsFetched,
  postFailed,
  myPostsFetched,
  postLikedOrUnliked,
  commentAdded,
  postViewIncremented,
} from "@/app/features/postSlice";
import {
  sendFriendRequest,
  fetchFriendRequests,
  fetchFriends,
  deleteFriendRequest,
} from "@/app/features/friendSlice";

import FriendsModal from "../../components/blog-components/FriendsModal";

import { HiPlus, HiOutlineSearch, HiOutlineHeart, HiHeart, HiOutlineChat, HiX } from "react-icons/hi";
import { HiOutlineFilter, HiOutlineGlobeAlt, HiOutlineMenuAlt2 } from "react-icons/hi";
import {
  categories,
  popularTags,
  designerCategories,
  featuredBlogs,
} from "@/utils/data";
import { Gallery4 } from "@/components/blocks/gallery4";
import PremiumSubscriptionPage from "./premium-subscription/page";
import { Star,ChevronDown } from "lucide-react";

export default function BlogPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [commentText, setCommentText] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const premiumSectionRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [premiumHighlight, setPremiumHighlight] = useState(false);

  // Profil fotoğrafı önizleme modalı için yeni state
  const [photoPreview, setPhotoPreview] = useState({
    show: false,
    src: "",
    alt: ""
  });

  const loading = useSelector((state) => state.post.loading);
  const currentUser = useSelector((state) => state.user.currentUser);
  const posts = useSelector((state) => state.post.posts);
  const myPosts = useSelector((state) => state.post.myPosts);
  const { friendRequests, friends } = useSelector((state) => state.friend);

  const postsPerPage = 6;

  // Profil fotoğrafını önizleme modalında göster
  const scrollToPremium = () => {
    setShowScrollIndicator(true);
    
    // Smooth scroll işlemi
    if (premiumSectionRef.current) {
      premiumSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Scroll tamamlandıktan sonra highlight efekti
      setTimeout(() => {
        setPremiumHighlight(true);
        
        // Scroll göstergesini kaldır
        setTimeout(() => {
          setShowScrollIndicator(false);
        }, 1000);
        
        // Highlight efektini kaldır
        setTimeout(() => {
          setPremiumHighlight(false);
        }, 3000);
      }, 1000);
    }
  };
  const openPhotoPreview = (src, alt, e) => {
    if (e) {
      e.preventDefault(); // Link'in çalışmasını engelle
      e.stopPropagation(); // Event'in parent elementlere yayılmasını engelle
    }
    setPhotoPreview({
      show: true,
      src: src || "/fallback-avatar.png",
      alt: alt || "Profil Fotoğrafı"
    });
  };

  // Profil fotoğrafı önizleme modalını kapat
  const closePhotoPreview = () => {
    setPhotoPreview({
      ...photoPreview,
      show: false
    });
  };

  const demoData = {
    title: "Haberler",
    description:
      "Önde gelen tasarımcıların ve geliştiricilerin modern web teknolojilerinden yararlanarak çarpıcı dijital deneyimler nasıl tasarladığını keşfedin.",
    items: [
      {
        id: "shadcn-ui",
        title: "shadcn/ui: Building a Modern Component Library",
        description:
          "Explore how shadcn/ui revolutionized React component libraries by providing a unique approach to component distribution and customization.",
        href: "https://ui.shadcn.com",
        image:
          "https://images.unsplash.com/photo-1551250928-243dc937c49d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      },
      {
        id: "tailwind",
        title: "Tailwind CSS: The Utility-First Revolution",
        description:
          "Discover how Tailwind CSS transformed the way developers style their applications, offering a utility-first approach.",
        href: "https://tailwindcss.com",
        image:
          "https://images.unsplash.com/photo-1551250928-e4a05afaed1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      },
      {
        id: "astro",
        title: "Astro: The All-in-One Web Framework",
        description:
          "Learn how Astro's innovative 'Islands Architecture' and zero-JS-by-default approach is helping developers build faster websites.",
        href: "https://astro.build",
        image:
          "https://images.unsplash.com/photo-1536735561749-fc87494598cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      },
      {
        id: "react",
        title: "React: Pioneering Component-Based UI",
        description:
          "See how React continues to shape modern web development with its component-based architecture.",
        href: "https://react.dev",
        image:
          "https://images.unsplash.com/photo-1548324215-9133768e4094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      },
      {
        id: "nextjs",
        title: "Next.js: The React Framework for Production",
        description:
          "Explore how Next.js has become the go-to framework for building full-stack React applications.",
        href: "https://nextjs.org",
        image:
          "https://images.unsplash.com/photo-1550070881-a5d71eda5800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      },
    ],
  };

  // 1) Fetch currentUser
  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR issues
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(clearUser());
      return;
    }
    const fetchCurrentUser = async () => {
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
    fetchCurrentUser();
  }, [dispatch]);

  // 2) Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(startLoading());
      try {
        const response = await axios.get("/api/auth/all-posts");
        dispatch(postsFetched(response.data.posts));
      } catch (error) {
        dispatch(postFailed(error.message));
      }
    };
    fetchPosts();
  }, [dispatch]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchMyPosts = async () => {
      dispatch(startLoading());
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/my-posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(myPostsFetched(response.data.posts));
      } catch (error) {
        dispatch(postFailed(error.message));
      }
    };
    fetchMyPosts();
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchFriendRequests());
      dispatch(fetchFriends());
    }
  }, [dispatch, currentUser]);

  // Filter posts when category changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((p) => p.categories?.includes(selectedCategory)));
    }
    setCurrentPage(1); // Reset to first page when changing categories
  }, [selectedCategory, posts]);

  // Calculate posts to display
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fetchUsers = async () => {
      setUserLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/api/auth/all-users?search=${searchTerm}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        let users = response.data.users || [];
        
        
        if (currentUser?._id) {
          users = users.filter(user => user._id !== currentUser._id);
        }
        
        
        if (!searchTerm && users.length > 3) {
          users = users.sort(() => 0.5 - Math.random()).slice(0, 3);
        }
        
        setFetchedUsers(users);
      } catch (error) {
        console.error("Kullanıcılar çekilemedi:", error);
        setFetchedUsers([]);
      } finally {
        setUserLoading(false);
      }
    };
    
    
    if (searchFocused || searchTerm) {
      fetchUsers();
    }
  }, [searchTerm, searchFocused, currentUser]);

  
  const handleAddFriend = (receiverId) => {
    if (!currentUser) {
      alert("Önce giriş yapmalısınız!");
      return;
    }
    dispatch(
      sendFriendRequest({
        receiverId,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
      })
    );
  };

  const handleCancelFriendRequest = async (requestId) => {
    await dispatch(deleteFriendRequest(requestId));
    dispatch(fetchFriendRequests());
  };

  const checkIsFriend = (otherUserId) => {
    if (!currentUser?._id) return false;
    return friends?.some((fr) => {
      if (fr.status !== "accepted") return false;
      const senderId = fr.sender?._id || fr.sender;
      const receiverId = fr.receiver?._id || fr.receiver;
      return (
        (senderId === currentUser._id && receiverId === otherUserId) ||
        (receiverId === currentUser._id && senderId === otherUserId)
      );
    });
  };

  const checkIsPending = (otherUserId) => {
    if (!currentUser?._id) return false;
    return friendRequests?.some((rq) => {
      if (rq.status !== "pending") return false;
      const senderId = rq.sender?._id || rq.sender;
      const receiverId = rq.receiver?._id || rq.receiver;
      return (
        (senderId === currentUser._id && receiverId === otherUserId) ||
        (receiverId === currentUser._id && senderId === otherUserId)
      );
    });
  };

  const findPendingRequestId = (otherUserId) => {
    if (!currentUser?._id) return undefined;
    const pendingReq = friendRequests?.find((rq) => {
      if (rq.status !== "pending") return false;
      const senderId = rq.sender?._id || rq.sender;
      const receiverId = rq.receiver?._id || rq.receiver;
      return (
        (senderId === currentUser._id && receiverId === otherUserId) ||
        (receiverId === currentUser._id && senderId === otherUserId)
      );
    });
    return pendingReq?._id;
  };

  
  const handleLike = async (postId) => {
    if (!currentUser) {
      alert("Önce giriş yapmalısınız!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/auth/like-post",
        { postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(postLikedOrUnliked(res.data.post));
    } catch (error) {
      console.error("Like hatası:", error);
      dispatch(postFailed(error.message));
    }
  };
  
  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    if (!currentUser) {
      alert("Önce giriş yapmalısınız!");
      return;
    }
  
    try {
      dispatch(startLoading());
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/auth/comment-post",
        { postId, text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      dispatch(commentAdded(res.data.post));
      setCommentText("");
      setActiveCommentPostId(null);
    } catch (error) {
      console.error("Comment hatası:", error);
      dispatch(postFailed(error.message));
    }
  };
  // Add this function to your BlogPage component
const handlePostView = async (postId) => {
  if (!postId) return;
  
  try {
    const res = await axios.post(
      "/api/auth/view-post",
      { postId },
      { headers: { "Content-Type": "application/json" } }
    );
    dispatch(postViewIncremented(res.data.post));
  } catch (error) {
    console.error("Görüntüleme kaydedilemedi:", error);
  }
};
  
  const handleBlogLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.status === 200) {
        dispatch(clearUser());
        localStorage.removeItem("token");
        router.push("/");
      }
    } catch (error) {
      console.error("Logout hatası:", error);
    }
  };

  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
        <div className="text-center">
          <div className="flex overflow-hidden">
            {["M", "A", "L", "E", "R", "I", "U", "M"].map((letter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  y: [-20, 0, 0, 20],
                  color: [
                    "#4F46E5", // indigo-600
                    "#8B5CF6", // violet-500
                    "#EC4899", // pink-500
                    "#3B82F6"  // blue-500
                  ]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  delay: index * 0.15,
                  ease: "easeInOut"
                }}
                className="text-5xl font-bold px-1"
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

 
  return (
    <div className="min-h-screen bg-gray-50">
      
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button 
                className="p-2 rounded-md text-gray-500 lg:hidden "
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <HiOutlineMenuAlt2 className="h-6 w-6" />
              </button>
              <Link href="/" className="flex items-center">
                <Image
                  src="/assets/maleriumBlack.png"
                  alt="Malerium"
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </Link>
            </div>
            
            
            <div className="hidden lg:flex items-center space-x-6">
              {categories.slice(0, 5).map((category, idx) => (
                <button
                  key={`nav-${idx}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`text-sm font-medium hover:text-yellow-600 transition px-2 py-1 ${
                    selectedCategory === category
                      ? "text-yellow-600 border-b-2 border-yellow-500"
                      : "text-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Kişi ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={(e) => {
                    
                    setTimeout(() => {
                      if (!e.relatedTarget || !e.relatedTarget.closest('.search-dropdown')) {
                        setSearchFocused(false);
                      }
                    }, 200);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-32 sm:w-64 bg-gray-50"
                />
                <HiOutlineSearch className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                
               
                {(searchFocused || searchTerm) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 search-dropdown">
                    <div className="p-2 border-b border-gray-100">
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Kişiler</h4>
                    </div>
                    
                    {userLoading ? (
                      <div className="p-4 flex justify-center">
                        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : fetchedUsers && fetchedUsers.length > 0 ? (
                      <div className="max-h-72 overflow-y-auto">
                        {fetchedUsers.map((user) => (
                          <div 
                            key={user._id} 
                            className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-grow">
                              {/* Profil fotoğrafına tıklandığında büyüt */}
                              <div 
                                className="cursor-pointer relative overflow-hidden rounded-full group"
                                onClick={(e) => openPhotoPreview(user.avatar || "/fallback-avatar.png", user.name, e)}
                              >
                                <Image
                                  src={user.avatar || "/fallback-avatar.png"}
                                  alt={user.name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform"
                                />
                                {/* Hover durumunda gösterilecek büyüteç efekti */}
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                  </svg>
                                </div>
                              </div>
                              <Link 
                                href={`/profile/${user._id}`}
                                onClick={() => setSearchTerm("")}
                              >
                                <div>
                                  <p className="font-medium text-gray-800">{user.name}</p>
                                  <p className="text-xs text-gray-500">{user.title || "Kullanıcı"}</p>
                                </div>
                              </Link>
                            </div>
                            
                            {(user._id !== currentUser?._id) && (
                              <div>
                                {checkIsFriend(user._id) ? (
                                  <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                    Arkadaşsınız
                                  </span>
                                ) : checkIsPending(user._id) ? (
                                  <button
                                    onClick={() => handleCancelFriendRequest(findPendingRequestId(user._id))}
                                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                  >
                                    İsteği İptal Et
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleAddFriend(user._id)}
                                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
                                  >
                                    Arkadaş Ekle
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        {searchTerm ? "Kullanıcı bulunamadı" : "Birini aramak için yazın"}
                      </div>
                    )}
                    
                    
                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                      <Link 
                        href="/blog/friends" 
                        className="flex items-center justify-center gap-2 w-full py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors text-sm font-medium"
                        onClick={() => setSearchFocused(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16.5h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16.5z" />
                        </svg>
                        Tüm Arkadaşlarını Gör
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {currentUser ? (
                <button
                  onClick={() => setShowFriendsModal(true)}
                  className="relative"
                >
                  <Image
                    src={currentUser.avatar || "/fallback-avatar.png"}
                    alt={currentUser.name}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm hover:border-yellow-400 transition-colors"
                  />
                  {friends?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {friends.length}
                    </span>
                  )}
                </button>
              ) : (
                <Link 
                  href="/auth/login"
                  className="px-4 py-2 rounded-full text-sm bg-yellow-500 text-white hover:bg-yellow-600 transition font-medium"
                >
                  Giriş Yap
                </Link>
              )}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <HiOutlineFilter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden shadow-sm"
          >
            <div className="px-4 py-3 space-y-2">
              {categories.map((category, idx) => (
                <button
                  key={`mobile-cat-${idx}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                    setShowMobileMenu(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                    selectedCategory === category
                      ? "bg-yellow-50 text-yellow-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white shadow-md border-b border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, idx) => (
                  <button
                    key={`filter-tag-${idx}`}
                    className="px-3 py-1.5 text-sm bg-gray-100 rounded-full hover:bg-yellow-50 hover:text-yellow-600 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-white to-black overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute left-0 bottom-0 h-full w-full text-white opacity-10" 
               viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path d="M0,1000 C150,800 350,600 500,600 C650,600 850,800 1000,1000 L1000,0 L0,0 Z" fill="currentColor" />
          </svg>
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-6"
          >
            <Image
              src="/assets/maleriumWhite.png"
              alt="Malerium"
              width={200}
              height={80}
              className="mx-auto h-16 sm:h-20 object-contain"
            />
          </motion.div>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-lg sm:text-xl text-white max-w-3xl mx-auto"
          >
            Tasarım dünyasının en son trendlerini keşfedin, ilham verici projelerle tanışın ve yaratıcı topluluğa katılın.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <a 
              href="#featured-posts" 
              className="px-6 py-3 rounded-full bg-white text-yellow-600 font-medium hover:bg-yellow-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Öne Çıkan Yazılar
            </a>
            
            <Link
              href="/blog/add-post"
              className="px-6 py-3 rounded-full bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <HiPlus className="h-5 w-5" />
              Yazı Ekle
            </Link>
          </motion.div>
        </div>
      </section>

      
      {currentUser && (
        <div className="bg-white border-b border-gray-100 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Link href={`/profile/${currentUser._id}`} className="flex items-center space-x-3 group">
                {/* Kullanıcının kendi avatarına tıklayınca önizleme aç */}
                <div 
                  className="cursor-pointer relative overflow-hidden rounded-full group"
                  onClick={(e) => openPhotoPreview(currentUser.avatar || "/fallback-avatar.png", currentUser.name, e)}
                >
                  <Image
                    src={currentUser.avatar || "/fallback-avatar.png"}
                    alt={currentUser.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover border-2 border-white shadow-sm h-10 w-10 group-hover:border-yellow-400 transition-all group-hover:scale-105"
                  />
                  {/* Hover durumunda gösterilecek büyüteç efekti */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-800 group-hover:text-yellow-600 transition-colors">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">
                    {myPosts?.length || 0} yazı • {friends?.length || 0} arkadaş
                  </p>
                </div>
              </Link>
              
              <div className="flex items-center space-x-6">
                <Link href={`/profile/${currentUser._id}`} className="flex flex-col items-center hover:text-yellow-600 transition-colors">
                  <span className="text-xl font-bold text-yellow-600">{myPosts?.reduce((acc, post) => acc + (post.likes?.length || 0), 0)}</span>
                  <span className="text-xs text-gray-500">Beğeni</span>
                </Link>
                
                <Link href={`/profile/${currentUser._id}`} className="flex flex-col items-center hover:text-purple-600 transition-colors">
                  <span className="text-xl font-bold text-purple-600">{myPosts?.reduce((acc, post) => acc + (post.comments?.length || 0), 0)}</span>
                  <span className="text-xs text-gray-500">Yorum</span>
                </Link>
                
                <Link href={`/profile/${currentUser._id}`} className="flex flex-col items-center hover:text-purple-600 transition-colors">
                  <span className="text-xl font-bold text-purple-600">{posts?.length || 0}</span>
                  <span className="text-xs text-gray-500">Toplam Post</span>
                </Link>
                
                <Link 
                  href="/profile" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-purple-600 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Profil Düzenle
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {showScrollIndicator && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed z-40 bottom-24 left-1/2 transform -translate-x-1/2"
          >
            <div className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <span className="text-sm font-medium">Premium Üyelik Gösteriliyor</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <section id="featured-posts" className="mb-20">
          <div className="mb-10 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              VIP Premium İçerikler
            </motion.h2>
            <div className="w-20 h-1 bg-gradient-to-r from-yellow-500 to-purple-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Premium üyelerimize özel hazırlanmış içerikler ve fırsatlar
            </p>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {featuredBlogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                variants={fadeInUp}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
              >
                
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center  shadow-lg">
                    <Star className="h-4 w-4 mr-1 fill-current "/>
                    PREMIUM
                  </span>
                </div>
                
                <Link href={`/blog/${blog.id}`} className="block flex-grow">
                  <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={600}
                      height={340}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        VIP İçerik
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {blog.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {/* Blog yazarının avatarını büyüt */}
                        <div 
                          className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer group"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openPhotoPreview(
                              blog.author?.avatar || "https://images.pexels.com/photos/27894205/pexels-photo-27894205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", 
                              blog.author?.name || "Yazar", 
                              e
                            );
                          }}
                        >
                          <Image
                            src={blog.author?.avatar || "https://images.pexels.com/photos/27894205/pexels-photo-27894205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                            alt={blog.author?.name || "Yazar"}
                            width={32}
                            height={32}
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {blog.author?.name || "Anonim"}
                        </span>
                      </div>
                      
                      <span className="text-xs text-gray-500">
                        {blog.date || ""}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <div className="flex justify-center mt-16 mb-[-100px]">
          <button onClick={scrollToPremium} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-purple-600 text-white rounded-full font-medium hover:from-yellow-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
         <span>Premium Üyelik Al</span>
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
         </svg>
          </button>
          </div>
        </section>
        
        
        <section className="mb-20">
          <Gallery4 {...demoData} />
        </section>
        
        
        <section className="mb-10">
          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
              {["All", ...categories].map((category, idx) => (
                <button
                  key={`cat-filter-${idx}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-yellow-500 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        
        <section id="all-posts-section" className="mb-20">
          <div className="mb-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 mb-2 text-left"
            >
              Tüm Blog Yazıları
            </motion.h2>
            <div className="w-20 h-1 bg-yellow-500 rounded-full"></div>
          </div>
          
          {currentPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <HiOutlineSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Bu kategori için gönderi bulunamadı
              </h3>
              <p className="text-gray-500 mb-6">
                Farklı bir kategori seçmeyi veya tüm gönderileri görüntülemeyi deneyebilirsiniz.
              </p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="px-5 py-2 bg-yellow-500 text-white rounded-full text-sm font-medium hover:bg-yellow-600 transition"
              >
                Tüm Gönderileri Göster
              </button>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {currentPosts.map((post, i) => (
                <motion.div
                  key={`post-${post._id || i}`}
                  variants={fadeInUp}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image section with fixed aspect ratio */}
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <div className="absolute inset-0">
                      <Link href={`/blog/${post._id}`} className="block w-full h-full">
                        {post.images && post.images.length > 0 ? (
                          <div className="w-full h-full relative">
                            <Image
                              src={post.images[0]}
                              alt={post.title || "No Title"}
                              fill
                              className="object-cover transition-transform duration-700 hover:scale-105"
                              priority
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <HiOutlineGlobeAlt className="text-gray-400 w-10 h-10" />
                          </div>
                        )}
                      </Link>
                      {post.categories && post.categories.length > 0 && (
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                          {post.categories.slice(0, 2).map((cat, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-yellow-500/90 text-white px-2 py-1 rounded-full font-medium backdrop-blur-sm"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Content section with fixed height */}
                  <div className="p-6 flex-grow flex flex-col">
                    <Link href={`/blog/${post._id}`}>
                      <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-yellow-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {post.title || "Başlıksız Gönderi"}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                      {post.description || post.content?.substring(0, 120) || "İçerik yok"}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4 mt-auto">
                      <div className="flex items-center gap-2">
                        <div 
                          className="cursor-pointer relative overflow-hidden rounded-full group"
                          onClick={(e) => openPhotoPreview(post.author?.avatar || "/fallback-avatar.png", post.author?.name || "Anonim Yazar", e)}
                        >
                          <Image
                            src={post.author?.avatar || "/fallback-avatar.png"}
                            alt={post.author?.name || "Anonim Yazar"}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {post.author?.name || "Anonim Yazar"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {post.createdAt 
                          ? new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) 
                          : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
  <button
    onClick={() => handleLike(post._id)}
    className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
  >
    {post.likes?.includes(currentUser?._id) ? (
      <HiHeart className="w-5 h-5 text-red-500" />
    ) : (
      <HiOutlineHeart className="w-5 h-5" />
    )}
    <span className="text-sm">{post.likes?.length || 0}</span>
  </button>
  
  <button
    onClick={() => {
      setActiveCommentPostId(
        activeCommentPostId === post._id ? null : post._id
      );
    }}
    className="flex items-center gap-1 text-gray-600 hover:text-yellow-500 transition-colors"
  >
    <HiOutlineChat className="w-5 h-5" />
    <span className="text-sm">{post.comments?.length || 0}</span>
  </button>
  
  {/* Add the view counter here */}
  <div className="flex items-center gap-1 text-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    <span className="text-sm">{post.views || 0}</span>
  </div>
  
  <Link 
    href={`/blog/${post._id}`}
    onClick={() => handlePostView(post._id)}
    className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors hover:underline"
  >
    Devamını Oku
  </Link>
</div>
                    
                    {activeCommentPostId === post._id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Yorum yaz..."
                          className="border border-gray-200 px-3 py-2 text-sm rounded-full flex-1 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                        />
                        <button
                          onClick={() => handleComment(post._id)}
                          className="bg-yellow-500 text-white text-sm px-4 py-2 rounded-full hover:bg-yellow-600 transition"
                        >
                          Gönder
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Improved Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    setTimeout(() => {
                      document.getElementById('all-posts-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }
                }}
                disabled={currentPage === 1}
                className={`mx-1 px-3 h-10 flex items-center justify-center rounded-l-lg text-sm font-semibold transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={`page-${index + 1}`}
                  onClick={() => {
                    setCurrentPage(index + 1);
                    setTimeout(() => {
                      document.getElementById('all-posts-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className={`mx-1 w-10 h-10 flex items-center justify-center rounded-md text-sm font-semibold transition ${
                    currentPage === index + 1
                      ? "bg-yellow-500 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                    setTimeout(() => {
                      document.getElementById('all-posts-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }
                }}
                disabled={currentPage === totalPages}
                className={`mx-1 px-3 h-10 flex items-center justify-center rounded-r-lg text-sm font-semibold transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </section>
        
        
        {currentUser && (
          <section className="mb-20">
            <div className="mb-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-gray-900 mb-2 text-left"
              >
                Senin Yazıların
              </motion.h2>
              <div className="w-20 h-1 bg-yellow-500 rounded-full"></div>
            </div>
            
            {myPosts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <HiPlus className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Henüz yazı paylaşmamışsın
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  İlk yazını oluşturarak kendi hikayeni anlatmaya başla ve toplulukla paylaş.
                </p>
                <Link
                  href="/blog/add-post"
                  className="px-6 py-3 bg-yellow-500 text-white rounded-full text-sm font-medium hover:bg-yellow-600 transition inline-flex items-center gap-2"
                >
                  <HiPlus className="w-5 h-5" />
                  İlk Yazını Oluştur
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Use the same image and content layout as the all posts section */}
                  {(myPosts.length >= 3 ? myPosts.slice(0, 3) : myPosts).map((post, i) => (
                    <motion.div
                      key={`my-post-${post._id || i}`}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-yellow-100 flex flex-col h-full"
                    >
                      {/* Image section with fixed aspect ratio */}
                      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        <div className="absolute inset-0">
                          <Link href={`/blog/${post._id}`} className="block w-full h-full">
                            {post.images && post.images.length > 0 ? (
                              <div className="w-full h-full relative">
                                <Image
                                  src={post.images[0]}
                                  alt={post.title || "No Title"}
                                  fill
                                  className="object-cover transition-transform duration-700 hover:scale-105"
                                  priority
                                />
                              </div>
                            ) : (
                              <div className="w-full h-full bg-yellow-50 flex items-center justify-center">
                                <HiOutlineGlobeAlt className="text-yellow-300 w-10 h-10" />
                              </div>
                            )}
                          </Link>
                          {post.categories && post.categories.length > 0 && (
                            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                              {post.categories.slice(0, 2).map((cat, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-yellow-500/90 text-white px-2 py-1 rounded-full font-medium backdrop-blur-sm"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-6 flex-grow flex flex-col">
                        <Link href={`/blog/${post._id}`}>
                          <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                            {post.title || "Başlıksız Gönderi"}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                          {post.description || post.content?.substring(0, 120) || "İçerik yok"}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4 mt-auto">
                          <div className="flex items-center gap-2">
                            <div 
                              className="cursor-pointer relative overflow-hidden rounded-full group"
                              onClick={(e) => openPhotoPreview(post.author?.avatar || "/fallback-avatar.png", post.author?.name || "Anonim Yazar", e)}
                            >
                              <Image
                                src={post.author?.avatar || "/fallback-avatar.png"}
                                alt={post.author?.name || "Anonim Yazar"}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              Sen
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {post.createdAt 
                              ? new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) 
                              : ''}
                          </span>
                        </div>
                        
                        {/* "Senin Yazıların" bölümündeki post kartlarını düzenle */}
<div className="flex items-center justify-between pt-4 border-t border-gray-100">
  <div className="flex items-center gap-1 text-gray-600">
    <HiOutlineHeart className="w-5 h-5" />
    <span className="text-sm">{post.likes?.length || 0}</span>
  </div>
  
  <div className="flex items-center gap-1 text-gray-600">
    <HiOutlineChat className="w-5 h-5" />
    <span className="text-sm">{post.comments?.length || 0}</span>
  </div>
  
  {/* Görüntülenme sayacını ekle */}
  <div className="flex items-center gap-1 text-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    <span className="text-sm">{post.views || 0}</span>
  </div>
  
  <Link 
    href={`/blog/${post._id}`}
    onClick={() => handlePostView(post._id)}
    className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors hover:underline"
  >
    Düzenle
  </Link>
</div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Add dummy posts if there are less than 3 real posts */}
                  {myPosts.length === 1 && (
                    <>
                      {[1, 2].map((dummyIndex) => (
                        <motion.div
                          key={`dummy-post-${dummyIndex}`}
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: dummyIndex * 0.1 }}
                          className="bg-white rounded-xl overflow-hidden shadow-sm border border-yellow-50 h-full flex flex-col opacity-60"
                        >
                          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                            <div className="absolute inset-0">
                              <div className="w-full h-full bg-yellow-50 flex items-center justify-center">
                                <HiPlus className="text-yellow-300 w-10 h-10" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-6 flex-grow flex flex-col items-center justify-center text-center">
                            <p className="text-yellow-500 font-medium mb-2">Yeni yazı ekle</p>
                            <Link
                              href="/blog/add-post"
                              className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-full text-sm font-medium hover:bg-yellow-200 transition inline-flex items-center gap-2 mt-2"
                            >
                              <HiPlus className="w-4 h-4" />
                              Yazı Oluştur
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}

                  {myPosts.length === 2 && (
                    <motion.div
                      key="dummy-post-1"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-yellow-50 h-full flex flex-col opacity-60"
                    >
                      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        <div className="absolute inset-0">
                          <div className="w-full h-full bg-yellow-50 flex items-center justify-center">
                            <HiPlus className="text-yellow-300 w-10 h-10" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 flex-grow flex flex-col items-center justify-center text-center">
                        <p className="text-yellow-500 font-medium mb-2">Yeni yazı ekle</p>
                        <Link
                          href="/blog/add-post"
                          className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-full text-sm font-medium hover:bg-yellow-200 transition inline-flex items-center gap-2 mt-2"
                        >
                          <HiPlus className="w-4 h-4" />
                          Yazı Oluştur
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <div className="flex justify-center mt-8">
                  <Link
                    href={`/blog/user/${currentUser._id}`}
                    className="px-6 py-3 bg-white border border-yellow-200 text-yellow-600 rounded-full text-sm font-medium hover:bg-yellow-50 transition shadow-sm"
                  >
                    Tüm Yazılarını Gör
                  </Link>
                </div>
              </>
            )}
          </section>
        )}
        
        <motion.section
          ref={premiumSectionRef}
          initial={{ opacity: 1 }}
          animate={{ 
                  opacity: 1,
                  boxShadow: premiumHighlight 
                  ? "0 0 0 4px rgba(234, 179, 8, 0.5)" 
                  : "0 0 0 0px rgba(234, 179, 8, 0)"}}
          transition={{ duration: 1 }}
          className="rounded-3xl overflow-hidden">
        <PremiumSubscriptionPage />
        </motion.section>

        <section className="mb-12">
          <div className="mb-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 mb-2 text-left"
            >
              Tasarımcı Documentasyonları
            </motion.h2>
            <div className="w-20 h-1 bg-purple-600 rounded-full"></div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {designerCategories.slice(0, 6).map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 h-full"
              >
                <Link href={category.route} className="block h-full">
                  <div className="aspect-w-3 aspect-h-2 relative overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-bold mb-1 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                      {category.title}
                    </h3>
                    <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-300">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      
      
      
      <div className="fixed bottom-6 right-6 flex items-center space-x-3">
        <Link
          href="/blog/add-post"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 transition-colors hover:shadow-xl transform hover:scale-105"
        >
          <HiPlus className="w-6 h-6" />
        </Link>
      </div>
      
      {/* Profil Fotoğrafı Önizleme Modalı */}
      <AnimatePresence>
        {photoPreview.show && (
          <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center"
            onClick={closePhotoPreview}
          >
            {/* Arkaplan - Tam saydam siyah */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Fotoğraf içeren konteyner */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="relative z-10 w-full max-w-xl mx-4 bg-transparent rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-square max-h-[80vh] overflow-hidden rounded-xl border-4 border-white">
                <Image
                  src={photoPreview.src}
                  alt={photoPreview.alt}
                  fill
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* Kapatma butonu */}
              <button 
                onClick={closePhotoPreview}
                className="absolute top-3 right-3 bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition-all"
              >
                <HiX className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Arkadaşlar Modalı */}
      <FriendsModal
        show={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
        currentUser={currentUser}
        friends={friends}
        onLogout={handleBlogLogout}
      />
      
      {/* CSS for line clamping */}
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}