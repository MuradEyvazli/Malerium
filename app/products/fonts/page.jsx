"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Download,
  Search,
  Heart,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowLeft,
  ArrowRight,
  Code,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Star,
  Settings,
  Sparkles,
  Globe,
  Moon,
  Sun,
} from "lucide-react";

// Custom hook for font loading status
const useFontLoading = () => {
  const [loadedFonts, setLoadedFonts] = useState({});
  
  const markFontAsLoaded = (fontFamily) => {
    setLoadedFonts(prev => ({...prev, [fontFamily]: true}));
  };
  
  const isFontLoaded = (fontFamily) => {
    return loadedFonts[fontFamily] || false;
  };
  
  return { markFontAsLoaded, isFontLoaded };
};

// Example font pairings (to be expanded)
const FONT_PAIRINGS = [
  { heading: "Roboto", body: "Open Sans", name: "Modern Clean" },
  { heading: "Playfair Display", body: "Source Sans Pro", name: "Classic Elegance" },
  { heading: "Montserrat", body: "Merriweather", name: "Contemporary Contrast" },
  { heading: "Oswald", body: "Lato", name: "Strong & Readable" },
  { heading: "Raleway", body: "Nunito", name: "Gentle Flow" },
  { heading: "Poppins", body: "Work Sans", name: "Friendly Professional" },
];

// Font categories with more descriptive names and icons
const FONT_CATEGORIES = [
  { value: "All", label: "All Categories", icon: <Globe className="w-4 h-4" /> },
  { value: "serif", label: "Serif (Elegant)", icon: <Moon className="w-4 h-4" /> },
  { value: "sans-serif", label: "Sans-Serif (Modern)", icon: <Sun className="w-4 h-4" /> },
  { value: "display", label: "Display (Distinctive)", icon: <Sparkles className="w-4 h-4" /> },
  { value: "handwriting", label: "Handwriting (Personal)", icon: <Heart className="w-4 h-4" /> },
  { value: "monospace", label: "Monospace (Technical)", icon: <Code className="w-4 h-4" /> },
];

// Font card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

// Color themes
const THEMES = [
  { name: "Ocean", primary: "bg-blue-500", secondary: "bg-cyan-400", accent: "bg-indigo-600" },
  { name: "Forest", primary: "bg-emerald-600", secondary: "bg-green-400", accent: "bg-yellow-500" },
  { name: "Sunset", primary: "bg-orange-500", secondary: "bg-red-400", accent: "bg-yellow-500" },
  { name: "Lavender", primary: "bg-purple-500", secondary: "bg-fuchsia-400", accent: "bg-violet-600" },
  { name: "Ash", primary: "bg-gray-700", secondary: "bg-gray-500", accent: "bg-gray-900" },
];

