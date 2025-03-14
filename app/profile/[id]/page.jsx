"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import {
  sendFriendRequest,
  fetchFriendRequests,
  fetchFriends,
  deleteFriendRequest,
} from "@/app/features/friendSlice";
import { clearUser } from "@/app/features/UserSlice";
import { ArrowLeft, Edit3, User } from "lucide-react";

export default function ProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const { friendRequests, friends } = useSelector((state) => state.friend);
  const currentUser = useSelector((state) => state.user.currentUser);

  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchFriendRequests());
      dispatch(fetchFriends());
    }

    const fetchProfileAndPosts = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        // 1) Profil Bilgisi
        const profileRes = await fetch(`/api/auth/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) {
          if (profileRes.status === 401) {
            dispatch(clearUser());
            localStorage.removeItem("token");
          }
          throw new Error("Profil verileri çekilemedi");
        }
        const profileData = await profileRes.json();
        setProfile(profileData.profile);

        // 2) Kullanıcının Postları
        const postsRes = await fetch(`/api/auth/user-posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!postsRes.ok) throw new Error("Kullanıcı postları çekilemedi");
        const postsData = await postsRes.json();
        setUserPosts(postsData.posts || []);
      } catch (error) {
        console.error("Profil veya postlar çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [id, dispatch, currentUser]);

  // Yükleniyor Ekranı
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-t-2 border-b-2 border-yellow-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Profil yoksa
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-3xl mb-4">🔍</div>
          <p className="text-gray-800 font-medium">Profil bulunamadı.</p>
          <Link href="/" className="mt-4 inline-block text-yellow-600 hover:underline">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  // Kendi profili mi?
  const isOwnProfile = currentUser?._id === id;

  // Arkadaşlık durumu
  let isFriend = false;
  let hasPendingRequest = false;
  if (!isOwnProfile) {
    isFriend = friends.some(
      (f) =>
        f.status === "accepted" &&
        (f.sender._id === id || f.receiver._id === id)
    );
    hasPendingRequest = friendRequests.some(
      (req) => req.sender._id === id || req.receiver._id === id
    );
  }

  // Arkadaşlık isteği gönder
  const handleSendRequest = async () => {
    if (!currentUser) return;
    await dispatch(
      sendFriendRequest({
        receiverId: id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
      })
    );
    dispatch({
      type: "friend/fetchFriendRequests/fulfilled",
      payload: [
        ...friendRequests,
        {
          sender: {
            _id: currentUser._id,
            name: currentUser.name,
            avatar: currentUser.avatar,
          },
          receiver: { _id: id },
          status: "pending",
        },
      ],
    });
  };

  // Gönderilen isteği geri çek
  const handleCancelRequest = () => {
    const request = friendRequests.find(
      (req) => req.sender._id === currentUser._id && req.receiver._id === id
    );
    if (request) {
      dispatch(deleteFriendRequest(request._id));
    }
  };

  // Pagination logic
  const totalPosts = userPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = userPosts.slice(startIndex, endIndex);

  // Sayfa butonuna tıklayınca
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: document.getElementById('posts-section').offsetTop - 100, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <Edit3 className="h-4 w-4 text-white" />
              </div>
              <h1 className="ml-2 text-gray-900 text-lg font-semibold">Design<span className="text-yellow-500">Studio</span></h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push("/blog")}
                className="text-gray-600 hover:text-yellow-500 flex items-center text-sm font-medium transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Blog
              </button>
              {isOwnProfile && (
                <button 
                  onClick={() => router.push("/profile")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BANNER */}
      <div className="relative w-full h-64 md:h-80 bg-gradient-to-r from-yellow-300 to-purple-300 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-50 ">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-yellow-100"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-white"></div>
          <div className="absolute top-20 right-20 w-20 h-20 rounded-full bg-white"></div>
        </div>
        
        <div className="absolute inset-0 flex items-end px-6 md:px-16 pb-32 md:pb-40">
          <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight">
            {isOwnProfile ? "Kişisel Profiliniz" : `${profile.name}'in Portfolyosu`}
          </h1>
        </div>
      </div>

      {/* PROFILE CARD - FLOATING */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-24 z-10">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="md:flex">
            {/* Profile Sidebar */}
            <div className="md:w-1/3 bg-yellow-50 p-8">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                  <Image
                    src={profile.avatar || "/default-avatar.png"}
                    alt="Profile Picture"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Name & Social Info */}
                <h2 className="text-2xl font-bold text-gray-800 text-center">{profile.name}</h2>
                <p className="text-yellow-600 font-medium mb-4">@{profile.nickName || "kullanici"}</p>

                {/* Buttons */}
                <div className="w-full mb-6 flex flex-col space-y-3">
                  {/* Friendship Button */}
                  {!isOwnProfile && (
                    isFriend ? (
                      <div className="flex items-center justify-center py-2 px-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Arkadaşsınız</span>
                      </div>
                    ) : hasPendingRequest ? (
                      <button
                        onClick={handleCancelRequest}
                        className="w-full py-2 px-4 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 transition rounded-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        İstek Gönderildi
                      </button>
                    ) : (
                      <button
                        onClick={handleSendRequest}
                        className="w-full py-2 px-4 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white transition rounded-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Arkadaşlık İsteği
                      </button>
                    )
                  )}
                  
                  {/* Edit profile button (only shows on own profile) */}
                  {isOwnProfile && (
                    <button
                      onClick={() => router.push("/profile")}
                      className="w-full py-2 px-4 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white transition rounded-lg"
                    >
                      <Edit3 className="h-5 w-5 mr-2" />
                      Profili Düzenle
                    </button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="w-full mt-4 space-y-4">
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{profile.gender || "Belirtilmemiş"}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    <span>{profile.country || "Belirtilmemiş"}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span>{profile.language || "İngilizce"}</span>
                  </div>

                  {profile.email && (
                    <div className="flex items-center text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <Link href={`mailto:${profile.email}`} className="text-yellow-600 hover:underline">
                        {profile.email}
                      </Link>
                    </div>
                  )}

                  {profile.website && (
                    <div className="flex items-center text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <Link 
                        href={profile.website.startsWith("http") ? profile.website : `http://${profile.website}`}
                        className="text-yellow-600 hover:underline"
                        target="_blank"
                      >
                        {profile.website}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:w-2/3 p-8">
              {/* About Section */}
              <div>
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Hakkımda</h3>
                  <div className="ml-3 flex-grow h-px bg-gray-200"></div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <p className="text-gray-700 leading-relaxed">
                    {profile.bio || "Henüz bir biyografi eklenmemiş."}
                  </p>
                </div>
              </div>

              {/* Stats/Summary Section */}
              <div className="mt-10">
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">İstatistikler</h3>
                  <div className="ml-3 flex-grow h-px bg-gray-200"></div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Post Count */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-3xl font-bold text-yellow-500">{userPosts.length}</div>
                    <div className="text-sm text-gray-500">Toplam Post</div>
                  </div>
                  
                  {/* Friends Count - Placeholder since we don't have actual count */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-3xl font-bold text-yellow-500">
                      {friends.filter(f => 
                        f.status === "accepted" && 
                        (f.sender._id === profile._id || f.receiver._id === profile._id)
                      ).length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Arkadaş</div>
                  </div>
                  
                  {/* Date Joined - Using a placeholder value */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-lg font-medium text-yellow-500">
                      {new Date().toLocaleDateString('tr-TR', {year: 'numeric', month: 'short'})}
                    </div>
                    <div className="text-sm text-gray-500">Katılım Tarihi</div>
                  </div>
                </div>
                
                {/* Back to Blog link */}
                <div className="mt-8">
                  <button 
                    onClick={() => router.push("/blog")}
                    className="flex items-center text-yellow-600 hover:text-yellow-800 font-medium transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Blog Sayfasına Dön
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POSTS GRID */}
      <section id="posts-section" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10 flex items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {isOwnProfile ? "Paylaşımlarım" : `${profile.name}'in Paylaşımları`}
          </h2>
          <div className="ml-4 flex-grow h-px bg-gray-200"></div>
        </div>

        {currentPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-yellow-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <p className="text-lg text-gray-600">
              Henüz paylaşılmış bir içerik bulunamadı.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post, idx) => (
              <div
                key={post._id || idx}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group border border-gray-100"
              >
                {/* Kapak Resmi */}
                <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                  <Image
                    src={
                      post.images && post.images.length > 0
                        ? post.images[0]
                        : "/placeholder.jpg"
                    }
                    alt={post.title || "Post"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* İçerik */}
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                      Blog
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {new Date().toLocaleDateString('tr-TR', {day: 'numeric', month: 'short'})}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-yellow-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-3">
                    {post.author?.name || "Anonim"}
                  </p>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {post.description || post.content?.substring(0, 100)}...
                  </p>
                  
                  <Link
                    href={`/blog/${post._id}`}
                    className="inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-800"
                  >
                    Devamını Oku
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center rounded-lg bg-white shadow-sm border border-gray-100">
              <button
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm rounded-l-lg ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === currentPage;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 text-sm border-l border-r border-gray-100
                      ${
                        isActive
                          ? "bg-yellow-50 text-yellow-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm rounded-r-lg ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}