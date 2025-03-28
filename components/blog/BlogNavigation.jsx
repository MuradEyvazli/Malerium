"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

import { clearUser } from "@/app/features/UserSlice";
import { sendFriendRequest, fetchFriendRequests, fetchFriends, deleteFriendRequest } from "@/app/features/friendSlice";

import FriendsModal from "../blog-components/FriendsModal";

import { HiPlus, HiOutlineSearch, HiOutlineMenuAlt2, HiOutlineFilter, HiX } from "react-icons/hi";
import { categories } from "@/utils/data";

const BlogNavigation = ({ selectedCategory, setSelectedCategory, setCurrentPage }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [photoPreview, setPhotoPreview] = useState({
    show: false,
    src: "",
    alt: ""
  });

  const currentUser = useSelector((state) => state.user.currentUser);
  const { friendRequests, friends } = useSelector((state) => state.friend);
  
  // Open photo preview
  const openPhotoPreview = (src, alt, e) => {
    if (e) {
      e.preventDefault(); 
      e.stopPropagation(); 
    }
    setPhotoPreview({
      show: true,
      src: src || "/fallback-avatar.png",
      alt: alt || "Profile Photo"
    });
  };
  
  // Close photo preview
  const closePhotoPreview = () => {
    setPhotoPreview({
      ...photoPreview,
      show: false
    });
  };
  
  // Fetch current user
  useEffect(() => {
    if (typeof window === "undefined") return; 
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(clearUser());
      return;
    }
  }, [dispatch]);

  // Fetch friends and friend requests
  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchFriendRequests());
      dispatch(fetchFriends());
    }
  }, [dispatch, currentUser]);

  // Search users
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
        
        // Filter out current user
        if (currentUser?._id) {
          users = users.filter(user => user._id !== currentUser._id);
        }
        
        // Limit random users when not searching
        if (!searchTerm && users.length > 3) {
          users = users.sort(() => 0.5 - Math.random()).slice(0, 3);
        }
        
        setFetchedUsers(users);
      } catch (error) {
        console.error("Could not fetch users:", error);
        setFetchedUsers([]);
      } finally {
        setUserLoading(false);
      }
    };
    
    // Only fetch when search is focused or there's a search term
    if (searchFocused || searchTerm) {
      fetchUsers();
    }
  }, [searchTerm, searchFocused, currentUser]);

  // Add friend functionality
  const handleAddFriend = (receiverId) => {
    if (!currentUser) {
      alert("You need to login first!");
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

  // Cancel friend request
  const handleCancelFriendRequest = async (requestId) => {
    await dispatch(deleteFriendRequest(requestId));
    dispatch(fetchFriendRequests());
  };

  // Check if already friends
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

  // Check if friend request is pending
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

  // Find pending request ID
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
  
  // Logout
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
      console.error("Logout error:", error);
    }
  };
  
  return (
    <>
      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button 
                className="p-2 rounded-md text-gray-500 lg:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <HiOutlineMenuAlt2 className="mt-3 h-6 w-6" />
              </button>
              <Link href="/blog" className="flex items-center">
                <Image
                  src="/assets/maleriumBlack.png"
                  alt="Malerium"
                  width={120}
                  height={40}
                  className="h-8 ml-2 w-auto object-contain"
                />
              </Link>
            </div>
            
            {/* Desktop Categories */}
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
            
            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search people..."
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
                
                {/* Search Results Dropdown */}
                {(searchFocused || searchTerm) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 search-dropdown">
                    <div className="p-2 border-b border-gray-100">
                      <h4 className="text-xs font-medium text-gray-500 mb-1">People</h4>
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
                              {/* Profile photo preview on click */}
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
                                {/* Magnifier effect on hover */}
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
                                  <p className="text-xs text-gray-500">{user.title || "User"}</p>
                                </div>
                              </Link>
                            </div>
                            
                            {(user._id !== currentUser?._id) && (
                              <div>
                                {checkIsFriend(user._id) ? (
                                  <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                    Friends
                                  </span>
                                ) : checkIsPending(user._id) ? (
                                  <button
                                    onClick={() => handleCancelFriendRequest(findPendingRequestId(user._id))}
                                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                  >
                                    Cancel Request
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleAddFriend(user._id)}
                                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
                                  >
                                    Add Friend
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        {searchTerm ? "No users found" : "Type to search for someone"}
                      </div>
                    )}
                    
                    {/* View All Friends Link */}
                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                      <Link 
                        href="/blog/friends" 
                        className="flex items-center justify-center gap-2 w-full py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors text-sm font-medium"
                        onClick={() => setSearchFocused(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16.5h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16.5z" />
                        </svg>
                        See All Friends
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Profile or Login Button */}
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
                  Log In
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
      
      {/* Mobile Menu */}
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
      
      {/* Filters */}
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
                {["Design", "Development", "UI/UX", "Typography", "Colors", "Inspiration", "Tools", "Resources"].map((tag, idx) => (
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
      
      {/* Photo Preview Modal */}
      <AnimatePresence>
        {photoPreview.show && (
          <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center"
            onClick={closePhotoPreview}
          >
            {/* Background - Full transparent black */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Photo container */}
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
              <div className="relative  aspect-square max-h-[80vh] overflow-hidden rounded-xl border-4 border-white">
                <Image
                  src={photoPreview.src}
                  alt={photoPreview.alt}
                  fill
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* Close button */}
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
      
      {/* Friends Modal */}
      <FriendsModal
        show={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
        currentUser={currentUser}
        friends={friends}
        onLogout={handleBlogLogout}
      />
    </>
  );
};

export default BlogNavigation;