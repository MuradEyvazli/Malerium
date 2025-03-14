"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, postAdded, postFailed } from "@/app/features/postSlice";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Upload,
  X,
  Check,
  Image as ImageIcon,
  Type,
  Camera,
  Video,
  Code,
  Lightbulb,
  PuzzlePiece,
  Box,
  ChevronLeft,
  Tag,
  InfoIcon,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Plus
} from "lucide-react";

// Tüm kategori seçenekleri
const availableCategories = [
  "UI/UX Tasarım",
  "İllüstrasyon",
  "Grafik Tasarım",
  "3D Modelleme",
  "Animasyon",
  "Dijital Sanat",
  "Fotoğrafçılık",
  "İç Mekan Tasarımı",
  "Reklam Tasarımı",
  "Tipografi",
];

// Kategori renkleri
const categoryColors = {
  "UI/UX Tasarım": { bg: "bg-blue-50", text: "text-blue-600", accent: "bg-blue-600", hover: "hover:bg-blue-100", shadow: "shadow-blue-100", border: "border-blue-200" },
  "İllüstrasyon": { bg: "bg-purple-50", text: "text-purple-600", accent: "bg-purple-600", hover: "hover:bg-purple-100", shadow: "shadow-purple-100", border: "border-purple-200" },
  "Grafik Tasarım": { bg: "bg-pink-50", text: "text-pink-600", accent: "bg-pink-600", hover: "hover:bg-pink-100", shadow: "shadow-pink-100", border: "border-pink-200" },
  "3D Modelleme": { bg: "bg-orange-50", text: "text-orange-600", accent: "bg-orange-600", hover: "hover:bg-orange-100", shadow: "shadow-orange-100", border: "border-orange-200" },
  "Animasyon": { bg: "bg-yellow-50", text: "text-yellow-600", accent: "bg-yellow-600", hover: "hover:bg-yellow-100", shadow: "shadow-yellow-100", border: "border-yellow-200" },
  "Dijital Sanat": { bg: "bg-green-50", text: "text-green-600", accent: "bg-green-600", hover: "hover:bg-green-100", shadow: "shadow-green-100", border: "border-green-200" },
  "Fotoğrafçılık": { bg: "bg-indigo-50", text: "text-indigo-600", accent: "bg-indigo-600", hover: "hover:bg-indigo-100", shadow: "shadow-indigo-100", border: "border-indigo-200" },
  "İç Mekan Tasarımı": { bg: "bg-red-50", text: "text-red-600", accent: "bg-red-600", hover: "hover:bg-red-100", shadow: "shadow-red-100", border: "border-red-200" },
  "Reklam Tasarımı": { bg: "bg-teal-50", text: "text-teal-600", accent: "bg-teal-600", hover: "hover:bg-teal-100", shadow: "shadow-teal-100", border: "border-teal-200" },
  "Tipografi": { bg: "bg-gray-50", text: "text-gray-600", accent: "bg-gray-600", hover: "hover:bg-gray-100", shadow: "shadow-gray-100", border: "border-gray-200" },
};

