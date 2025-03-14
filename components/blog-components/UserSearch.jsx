"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { UserPlus } from "lucide-react";

export default function UserSearch({
  searchTerm,
  setSearchTerm,
  userLoading,
  fetchedUsers,
  currentUser,
  friendRequests,
  handleAddFriend,
  handleCancelFriendRequest,
  checkIsFriend,
  checkIsPending,
  findPendingRequestId,
}) {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xl">
      {/* Üst Başlık */}
      <div className="pb-4 mb-4 border-b border-gray-200">
        <h3 className="text-xl font-extrabold text-gray-800">Kullanıcı Ara</h3>
        <p className="text-sm text-gray-500 mt-1">
          Yeni arkadaşlar bulmak için hemen aramaya başlayın.
        </p>
      </div>

      {/* Arama Kutusu */}
      <div className="relative mb-6">
        {/* Arama ikonu */}
        <svg
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          <circle cx="11" cy="11" r="8" stroke="currentColor"></circle>
        </svg>
        <input
          type="text"
          placeholder="İsim girin..."
          className="w-full pl-10 pr-4 py-2 bg-white rounded-full 
                     text-gray-700 border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 
                     transition placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Kullanıcı Listesi */}
      <div className="space-y-3">
        {/* Yükleniyor Durumu */}
        {userLoading ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : fetchedUsers.filter((u) => u._id !== currentUser?._id).length > 0 ? (
          // Kullanıcılar var
          fetchedUsers
            .filter((u) => u._id !== currentUser?._id)
            .map((user) => {
              const isFriend = checkIsFriend(user._id);
              const isPending = checkIsPending(user._id);

              let pendingRequestId;
              if (isPending) {
                pendingRequestId = findPendingRequestId(user._id);
              }
              const pendingRequest = friendRequests?.find(
                (rq) => rq._id === pendingRequestId
              );
              const senderId = pendingRequest?.sender?._id || pendingRequest?.sender;
              const iAmSender = senderId === currentUser?._id;

              let buttonContent;
              if (isFriend) {
                buttonContent = (
                  <span className="text-xs font-medium text-green-600">
                    Artık Arkadaşsınız
                  </span>
                );
              } else if (isPending) {
                // İstek bekliyor
                if (iAmSender) {
                  buttonContent = (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleCancelFriendRequest(pendingRequestId);
                      }}
                      className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 
                                 text-white px-3 py-1 rounded-full text-sm transition"
                    >
                      İsteği Geri Çek
                    </button>
                  );
                } else {
                  buttonContent = (
                    <span className="text-sm font-medium text-yellow-600">
                      İstek Bekliyor
                    </span>
                  );
                }
              } else {
                // Arkadaş ekle butonu
                buttonContent = (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddFriend(user._id);
                    }}
                    className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-500 
                               text-white px-3 py-1 rounded-full text-sm transition"
                  >
                    <UserPlus size={16} />
                    <span>Arkadaş Ekle</span>
                  </button>
                );
              }

              return (
                <Link
                  key={user._id}
                  href={`/profile/${user._id}`}
                  className="block rounded-lg overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between bg-gray-50 
                               hover:bg-gray-100 border border-gray-200 
                               rounded-lg p-3 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative">
                        <Image
                          src={
                            user.avatar ||
                            "https://images.pexels.com/photos/30327309/pexels-photo-30327309/free-photo-of-6-2025.jpeg"
                          }
                          alt={user.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.name}
                      </span>
                    </div>
                    <div>{buttonContent}</div>
                  </div>
                </Link>
              );
            })
        ) : (
          // Hiç sonuç yok
          <p className="text-gray-500">Aradığınız kullanıcı bulunamadı.</p>
        )}
      </div>

      {/* Tüm Arkadaşlık İstekleri */}
      <div className="mt-6 text-right">
        <Link
          href="/blog/friends"
          className="inline-flex items-center gap-2 px-4 py-2 
                     bg-gray-800 hover:bg-gray-600 text-white 
                     font-semibold rounded-full transition"
        >
          <span>Tüm Arkadaşlık İstekleri</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
