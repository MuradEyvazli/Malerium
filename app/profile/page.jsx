"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/app/features/UserSlice";
import { useRouter } from "next/navigation";
import { Camera, Globe, User, MapPin, Clock, MessageCircle, Link as LinkIcon, Edit3, Save, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state) => state.user.currentUser);
  const fileInputRef = useRef(null);

  // Form fields (State)
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [emails, setEmails] = useState([]);
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [activeSection, setActiveSection] = useState("personal");

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load current user data
  useEffect(() => {
    if (currentUser) {
      setAvatar(currentUser.avatar || "");
      setName(currentUser.name || "");
      setNickName(currentUser.nickName || "No Nickname");
      setGender(currentUser.gender || "Not specified");
      setCountry(currentUser.country || "Not specified");
      setLanguage(currentUser.language || "English");
      setTimeZone(currentUser.timeZone || "");
      setEmails(currentUser.email ? [currentUser.email] : []);
      setBio(currentUser.bio || "");
      setWebsite(currentUser.website || "");
    }
  }, [currentUser]);

  // Avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Submit form (Update Profile)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Create FormData
      const formData = new FormData();
      // If a new file is selected, add it, otherwise send the current URL
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      } else {
        formData.append("avatar", avatar);
      }
      formData.append("name", name.trim() || currentUser.name);
      formData.append("nickName", nickName.trim() || currentUser.nickName || "No Nickname");
      formData.append("gender", gender.trim() || currentUser.gender || "Not specified");
      formData.append("country", country.trim() || currentUser.country || "Not specified");
      formData.append("language", language.trim() || currentUser.language || "English");
      formData.append("timeZone", timeZone.trim() || currentUser.timeZone);
      formData.append("bio", bio.trim() || currentUser.bio || "");
      formData.append("website", website.trim() || currentUser.website || "");

      const response = await axios.patch("/api/auth/update-profile", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      dispatch(setUser(response.data.updatedUser));
      
      // Success animation
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push("/blog");
      }, 1500);
    } catch (error) {
      console.error("Profile could not be updated:", error);
    } finally {
      setLoading(false);
    }
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
                <ChevronRight className="h-4 w-4 mr-1 transform rotate-180" />
                Back to Blog
              </button>
              {currentUser ? (
  <Link href={`/profile/${currentUser._id || currentUser.id}`} 
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
  >
    <User className="h-4 w-4 mr-1" />
    View Profile
  </Link>
) : (
  <button 
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center opacity-50 cursor-not-allowed"
    disabled
  >
    <User className="h-4 w-4 mr-1" />
    View Profile
  </button>
)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Message */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center z-50 animate-fadeIn">
          <Save className="mr-2 h-5 w-5" />
          Profile successfully updated!
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative bg-yellow-50 h-48">
            {/* Header Decorative Elements */}
            <div className="absolute top-0 left-0 right-0 h-full bg-pattern-dots opacity-5"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-yellow-100 to-transparent"></div>
            
            {/* Header Content */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative" onClick={triggerFileInput}>
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-white cursor-pointer">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt="Profile"
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-yellow-100 flex items-center justify-center">
                      <User className="h-12 w-12 text-yellow-300" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Camera className="h-4 w-4 text-white" />
                </div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                />
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="pt-20 px-8 pb-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {name || "Your Name"}
                </h1>
                <div className="flex items-center mt-1">
                  <p className="text-gray-500 font-medium mr-4">@{nickName || "nickname"}</p>
                  {emails[0] && (
                    <span className="text-gray-600 text-sm">
                      {emails[0]}
                    </span>
                  )}
                </div>
                
                {/* Bio (summary view) */}
                {bio && (
                  <p className="mt-3 text-gray-600 max-w-2xl text-sm border-l-2 border-yellow-400 pl-3">
                    "{bio.length > 100 ? bio.substring(0, 100) + "..." : bio}"
                  </p>
                )}
              </div>  
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="border-t border-gray-200 px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveSection("personal")}
                className={`py-4 px-1 text-sm font-medium relative ${
                  activeSection === "personal"
                    ? "text-yellow-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Personal Information
                </span>
                {activeSection === "personal" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></span>
                )}
              </button>
              <button
                onClick={() => setActiveSection("location")}
                className={`py-4 px-1 text-sm font-medium relative ${
                  activeSection === "location"
                    ? "text-yellow-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Location & Contact
                </span>
                {activeSection === "location" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Form Area */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {activeSection === "personal" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 pb-3 border-b border-gray-200 flex items-center">
                  <User className="h-5 w-5 mr-2 text-yellow-500" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  {/* Nick Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nick Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-gray-400">@</span>
                      <input
                        type="text"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                        placeholder="Your Nick Name"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 appearance-none"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute right-4 top-2.5 pointer-events-none">
                        <ChevronRight className="h-4 w-4 text-gray-400 transform rotate-90" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell something about yourself..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "location" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 pb-3 border-b border-gray-200 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-yellow-500" />
                  Location & Contact
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Country */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Your Country"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  {/* Language */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-2.5 h-4 w-4 text-gray-400" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 appearance-none"
                      >
                        <option value="">Select</option>
                        <option value="english">English</option>
                        <option value="turkish">Turkish</option>
                        <option value="german">German</option>
                        <option value="french">French</option>
                      </select>
                      <div className="absolute right-4 top-2.5 pointer-events-none">
                        <ChevronRight className="h-4 w-4 text-gray-400 transform rotate-90" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Time Zone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Time Zone
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                        placeholder="e.g. Europe/Istanbul"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  {/* Website */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://your-website.com"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Save Button */}
            <div className="mt-8 pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    onClick={() => router.push("/blog")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        Update Profile
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Extra CSS */}
      <style jsx global>{`
        .bg-pattern-dots {
          background-image: radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}