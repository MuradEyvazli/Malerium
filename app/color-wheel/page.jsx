"use client";

import React, { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { 
  Copy, 
  Heart, 
  Image as ImageIcon, 
  Download, 
  Upload, 
  Palette, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Shuffle,
  Eye,
  Camera,
  Clock
} from "lucide-react";

// Color utility functions
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const rgbToHex = (r, g, b) => {
  return "#" + 
    ("0" + r.toString(16)).slice(-2) + 
    ("0" + g.toString(16)).slice(-2) + 
    ("0" + b.toString(16)).slice(-2);
};

const hexToHSL = (hex) => {
  // Convert hex to RGB first
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  
  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b);
  let cmax = Math.max(r, g, b);
  let delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  // Calculate hue
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Convert to percentages
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
};

const hslToHex = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Color scheme generators
const generateAnalogousColors = (hex, count = 5) => {
  const { h, s, l } = hexToHSL(hex);
  const colors = [];
  const step = 30; // 30 degrees step
  
  for (let i = 0; i < count; i++) {
    const newH = (h + step * (i - Math.floor(count / 2))) % 360;
    colors.push(hslToHex(newH < 0 ? newH + 360 : newH, s, l));
  }
  
  return colors;
};

const generateMonochromaticColors = (hex, count = 5) => {
  const { h, s, l } = hexToHSL(hex);
  const colors = [];
  
  for (let i = 0; i < count; i++) {
    const newL = Math.max(0, Math.min(100, l - 30 + i * 15));
    colors.push(hslToHex(h, s, newL));
  }
  
  return colors;
};

const getComplementaryColor = (hex) => {
  const { h, s, l } = hexToHSL(hex);
  return hslToHex((h + 180) % 360, s, l);
};

const generateTriadicColors = (hex) => {
  const { h, s, l } = hexToHSL(hex);
  return [
    hex,
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l)
  ];
};

const generateTetradicColors = (hex) => {
  const { h, s, l } = hexToHSL(hex);
  return [
    hex,
    hslToHex((h + 90) % 360, s, l),
    hslToHex((h + 180) % 360, s, l),
    hslToHex((h + 270) % 360, s, l)
  ];
};

const generateSplitComplementaryColors = (hex) => {
  const { h, s, l } = hexToHSL(hex);
  return [
    hex,
    hslToHex((h + 150) % 360, s, l),
    hslToHex((h + 210) % 360, s, l)
  ];
};

// Random color generator
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Color names map (simplified)
const colorNames = {
  "#FF0000": "Red",
  "#00FF00": "Green",
  "#0000FF": "Blue",
  "#FFFF00": "Yellow",
  "#FF00FF": "Magenta",
  "#00FFFF": "Cyan",
  "#000000": "Black",
  "#FFFFFF": "White",
  "#808080": "Gray",
  "#FFA500": "Orange",
  "#800080": "Purple",
  "#A52A2A": "Brown",
  "#FF69B4": "Hot Pink",
  "#4B0082": "Indigo",
  "#7CFC00": "Lawn Green",
  "#6A5ACD": "Slate Blue",
};

// Get approximate color name
const getColorName = (hex) => {
  let closestColor = "#000000";
  let closestDistance = Infinity;
  const rgb1 = hexToRgb(hex);
  
  for (const [color, name] of Object.entries(colorNames)) {
    const rgb2 = hexToRgb(color);
    const distance = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestColor = color;
    }
  }
  
  return colorNames[closestColor];
};

