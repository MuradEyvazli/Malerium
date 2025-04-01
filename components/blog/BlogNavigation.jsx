"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

import { clearUser } from "@/app/features/UserSlice";
import { sendFriendRequest, fetchFriendRequests, fetchFriends, deleteFriendRequest } from "@/app/features/friendSlice";

// Import the simplified FriendsModal
import SimplifiedFriendsModal from "../blog-components/SimplifiedFriendsModal";

import { HiOutlineSearch, HiOutlineMenuAlt2, HiOutlineFilter, HiX } from "react-icons/hi";
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const searchRef = useRef(null);

  const currentUser = useSelector((state) => state.user.currentUser);
  const { friendRequests = [], friends = [] } = useSelector((state) => state.friend) || {};
  
  // Safely get the count of friends
  const friendsCount = Array.isArray(friends) ? friends.length : 0;

  // Handle click outside for search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [searchRef]);
  
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
          users = users.sort(() => 0.5 - Math.random()).slice(0, 6);
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
    if (!requestId) return;
    await dispatch(deleteFriendRequest(requestId));
    dispatch(fetchFriendRequests());
  };

  // Check if already friends - with null safety
  const checkIsFriend = (otherUserId) => {
    if (!currentUser?._id || !otherUserId || !Array.isArray(friends)) return false;
    
    return friends.some((fr) => {
      if (!fr || fr.status !== "accepted") return false;
      const senderId = fr.sender?._id || fr.sender;
      const receiverId = fr.receiver?._id || fr.receiver;
      
      return (
        (senderId === currentUser._id && receiverId === otherUserId) ||
        (receiverId === currentUser._id && senderId === otherUserId)
      );
    });
  };

  // Check if friend request is pending - with null safety
  const checkIsPending = (otherUserId) => {
    if (!currentUser?._id || !otherUserId || !Array.isArray(friendRequests)) return false;
    
    return friendRequests.some((rq) => {
      if (!rq || rq.status !== "pending") return false;
      const senderId = rq.sender?._id || rq.sender;
      const receiverId = rq.receiver?._id || rq.receiver;
      
      return (
        (senderId === currentUser._id && receiverId === otherUserId) ||
        (receiverId === currentUser._id && senderId === otherUserId)
      );
    });
  };

  // Find pending request ID - with null safety
  const findPendingRequestId = (otherUserId) => {
    if (!currentUser?._id || !otherUserId || !Array.isArray(friendRequests)) return undefined;
    
    const pendingReq = friendRequests.find((rq) => {
      if (!rq || rq.status !== "pending") return false;
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

  // Focus search input when mobile search is shown
  useEffect(() => {
    if (showMobileSearch && searchRef.current) {
      setTimeout(() => {
        searchRef.current.focus();
      }, 100);
    }
  }, [showMobileSearch]);
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Keep the search open after submitting
    setSearchFocused(true);
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
                aria-label="Menu"
              >
                <HiOutlineMenuAlt2 className="h-6 w-6" />
              </button>
              <Link href="/blog" className="flex items-center">
                <Image
                  src="/MaleriumTransparentWhite.png"
                  alt="Malerium"
                  width={900}
                  height={140}
                  className="h-[150px] mr-2 mb-1 w-auto object-contain"
                />
              </Link>
            </div>
            
            {/* Desktop Categories */}
            <div className="hidden lg:flex items-center space-x-6">
              {Array.isArray(categories) && categories.slice(0, 5).map((category, idx) => (
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
              {/* Search Button for Mobile */}
              <button 
                className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition lg:hidden"
                onClick={() => setShowMobileSearch(true)}
                aria-label="Search"
              >
                <HiOutlineSearch className="h-5 w-5" />
              </button>
              
              {/* Desktop Search */}
              <div className="relative hidden lg:block" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Search people..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-32 sm:w-64 bg-gray-50"
                  />
                  <HiOutlineSearch className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                </form>
                
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
                        {fetchedUsers.map((user) => {
                          // Skip invalid users
                          if (!user || !user._id) return null;
                          
                          return (
                            <div 
                              key={user._id} 
                              className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-grow">
                                <div className="overflow-hidden rounded-full">
                                  <Image
                                    src={user.avatar || "/fallback-avatar.png"}
                                    alt={user.name || "User"}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                </div>
                                <Link 
                                  href={`/profile/${user._id}`}
                                  onClick={() => {
                                    setSearchTerm("");
                                    setSearchFocused(false);
                                  }}
                                >
                                  <div>
                                    <p className="font-medium text-gray-800">{user.name || "User"}</p>
                                    <p className="text-xs text-gray-500">{user.title || "User"}</p>
                                  </div>
                                </Link>
                              </div>
                              
                              {currentUser && user._id !== currentUser._id && (
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
                          );
                        })}
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
                  aria-label="Profile"
                >
                  <Image
                    src={currentUser.avatar || "/fallback-avatar.png"}
                    alt={currentUser.name || "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm hover:border-yellow-400 transition-colors"
                  />
                  {friendsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {friendsCount > 99 ? '99+' : friendsCount}
                    </span>
                  )}
                </button>
              ) : (
                <Link 
                  href="/login"
                  className="px-4 py-2 rounded-full text-sm bg-yellow-500 text-white hover:bg-yellow-600 transition font-medium"
                >
                  Log In
                </Link>
              )}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                aria-label="Filters"
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
              {/* Mobile Search in Menu */}
              <div className="mb-3 p-2">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search people..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-50"
                  />
                  <HiOutlineSearch className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                </form>
                
                {/* Mobile Search Results */}
                {(searchFocused || searchTerm) && (
                  <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 search-dropdown">
                    <div className="p-2 border-b border-gray-100">
                      <h4 className="text-xs font-medium text-gray-500 mb-1">People</h4>
                    </div>
                    
                    {userLoading ? (
                      <div className="p-4 flex justify-center">
                        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : fetchedUsers && fetchedUsers.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto">
                        {fetchedUsers.map((user) => {
                          // Skip invalid users
                          if (!user || !user._id) return null;
                          
                          return (
                            <div 
                              key={user._id} 
                              className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-grow">
                                <div className="overflow-hidden rounded-full">
                                  <Image
                                    src={user.avatar || "/fallback-avatar.png"}
                                    alt={user.name || "User"}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                </div>
                                <Link 
                                  href={`/profile/${user._id}`}
                                  onClick={() => {
                                    setSearchTerm("");
                                    setSearchFocused(false);
                                    setShowMobileMenu(false);
                                  }}
                                >
                                  <div>
                                    <p className="font-medium text-gray-800">{user.name || "User"}</p>
                                    <p className="text-xs text-gray-500">{user.title || "User"}</p>
                                  </div>
                                </Link>
                              </div>
                              
                              {currentUser && user._id !== currentUser._id && (
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
                                      Cancel
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleAddFriend(user._id)}
                                      className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
                                    >
                                      Add
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
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
                        onClick={() => {
                          setSearchFocused(false);
                          setShowMobileMenu(false);
                        }}
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
              
              {/* Categories */}
              {Array.isArray(categories) && categories.map((category, idx) => (
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
      
      {/* Full Screen Mobile Search */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-white"
          >
            <div className="p-4 pb-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Search People</h3>
                <button 
                  onClick={() => {
                    setShowMobileSearch(false);
                    setSearchFocused(false);
                  }}
                  className="p-2 rounded-full bg-gray-100 text-gray-700"
                >
                  <HiX className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSearchSubmit} className="relative mb-4">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-50"
                  autoFocus
                />
                <HiOutlineSearch className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
              </form>
            </div>
            
            {/* Mobile Search Results Fullscreen */}
            <div className="h-[calc(100%-120px)] overflow-y-auto pb-6 px-4">
              {userLoading ? (
                <div className="p-4 flex justify-center">
                  <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : fetchedUsers && fetchedUsers.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {fetchedUsers.map((user) => {
                    // Skip invalid users
                    if (!user || !user._id) return null;
                    
                    return (
                      <div 
                        key={user._id} 
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center gap-3 flex-grow">
                          <div className="overflow-hidden rounded-full">
                            <Image
                              src={user.avatar || "/fallback-avatar.png"}
                              alt={user.name || "User"}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          </div>
                          <Link 
                            href={`/profile/${user._id}`}
                            onClick={() => {
                              setSearchTerm("");
                              setSearchFocused(false);
                              setShowMobileSearch(false);
                            }}
                          >
                            <div>
                              <p className="font-medium text-gray-800">{user.name || "User"}</p>
                              <p className="text-xs text-gray-500">{user.title || "User"}</p>
                            </div>
                          </Link>
                        </div>
                        
                        {currentUser && user._id !== currentUser._id && (
                          <div>
                            {checkIsFriend(user._id) ? (
                              <span className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-full">
                                Friends
                              </span>
                            ) : checkIsPending(user._id) ? (
                              <button
                                onClick={() => handleCancelFriendRequest(findPendingRequestId(user._id))}
                                className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                              >
                                Cancel Request
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAddFriend(user._id)}
                                className="px-3 py-1.5 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
                              >
                                Add Friend
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  {searchTerm ? "No users found" : "Type to search for someone"}
                </div>
              )}
              
              {/* View All Friends Button */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                <Link 
                  href="/blog/friends" 
                  className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors text-sm font-medium"
                  onClick={() => {
                    setSearchFocused(false);
                    setShowMobileSearch(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16.5h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16.5z" />
                  </svg>
                  See All Friends
                </Link>
              </div>
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
      
      {/* Simplified Friends Modal with Proper Error Handling */}
      <SimplifiedFriendsModal
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