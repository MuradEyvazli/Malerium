"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HexColorPicker } from "react-colorful";
import { Copy, Search, Download, Palette, Camera, X, RefreshCw } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { extractColors } from "extract-colors";

// Popular color schemes and design trends
const POPULAR_QUERIES = [
  { name: "Minimalist", color: "#F5F5F5" },
  { name: "Nordic", color: "#E0E6E9" },
  { name: "Neon", color: "#00FFAA" },
  { name: "Pastel", color: "#FFD6E0" },
  { name: "Vintage", color: "#D4A373" },
  { name: "Cyberpunk", color: "#F900FD" },
  { name: "Earth Tones", color: "#6B705C" },
  { name: "Ocean", color: "#48CAE4" },
  { name: "Forest", color: "#2D6A4F" },
  { name: "Sunset", color: "#FF7D00" },
];

// Predefined bubble positions to ensure deterministic rendering
const BUBBLES = [
  { width: 160, height: 110, left: "15%", top: "20%", x: 40, y: -30 },
  { width: 120, height: 120, left: "35%", top: "60%", x: -20, y: 40 },
  { width: 180, height: 180, left: "65%", top: "15%", x: 50, y: 20 },
  { width: 100, height: 100, left: "80%", top: "50%", x: -40, y: -20 },
  { width: 140, height: 140, left: "20%", top: "80%", x: 30, y: 30 },
  { width: 200, height: 200, left: "50%", top: "30%", x: -30, y: -40 },
  { width: 90, height: 90, left: "75%", top: "70%", x: 20, y: -35 },
  { width: 150, height: 150, left: "10%", top: "40%", x: -25, y: 25 },
  { width: 110, height: 110, left: "60%", top: "85%", x: 35, y: -15 },
  { width: 130, height: 130, left: "30%", top: "10%", x: -15, y: 45 },
  { width: 170, height: 170, left: "85%", top: "25%", x: 25, y: 30 },
  { width: 95, height: 95, left: "45%", top: "75%", x: -45, y: -25 },
  { width: 125, height: 125, left: "5%", top: "55%", x: 15, y: 20 },
  { width: 145, height: 145, left: "70%", top: "5%", x: -20, y: 40 },
  { width: 115, height: 115, left: "25%", top: "65%", x: 30, y: -30 },
];

// Random search terms for initial load
const RANDOM_SEARCH_TERMS = [
  "nature", "cityscape", "abstract", "animals", "beach", 
  "mountains", "flowers", "architecture", "food", "people",
  "technology", "travel", "art", "water", "sky"
];