// Custom Toast component
const Toast = ({ message, visible, type = "success", onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);
  
  if (!visible) return null;
  
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-3 rounded-lg shadow-lg transition-all transform translate-y-0 opacity-100
      ${type === "success" ? "bg-emerald-50 text-emerald-700" : 
        type === "error" ? "bg-red-50 text-red-700" : 
        "bg-blue-50 text-blue-700"}`}
    >
      <span className={`flex items-center justify-center p-1 rounded-full mr-2 
        ${type === "success" ? "bg-emerald-100" : 
          type === "error" ? "bg-red-100" : 
          "bg-blue-100"}`}
      >
        {type === "success" ? <Check size={14} /> : <X size={14} />}
      </span>
      <span className="text-sm font-medium">{message}</span>
      <button 
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-500 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Main component
const ColorWheelPage = () => {
  // Helper function to determine text color based on background
  const getTextColor = (bgColor) => {
    // Convert hex to RGB
    let r = parseInt(bgColor.slice(1, 3), 16);
    let g = parseInt(bgColor.slice(3, 5), 16);
    let b = parseInt(bgColor.slice(5, 7), 16);
    
    // Calculate relative luminance
    let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? "text-gray-900" : "text-white";
  };

  // State for the page flip
  const [currentPage, setCurrentPage] = useState("colorPicker"); // "colorPicker" or "imageExtractor"
  const [pageFlipping, setPageFlipping] = useState(false);

  // Color picker state
  const [color, setColor] = useState("#3498db");
  const [scheme, setScheme] = useState("analogic");
  const [combinations, setCombinations] = useState([]);
  const [hexInput, setHexInput] = useState("#3498db");
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [colorDetails, setColorDetails] = useState(null);
  
  // Image state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [extractedColors, setExtractedColors] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  
  // UI state
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [copied, setCopied] = useState(false);
  
  // References
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('colorFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Set initial colors
    fetchColorDetails(color);
    updateColorCombinations(color, scheme);
  }, []);
  
  // Update when main color changes
  useEffect(() => {
    setHexInput(color);
    fetchColorDetails(color);
    updateColorCombinations(color, scheme);
    addToHistory(color);
  }, [color, scheme]);
  
  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('colorFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Get color details
  const fetchColorDetails = async (hexColor) => {
    try {
      const response = await fetch(
        `https://www.thecolorapi.com/id?hex=${hexColor.substring(1)}`
      );
      const data = await response.json();
      setColorDetails(data);
    } catch (error) {
      console.error("Color API error:", error);
      // Fallback if API fails
      const rgb = hexToRgb(hexColor);
      const hsl = hexToHSL(hexColor);
      
      setColorDetails({
        hex: { value: hexColor },
        name: { value: getColorName(hexColor) },
        rgb: rgb,
        hsl: hsl
      });
    }
  };

  // Update color combinations based on scheme
  const updateColorCombinations = async (hexColor, colorScheme) => {
    try {
      const response = await fetch(
        `https://www.thecolorapi.com/scheme?hex=${hexColor.substring(1)}&mode=${colorScheme}&count=5`
      );
      const data = await response.json();
      setCombinations(data.colors);
    } catch (error) {
      console.error("Color API error:", error);
      
      // Fallback if API fails
      let colors = [];
      switch (colorScheme) {
        case "analogic":
          colors = generateAnalogousColors(hexColor);
          break;
        case "monochrome":
          colors = generateMonochromaticColors(hexColor);
          break;
        case "complement":
          colors = [hexColor, getComplementaryColor(hexColor)];
          break;
        case "triad":
          colors = generateTriadicColors(hexColor);
          break;
        case "tetrad":
          colors = generateTetradicColors(hexColor);
          break;
        case "splitComplement":
          colors = generateSplitComplementaryColors(hexColor);
          break;
        default:
          colors = generateAnalogousColors(hexColor);
      }
      
      // Format to match API response structure
      setCombinations(colors.map(hex => ({
        hex: { value: hex },
        name: { value: getColorName(hex) },
        rgb: hexToRgb(hex)
      })));
    }
  };

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  // Handle hex input change
  const handleHexInput = (e) => {
    setHexInput(e.target.value);
  };

  // Apply hex color
  const applyHexColor = () => {
    // Validate hex code
    if (/^#?[0-9A-F]{3}$/i.test(hexInput) || /^#?[0-9A-F]{6}$/i.test(hexInput)) {
      // Add # if not present
      const formattedHex = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
      setColor(formattedHex);
    } else {
      showToast("Please enter a valid HEX code (e.g. #3498db or #fff)", "error");
    }
  };

  // Add color to favorites
  const addToFavorites = (colorToAdd = color) => {
    if (!favorites.includes(colorToAdd)) {
      setFavorites([...favorites, colorToAdd]);
      showToast(`${colorToAdd} has been added to your favorites`, "success");
    } else {
      showToast("This color is already in your favorites", "error");
    }
  };

  // Remove color from favorites
  const removeFromFavorites = (colorToRemove) => {
    setFavorites(favorites.filter(c => c !== colorToRemove));
    showToast(`${colorToRemove} has been removed from favorites`, "success");
  };

  // Add color to history
  const addToHistory = (newColor) => {
    if (!history.includes(newColor)) {
      const updatedHistory = [newColor, ...history.slice(0, 9)]; // Keep only last 10
      setHistory(updatedHistory);
    }
  };

  // Copy color to clipboard
  const copyColor = async (formatType = 'hex', value = color) => {
    let textToCopy = value;
    
    if (colorDetails) {
      switch (formatType) {
        case 'hex':
          textToCopy = colorDetails.hex?.value || value;
          break;
        case 'rgb':
          if (colorDetails.rgb) {
            textToCopy = `rgb(${colorDetails.rgb.r}, ${colorDetails.rgb.g}, ${colorDetails.rgb.b})`;
          }
          break;
        case 'hsl':
          if (colorDetails.hsl) {
            textToCopy = `hsl(${colorDetails.hsl.h}, ${Math.round(colorDetails.hsl.s)}%, ${Math.round(colorDetails.hsl.l)}%)`;
          }
          break;
      }
    }
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast(`${textToCopy} copied to clipboard`, "success");
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy error:", err);
      showToast("Failed to copy to clipboard", "error");
    }
  };

  // Generate random color
  const generateRandomColor = () => {
    const randomColor = getRandomColor();
    setColor(randomColor);
  };

  // Handle page flip
  const flipPage = (page) => {
    setPageFlipping(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageFlipping(false);
    }, 400);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Extract colors from image - Enhanced algorithm
  const extractColorsFromImage = () => {
    if (!imagePreviewUrl) {
      showToast("Please select an image first", "error");
      return;
    }
    
    setIsExtracting(true);
    
    // Create an image element from the image URL
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imagePreviewUrl;
    
    img.onload = () => {
      // Create a canvas to extract colors
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      // Calculate the optimal canvas size to improve performance while maintaining accuracy
      const maxDimension = Math.max(img.width, img.height);
      const scaleFactor = maxDimension > 1000 ? 1000 / maxDimension : 1;
      
      // Set canvas size (scaled down for better performance with large images)
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      
      // Advanced color extraction algorithm
      // K-means clustering approach (simplified)
      
      // Step 1: Collect pixel data (not all pixels to improve performance)
      const pixels = [];
      const pixelCount = imageData.length / 4;
      const sampleRate = Math.max(1, Math.floor(pixelCount / 20000)); // More samples for better accuracy
      
      for (let i = 0; i < pixelCount; i += sampleRate) {
        const offset = i * 4;
        const r = imageData[offset];
        const g = imageData[offset + 1];
        const b = imageData[offset + 2];
        const a = imageData[offset + 3];
        
        // Skip transparent and near-white/black pixels that often don't contribute to the main theme
        if (a < 128 || (r > 245 && g > 245 && b > 245) || (r < 10 && g < 10 && b < 10)) {
          continue;
        }
        
        pixels.push({r, g, b, count: 1});
      }
      
      // Step 2: Use a modified k-means approach to find distinct color clusters
      const colorCount = 8; // Number of desired colors
      const clusterTolerance = 60; // RGB distance tolerance for merging
      let clusters = [];
      
      // Initialize clusters with the first pixel
      if (pixels.length > 0) {
        clusters.push({...pixels[0]});
      }
      
      // Function to calculate the Euclidean distance between two colors
      const colorDistance = (c1, c2) => {
        return Math.sqrt(
          Math.pow(c1.r - c2.r, 2) + 
          Math.pow(c1.g - c2.g, 2) + 
          Math.pow(c1.b - c2.b, 2)
        );
      };
      
      // Process each pixel
      for (let i = 1; i < pixels.length; i++) {
        const pixel = pixels[i];
        let foundMatch = false;
        
        // Try to add to existing cluster
        for (let j = 0; j < clusters.length; j++) {
          if (colorDistance(pixel, clusters[j]) < clusterTolerance) {
            // Update cluster's color values (weighted average)
            const totalCount = clusters[j].count + 1;
            clusters[j].r = Math.round((clusters[j].r * clusters[j].count + pixel.r) / totalCount);
            clusters[j].g = Math.round((clusters[j].g * clusters[j].count + pixel.g) / totalCount);
            clusters[j].b = Math.round((clusters[j].b * clusters[j].count + pixel.b) / totalCount);
            clusters[j].count += 1;
            foundMatch = true;
            break;
          }
        }
        
        // Create new cluster if no match and we haven't reached limit
        if (!foundMatch && clusters.length < colorCount * 2) { // Collect more than needed to filter later
          clusters.push({...pixel});
        }
      }
      
      // Step 3: Sort clusters by count (popularity)
      clusters.sort((a, b) => b.count - a.count);
      
      // Step 4: Improve diversity by removing too similar colors from the final selection
      const finalClusters = [];
      for (const cluster of clusters) {
        // Only add if it's distinctly different from already selected colors
        let isDistinct = true;
        for (const selected of finalClusters) {
          if (colorDistance(cluster, selected) < clusterTolerance) {
            isDistinct = false;
            break;
          }
        }
        
        if (isDistinct) {
          finalClusters.push(cluster);
        }
        
        // Stop when we have enough colors
        if (finalClusters.length >= colorCount) {
          break;
        }
      }
      
      // Step 5: Convert clusters to hex colors
      const dominantColors = finalClusters.map(cluster => 
        rgbToHex(cluster.r, cluster.g, cluster.b)
      );
      
      // Add additional colors if we don't have enough (fallback)
      if (dominantColors.length < colorCount) {
        // Find more colors with less strict criteria
        for (const cluster of clusters) {
          const hexColor = rgbToHex(cluster.r, cluster.g, cluster.b);
          if (!dominantColors.includes(hexColor)) {
            dominantColors.push(hexColor);
          }
          if (dominantColors.length >= colorCount) {
            break;
          }
        }
      }
      
      // Format colors like API response
      const formattedColors = dominantColors.map(hex => ({
        hex: { value: hex },
        name: { value: getColorName(hex) },
        rgb: hexToRgb(hex)
      }));
      
      setExtractedColors(formattedColors);
      setIsExtracting(false);
      showToast("Colors extracted successfully", "success");
    };
    
    img.onerror = () => {
      setIsExtracting(false);
      showToast("Failed to process image", "error");
    };
    
    // Fallback if the image takes too long to process
    const timeout = setTimeout(() => {
      if (isExtracting) {
        setIsExtracting(false);
        showToast("Image processing took too long, please try a smaller image", "error");
      }
    }, 15000); // 15 second timeout
    
    return () => clearTimeout(timeout);
  };

  // Use extracted color
  const useExtractedColor = (hex) => {
    setColor(hex);
    flipPage("colorPicker");
  };

  // Download palette
  const downloadPalette = (colors, format = 'hex') => {
    if (!colors || colors.length === 0) {
      showToast("No colors to download", "error");
      return;
    }
    
    let content = "";
    
    switch (format) {
      case 'hex':
        content = colors.map(c => c.hex.value).join('\n');
        break;
      case 'rgb':
        content = colors.map(c => {
          const rgb = c.rgb;
          return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }).join('\n');
        break;
      case 'css':
        content = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex.value};`).join('\n')}\n}`;
        break;
      default:
        content = colors.map(c => c.hex.value).join('\n');
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `color-palette-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast("Palette downloaded successfully", "success");
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Toast notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <header className="py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex gap-4">
            <button
              className={`flex items-center px-4 py-2 rounded-full text-sm transition-colors ${currentPage === "colorPicker" ? "bg-white text-indigo-600 font-semibold" : "bg-indigo-700 text-white hover:bg-indigo-800"}`}
              onClick={() => flipPage("colorPicker")}
            >
              <Palette size={16} className="mr-2" />
              Renk Seçici
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-full text-sm transition-colors ${currentPage === "colorPicker" ? "bg-white text-indigo-600 font-semibold" : "bg-indigo-700 text-white hover:bg-indigo-800"}`}
              onClick={() => flipPage("imageExtractor")}
            >
              <ImageIcon size={16} className="mr-2" />
              Fotoğraf Renkleri
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content with page flip effect */}
      <main className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden">
          {/* Book-like pages container */}
          <div className="relative perspective-1000">
            {/* Page transition container */}
            <div className={`relative transition-all duration-500 transform ${
              pageFlipping 
                ? currentPage === "colorPicker" 
                  ? "rotate-y-90 origin-left" 
                  : "rotate-y-90 origin-right" 
                : "rotate-y-0"
            }`}>
              
              {/* Color Picker Page */}
              <div className={`${currentPage === "colorPicker" ? "block" : "hidden"}`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column - Color Picker */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Main Color Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div 
                        className="h-40 flex items-center justify-center relative"
                        style={{ backgroundColor: color }}
                      >
                        <h2 className={`text-2xl font-bold ${getTextColor(color)}`}>
                          {colorDetails?.name?.value || "Color Picker"}
                        </h2>
                        
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button 
                            onClick={() => copyColor('hex')}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            title="Copy HEX"
                          >
                            <Copy size={16} />
                          </button>
                          
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex items-center mb-4">
                          <input
                            type="text"
                            value={hexInput}
                            onChange={handleHexInput}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="#3498db"
                          />
                          <button
                            onClick={applyHexColor}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-r-lg hover:bg-indigo-700 transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        
                        <div className="mt-4">
                          <HexColorPicker color={color} onChange={setColor} className="w-full" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Color Details */}
                    <div className="bg-white rounded-xl shadow-lg p-5 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Color Details</h3>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 font-medium">HEX</p>
                          <div className="flex items-center">
                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded flex-1">
                              {colorDetails?.hex?.value || color}
                            </span>
                            <button
                              onClick={() => copyColor('hex')}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                              title="Copy HEX"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 font-medium">RGB</p>
                          <div className="flex items-center">
                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                              {colorDetails?.rgb ? `${colorDetails.rgb.r}, ${colorDetails.rgb.g}, ${colorDetails.rgb.b}` : "Loading..."}
                            </span>
                            <button
                              onClick={() => copyColor('rgb')}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                              title="Copy RGB"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 font-medium">HSL</p>
                          <div className="flex items-center">
                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                              {colorDetails?.hsl ? `${colorDetails.hsl.h}, ${Math.round(colorDetails.hsl.s)}%, ${Math.round(colorDetails.hsl.l)}%` : "Loading..."}
                            </span>
                            <button
                              onClick={() => copyColor('hsl')}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                              title="Copy HSL"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Random Color</p>
                        <button
                          onClick={generateRandomColor}
                          className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Shuffle size={16} className="inline-block mr-2" />
                          Generate Random Color
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Color Schemes & Favorites */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Color Scheme */}
                    <div className="bg-white rounded-xl shadow-lg p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Color Schemes</h3>
                        <select
                          value={scheme}
                          onChange={(e) => setScheme(e.target.value)}
                          className="bg-gray-100 border border-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="analogic">Analogous</option>
                          <option value="monochrome">Monochromatic</option>
                          <option value="complement">Complementary</option>
                          <option value="triad">Triadic</option>
                          <option value="tetrad">Tetradic</option>
                          <option value="splitComplement">Split Complementary</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {combinations.map((col, index) => (
                          <div
                            key={index}
                            className="rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                          >
                            <div
                              className="h-20 relative"
                              style={{ backgroundColor: col.hex.value }}
                            >
                              <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/20 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  onClick={() => copyColor('hex', col.hex.value)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/80 transition-colors"
                                  title="Copy HEX"
                                >
                                  <Copy size={14} />
                                </button>
                                <button
                                  onClick={() => setColor(col.hex.value)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/80 transition-colors"
                                  title="Use this color"
                                >
                                  <Eye size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="p-2 bg-white">
                              <p className="text-xs font-medium truncate">{col.name?.value || `Color ${index + 1}`}</p>
                              <p className="text-xs text-gray-500 font-mono">{col.hex?.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => downloadPalette(combinations, 'css')}
                          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Download size={16} className="mr-2" />
                          Export Palette
                        </button>
                      </div>
                    </div>
                    
                    {/* Favorites & History */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Favorites */}
                      <div className="bg-white rounded-xl shadow-lg p-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Favorites</h3>
                        
                        {favorites.length > 0 ? (
                          <div className="grid grid-cols-4 gap-2">
                            {favorites.map((fav, index) => (
                              <div key={index} className="relative group">
                                <button
                                  className="w-full aspect-square rounded-lg"
                                  style={{ backgroundColor: fav }}
                                  onClick={() => setColor(fav)}
                                  title={fav}
                                >
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity rounded-lg flex items-center justify-center">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromFavorites(fav);
                                      }}
                                      className="w-6 h-6 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/80 transition-colors"
                                    >
                                      <Heart size={12} className="fill-red-500 text-red-500" />
                                    </button>
                                  </div>
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                            <Heart size={32} className="mb-2 opacity-30" />
                            <p className="text-sm">No favorites yet</p>
                          </div>
                        )}
                      </div>
                      
                      {/* History */}
                      <div className="bg-white rounded-xl shadow-lg p-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Colors</h3>
                        
                        {history.length > 0 ? (
                          <div className="grid grid-cols-5 gap-2">
                            {history.map((historyColor, index) => (
                              <button
                                key={index}
                                className="aspect-square rounded-lg border border-gray-200"
                                style={{ backgroundColor: historyColor }}
                                onClick={() => setColor(historyColor)}
                                title={historyColor}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                            <Clock size={32} className="mb-2 opacity-30" />
                            <p className="text-sm">No recent colors</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Color Preview in Context */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
                      </div>
                      
                      <div className="p-5" style={{ backgroundColor: color }}>
                        <div className="bg-white p-5 rounded-lg shadow-lg">
                          <h4 
                            className="text-xl font-bold mb-3" 
                            style={{ color }}
                          >
                            Sample Heading with Your Color
                          </h4>
                          
                          <p className="text-gray-700 mb-4">
                            This is how your selected color might look when used as an accent in a real design. 
                            Good color choices can drastically improve the visual appeal of your projects.
                          </p>
                          
                          <div className="flex gap-3">
                            <button 
                              className="px-4 py-2 rounded-lg text-white font-medium text-sm"
                              style={{ backgroundColor: color }}
                            >
                              Primary Button
                            </button>
                            <button 
                              className="px-4 py-2 rounded-lg font-medium text-sm border-2"
                              style={{ color, borderColor: color }}
                            >
                              Secondary Button
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image Extractor Page */}
              <div className={`${currentPage === "imageExtractor" ? "block" : "hidden"}`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column - Image Upload */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">Upload Image</h3>
                        <p className="text-sm text-gray-500">
                          Select an image to extract its colors
                        </p>
                      </div>
                      
                      <div className="p-5">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        
                        <div 
                          onClick={() => fileInputRef.current.click()}
                          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer 
                            flex flex-col items-center justify-center
                            ${imagePreviewUrl ? "border-indigo-300 bg-indigo-50" : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"}`}
                        >
                          {imagePreviewUrl ? (
                            <div className="w-full">
                              <img 
                                src={imagePreviewUrl} 
                                alt="Preview" 
                                className="max-h-80 max-w-full mx-auto rounded-lg shadow-md" 
                              />
                              <p className="text-center text-sm text-gray-500 mt-3">
                                Click to select a different image
                              </p>
                            </div>
                          ) : (
                            <>
                              <Upload size={48} className="text-gray-400 mb-3" />
                              <p className="text-gray-600 text-sm font-medium mb-1">
                                Click to select an image
                              </p>
                              <p className="text-gray-500 text-xs">
                                JPG, PNG or GIF, max 5MB
                              </p>
                            </>
                          )}
                        </div>
                        
                        <button
                          onClick={extractColorsFromImage}
                          disabled={!imagePreviewUrl || isExtracting}
                          className={`mt-4 w-full py-3 rounded-lg text-white text-sm font-medium flex items-center justify-center
                            ${!imagePreviewUrl || isExtracting
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 transition-opacity"
                            }`}
                        >
                          {isExtracting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Extracting Colors...
                            </>
                          ) : (
                            <>
                              <Palette size={16} className="mr-2" />
                              Extract Colors
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* How it works */}
                    <div className="bg-white rounded-xl shadow-lg p-5">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
                      
                      <ol className="space-y-4">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3">
                            1
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">Upload an Image</h4>
                            <p className="text-sm text-gray-600">Select any image from your device to analyze.</p>
                          </div>
                        </li>
                        
                        <li className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3">
                            2
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">Extract Colors</h4>
                            <p className="text-sm text-gray-600">Our algorithm identifies the dominant colors in your image.</p>
                          </div>
                        </li>
                        
                        <li className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3">
                            3
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">Use the Colors</h4>
                            <p className="text-sm text-gray-600">Add colors to your palette or switch to the color picker to use them in your designs.</p>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>
                  
                  {/* Right Column - Extracted Colors */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Extracted Colors</h3>
                          <p className="text-sm text-gray-500">
                            {extractedColors.length > 0 
                              ? `${extractedColors.length} colors found in your image` 
                              : "Extract colors from your image"}
                          </p>
                        </div>
                        
                        {extractedColors.length > 0 && (
                          <button
                            onClick={() => downloadPalette(extractedColors, 'hex')}
                            className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Download size={14} className="mr-1.5" />
                            Save
                          </button>
                        )}
                      </div>
                      
                      <div className="p-5">
                        {extractedColors.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {extractedColors.map((col, index) => (
                              <div
                                key={index}
                                className="rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                              >
                                <div
                                  className="h-24 relative"
                                  style={{ backgroundColor: col.hex.value }}
                                >
                                  <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/20 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => copyColor('hex', col.hex.value)}
                                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/80 transition-colors"
                                      title="Copy HEX"
                                    >
                                      <Copy size={14} />
                                    </button>
                                    <button
                                      onClick={() => useExtractedColor(col.hex.value)}
                                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/80 transition-colors"
                                      title="Use this color"
                                    >
                                      <Eye size={14} />
                                    </button>
                                    <button
                                      onClick={() => addToFavorites(col.hex.value)}
                                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/80 transition-colors"
                                      title={favorites.includes(col.hex.value) ? "Remove from favorites" : "Add to favorites"}
                                    >
                                      <Heart size={14} className={favorites.includes(col.hex.value) ? "text-red-500 fill-red-500" : ""} />
                                    </button>
                                  </div>
                                </div>
                                <div className="p-3 bg-white">
                                  <p className="text-sm font-medium mb-1">{col.name?.value || `Color ${index + 1}`}</p>
                                  <p className="text-xs text-gray-500 font-mono">{col.hex?.value}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-16 flex flex-col items-center justify-center text-gray-400">
                            <Palette size={48} className="mb-3 opacity-30" />
                            <p className="text-lg font-medium mb-1">No colors extracted yet</p>
                            <p className="text-sm text-center">
                              Upload an image and click "Extract Colors" to identify the color palette
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Color Combinations from Image */}
                    {extractedColors.length > 0 && (
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-5 border-b border-gray-100">
                          <h3 className="text-lg font-semibold text-gray-800">Color Combinations</h3>
                          <p className="text-sm text-gray-500">
                            Suggested combinations from your image
                          </p>
                        </div>
                        
                        <div className="p-5 space-y-5">
                          {/* Combinations - taking the first 4 colors for simplicity */}
                          {extractedColors.length >= 2 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Primary & Secondary</h4>
                              <div className="flex h-14 rounded-lg overflow-hidden">
                                <div 
                                  className="w-2/3" 
                                  style={{ backgroundColor: extractedColors[0].hex.value }}
                                />
                                <div 
                                  className="w-1/3" 
                                  style={{ backgroundColor: extractedColors[1].hex.value }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {extractedColors.length >= 3 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Triadic Scheme</h4>
                              <div className="flex h-14 rounded-lg overflow-hidden">
                                <div 
                                  className="w-1/3" 
                                  style={{ backgroundColor: extractedColors[0].hex.value }}
                                />
                                <div 
                                  className="w-1/3" 
                                  style={{ backgroundColor: extractedColors[1].hex.value }}
                                />
                                <div 
                                  className="w-1/3" 
                                  style={{ backgroundColor: extractedColors[2].hex.value }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {extractedColors.length >= 4 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Accent Colors</h4>
                              <div className="grid grid-cols-4 gap-2 h-14">
                                {extractedColors.slice(0, 4).map((col, index) => (
                                  <div
                                    key={index}
                                    className="rounded-lg"
                                    style={{ backgroundColor: col.hex.value }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Color Palette Preview - Similar to the screenshot */}
                          {extractedColors.length >= 4 && (
                            <div className="mt-6">
                              <h4 className="text-sm font-medium text-gray-700 mb-3">Complete Palette</h4>
                              <div className="h-24 w-full flex rounded-lg overflow-hidden shadow border border-gray-200">
                                {extractedColors.map((col, index) => (
                                  <div
                                    key={index}
                                    className="flex-1 h-full transition-all hover:flex-grow-[1.2]"
                                    style={{ backgroundColor: col.hex.value }}
                                  />
                                ))}
                              </div>
                              
                              <div className="mt-2 grid grid-cols-4 sm:grid-cols-8 gap-2">
                                {extractedColors.map((col, index) => (
                                  <div key={index} className="text-center">
                                    <div 
                                      className="w-8 h-8 mx-auto rounded-full shadow-sm border border-gray-200 mb-1" 
                                      style={{ backgroundColor: col.hex.value }}
                                    />
                                    <span className="text-xs font-mono block truncate">
                                      {col.hex.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => {
                                if (extractedColors.length > 0) {
                                  useExtractedColor(extractedColors[0].hex.value);
                                }
                              }}
                              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-medium"
                            >
                              Use These Colors in Designer
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Page flip controls */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            {currentPage === "imageExtractor" && (
              <button
                onClick={() => flipPage("colorPicker")}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft size={20} />
              </button>
            )}
          </div>
          
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            {currentPage === "colorPicker" && (
              <button
                onClick={() => flipPage("imageExtractor")}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </main>
      {/* CSS for page flip animations */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-90 {
          transform: rotateY(90deg);
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
        .origin-left {
          transform-origin: left center;
        }
        .origin-right {
          transform-origin: right center;
        }
      `}</style>
    </div>
  );
};

export default ColorWheelPage;