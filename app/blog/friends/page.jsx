"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  fetchFriendRequests,
  fetchFriends,
  updateFriendRequest,
  deleteFriendRequest,
  sendFriendRequest,
  fetchAllUsers,
} from "@/app/features/friendSlice";

// Icons
import { HiOutlineUserGroup, HiOutlineUserAdd, HiOutlineUser, HiSearch, HiOutlineBell } from "react-icons/hi";
import { HiOutlineCheck, HiOutlineX, HiChevronDown, HiOutlineTrash, HiOutlinePaperAirplane } from "react-icons/hi";
import { HiOutlineUsers, HiOutlineHeart, HiOutlineChatAlt2, HiOutlineGlobe } from "react-icons/hi";

const FriendsPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { users, friendRequests, friends, loading, error } = useSelector(
    (state) => state.friend
  );

  // States for search, visible count and tabs
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingStates, setLoadingStates] = useState({});
  const [activeTab, setActiveTab] = useState("all"); // "all", "online", "pending"
  const [selectedUser, setSelectedUser] = useState(null);

  // For stats demo
  const [stats] = useState({
    totalFriends: friends.length,
    onlineFriends: Math.floor(Math.random() * friends.length),
    friendsInCommon: Math.floor(Math.random() * 12),
    suggestedFriends: Math.floor(Math.random() * 15) + 5,
  });

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) => 
      user._id !== currentUser?._id && // Don't show current user
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get visible users for pagination
  const visibleUsers = filteredUsers.slice(0, visibleCount);

  // Random activity messages for the activity feed
  const [activities] = useState([
    { user: "Ali Yılmaz", action: "bir fotoğraf paylaştı", time: "15 dk önce" },
    { user: "Selin Demir", action: "durumunu güncelledi", time: "38 dk önce" },
    { user: "Kerem Aydın", action: "bir etkinlik oluşturdu", time: "1 saat önce" },
    { user: "Zeynep Kaya", action: "bir yorum yaptı", time: "2 saat önce" },
    { user: "Burak Şahin", action: "profil fotoğrafını değiştirdi", time: "3 saat önce" },
    { user: "Deniz Yıldız", action: "bir hikaye paylaştı", time: "5 saat önce" },
  ]);

  useEffect(() => {
    dispatch(fetchFriendRequests());
    dispatch(fetchFriends());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Handle friend request actions with loading states
  const handleAccept = async (requestId) => {
    setLoadingStates(prev => ({ ...prev, [requestId]: 'accepting' }));
    await dispatch(updateFriendRequest({ requestId, action: "accept" }));
    setLoadingStates(prev => ({ ...prev, [requestId]: undefined }));
  };

  const handleReject = async (requestId) => {
    setLoadingStates(prev => ({ ...prev, [requestId]: 'rejecting' }));
    await dispatch(updateFriendRequest({ requestId, action: "reject" }));
    setLoadingStates(prev => ({ ...prev, [requestId]: undefined }));
  };

  const handleDelete = async (requestId) => {
    setLoadingStates(prev => ({ ...prev, [requestId]: 'deleting' }));
    await dispatch(deleteFriendRequest(requestId));
    setLoadingStates(prev => ({ ...prev, [requestId]: undefined }));
  };

  const handleSendRequest = async (receiverId) => {
    if (!currentUser) return;
    setLoadingStates(prev => ({ ...prev, [receiverId]: 'sending' }));
    await dispatch(
      sendFriendRequest({
        receiverId,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
      })
    );
    setLoadingStates(prev => ({ ...prev, [receiverId]: undefined }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setVisibleCount(6);
  };

  // Calculate pending requests count
  const pendingRequestsCount = friendRequests.filter(
    (req) => req.sender && req.sender._id !== currentUser?._id
  ).length;

  // Calculate sent request count
  const sentRequestsCount = friendRequests.filter(
    (req) => req.sender && req.sender._id === currentUser?._id
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full mx-auto px-4 py-8">
        {/* Top Navigation & Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Welcome Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-cover bg-center opacity-10" 
                   style={{backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')"}}></div>
              <div className="relative p-6 md:p-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Merhaba, {currentUser?.name?.split(' ')[0] || 'Kullanıcı'}!
                </h1>
                <p className="text-slate-600 max-w-xl">
                  Arkadaşların seni bekliyor - yeni bağlantılar kur, etkinlikler düzenle ve sosyal çevreni genişlet.
                </p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200 transition-transform hover:scale-105">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                        <HiOutlineUserGroup className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-700">{friends.length}</p>
                        <p className="text-xs text-slate-500">Arkadaş</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200 transition-transform hover:scale-105">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <HiOutlineBell className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-700">{pendingRequestsCount}</p>
                        <p className="text-xs text-slate-500">İstek</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200 transition-transform hover:scale-105">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                        <HiOutlineUsers className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-700">{stats.friendsInCommon}</p>
                        <p className="text-xs text-slate-500">Ortak Arkadaş</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200 transition-transform hover:scale-105">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                        <HiOutlineUserAdd className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-700">{stats.suggestedFriends}</p>
                        <p className="text-xs text-slate-500">Önerilen</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search & Quick Actions */}
          <div className="flex flex-col gap-4">
            {/* Search Box */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Arkadaş ara..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <HiSearch className="absolute left-3 top-3.5 text-slate-400 h-5 w-5" />
              </div>
              
              {/* Quick Filters */}
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 text-xs rounded-lg flex items-center ${activeTab === "all" 
                    ? "bg-slate-800 text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  <HiOutlineUsers className="mr-1.5 h-3.5 w-3.5" />
                  Tümü
                </button>
                <button 
                  onClick={() => setActiveTab("pending")}
                  className={`px-3 py-1.5 text-xs rounded-lg flex items-center ${activeTab === "pending" 
                    ? "bg-amber-500 text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  <HiOutlineBell className="mr-1.5 h-3.5 w-3.5" />
                  İstekler {pendingRequestsCount > 0 && `(${pendingRequestsCount})`}
                </button>
                <button 
                  onClick={() => setActiveTab("new")}
                  className={`px-3 py-1.5 text-xs rounded-lg flex items-center ${activeTab === "new" 
                    ? "bg-blue-500 text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  <HiOutlineUserAdd className="mr-1.5 h-3.5 w-3.5" />
                  Keşfet
                </button>
              </div>
            </div>
            
            {/* Quick Activity Feed */}
            <div className="bg-white rounded-xl shadow-lg p-4 flex-grow">
              <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
                <HiOutlineGlobe className="mr-1.5 h-4 w-4 text-slate-500" />
                Son Aktiviteler
              </h3>
              
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-2 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                      {activity.action.includes("fotoğraf") ? (
                        <HiOutlineHeart className="h-4 w-4" />
                      ) : activity.action.includes("yorum") ? (
                        <HiOutlineChatAlt2 className="h-4 w-4" />
                      ) : (
                        <HiOutlineUser className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-2">
            {/* Pending Friend Requests Panel */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-amber-400 to-amber-600 py-4 px-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white flex items-center">
                    <HiOutlineBell className="mr-2 h-5 w-5" />
                    Bekleyen İstekler
                    {pendingRequestsCount > 0 && (
                      <span className="ml-2 bg-white text-amber-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </h2>
                </div>
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse flex items-center gap-4">
                        <div className="rounded-full bg-slate-200 h-12 w-12"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                          <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : friendRequests.length === 0 ? (
                  <div className="text-center py-6 px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-500 mb-4">
                      <HiOutlineBell className="h-8 w-8" />
                    </div>
                    <p className="text-slate-700 font-medium mb-2">Bekleyen istek yok</p>
                    <p className="text-sm text-slate-500 mb-4">
                      Yeni arkadaşlık isteklerin burada görünecek
                    </p>
                    <button 
                      onClick={() => setActiveTab("new")}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                    >
                      Yeni Arkadaşlar Bul
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {friendRequests.map((req) => {
                      const isSender = req.sender && req.sender._id === currentUser?._id;
                      const requestUser = isSender ? req.receiver : req.sender;
                      const isLoading = loadingStates[req._id];

                      return (
                        <div
                          key={req._id}
                          className="bg-slate-50 rounded-lg p-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <Link href={`/profile/${requestUser._id}`} className="flex items-center gap-3 group flex-grow">
                              <div className="relative">
                                <Image
                                  src={requestUser.avatar || "/fallback-avatar.png"}
                                  alt={requestUser.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full object-cover"
                                />
                                {!isSender && (
                                  <span className="absolute -top-1 -right-1 bg-amber-500 h-3 w-3 rounded-full border-2 border-white"></span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-slate-800 group-hover:text-amber-600 transition-colors">
                                  {requestUser.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {isSender ? "İstek gönderildi" : "Arkadaşlık isteği"}
                                </p>
                              </div>
                            </Link>

                            {isSender ? (
                              <button
                                onClick={() => handleDelete(req._id)}
                                disabled={isLoading}
                                className={`${
                                  isLoading
                                    ? "bg-slate-300 cursor-not-allowed"
                                    : "bg-slate-200 hover:bg-slate-300 text-slate-600"
                                } p-2 rounded-lg transition-colors`}
                              >
                                {isLoading ? (
                                  <div className="h-5 w-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <HiOutlineX className="h-5 w-5" />
                                )}
                              </button>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAccept(req._id)}
                                  disabled={isLoading}
                                  className={`${
                                    isLoading === 'accepting'
                                      ? "bg-emerald-300 cursor-not-allowed"
                                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                  } p-2 rounded-lg transition-colors`}
                                >
                                  {isLoading === 'accepting' ? (
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <HiOutlineCheck className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleReject(req._id)}
                                  disabled={isLoading}
                                  className={`${
                                    isLoading === 'rejecting'
                                      ? "bg-rose-300 cursor-not-allowed"
                                      : "bg-rose-500 hover:bg-rose-600 text-white"
                                  } p-2 rounded-lg transition-colors`}
                                >
                                  {isLoading === 'rejecting' ? (
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <HiOutlineX className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Friends Stats */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-700 to-slate-900 py-4 px-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white flex items-center">
                    <HiOutlineUserGroup className="mr-2 h-5 w-5" />
                    Arkadaşlık İstatistikleri
                  </h2>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-slate-800">{friends.length}</p>
                    <p className="text-sm text-slate-500">Toplam Arkadaş</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-slate-800">{sentRequestsCount}</p>
                    <p className="text-sm text-slate-500">Gönderilen İstek</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-slate-800">{pendingRequestsCount}</p>
                    <p className="text-sm text-slate-500">Bekleyen İstek</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-slate-800">{stats.friendsInCommon}</p>
                    <p className="text-sm text-slate-500">Ortak Arkadaşlar</p>
                  </div>
                </div>
                
                {friends.length === 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-blue-700 font-medium mb-2">Henüz Arkadaşın Yok</p>
                    <p className="text-sm text-blue-600 mb-4">Yeni arkadaşlar edinmek için keşfet kısmını kullanabilirsin</p>
                    <button 
                      onClick={() => setActiveTab("new")}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Kişileri Keşfet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Center Content - Friends/Requests/Discover List */}
          <div className="lg:col-span-4">
            {/* Main Content Box */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header with different colors based on active tab */}
              <div className={`py-4 px-5 ${
                activeTab === "all" 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600" 
                  : activeTab === "pending" 
                    ? "bg-gradient-to-r from-amber-400 to-amber-600" 
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
              }`}>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white flex items-center">
                    {activeTab === "all" ? (
                      <>
                        <HiOutlineUserGroup className="mr-2 h-5 w-5" />
                        Tüm Arkadaşlar
                      </>
                    ) : activeTab === "pending" ? (
                      <>
                        <HiOutlineBell className="mr-2 h-5 w-5" />
                        Bekleyen İstekler
                      </>
                    ) : (
                      <>
                        <HiOutlineUserAdd className="mr-2 h-5 w-5" />
                        Yeni Kişiler Keşfet
                      </>
                    )}
                  </h2>
                  
                  <div className="text-white text-sm flex items-center">
                    <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                      {activeTab === "all"
                        ? `${friends.length} arkadaş`
                        : activeTab === "pending"
                          ? `${friendRequests.length} istek`
                          : `${filteredUsers.length} kişi bulundu`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content based on active tab */}
              <div className="p-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-slate-100 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="rounded-full bg-slate-200 h-14 w-14"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            </div>
                          </div>
                          <div className="h-8 bg-slate-200 rounded-lg w-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeTab === "all" ? (
                  // All Friends Tab
                  friends.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4">
                        <HiOutlineUserGroup className="h-10 w-10" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Henüz Arkadaşın Yok</h3>
                      <p className="text-slate-500 max-w-md mx-auto mb-6">
                        Henüz hiç arkadaşın yok. Sosyal çevreni genişletmek için yeni kişiler keşfetmeye başla!
                      </p>
                      <button 
                        onClick={() => setActiveTab("new")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        Kişileri Keşfet
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {friends.map((friend) => {
                        const friendUser =
                          friend.sender._id === currentUser?._id
                            ? friend.receiver
                            : friend.sender;
                        const isLoading = loadingStates[friend._id];

                        return (
                          <div
                            key={friend._id}
                            className="bg-slate-50 rounded-xl p-5 transform transition-transform hover:scale-105 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="relative">
                                <Image
                                  src={friendUser.avatar || "/fallback-avatar.png"}
                                  alt={friendUser.name}
                                  width={56}
                                  height={56}
                                  className="rounded-full object-cover"
                                />
                                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                              </div>
                              <div>
                                <h3 className="font-medium text-slate-800">
                                  {friendUser.name}
                                </h3>
                                <p className="text-xs text-slate-500">Arkadaşın</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-lg transition-colors flex items-center justify-center"
                                onClick={() => handleDelete(friend._id)}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <div className="h-4 w-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                                ) : (
                                  <HiOutlineTrash className="h-4 w-4 mr-2" />
                                )}
                                <span className="text-sm font-medium">Arkadaşı Sil</span>
                              </button>
                              <Link
                                href={`/profile/${friendUser._id}`}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center"
                              >
                                <HiOutlineUser className="h-4 w-4 mr-2" />
                                <span className="text-sm font-medium">Profili Gör</span>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : activeTab === "pending" ? (
                  // Pending Requests Tab
                  friendRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-4">
                        <HiOutlineBell className="h-10 w-10" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Bekleyen İstek Yok</h3>
                      <p className="text-slate-500 max-w-md mx-auto mb-6">
                        Şu anda bekleyen arkadaşlık isteğin bulunmuyor. Yeni kişiler keşfetmek için aşağıdaki butona tıklayabilirsin.
                      </p>
                      <button 
                        onClick={() => setActiveTab("new")}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                      >
                        Kişileri Keşfet
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {friendRequests.map((req) => {
                        const isSender = req.sender && req.sender._id === currentUser?._id;
                        const requestUser = isSender ? req.receiver : req.sender;
                        const isLoading = loadingStates[req._id];

                        return (
                          <div
                            key={req._id}
                            className="bg-slate-50 rounded-xl p-5 transform transition-transform hover:scale-105 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <Image
                                src={requestUser.avatar || "/fallback-avatar.png"}
                                alt={requestUser.name}
                                width={56}
                                height={56}
                                className="rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-medium text-slate-800">
                                  {requestUser.name}
                                </h3>
                                <p className="text-xs text-slate-500 flex items-center">
                                  {isSender ? (
                                    <>
                                      <HiOutlinePaperAirplane className="h-3 w-3 mr-1 transform rotate-45" />
                                      İstek gönderildi
                                    </>
                                  ) : (
                                    <>
                                      <HiOutlineBell className="h-3 w-3 mr-1" />
                                      Arkadaşlık isteği
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                            
                            {isSender ? (
                              <button
                                onClick={() => handleDelete(req._id)}
                                disabled={isLoading}
                                className={`w-full ${
                                  isLoading
                                    ? "bg-slate-300 cursor-not-allowed"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                } py-2 rounded-lg transition-colors flex items-center justify-center`}
                              >
                                {isLoading ? (
                                  <div className="h-4 w-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                                ) : (
                                  <HiOutlineX className="h-4 w-4 mr-2" />
                                )}
                                <span className="text-sm font-medium">İsteği İptal Et</span>
                              </button>
                            ) : (
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleAccept(req._id)}
                                  disabled={isLoading}
                                  className={`${
                                    isLoading === 'accepting'
                                      ? "bg-emerald-300 cursor-not-allowed"
                                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                  } py-2 rounded-lg transition-colors flex items-center justify-center`}
                                >
                                  {isLoading === 'accepting' ? (
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  ) : (
                                    <HiOutlineCheck className="h-4 w-4 mr-2" />
                                  )}
                                  <span className="text-sm font-medium">Kabul Et</span>
                                </button>
                                <button
                                  onClick={() => handleReject(req._id)}
                                  disabled={isLoading}
                                  className={`${
                                    isLoading === 'rejecting'
                                      ? "bg-rose-300 cursor-not-allowed"
                                      : "bg-rose-500 hover:bg-rose-600 text-white"
                                  } py-2 rounded-lg transition-colors flex items-center justify-center`}
                                >
                                  {isLoading === 'rejecting' ? (
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  ) : (
                                    <HiOutlineX className="h-4 w-4 mr-2" />
                                  )}
                                  <span className="text-sm font-medium">Reddet</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  // Discover New Users Tab
                  filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mb-4">
                        <HiSearch className="h-10 w-10" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Kullanıcı Bulunamadı</h3>
                      <p className="text-slate-500 max-w-md mx-auto mb-6">
                        Arama kriterlerine uygun kullanıcı bulunamadı. Lütfen farklı bir arama terimi deneyin.
                      </p>
                      <div className="relative max-w-md mx-auto">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          placeholder="Kullanıcı ara..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <HiSearch className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {visibleUsers.map((user) => {
                          const isLoading = loadingStates[user._id];
                          // Check existing relationships
                          const existingRequest = friendRequests.find(
                            (req) =>
                              (req.sender?._id === currentUser?._id && req.receiver?._id === user._id) ||
                              (req.receiver?._id === currentUser?._id && req.sender?._id === user._id)
                          );
                          const existingFriendship = friends.find(
                            (friend) =>
                              (friend.sender?._id === currentUser?._id && friend.receiver?._id === user._id) ||
                              (friend.receiver?._id === currentUser?._id && friend.sender?._id === user._id)
                          );

                          return (
                            <div
                              key={user._id}
                              className="bg-white rounded-xl p-5 border border-slate-200 transform transition-transform hover:scale-105 shadow-sm hover:shadow-md"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <Image
                                  src={user.avatar || "/fallback-avatar.png"}
                                  alt={user.name}
                                  width={56}
                                  height={56}
                                  className="rounded-full object-cover"
                                />
                                <div>
                                  <h3 className="font-medium text-slate-800">
                                    {user.name}
                                  </h3>
                                  <p className="text-xs text-slate-500 flex items-center">
                                    <HiOutlineUsers className="h-3 w-3 mr-1" />
                                    {Math.floor(Math.random() * 5) + 1} ortak arkadaş
                                  </p>
                                </div>
                              </div>
                              
                              {existingFriendship ? (
                                <button 
                                  className="w-full bg-emerald-100 text-emerald-700 py-2 rounded-lg flex items-center justify-center"
                                  disabled
                                >
                                  <HiOutlineCheck className="h-4 w-4 mr-2" />
                                  <span className="text-sm font-medium">Arkadaşsınız</span>
                                </button>
                              ) : existingRequest ? (
                                <button 
                                  className="w-full bg-amber-100 text-amber-700 py-2 rounded-lg flex items-center justify-center"
                                  disabled
                                >
                                  <HiOutlineBell className="h-4 w-4 mr-2" />
                                  <span className="text-sm font-medium">
                                    {existingRequest.sender?._id === currentUser?._id 
                                      ? "İstek Gönderildi" 
                                      : "İstek Bekliyor"}
                                  </span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSendRequest(user._id)}
                                  disabled={isLoading}
                                  className={`w-full ${
                                    isLoading
                                      ? "bg-purple-300 cursor-not-allowed"
                                      : "bg-purple-500 hover:bg-purple-600 text-white"
                                  } py-2 rounded-lg transition-colors flex items-center justify-center`}
                                >
                                  {isLoading ? (
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  ) : (
                                    <HiOutlineUserAdd className="h-4 w-4 mr-2" />
                                  )}
                                  <span className="text-sm font-medium">Arkadaş Ekle</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Show More Button */}
                      {filteredUsers.length > visibleCount && (
                        <div className="mt-6 text-center">
                          <button
                            onClick={() => setVisibleCount((prev) => prev + 6)}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-full text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
                          >
                            Daha Fazla Göster
                            <HiChevronDown className="ml-1.5 h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;