export default function AddPost() {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { loading, error } = useSelector((state) => state.post);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0);
  const [selectedPreview, setSelectedPreview] = useState(0);
  const [activeTab, setActiveTab] = useState("preview"); // "preview" veya "form"

  // Refs for form alanları
  const fileInputRef = useRef(null);
  const titleInputRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // Otomatik ilerleme çubuğu animasyonu
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setSavingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      setSavingProgress(0);
    }
  }, [loading]);

  // Dropdown dışında tıklandığında kapanmasını sağla
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Kategori seçimini yönetir
  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Dosya seçimi (resim ekleme)
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    if (newFiles.length > 0) {
      setImages((prevImages) => [...prevImages, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  // Drag and drop işlemleri
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      if (newFiles.length > 0) {
        setImages((prevImages) => [...prevImages, ...newFiles]);
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      }
    }
  };

  // Seçili resmi silme
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (selectedPreview === index) {
      setSelectedPreview(0);
    } else if (selectedPreview > index) {
      setSelectedPreview(selectedPreview - 1);
    }
  };

  // Formu (yeni proje) gönderir
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Proje paylaşabilmek için giriş yapmalısınız!");
      return;
    }

    if (images.length === 0) {
      toast.error("Lütfen en az bir resim seçiniz!");
      return;
    }

    // Eğer hiçbir kategori seçilmediyse, tüm kategorileri ekle
    const categoriesToSend =
      selectedCategories.length === 0 ? availableCategories : selectedCategories;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    images.forEach((img) => formData.append("images", img));
    formData.append("userId", currentUser._id);
    formData.append("username", currentUser.name);
    formData.append("categories", JSON.stringify(categoriesToSend));

    dispatch(startLoading());

    try {
      const response = await fetch("/api/auth/add-post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Proje eklenemedi!");
      }

      const data = await response.json();
      dispatch(postAdded(data.post));

      // Formu sıfırla
      setTitle("");
      setContent("");
      setImages([]);
      setPreviews([]);
      setSelectedCategories([]);

      toast.success("Proje başarıyla paylaşıldı!");
      setTimeout(() => {
        router.push("/blog");
      }, 2000);
    } catch (err) {
      dispatch(postFailed(err.message));
      console.error("Proje eklenirken hata oluştu:", err);
      toast.error("Proje eklenirken hata oluştu!");
    }
  };

  // Rastgele bir kategori arkaplan rengi ver
  const getRandomCategoryStyle = () => {
    const keys = Object.keys(categoryColors);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return categoryColors[randomKey];
  };

  // Mobil görünümde tab değiştirme
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      {/* Malerium Loading Animation */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="text-center">
            <div className="flex overflow-hidden">
              {["M", "A", "L", "E", "R", "I", "U", "M"].map((letter, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                    y: [-20, 0, 0, 20],
                    color: [
                      "#4F46E5", // indigo-600
                      "#8B5CF6", // violet-500
                      "#EC4899", // pink-500
                      "#3B82F6"  // blue-500
                    ]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    delay: index * 0.15,
                    ease: "easeInOut"
                  }}
                  className="text-5xl font-bold px-1"
                >
                  {letter}
                </motion.div>
              ))}
            </div>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 mt-4 rounded-full"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-gray-600"
            >
              Projeniz yükleniyor...
            </motion.p>
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm py-4 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link href="/blog" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Bloga Dön</span>
            </Link>
            
            {/* Save Button */}
            <button
              onClick={handleSubmit}
              className={`px-6 py-2.5 rounded-full text-white font-medium flex items-center gap-2 shadow-md transition-all ${
                loading || images.length === 0 || !title || !content 
                  ? "bg-gray-400 cursor-not-allowed opacity-70" 
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:from-blue-700 hover:to-indigo-700"
              }`}
              disabled={loading || images.length === 0 || !title || !content}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 text-white"
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Yayınla</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Mobil Tab Switcher */}
        <div className="md:hidden sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 p-2">
          <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <button
              className={`flex-1 py-2.5 text-center text-sm font-medium transition-all ${
                activeTab === "form" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => toggleTab("form")}
            >
              Proje Bilgileri
            </button>
            <button
              className={`flex-1 py-2.5 text-center text-sm font-medium transition-all ${
                activeTab === "preview" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => toggleTab("preview")}
            >
              Önizleme
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Yeni Proje Oluştur
            </h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Çalışmanızı paylaşın, tasarım topluluğunu etkileyin ve geri bildirim alın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Form */}
            <div 
              className={`md:col-span-5 lg:col-span-4 ${
                activeTab === "preview" ? "hidden md:block" : ""
              }`}
            >
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {/* Dosya Yükleme Bölümü */}
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-500" />
                    Görseller
                  </h2>
                  
                  <div 
                    className={`border-2 border-dashed rounded-xl transition-all relative ${
                      dragActive 
                        ? "border-indigo-500 bg-indigo-50" 
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
                        <Upload className="w-7 h-7 text-indigo-600" />
                      </div>
                      
                      <h3 className="text-gray-700 font-medium mb-2">
                        Dosyaları Buraya Sürükleyin
                      </h3>
                      
                      <p className="text-sm text-gray-500 mb-4">
                        veya
                      </p>
                      
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 inline-flex items-center gap-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        Dosya Seç
                      </button>
                      
                      <p className="text-xs text-gray-400 mt-4">
                        PNG, JPG veya GIF • Maksimum 10MB
                      </p>
                    </div>
                  </div>
                  
                  {/* Yüklenen Görseller */}
                  {previews.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-700">
                          Yüklenen Görseller ({previews.length})
                        </h3>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Daha Fazla Ekle
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {previews.map((src, index) => (
                          <div 
                            key={index} 
                            className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              selectedPreview === index 
                                ? "border-indigo-500 shadow-md" 
                                : "border-transparent hover:border-indigo-300"
                            }`}
                            onClick={() => setSelectedPreview(index)}
                          >
                            <Image
                              src={src}
                              alt={`Preview ${index + 1}`}
                              width={120}
                              height={120}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(index);
                                }}
                                className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-red-600 hover:bg-white transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Form Alanları */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-6">
                    {/* Başlık Alanı */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Type className="w-4 h-4 text-indigo-500" />
                        Proje Başlığı
                      </label>
                      <input
                        type="text"
                        placeholder="Projenize çarpıcı bir başlık verin..."
                        ref={titleInputRef}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    {/* İçerik Alanı */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Type className="w-4 h-4 text-indigo-500" />
                        Proje Detayları
                      </label>
                      <textarea
                        placeholder="Projenizi detaylı bir şekilde anlatın..."
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white resize-none"
                        rows="6"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                      />
                    </div>
                    
                    {/* Kategori Seçimi */}
                    <div className="relative" ref={categoryDropdownRef}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-indigo-500" />
                        Kategoriler
                      </label>
                      
                      <button
                        type="button"
                        className="w-full bg-gray-50 p-3 border border-gray-200 rounded-xl transition-all hover:border-indigo-300 flex items-center justify-between"
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      >
                        <span className="text-gray-600">
                          {selectedCategories.length > 0 
                            ? `${selectedCategories.length} kategori seçildi` 
                            : "Kategoriler seçin..."}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showCategoryDropdown ? "transform rotate-180" : ""}`} />
                      </button>
                      
                      {/* Seçilen kategoriler */}
                      {selectedCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedCategories.map((cat) => (
                            <span 
                              key={cat}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${categoryColors[cat].bg} ${categoryColors[cat].text}`}
                            >
                              {cat}
                              <button
                                type="button"
                                onClick={() => handleCategoryToggle(cat)}
                                className="ml-1 p-0.5 rounded-full hover:bg-white/50"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Dropdown content */}
                      <AnimatePresence>
                        {showCategoryDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-10 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                          >
                            <div className="max-h-64 overflow-y-auto p-2">
                              {availableCategories.map((cat) => (
                                <label
                                  key={cat}
                                  className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
                                    selectedCategories.includes(cat) 
                                      ? `${categoryColors[cat].bg} ${categoryColors[cat].text}` 
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => handleCategoryToggle(cat)}
                                  />
                                  <span className={`rounded-full w-3 h-3 ${categoryColors[cat].accent}`}></span>
                                  <span className="text-sm font-medium">{cat}</span>
                                </label>
                              ))}
                            </div>
                            <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                {selectedCategories.length} / {availableCategories.length} kategori seçildi
                              </span>
                              <button
                                type="button"
                                className="text-xs text-indigo-600 font-medium hover:text-indigo-700"
                                onClick={() => setShowCategoryDropdown(false)}
                              >
                                Tamam
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Tool icons */}
                    <div className="border-t border-gray-100 pt-6 mt-6">
                      <h3 className="text-sm font-medium text-gray-600 mb-4">
                        Tasarım Araçları
                      </h3>
                      <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                        <button type="button" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                          <span className="text-xs text-blue-700">Görsel</span>
                        </button>
                        <button type="button" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
                          <Type className="w-5 h-5 text-purple-600" />
                          <span className="text-xs text-purple-700">Metin</span>
                        </button>
                        <button type="button" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors">
                          <Camera className="w-5 h-5 text-pink-600" />
                          <span className="text-xs text-pink-700">Kamera</span>
                        </button>
                        <button type="button" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors">
                          <Video className="w-5 h-5 text-indigo-600" />
                          <span className="text-xs text-indigo-700">Video</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Info Card */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <InfoIcon className="w-5 h-5 text-indigo-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-indigo-800 mb-1">Yayın Öncesi Bilgi</h4>
                          <p className="text-xs text-indigo-600">
                            Projeniz yayınlandıktan sonra görüntüleme, beğeni ve yorum sayılarını takip edebileceksiniz. İçerik kılavuzlarımıza uygun içerik yayınladığınızdan emin olun.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Right Column: Preview */}
            <div 
              className={`md:col-span-7 lg:col-span-8 ${
                activeTab === "form" ? "hidden md:block" : ""
              }`}
            >
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    Proje Önizlemesi
                  </h2>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>Taslak</span>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* İçerik Önizlemesi */}
                  <div className="mb-8">
                    {/* Başlık */}
                    {title ? (
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
                    ) : (
                      <div className="h-10 bg-gray-100 rounded-md w-3/4 mb-4 animate-pulse"></div>
                    )}
                    
                    {/* Yazar Bilgisi */}
                    {currentUser && (
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={currentUser.avatar || "/fallback-avatar.png"}
                            alt={currentUser.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{currentUser.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Kategoriler */}
                    {selectedCategories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedCategories.map((cat) => (
                          <span 
                            key={cat} 
                            className={`px-3 py-1 text-xs font-medium rounded-full ${categoryColors[cat].bg} ${categoryColors[cat].text}`}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* İçerik */}
                    {content ? (
                      <p className="text-gray-700 whitespace-pre-line mb-8">{content}</p>
                    ) : (
                      <div className="space-y-3 mb-8">
                        <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                        <div className="h-4 bg-gray-100 rounded w-4/6 animate-pulse"></div>
                      </div>
                    )}
                    
                    {/* Ana Görsel / Görsel Galerisi */}
                    {previews.length > 0 ? (
                      <div className="space-y-6">
                        <div className="relative rounded-xl overflow-hidden aspect-video">
                          <Image
                            src={previews[selectedPreview]}
                            alt={title || "Proje Görseli"}
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>
                        
                        {/* Küçük Görseller / Slider */}
                        {previews.length > 1 && (
                          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                            {previews.map((src, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedPreview(index)}
                                className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-all ${
                                  selectedPreview === index 
                                    ? "ring-2 ring-indigo-500" 
                                    : "opacity-70 hover:opacity-100"
                                }`}
                              >
                                <Image
                                  src={src}
                                  alt={`Görsel ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-gray-100 aspect-video flex items-center justify-center">
                        <div className="text-center p-6">
                          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-sm">
                            Görsel önizlemesi için resim yükleyin
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Etkileşim Kısmı Önizlemesi */}
                  <div className="border-t border-gray-100 pt-6 mt-8">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-6">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors">
                          <div className="p-2 rounded-full bg-gray-50">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium">0 beğeni</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                          <div className="p-2 rounded-full bg-gray-50">
                            <Type className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium">0 yorum</span>
                        </button>
                        <div className="flex items-center gap-2 text-gray-500">
                          <div className="p-2 rounded-full bg-gray-50">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium">0 görüntülenme</span>
                        </div>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
                        <ArrowRight className="w-4 h-4" />
                        <span>Paylaş</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Yayınlama Bilgileri */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-50 text-green-600">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Görünürlük</h3>
                      <p className="text-sm text-gray-600">
                        Projeniz yayınlandığında tüm kullanıcılar tarafından görüntülenebilir olacak.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">İstatistikler</h3>
                      <p className="text-sm text-gray-600">
                        Beğeni, yorum ve görüntülenme istatistiklerini profilinizden takip edebilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm sm:col-span-2 lg:col-span-1">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-purple-50 text-purple-600">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Öne Çıkan</h3>
                      <p className="text-sm text-gray-600">
                        Yaratıcı ve özgün projeler editör seçkisinde öne çıkabilir ve daha fazla etkileşim alabilir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Save floating button on mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <button
          onClick={handleSubmit}
          className={`p-4 rounded-full shadow-lg flex items-center justify-center transition-all ${
            loading || images.length === 0 || !title || !content 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl"
          }`}
          disabled={loading || images.length === 0 || !title || !content}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 text-white"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          ) : (
            <Sparkles className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </>
  );
}