// Client-side only animated bubbles component
const AnimatedBubbles = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  // Only render on client-side to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {BUBBLES.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm"
          style={{
            width: bubble.width,
            height: bubble.height,
            left: bubble.left,
            top: bubble.top,
          }}
          animate={{
            x: [0, bubble.x],
            y: [0, bubble.y],
          }}
          transition={{
            duration: 10 + (i % 5),
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Toast notification component
const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Page() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#6366F1");
  const [activeImageColors, setActiveImageColors] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });

  const observer = useRef();
  const searchInputRef = useRef(null);

  // Show toast notification
  const showToast = (message) => {
    setToast({ visible: true, message });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast({ visible: false, message: "" });
  };

  // Fetch random images on initial load
  const fetchRandomImages = async () => {
    setInitialLoading(true);
    try {
      // Select a random search term
      const randomTerm = RANDOM_SEARCH_TERMS[Math.floor(Math.random() * RANDOM_SEARCH_TERMS.length)];
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(randomTerm)}&page=1`);
      if (!response.ok) {
        throw new Error("Failed to fetch initial images");
      }
      
      const data = await response.json();
      setImages(data.results);
      
      // Set the query to match what was searched
      setQuery(randomTerm);
      
    } catch (err) {
      console.error("Error fetching random images:", err);
      setError("Could not load initial images");
    } finally {
      setInitialLoading(false);
    }
  };

  // Fetch images with a debounce to avoid too many API calls
  const debouncedFetch = useDebouncedCallback((q, pageNum) => {
    fetchImages(q, pageNum);
  }, 500);

  // Function to fetch more random images
  const fetchMoreRandomImages = () => {
    const randomTerm = RANDOM_SEARCH_TERMS[Math.floor(Math.random() * RANDOM_SEARCH_TERMS.length)];
    setQuery(randomTerm);
    handleSearch(randomTerm);
  };

  // Function to fetch images from API (with minimum loading time of 1.5 seconds)
  const fetchImages = async (q, pageNum) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    const startTime = Date.now();
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}&page=${pageNum}`);
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Search error");
      }
      
      const data = await response.json();
      
      // If results count is less than 20, there are no more results
      if (data.results.length < 20) {
        setHasMore(false);
      }
      
      // If page 1, reset images, otherwise append
      if (pageNum === 1) {
        setImages(data.results);
      } else {
        setImages((prev) => [...prev, ...data.results]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(1500 - elapsed, 0);
      setTimeout(() => {
        setLoading(false);
      }, delay);
    }
  };

  // Handle search submission
  const handleSearch = (searchTerm) => {
    const q = searchTerm ?? query;
    if (!q.trim()) return;
    setQuery(q);
    setPage(1);
    setHasMore(true);
    debouncedFetch(q, 1);
  };

  // Handle color selection from the color picker
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    handleSearch(color);
    setColorPickerOpen(false);
  };

  // Handle click on popular query tag
  const handlePopularClick = (tag) => {
    setSelectedColor(tag.color);
    handleSearch(tag.name);
  };

  // Extract color palette from an image
  const extractImageColors = async (imageUrl) => {
    try {
      // Create an image element to load the image
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      // Extract colors from the image
      const colors = await extractColors(img, {
        pixels: 10000, // Number of pixels to sample
        distance: 0.12, // Color distance threshold
        saturationDistance: 0.2,
        lightnessDistance: 0.2,
        hueDistance: 0.1,
      });
      
      return colors.slice(0, 6); // Return top 6 colors
    } catch (error) {
      console.error("Error extracting colors:", error);
      return [];
    }
  };

  // Handle image click to show color palette
  const handleImageClick = async (image) => {
    setPreviewImage(image);
    setActiveImageColors([]); // Reset colors
    
    // Extract colors from the image
    const colors = await extractImageColors(image.small);
    setActiveImageColors(colors);
  };

  // Close the preview panel
  const closePreview = () => {
    setPreviewImage(null);
    setActiveImageColors(null);
  };

  // Copy color to clipboard
  const copyColorToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    showToast(`Copied ${color} to clipboard`);
  };

  // Download color palette as JSON
  const downloadPalette = () => {
    if (!activeImageColors) return;
    
    const paletteData = {
      name: previewImage?.alt_description || "Color Palette",
      colors: activeImageColors.map(c => c.hex),
      source: previewImage?.small,
    };
    
    const dataStr = JSON.stringify(paletteData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", `palette-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Palette downloaded successfully");
  };

  // Intersection Observer for infinite scrolling
  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch more images when page changes
  useEffect(() => {
    if (page === 1) return; // First page is already fetched by handleSearch
    fetchImages(query, page);
  }, [page]);

  // Load random images on initial render
  useEffect(() => {
    fetchRandomImages();
  }, []);

  // Handle keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        visible={toast.visible}
        onClose={hideToast}
      />
      
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-500 via-gray-500 to-yellow-500 h-80 md:h-96 mb-8 md:mb-16">
        <div className="absolute inset-0" style={{ background: "url('/noise.svg') repeat", opacity: 0.1 }}></div>
        
        {/* Client-side only animated bubbles */}
        <AnimatedBubbles />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 md:mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Color<span className="text-yellow-300">Search</span>
          </motion.h1>
          
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl mx-auto mb-5 md:mb-8 text-white/80 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover perfect color palettes for your designs
          </motion.p>
          
          {/* Search Bar */}
          <motion.div
            className="w-full max-w-2xl relative px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by color, mood, or theme..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 text-base sm:text-lg"
              />
              
              <button
                onClick={() => handleSearch()}
                className="absolute right-4 text-white/70 hover:text-white"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              
              <button
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
                className="absolute right-14 sm:right-16 flex items-center justify-center"
                aria-label="Color Picker"
              >
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/30"
                  style={{ backgroundColor: selectedColor }}
                ></div>
              </button>
            </div>
            
            {/* Color Picker Dropdown */}
            <AnimatePresence>
              {colorPickerOpen && (
                <motion.div
                  className="absolute mt-2 right-8 sm:right-16 bg-white rounded-lg shadow-xl p-3 sm:p-4 z-20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-slate-800 font-mono text-sm sm:text-base">{selectedColor}</div>
                    <button
                      onClick={() => handleColorSelect(selectedColor)}
                      className="px-2 sm:px-3 py-1 bg-indigo-500 text-white text-xs sm:text-sm rounded-md hover:bg-indigo-600"
                    >
                      Search
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="text-xs text-white/60 mt-2 text-center">
              Press <kbd className="px-1 sm:px-2 py-0.5 bg-white/10 rounded-md mx-1">⌘ K</kbd> to search
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Popular Tags */}
      <div className="container mx-auto px-4 -mt-8">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-3 sm:p-4 flex flex-wrap items-center justify-center gap-1 sm:gap-2 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <span className="text-xs sm:text-sm text-slate-400 mr-1 sm:mr-2">Popular:</span>
          {POPULAR_QUERIES.map((tag) => (
            <button
              key={tag.name}
              onClick={() => handlePopularClick(tag)}
              className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-all group"
            >
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: tag.color }}
              ></div>
              <span>{tag.name}</span>
            </button>
          ))}
        </motion.div>
      </div>
      
      {/* Random Images Button */}
      <div className="container mx-auto px-4 mb-4 flex justify-center">
        <button
          onClick={fetchMoreRandomImages}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
        >
          <RefreshCw size={16} />
          <span>Refresh with Random Images</span>
        </button>
      </div>
      
      {/* Loading State */}
      {(loading || initialLoading) && (
        <div className="container mx-auto px-4 mt-6 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-4 h-4 rounded-full bg-indigo-500 animate-ping opacity-75"></div>
            <p className="text-sm text-slate-700">Searching for perfect colors...</p>
          </motion.div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 mt-6 text-center">
          <p className="text-sm text-red-500 bg-red-50 inline-block px-4 py-2 rounded-md">
            {error}
          </p>
        </div>
      )}
      
      {/* Image Grid */}
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {images.map((img, index) => {
            const isLastElement = images.length === index + 1;
            
            return (
              <motion.div
                key={img.id}
                ref={isLastElement ? lastImageRef : null}
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index % 10 * 0.05 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={img.small}
                    alt={img.alt_description || "Unsplash image"}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <button
                    onClick={() => handleImageClick(img)}
                    className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                    aria-label="View color palette"
                  >
                    <Palette size={18} />
                  </button>
                </div>
                
                <div className="p-3">
                  <p className="text-slate-700 line-clamp-1 text-xs sm:text-sm">
                    {img.alt_description || "Untitled image"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">by {img.user}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* End of content message */}
        {!loading && !hasMore && images.length > 0 && (
          <div className="text-center mt-8 mb-6">
            <p className="text-sm text-slate-500">No more images to load</p>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !initialLoading && images.length === 0 && !error && (
          <div className="text-center py-16 sm:py-20">
            <Camera size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg sm:text-xl text-slate-600 mb-2">No images found</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base">
              Try searching for different colors, themes, or moods to find inspiring images
            </p>
          </div>
        )}
      </div>
      
      {/* Color Palette Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreview}
          >
            <motion.div
              className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                {/* Image */}
                <div className="md:w-1/2 h-56 sm:h-64 md:h-auto relative overflow-hidden">
                  <img
                    src={previewImage.small}
                    alt={previewImage.alt_description || "Selected image"}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Color palette */}
                <div className="md:w-1/2 p-4 sm:p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-medium text-slate-800">Color Palette</h3>
                    <button 
                      onClick={closePreview} 
                      className="text-slate-400 hover:text-slate-600 p-1"
                      aria-label="Close"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* Colors */}
                  <div className="space-y-4">
                    {activeImageColors ? (
                      activeImageColors.length > 0 ? (
                        <>
                          <div className="flex overflow-hidden rounded-lg h-16 sm:h-20 mb-4 sm:mb-6 shadow-sm">
                            {activeImageColors.map((color, i) => (
                              <div
                                key={i}
                                className="flex-1"
                                style={{ backgroundColor: color.hex }}
                              ></div>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {activeImageColors.map((color, i) => (
                              <div
                                key={i}
                                className="flex items-center p-2 sm:p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                <div
                                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-md mr-2 sm:mr-3 shadow-sm"
                                  style={{ backgroundColor: color.hex }}
                                ></div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs sm:text-sm font-mono text-slate-700 truncate">{color.hex}</div>
                                  <div className="text-xs text-slate-500">
                                    {Math.round(color.area * 100)}%
                                  </div>
                                </div>
                                <button
                                  onClick={() => copyColorToClipboard(color.hex)}
                                  className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700"
                                  title="Copy color"
                                  aria-label={`Copy color ${color.hex}`}
                                >
                                  <Copy size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-end pt-4">
                            <button
                              onClick={downloadPalette}
                              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-50 text-indigo-600 text-sm rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                              <Download size={16} />
                              <span>Download Palette</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="py-8 sm:py-10 text-center text-slate-500">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="mx-auto mb-4 w-8 h-8 border-2 border-slate-300 border-t-indigo-500 rounded-full"
                          ></motion.div>
                          <p>Extracting colors...</p>
                        </div>
                      )
                    ) : (
                      <div className="py-8 sm:py-10 text-center text-slate-500">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="mx-auto mb-4 w-8 h-8 border-2 border-slate-300 border-t-indigo-500 rounded-full"
                        ></motion.div>
                        <p>Extracting colors...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}