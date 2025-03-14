"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Globe, Mail, User, Languages } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileCard({ currentUser, friendsCount, onShowFriends }) {
  if (!currentUser) return null;

  return (
    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Üst Kapak (Cover) */}
      <div className="h-24" />

      {/* Kullanıcı Bilgisi Kartı */}
      <div className="p-6 pt-0 -mt-12 relative z-10">
        {/* Avatar + İsim/Bio */}
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden">
            <Image
              src={
                currentUser.avatar ||
                "https://images.pexels.com/photos/30469688/pexels-photo-30469688.jpeg"
              }
              alt="Profile Picture"
              fill
              className="object-cover"
            />
            
            <div className="relative">
             </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentUser?.name || "John Doe"}
            </h2>
            <p className="text-sm text-gray-600 italic mt-1">
              {currentUser?.bio || "No Bio Yet"}
            </p>
          </div>
        </div>

        {/* Ana Bilgiler */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <p className="text-gray-800 font-medium">
              <span className="text-gray-600">Email:</span>{" "}
              <Link
                href={`mailto:${currentUser?.email}`}
                className="text-blue-600 hover:underline"
              >
                {currentUser?.email || "test@gmail.com"}
              </Link>
            </p>
          </div>
          {/* Nickname */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <p className="text-gray-800 font-medium">
              <span className="text-gray-600">Nickname:</span>{" "}
              {currentUser?.nickName || "fakeNick"}
            </p>
          </div>
          {/* Gender */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <p className="text-gray-800 font-medium">
              <span className="text-gray-600">Gender:</span>{" "}
              {currentUser?.gender || "Not specified"}
            </p>
          </div>
          {/* Language */}
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-500" />
            <p className="text-gray-800 font-medium">
              <span className="text-gray-600">Language:</span>{" "}
              {currentUser?.language || "Not specified"}
            </p>
          </div>
          {/* Website */}
          <div className="flex items-center gap-2 col-span-full">
            <Globe className="w-4 h-4 text-gray-500" />
            <p className="text-gray-800 font-medium break-all">
              <span className="text-gray-600">Website:</span>{" "}
              <Link
                href={`https://${currentUser?.website || ""}`}
                className="text-blue-600 hover:underline"
              >
                {currentUser?.website || "fakewebsite.com"}
              </Link>
            </p>
          </div>
        </div>

        {/* Arkadaş Sayısı */}
        <div className="mt-6 flex items-center gap-3">
          <p className="text-sm text-gray-700">
            <strong>Arkadaş Sayısı:</strong> {friendsCount}
          </p>
          <button
            className="text-xs text-blue-600 underline hover:text-blue-800 transition"
            onClick={onShowFriends}
          >
            Gör
          </button>
        </div>

        {/* Butonlar */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/profile" legacyBehavior>
            <a className="py-3 bg-white border border-blue-600 text-blue-600 
                          rounded-full text-center font-semibold hover:bg-blue-600 
                          hover:text-white transition flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Profilini Düzenle
            </a>
          </Link>
          <Link href={`/profile/${currentUser._id}`} legacyBehavior>
            <a className="py-3 bg-white border border-gray-700 text-gray-700 
                          rounded-full text-center font-semibold hover:bg-gray-700 
                          hover:text-white transition flex items-center justify-center gap-2">
              Kendi Profiline Git
              <ArrowRight className="h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
