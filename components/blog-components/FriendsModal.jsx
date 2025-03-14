"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineLogout, HiOutlineUser, HiOutlineUserGroup, HiOutlineMail, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriendRequests, fetchFriends } from "@/app/features/friendSlice";

export default function FriendsModal({
  show,
  onClose,
  currentUser,
  onLogout
}) {
  const dispatch = useDispatch();
  
  // Redux state'inden friends'i al
  const { friends } = useSelector((state) => state.friend);
  
  // Kullanıcı postları ve profil bilgileri için state
  const [userStats, setUserStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    joinDate: ""
  });
  
  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Profil fotoğrafı önizleme modalı için state
  const [photoPreview, setPhotoPreview] = useState({
    show: false,
    src: "",
    alt: ""
  });

  // Component mount olduğunda verileri çek
  useEffect(() => {
    if (show && currentUser?._id) {
      // Arkadaş verilerini çek
      dispatch(fetchFriendRequests());
      dispatch(fetchFriends());
      
      // Kullanıcı istatistiklerini çek
      fetchUserStats();
    }
  }, [show, currentUser, dispatch]);

  // Kullanıcı istatistiklerini çekme fonksiyonu
  const fetchUserStats = async () => {
    if (!currentUser?._id) return;
    
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      // Kullanıcı postlarını çek
      const postsRes = await fetch(`/api/auth/user-posts/${currentUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!postsRes.ok) throw new Error("Kullanıcı postları çekilemedi");
      
      const postsData = await postsRes.json();
      const posts = postsData.posts || [];
      
      // Toplam beğeni sayısını hesapla (her post için likes sayısının toplamı)
      const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
      
      // Kullanıcı katılım tarihini formatla (gerçek veri varsa kullan, yoksa şu anki tarihi formatla)
      const joinDate = currentUser.createdAt 
        ? new Date(currentUser.createdAt).toLocaleDateString('tr-TR', {year: 'numeric', month: 'short'})
        : new Date().toLocaleDateString('tr-TR', {year: 'numeric', month: 'short'});
      
      setUserStats({
        totalPosts: posts.length,
        totalLikes: totalLikes,
        joinDate: joinDate
      });
    } catch (error) {
      console.error("Kullanıcı istatistikleri çekilemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  // Profil fotoğrafını önizleme modalında göster
  const openPhotoPreview = (src, alt, e) => {
    e.preventDefault(); // Link'in çalışmasını engelle
    e.stopPropagation(); // Event'in parent elementlere yayılmasını engelle
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

  // Modal kapalıysa hiç render etme
  if (!show) return null;

  // Ufak bir yardımcı fonksiyon: kim arkadaş
  const getFriendUser = (friend) => {
    const senderId = friend.sender?._id || friend.sender;
    return senderId === currentUser?._id ? friend.receiver : friend.sender;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Arkaplan Blur + Siyah */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal kutu */}
      <div className="relative z-10 bg-white w-full max-w-md p-5 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Profil ve Arkadaşlar</h2>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            Kapat
          </button>
        </div>
        
        {/* User Profile Section */}
        {currentUser && (
          <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              {/* Kullanıcı avatarına tıklandığında büyütmek için onClick eklendi */}
              <div 
                className="cursor-pointer relative overflow-hidden rounded-full group"
                onClick={(e) => openPhotoPreview(currentUser.avatar || "/fallback-avatar.png", currentUser.name, e)}
              >
                <Image
                  src={currentUser.avatar || "/fallback-avatar.png"}
                  alt={currentUser.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover border-2 border-blue-100 transition-transform group-hover:scale-105"
                />
                {/* Hover durumunda gösterilecek büyüteç efekti */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">{currentUser.name}</h4>
                <p className="text-sm text-gray-500">@{currentUser.nickName || currentUser.name.toLowerCase().replace(/\s/g, '_')}</p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link 
                href={`/profile/${currentUser._id}`}
                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-blue-100 text-blue-700 rounded-full group-hover:bg-blue-200 transition-colors">
                  <HiOutlineUser className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">Profil</p>
                  <p className="text-xs text-gray-500">Profilini görüntüle</p>
                </div>
              </Link>
              
              <Link 
                href={`/blog/friends`}
                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-blue-100 text-blue-700 rounded-full group-hover:bg-blue-200 transition-colors">
                  <HiOutlineUserGroup className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">Arkadaşlar</p>
                  <p className="text-xs text-gray-500">{friends?.length || 0} arkadaş</p>
                </div>
              </Link>
            </div>
            
            {/* User Stats - Dinamik veri gösterimi */}
            <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">
                  {loading ? "..." : userStats.totalPosts}
                </p>
                <p className="text-xs text-gray-500">Gönderi</p>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">{friends?.length || 0}</p>
                <p className="text-xs text-gray-500">Arkadaş</p>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {loading ? "..." : userStats.totalLikes}
                </p>
                <p className="text-xs text-gray-500">Beğeni</p>
              </div>
            </div>
            
            {/* Contact/Bio */}
            {currentUser.email && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <HiOutlineMail className="w-4 h-4 text-gray-400" />
                <span>{currentUser.email}</span>
              </div>
            )}
            {currentUser.bio && (
              <p className="mt-2 text-sm text-gray-600 italic">"{currentUser.bio}"</p>
            )}
          </div>
        )}
        
        {/* Friends List - Loading durumunu göster */}
        <h3 className="font-medium text-gray-700 mb-3">Arkadaşların · {loading ? "..." : (friends?.length || 0)}</h3>
        {loading ? (
          <div className="flex justify-center items-center py-8 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : friends?.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <HiOutlineUserGroup className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">Henüz arkadaşın yok</p>
            <p className="text-sm text-gray-400">
              İnsanları bul ve arkadaş ol
            </p>
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded-lg">
            {friends.map((friend) => {
              const friendUser = getFriendUser(friend);
              return (
                <div
                  key={friend._id}
                  className="flex items-center gap-3 bg-white p-3 rounded-md hover:bg-blue-50 transition"
                >
                  {/* Arkadaş avatarına tıklandığında büyütmek için onClick eklendi */}
                  <div 
                    className="cursor-pointer relative overflow-hidden rounded-full group"
                    onClick={(e) => openPhotoPreview(friendUser.avatar || "/fallback-avatar.png", friendUser.name, e)}
                  >
                    <Image
                      src={friendUser.avatar || "/fallback-avatar.png"}
                      alt={friendUser.name || "Friend Avatar"}
                      width={40}
                      height={40}
                      className="rounded-full object-cover transition-transform group-hover:scale-105"
                    />
                    {/* Hover durumunda gösterilecek büyüteç efekti */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                  <Link
                    href={`/profile/${friendUser._id}`}
                    className="flex-1"
                    onClick={onClose}
                  >
                    <p className="font-medium text-gray-900">
                      {friendUser.name || "Arkadaş"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {friendUser.status || "Çevrimiçi"}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Logout Button */}
        {currentUser && onLogout && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
            >
              <HiOutlineLogout className="w-5 h-5" />
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        )}
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
    </div>
  );
}