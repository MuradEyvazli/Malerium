"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import {
  fetchFriendRequests,
  fetchFriends,
  updateFriendRequest,
  deleteFriendRequest,
  sendFriendRequest,
  fetchAllUsers,
} from "@/app/features/friendSlice";

// Icons
import { Users, User, UserPlus, Bell, Search, Check, X } from "lucide-react";

const FriendsPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.currentUser);
  const { users = [], friendRequests = [], friends = [], loading = false } = useSelector(
    (state) => state.friend || { users: [], friendRequests: [], friends: [], loading: false }
  );

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("friends");
  const [loadingStates, setLoadingStates] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Veri yükleme fonksiyonu
    const loadData = async () => {
      try {
        // Debug için konsola yazdır
        console.log("Veri yükleme başladı");
        
        // Paralel veri yükleme
        const results = await Promise.all([
          dispatch(fetchFriendRequests()),
          dispatch(fetchFriends()),
          dispatch(fetchAllUsers())
        ]);
        
        console.log("Arkadaşlık istekleri:", results[0]?.payload);
        console.log("Arkadaşlar:", results[1]?.payload);
        console.log("Tüm kullanıcılar:", results[2]?.payload);
        
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      }
    };

    // Kullanıcı giriş yapmışsa verileri yükle
    if (currentUser && currentUser._id) {
      loadData();
    }
  }, [dispatch, currentUser]);

  // Verileri filtreleme ve kontrol etme fonksiyonları
  const getFilteredUsers = () => {
    if (!users || !Array.isArray(users)) return [];
    
    return users.filter(
      (user) => 
        user && user._id && currentUser && 
        user._id !== currentUser._id && 
        user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getReceivedRequests = () => {
    if (!friendRequests || !Array.isArray(friendRequests) || !currentUser) return [];
    
    // Gelen istekleri filtrele - alıcı şimdiki kullanıcı ise
    return friendRequests.filter(
      (req) => req && req.receiver && currentUser && req.receiver._id === currentUser._id
    );
  };

  const getSentRequests = () => {
    if (!friendRequests || !Array.isArray(friendRequests) || !currentUser) return [];
    
    // Gönderilen istekleri filtrele - gönderen şimdiki kullanıcı ise
    return friendRequests.filter(
      (req) => req && req.sender && currentUser && req.sender._id === currentUser._id
    );
  };

  // Filtrelenmiş veriler
  const filteredUsers = getFilteredUsers();
  const receivedRequests = getReceivedRequests();
  const sentRequests = getSentRequests();

  // İstek işleme fonksiyonları
  const handleAccept = async (requestId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [requestId]: 'accepting' }));
      const result = await dispatch(updateFriendRequest({ requestId, action: "accept" }));
      console.log("Kabul edilen istek sonucu:", result);
      
      // İsteği kabul ettikten sonra verileri güncelle
      dispatch(fetchFriendRequests());
      dispatch(fetchFriends());
    } catch (error) {
      console.error("İstek kabul hatası:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [requestId]: undefined }));
    }
  };

  const handleReject = async (requestId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [requestId]: 'rejecting' }));
      const result = await dispatch(updateFriendRequest({ requestId, action: "reject" }));
      console.log("Reddedilen istek sonucu:", result);
      
      // İsteği reddettikten sonra verileri güncelle
      dispatch(fetchFriendRequests());
    } catch (error) {
      console.error("İstek reddetme hatası:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [requestId]: undefined }));
    }
  };

  const handleDelete = async (requestId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [requestId]: 'deleting' }));
      const result = await dispatch(deleteFriendRequest(requestId));
      console.log("Silinen istek sonucu:", result);
      
      // İsteği sildikten sonra verileri güncelle
      dispatch(fetchFriendRequests());
    } catch (error) {
      console.error("İstek silme hatası:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [requestId]: undefined }));
    }
  };

  const handleSendRequest = async (receiverId) => {
    if (!currentUser) {
      console.error("Kullanıcı giriş yapmamış");
      return;
    }
    
    try {
      setLoadingStates(prev => ({ ...prev, [receiverId]: 'sending' }));
      
      // Kullanıcı bilgilerini tam olarak gönder
      const result = await dispatch(
        sendFriendRequest({
          receiverId,
          senderName: currentUser.name || "İsimsiz Kullanıcı",
          senderAvatar: currentUser.avatar || "/fallback-avatar.png",
        })
      );
      
      console.log("Gönderilen istek sonucu:", result);
      
      // İstek gönderdikten sonra verileri güncelle
      dispatch(fetchFriendRequests());
    } catch (error) {
      console.error("İstek gönderme hatası:", error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [receiverId]: undefined }));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Kullanıcı verisi kontrol fonksiyonu
  const getUserData = (userData, fallbackName = "İsimsiz Kullanıcı") => {
    if (!userData) return { name: fallbackName, avatar: "/fallback-avatar.png" };
    
    return {
      name: userData.name || fallbackName,
      avatar: userData.avatar || "/fallback-avatar.png"
    };
  };

  // Tab içeriği render etme fonksiyonu
  const renderTabContent = () => {
    if (loading || !isDataLoaded) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600">Yükleniyor...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "friends":
        return (
          <div>
            {!friends.length ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <Users className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Henüz arkadaşın yok</h3>
                <p className="text-gray-500 mb-4">Yeni arkadaşlık bağlantıları kurmaya başlamak için keşfet sekmesine geç</p>
                <button 
                  onClick={() => setActiveTab("discover")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Keşfet
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend) => {
                  // Eksik veya hatalı veri kontrolü
                  if (!friend || !friend.sender || !friend.receiver) {
                    console.warn("Eksik arkadaşlık verisi:", friend);
                    return null;
                  }
                  
                  // Arkadaş verilerini belirle
                  const isCurrentUserSender = friend.sender._id === currentUser?._id;
                  const friendData = isCurrentUserSender ? 
                    getUserData(friend.receiver, "Alıcı") : 
                    getUserData(friend.sender, "Gönderen");
                  
                  return (
                    <div key={friend._id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <Image
                          src={friendData.avatar}
                          alt={friendData.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-medium text-gray-800">{friendData.name}</h3>
                          <p className="text-xs text-gray-500">Arkadaşın</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          href={`/profile/${isCurrentUserSender ? friend.receiver._id : friend.sender._id}`}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded text-center text-sm font-medium transition-colors"
                        >
                          Profil
                        </Link>
                        <button
                          onClick={() => handleDelete(friend._id)}
                          disabled={loadingStates[friend._id]}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded text-center text-sm font-medium transition-colors"
                        >
                          Çıkar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
        
      case "requests":
        return (
          <div className="space-y-6">
            {receivedRequests.length === 0 && sentRequests.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <Bell className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">İstek yok</h3>
                <p className="text-gray-500 mb-4">Gelen veya gönderilen arkadaşlık isteği bulunmuyor</p>
                <button 
                  onClick={() => setActiveTab("discover")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Keşfet
                </button>
              </div>
            ) : (
              <>
                {receivedRequests.length > 0 && (
                  <>
                    <h3 className="font-medium text-gray-700 flex items-center">
                      <Bell className="mr-2 h-4 w-4" />
                      Gelen İstekler
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {receivedRequests.map((request) => {
                        // Gönderen verisini kontrol et
                        const senderData = getUserData(request.sender);
                        
                        return (
                          <div key={request._id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-3 mb-3">
                              <Image
                                src={senderData.avatar}
                                alt={senderData.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                              <div>
                                <h3 className="font-medium text-gray-800">{senderData.name}</h3>
                                <p className="text-xs text-gray-500">Arkadaşlık isteği gönderdi</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAccept(request._id)}
                                disabled={loadingStates[request._id]}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded text-center text-sm font-medium transition-colors flex items-center justify-center"
                              >
                                {loadingStates[request._id] === 'accepting' ? (
                                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-1" /> Kabul Et
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(request._id)}
                                disabled={loadingStates[request._id]}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-center text-sm font-medium transition-colors flex items-center justify-center"
                              >
                                {loadingStates[request._id] === 'rejecting' ? (
                                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <>
                                    <X className="h-4 w-4 mr-1" /> Reddet
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                
                {sentRequests.length > 0 && (
                  <>
                    <h3 className="font-medium text-gray-700 flex items-center mt-6">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Gönderilen İstekler
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sentRequests.map((request) => {
                        // Alıcı verisini kontrol et
                        const receiverData = getUserData(request.receiver);
                        
                        return (
                          <div key={request._id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-3 mb-3">
                              <Image
                                src={receiverData.avatar}
                                alt={receiverData.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                              <div>
                                <h3 className="font-medium text-gray-800">{receiverData.name}</h3>
                                <p className="text-xs text-gray-500">İstek gönderildi</p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDelete(request._id)}
                              disabled={loadingStates[request._id]}
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded text-center text-sm font-medium transition-colors flex items-center justify-center"
                            >
                              {loadingStates[request._id] === 'deleting' ? (
                                <div className="h-4 w-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <X className="h-4 w-4 mr-1" /> İptal Et
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        );
        
      case "discover":
      default:
        return (
          <div>
            {filteredUsers.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <Search className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Kullanıcı bulunamadı</h3>
                <p className="text-gray-500 mb-4">Arama kriterlerine uygun kullanıcı bulunamadı</p>
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="İsim ile ara..."
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => {
                  // Eksik veya hatalı veri kontrolü
                  if (!user || !user._id) {
                    console.warn("Eksik kullanıcı verisi:", user);
                    return null;
                  }
                  
                  // Kullanıcı verilerini kontrol et
                  const userData = getUserData(user);
                  
                  // İlişki kontrolü
                  const existingRequest = friendRequests.find(
                    (req) =>
                      req && req.sender && req.receiver && currentUser && user && 
                      ((req.sender._id === currentUser._id && req.receiver._id === user._id) ||
                      (req.receiver._id === currentUser._id && req.sender._id === user._id))
                  );
                  
                  const existingFriendship = friends.find(
                    (friend) =>
                      friend && friend.sender && friend.receiver && currentUser && user &&
                      ((friend.sender._id === currentUser._id && friend.receiver._id === user._id) ||
                      (friend.receiver._id === currentUser._id && friend.sender._id === user._id))
                  );

                  return (
                    <div key={user._id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <Image
                          src={userData.avatar}
                          alt={userData.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-medium text-gray-800">{userData.name}</h3>
                          <p className="text-xs text-gray-500">Kullanıcı</p>
                        </div>
                      </div>
                      
                      {existingFriendship ? (
                        <button 
                          className="w-full bg-green-50 text-green-600 py-2 rounded text-center text-sm font-medium flex items-center justify-center"
                          disabled
                        >
                          <Users className="h-4 w-4 mr-2" /> Arkadaşsınız
                        </button>
                      ) : existingRequest ? (
                        <button 
                          className="w-full bg-blue-50 text-blue-600 py-2 rounded text-center text-sm font-medium flex items-center justify-center"
                          disabled
                        >
                          {existingRequest.sender?._id === currentUser?._id ? (
                            <>
                              <Bell className="h-4 w-4 mr-2" /> İstek Gönderildi
                            </>
                          ) : (
                            <>
                              <Bell className="h-4 w-4 mr-2" /> İstek Aldınız
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSendRequest(user._id)}
                          disabled={loadingStates[user._id]}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-center text-sm font-medium transition-colors flex items-center justify-center"
                        >
                          {loadingStates[user._id] === 'sending' ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" /> Arkadaş Ekle
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
    }
  };

  // Tab içeriklerini render etmek için yardımcı fonksiyon
  const renderTab = (tabKey, label, icon, count = 0) => {
    return (
      <button
        className={`px-4 py-2 font-medium text-sm border-b-2 ${
          activeTab === tabKey
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab(tabKey)}
      >
        {icon}
        {label}
        {count > 0 && <span className="ml-1 text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5">{count}</span>}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Arkadaşlar</h1>
              <p className="text-gray-500">Arkadaşlarını yönet ve yeni bağlantılar kur</p>
            </div>
            
            <div className="relative max-w-md w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="İsim ile ara..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div 
            className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${activeTab === 'friends' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{friends?.length || 0}</p>
                <p className="text-xs text-gray-500">Arkadaş</p>
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${activeTab === 'requests' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{receivedRequests?.length || 0}</p>
                <p className="text-xs text-gray-500">Gelen İstek</p>
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${activeTab === 'requests' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{sentRequests?.length || 0}</p>
                <p className="text-xs text-gray-500">Gönderilen</p>
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${activeTab === 'discover' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{filteredUsers?.length || 0}</p>
                <p className="text-xs text-gray-500">Keşfet</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          {renderTab('friends', 'Arkadaşlar', <Users className="h-4 w-4 inline-block mr-1" />)}
          {renderTab('requests', 'İstekler', <Bell className="h-4 w-4 inline-block mr-1" />, (receivedRequests.length + sentRequests.length))}
          {renderTab('discover', 'Keşfet', <Search className="h-4 w-4 inline-block mr-1" />)}
        </div>
        
        {/* Main Content */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm min-h-[60vh]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;