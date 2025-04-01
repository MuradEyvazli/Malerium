"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineLogout, HiOutlineUser, HiOutlineUserGroup, HiX } from "react-icons/hi";

export default function SimplifiedFriendsModal({ show, onClose, currentUser, onLogout, friends = [] }) {
  // If modal is closed, don't render anything
  if (!show) return null;

  // Safe friends count with validation
  const friendsCount = Array.isArray(friends) ? friends.length : 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal box */}
      <div className="relative z-10 bg-white w-full max-w-md mx-4 p-5 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Profile</h2>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            <HiX className="h-5 w-5" />
          </button>
        </div>
        
        {/* User Profile Section - Simplified and Safe */}
        {currentUser ? (
          <div className="mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={currentUser.avatar || "/fallback-avatar.png"}
                  alt={currentUser.name || "User"}
                  width={60}
                  height={60}
                  className="rounded-full object-cover border-2 border-yellow-100"
                />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">{currentUser.name || "User"}</h4>
                <p className="text-sm text-gray-500">{currentUser.email || "No email provided"}</p>
              </div>
            </div>
            
            {/* Safe Navigation Options */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link 
                href={currentUser._id ? `/profile/${currentUser._id}` : "#"}
                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-yellow-50 rounded-lg transition-colors group"
                onClick={onClose}
              >
                <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full group-hover:bg-yellow-200 transition-colors">
                  <HiOutlineUser className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-yellow-700 transition-colors">Profile</p>
                </div>
              </Link>
              
              <Link 
                href="/blog/friends"
                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-yellow-50 rounded-lg transition-colors group"
                onClick={onClose}
              >
                <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full group-hover:bg-yellow-200 transition-colors">
                  <HiOutlineUserGroup className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-yellow-700 transition-colors">Friends</p>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-4 mb-4">
            <p className="text-gray-500">No user information available</p>
          </div>
        )}
        
        {/* Friends Count - Static Simple Display */}
        <div className="p-3 bg-gray-50 rounded-lg mb-4">
          <h3 className="text-sm font-medium text-gray-700">
            Friends · {friendsCount}
          </h3>
        </div>
        
        {/* Logout Button */}
        {currentUser && onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
}