const FontExplorer = () => {
  // Core state
  const [fonts, setFonts] = useState([]);
  const [filteredFonts, setFilteredFonts] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [sampleText, setSampleText] = useState("Design with confidence");
  const [theme, setTheme] = useState(THEMES[1]); // Default to Forest theme
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [fontSize, setFontSize] = useState(32);
  const [isGridView, setIsGridView] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [copiedHTML, setCopiedHTML] = useState(false);
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [loadingState, setLoadingState] = useState("loading"); // loading, success, error
  const [activePairing, setActivePairing] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Refs and utility hooks
  const { markFontAsLoaded, isFontLoaded } = useFontLoading();
  const fontListRef = useRef(null);
  const fontsPerPage = isGridView ? 12 : 8;
  
  // Load fonts from Google Fonts API
  useEffect(() => {
    const fetchFonts = async () => {
      try {
        setLoadingState("loading");
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
        const response = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${apiKey}`
        );
        const data = await response.json();

        if (data.items) {
          setFonts(data.items);
          setFilteredFonts(data.items);
          setLoadingState("success");
          
          // After a slight delay, change initial load state to trigger animations
          setTimeout(() => setIsInitialLoad(false), 500);
        } else {
          setLoadingState("error");
        }
      } catch (err) {
        console.error("Font API error:", err);
        setLoadingState("error");
      }
    };

    fetchFonts();
    
    // Initialize favorites from localStorage if available
    const savedFavorites = localStorage.getItem("fontFavorites");
    if (savedFavorites) {
      setFavoritesList(JSON.parse(savedFavorites));
    }
    
    const savedRecent = localStorage.getItem("recentlyViewedFonts");
    if (savedRecent) {
      setRecentlyViewed(JSON.parse(savedRecent));
    }
  }, []);
  
  // Filter fonts based on search, category, and favorites
  useEffect(() => {
    if (!fonts.length) return;

    let filtered = fonts.filter((font) => {
      const matchSearch = font.family
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || font.category === selectedCategory;
      const matchFavorites = !showOnlyFavorites || favoritesList.includes(font.family);

      return matchSearch && matchCategory && matchFavorites;
    });

    setFilteredFonts(filtered);
    setCurrentPage(1);
    
    // Scroll to top when filters change
    if (fontListRef.current && !isInitialLoad) {
      fontListRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [searchTerm, selectedCategory, fonts, showOnlyFavorites, favoritesList, isInitialLoad]);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("fontFavorites", JSON.stringify(favoritesList));
  }, [favoritesList]);
  
  // Save recently viewed to localStorage when they change
  useEffect(() => {
    localStorage.setItem("recentlyViewedFonts", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Pagination calculation
  const lastIndex = currentPage * fontsPerPage;
  const firstIndex = lastIndex - fontsPerPage;
  const currentFonts = filteredFonts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredFonts.length / fontsPerPage);
  
  // Handle font actions
  const toggleFavorite = (fontFamily) => {
    setFavoritesList((prev) => {
      if (prev.includes(fontFamily)) {
        return prev.filter((fav) => fav !== fontFamily);
      } else {
        return [...prev, fontFamily];
      }
    });
  };
  
  const viewFontDetails = (fontFamily) => {
    // Update recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(name => name !== fontFamily);
      return [fontFamily, ...filtered].slice(0, 5);
    });
  };
  
  const downloadFont = (fontItem) => {
    const regularUrl = fontItem.files?.regular;
    if (!regularUrl) {
      alert("This font has no download link available!");
      return;
    }
    window.open(regularUrl, "_blank");
  };
  
  // Get embed code for a font
  const getGoogleFontLink = (fontFamily) => {
    return `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;700&display=swap" rel="stylesheet">`;
  };
  
  const getGoogleFontCSS = (fontFamily) => {
    return `font-family: '${fontFamily}', ${getFallbackFontFamily(fontFamily)};`;
  };
  
  const getFallbackFontFamily = (fontFamily) => {
    const font = fonts.find(f => f.family === fontFamily);
    if (!font) return "sans-serif";
    
    switch(font.category) {
      case "serif": return "serif";
      case "monospace": return "monospace";
      case "handwriting": return "cursive";
      case "display": return "sans-serif";
      default: return "sans-serif";
    }
  };
  
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "html") {
        setCopiedHTML(true);
        setTimeout(() => setCopiedHTML(false), 2000);
      } else {
        setCopiedCSS(true);
        setTimeout(() => setCopiedCSS(false), 2000);
      }
    });
  };
  
  // Navigation functions
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      if (fontListRef.current) {
        fontListRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };
  
  // Random font suggestion
  const suggestRandomFont = () => {
    const randomIndex = Math.floor(Math.random() * fonts.length);
    const randomFont = fonts[randomIndex];
    viewFontDetails(randomFont.family);
    
    // Temporarily highlight the font
    const element = document.getElementById(`font-${randomFont.family.replace(/\s+/g, '-')}`);
    if (element) {
      element.classList.add("ring-4", "ring-offset-2", "ring-primary");
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        element.classList.remove("ring-4", "ring-offset-2", "ring-primary");
      }, 2000);
    }
  };
  
  // Get theme class
  const getThemeClass = (type) => {
    switch (type) {
      case "primary": return theme.primary;
      case "secondary": return theme.secondary;
      case "accent": return theme.accent;
      default: return theme.primary;
    }
  };
  
  // Placeholder components for the loading state
  const FontCardSkeleton = () => (
    <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md animate-pulse p-4 h-48">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4"></div>
    </div>
  );
  
  const LoadingSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill().map((_, index) => (
        <FontCardSkeleton key={index} />
      ))}
    </div>
  );
  
  // Font card component with InView for animations
  const FontCard = ({ font, view }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });
    
    const isFavorite = favoritesList.includes(font.family);
    const googleFontLink = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.family)}:wght@400;700&display=swap`;
    
    // Load font dynamically
    React.useEffect(() => {
      if (!isFontLoaded(font.family)) {
        const linkElement = document.createElement("link");
        linkElement.href = googleFontLink;
        linkElement.rel = "stylesheet";
        document.head.appendChild(linkElement);
        
        linkElement.onload = () => {
          markFontAsLoaded(font.family);
        };
        
        return () => {
          // Actually don't remove fonts since they might be used elsewhere
        };
      }
    }, [font.family, googleFontLink]);
    
    return (
      <motion.div
        ref={ref}
        id={`font-${font.family.replace(/\s+/g, '-')}`}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        exit="exit"
        variants={cardVariants}
        className={`rounded-xl ${view === 'grid' ? '' : 'flex flex-col md:flex-row md:items-center'} 
                  bg-white dark:bg-gray-800 shadow-md hover:shadow-lg
                  p-4 md:p-6 transition-all duration-300 hover:-translate-y-1
                  border border-transparent hover:border-gray-200 dark:hover:border-gray-700
                  relative overflow-hidden`}
      >
        {/* Color indicator for font category */}
        <div className={`absolute top-0 left-0 w-full h-1 ${getThemeClass("secondary")}`}></div>
        
        <div className={`${view === 'grid' ? '' : 'md:w-1/3 md:pr-6'}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
              {font.family}
            </h3>
            
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toggleFavorite(font.family)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isFavorite
                          ? "bg-pink-100 text-pink-500 dark:bg-pink-900 dark:text-pink-300"
                          : "bg-gray-100 text-gray-400 hover:bg-pink-50 hover:text-pink-400 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFavorite ? "Remove from favorites" : "Add to favorites"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => downloadFont(font)}
                      className="p-1.5 rounded-full bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-400 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Download font</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {font.category}
            </Badge>
            {font.variants && (
              <Badge variant="outline" className="text-xs">
                {font.variants.length} {font.variants.length === 1 ? "style" : "styles"}
              </Badge>
            )}
          </div>
        </div>
        
        <div 
          className={`${view === 'grid' ? 'mt-4' : 'md:w-2/3 md:mt-0 mt-4'} 
                     bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-hidden`}
        >
          <p
            style={{ 
              fontFamily: isFontLoaded(font.family) ? font.family : "sans-serif",
              fontSize: `${fontSize}px`,
              lineHeight: 1.4,
            }}
            className={`transition-all duration-200 text-gray-800 dark:text-gray-100 ${!isFontLoaded(font.family) ? 'opacity-50' : 'opacity-100'}`}
          >
            {sampleText || "The quick brown fox jumps over the lazy dog"}
          </p>
        </div>
        
        {view !== 'grid' && (
          <div className="mt-4 md:mt-0 md:ml-4 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => {
                const htmlCode = getGoogleFontLink(font.family);
                copyToClipboard(htmlCode, "html");
              }}
            >
              {copiedHTML ? <Check className="w-3 h-3 mr-1" /> : <Code className="w-3 h-3 mr-1" />}
              {copiedHTML ? "Copied!" : "HTML"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => {
                const cssCode = getGoogleFontCSS(font.family);
                copyToClipboard(cssCode, "css");
              }}
            >
              {copiedCSS ? <Check className="w-3 h-3 mr-1" /> : <Code className="w-3 h-3 mr-1" />}
              {copiedCSS ? "Copied!" : "CSS"}
            </Button>
            
            <Button 
              size="sm" 
              className={`text-xs ${getThemeClass("primary")} text-white`}
              onClick={() => viewFontDetails(font.family)}
            >
              <Eye className="w-3 h-3 mr-1" />
              Details
            </Button>
          </div>
        )}
      </motion.div>
    );
  };
  
  // Font pairing card component
  const FontPairingCard = ({ pairing, active, onClick }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`cursor-pointer rounded-xl bg-white dark:bg-gray-800 shadow-md 
                   p-4 transition-all duration-300 
                   border-2 ${active ? `${getThemeClass("primary")} border-opacity-70` : 'border-transparent'}`}
        onClick={onClick}
      >
        <h3 
          style={{ fontFamily: pairing.heading }}
          className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2"
        >
          {pairing.name}
        </h3>
        <p
          style={{ fontFamily: pairing.body }}
          className="text-gray-600 dark:text-gray-300"
        >
          Perfect for creating a harmonious design balance.
        </p>
        <div className="mt-3 flex gap-2">
          <Badge variant="outline" className="text-xs">{pairing.heading}</Badge>
          <Badge variant="outline" className="text-xs">{pairing.body}</Badge>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* HERO HEADER */}
      <header 
        className={`relative overflow-hidden ${getThemeClass("primary")} text-white py-16 md:py-24 px-4`}
      >
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-opacity-20 bg-white"></div>
        <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-opacity-20 bg-white"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-opacity-10 bg-white"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
              Font <span className={`${getThemeClass("accent")} px-2 rounded`}>Explorer</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-light max-w-2xl mb-8 text-gray-100">
              Discover the perfect typography for your next design project with our curated collection of beautiful fonts.
            </p>
            
            {/* Search bar with animation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative max-w-lg"
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search fonts by name..."
                className="w-full pl-10 pr-4 py-3 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-lg shadow-lg focus:ring-2 focus:ring-white focus:ring-opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow container mx-auto max-w-6xl px-4 py-8">
        {/* CUSTOM TABS NAVIGATION */}
        <div className="mb-8">
          <div className="grid w-full grid-cols-3 max-w-md mx-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab("browse")}
              className={`flex items-center justify-center py-2 px-3 text-sm rounded-md transition-colors ${
                activeTab === "browse" 
                  ? `${getThemeClass("primary")} text-white` 
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Search className="w-4 h-4 mr-2" />
              Browse
            </button>
            <button
              onClick={() => setActiveTab("pairings")}
              className={`flex items-center justify-center py-2 px-3 text-sm rounded-md transition-colors ${
                activeTab === "pairings" 
                  ? `${getThemeClass("primary")} text-white` 
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Pairings
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center justify-center py-2 px-3 text-sm rounded-md transition-colors ${
                activeTab === "favorites" 
                  ? `${getThemeClass("primary")} text-white` 
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </button>
          </div>

          {/* Browse Fonts Tab Content */}
          {activeTab === "browse" && (
            <div className="mt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* SIDEBAR */}
                <div className="w-full md:w-64 flex-shrink-0">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold">Filters</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                        className="md:hidden"
                      >
                        {isFiltersExpanded ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </div>
                    
                    <div className={`space-y-6 ${isFiltersExpanded ? 'block' : 'hidden md:block'}`}>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Categories
                        </label>
                        <div className="space-y-2">
                          {FONT_CATEGORIES.map((category) => (
                            <button
                              key={category.value}
                              onClick={() => setSelectedCategory(category.value)}
                              className={`w-full flex items-center px-3 py-2 rounded-md text-sm
                                        transition-colors ${
                                          selectedCategory === category.value
                                            ? `${getThemeClass("primary")} text-white`
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                        }`}
                            >
                              <span className="mr-2">{category.icon}</span>
                              <span>{category.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Sample Text
                        </label>
                        <Input
                          type="text"
                          placeholder="Type your sample text..."
                          value={sampleText}
                          onChange={(e) => setSampleText(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Font Size: {fontSize}px
                        </label>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min={12}
                            max={72}
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-20 text-center"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setFontSize(prev => Math.min(72, prev + 2))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          View Options
                        </label>
                        <div className="flex space-x-2">
                          <Button
                            variant={isGridView ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsGridView(true)}
                            className="flex-1"
                          >
                            Grid
                          </Button>
                          <Button
                            variant={!isGridView ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsGridView(false)}
                            className="flex-1"
                          >
                            List
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Color Theme
                        </label>
                        <div className="flex space-x-2 flex-wrap gap-2">
                          {THEMES.map((themeOption) => (
                            <button
                              key={themeOption.name}
                              onClick={() => setTheme(themeOption)}
                              className={`w-6 h-6 rounded-full ${themeOption.primary} ${
                                theme.name === themeOption.name ? "ring-2 ring-offset-2 ring-gray-500" : ""
                              }`}
                              aria-label={`Set ${themeOption.name} theme`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        className="w-full"
                        onClick={suggestRandomFont}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Surprise Me
                      </Button>
                    </div>
                  </div>
                  
                  {/* Recently viewed */}
                  {recentlyViewed.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-4 hidden md:block">
                      <h2 className="text-lg font-bold mb-4">Recently Viewed</h2>
                      <ul className="space-y-2">
                        {recentlyViewed.map((fontFamily) => (
                          <li key={fontFamily}>
                            <button
                              className="text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                              onClick={() => {
                                // Find and scroll to the font in the list
                                const element = document.getElementById(`font-${fontFamily.replace(/\s+/g, '-')}`);
                                if (element) {
                                  element.scrollIntoView({ behavior: "smooth", block: "center" });
                                  element.classList.add("ring-2", "ring-offset-2", "ring-primary");
                                  setTimeout(() => {
                                    element.classList.remove("ring-2", "ring-offset-2", "ring-primary");
                                  }, 1500);
                                }
                              }}
                            >
                              <span style={{ fontFamily }}>{fontFamily}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* FONT LIST */}
                <div className="flex-grow" ref={fontListRef}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold">
                        {showOnlyFavorites ? "Favorite Fonts" : "Popular Fonts"}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {filteredFonts.length} fonts found
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                      >
                        {showOnlyFavorites ? <Eye className="w-4 h-4 mr-2" /> : <Heart className="w-4 h-4 mr-2" />}
                        {showOnlyFavorites ? "Show All" : "Favorites"}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Loading states */}
                  {loadingState === "loading" && <LoadingSkeletons />}
                  
                  {loadingState === "error" && (
                    <div className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-100 p-4 rounded-lg">
                      <p>Failed to load fonts. Please try again later.</p>
                    </div>
                  )}
                  
                  {/* Empty states */}
                  {loadingState === "success" && filteredFonts.length === 0 && (
                    <div className="text-center py-10">
                      <h3 className="text-lg font-medium mb-2">No fonts found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Try adjusting your search or filters
                      </p>
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("All");
                          setShowOnlyFavorites(false);
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                  
                  {/* Font grid/list */}
                  {loadingState === "success" && filteredFonts.length > 0 && (
                    <AnimatePresence>
                      <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col space-y-4"}>
                        {currentFonts.map((font) => (
                          <FontCard key={font.family} font={font} view={isGridView ? 'grid' : 'list'} />
                        ))}
                      </div>
                    </AnimatePresence>
                  )}
                  
                  {/* Pagination */}
                  {loadingState === "success" && filteredFonts.length > fontsPerPage && (
                    <div className="flex justify-between items-center mt-8">
                      <Button
                        variant="outline"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <Button
                        variant="outline"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Font Pairings Tab Content */}
          {activeTab === "pairings" && (
            <div className="mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Font Pairings</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Perfect font combinations for your next design project. Each pairing is carefully selected for visual harmony and readability.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {FONT_PAIRINGS.map((pairing, index) => (
                    <FontPairingCard 
                      key={index} 
                      pairing={pairing} 
                      active={index === activePairing}
                      onClick={() => setActivePairing(index)} 
                    />
                  ))}
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <h3 
                    style={{ fontFamily: FONT_PAIRINGS[activePairing].heading }}
                    className="text-2xl font-bold mb-3"
                  >
                    Heading with {FONT_PAIRINGS[activePairing].heading}
                  </h3>
                  <p 
                    style={{ fontFamily: FONT_PAIRINGS[activePairing].body }}
                    className="text-base mb-6"
                  >
                    This is body text using {FONT_PAIRINGS[activePairing].body}. Good typography creates a visual hierarchy, provides a graphic balance to the page, and sets the product's overall tone. Typography should guide and inform users, optimize readability and accessibility, and ensure an excellent user experience.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const cssCode = `/* Heading */\nfont-family: '${FONT_PAIRINGS[activePairing].heading}', sans-serif;\n\n/* Body */\nfont-family: '${FONT_PAIRINGS[activePairing].body}', sans-serif;`;
                        copyToClipboard(cssCode, "css");
                      }}
                    >
                      {copiedCSS ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copiedCSS ? "Copied!" : "Copy CSS"}
                    </Button>
                    
                    <Button 
                      className={`${getThemeClass("primary")} text-white`}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Use This Pair
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Favorites Tab Content */}
          {activeTab === "favorites" && (
            <div className="mt-6">
              {favoritesList.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
                  <h2 className="text-xl font-bold mb-2">No Favorites Yet</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Click the heart icon on any font to add it to your favorites.
                  </p>
                  <Button
                    onClick={() => setActiveTab("browse")}
                  >
                    Browse Fonts
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fonts
                    .filter(font => favoritesList.includes(font.family))
                    .map(font => (
                      <FontCard key={font.family} font={font} view="grid" />
                    ))
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FontExplorer;