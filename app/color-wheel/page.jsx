"use client";

import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { ShootingStars } from "@/components/ui/shooting-stars";
import FindColor from '@/components/FindColor'

const ColorWheelPage = () => {

  const [color, setColor] = useState("#3498db");
  const [scheme, setScheme] = useState("analogic");
  const [combinations, setCombinations] = useState([]);
  const [colorDetails, setColorDetails] = useState(null);
  const [copied, setCopied] = useState(false);

  const [hexInput, setHexInput] = useState("");

  const fetchColorCombination = async (hexColor, colorScheme) => {
    try {
      const response = await fetch(
        `https://www.thecolorapi.com/scheme?hex=${hexColor.substring(
          1
        )}&mode=${colorScheme}&count=5`
      );
      const data = await response.json();
      setCombinations(data.colors);
    } catch (error) {
      console.error("Kombinasyon API hatası:", error);
    }
  };

  const fetchColorDetails = async (hexColor) => {
    try {
      const response = await fetch(
        `https://www.thecolorapi.com/id?hex=${hexColor.substring(1)}`
      );
      const data = await response.json();
      setColorDetails(data);
    } catch (error) {
      console.error("Renk detay API hatası:", error);
    }
  };

  useEffect(() => {
    fetchColorCombination(color, scheme);
    fetchColorDetails(color);
  }, [color, scheme]);

  const copyColor = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Kopyalama hatası:", err);
    }
  };

  const handleHexInput = (e) => {
    setHexInput(e.target.value);
  };

  const applyHexColor = () => {
    if (/^#[0-9A-F]{3}$/i.test(hexInput) || /^#[0-9A-F]{6}$/i.test(hexInput)) {
      setColor(hexInput);
    } else {
      alert("Geçerli bir HEX kodu girin (örn: #3498db, #fff vb.)");
    }
  };


  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <div className="h-[40rem] w-full bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_80%)]" />
          <div className="stars absolute inset-0" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Color Wheel 
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Color Wheel is a tool that allows you to generate color combinations based on a given color.
          </p>
        </div>

        {/* Multiple shooting star layers with different colors and speeds */}
        <ShootingStars
          starColor="#9E00FF"
          trailColor="#2EB9DF"
          minSpeed={15}
          maxSpeed={35}
          minDelay={1000}
          maxDelay={3000}
        />
        <ShootingStars
          starColor="#FF0099"
          trailColor="#FFB800"
          minSpeed={10}
          maxSpeed={25}
          minDelay={2000}
          maxDelay={4000}
        />
        <ShootingStars
          starColor="#00FF9E"
          trailColor="#00B8FF"
          minSpeed={20}
          maxSpeed={40}
          minDelay={1500}
          maxDelay={3500}
        />

        <style jsx>{`
          .stars {
            background-image: radial-gradient(2px 2px at 20px 30px, #fff, rgba(0, 0, 0, 0)),
              radial-gradient(2px 2px at 40px 70px, #ffffff, rgba(0, 0, 0, 0)),
              radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0, 0, 0, 0)),
              radial-gradient(2px 2px at 90px 40px, #fff, rgba(0, 0, 0, 0)),
              radial-gradient(2px 2px at 130px 80px, #fff, rgba(0, 0, 0, 0)),
              radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0, 0, 0, 0));
            background-repeat: repeat;
            background-size: 200px 200px;
            animation: twinkle 5s ease-in-out infinite;
            opacity: 0.5;
          }

          @keyframes twinkle {
            0% {
              opacity: 0.5;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              opacity: 0.5;
            }
          }
        `}</style>
      </div>

      <main className="flex-1 mt-8 mb-8 ">
        <div className="max-w-5xl mx-auto px-4 ">
          {/* Şema & Arama Kısmı */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8 ">
            {/* Şema seçimi */}
            <div>
              <label className="block mb-1 text-gray-700 text-sm font-medium">
                Renk Şeması:
              </label>
              <select
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
                className="p-2 w-40 text-sm rounded border border-gray-300 
                  focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="analogic">Analogic</option>
                <option value="monochrome">Monochrome</option>
                <option value="complement">Complement</option>
                <option value="triad">Triad</option>
              </select>
            </div>

            {/* Elle HEX girme alanı */}
            <div className="mt-4 md:mt-0">
              <label className="block mb-1 text-gray-700 text-sm font-medium">
                HEX Kodunu Gir (#...):
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="p-2 w-40 rounded border border-gray-300 
                    focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  type="text"
                  placeholder="#3498db"
                  value={hexInput}
                  onChange={handleHexInput}
                />
                <button
                  onClick={applyHexColor}
                  className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                >
                  Uygula
                </button>
              </div>
            </div>
          </div>

          {/* Ana kart / 2 kolon layout */}
          <div className="bg-white rounded-md shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sol sütun: Renk Seçici */}
            <div className="flex flex-col items-center md:items-start">
              <HexColorPicker color={color} onChange={setColor} />
            </div>

            {/* Sağ sütun: Seçili Renk Detayları */}
            <div className="relative flex flex-col items-center justify-center">
              {colorDetails && (
                <div className="bg-gray-50 w-full rounded-md shadow p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Seçilen Renk: <span>{color}</span>
                  </h3>

                  {/* Renk ismi + Preview */}
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="text-gray-600 text-sm">
                      <span className="font-semibold">İsim:</span>{" "}
                      {colorDetails.name
                        ? colorDetails.name.value
                        : "Bilinmiyor"}
                    </div>
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: colorDetails.hex.value }}
                    />
                  </div>

                  {/* Renk Değerleri (HEX, RGB, HSL) */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>HEX:</strong> {colorDetails.hex.value}
                    </p>
                    <p>
                      <strong>RGB:</strong>{" "}
                      {colorDetails.rgb
                        ? `${colorDetails.rgb.r}, ${colorDetails.rgb.g}, ${colorDetails.rgb.b}`
                        : ""}
                    </p>
                    <p>
                      <strong>HSL:</strong>{" "}
                      {colorDetails.hsl
                        ? `${colorDetails.hsl.h}, ${Math.round(
                            colorDetails.hsl.s
                          )}%, ${Math.round(colorDetails.hsl.l)}%`
                        : ""}
                    </p>
                  </div>

                  {/* Butonlar */}
                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={copyColor}
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                    >
                      Kopyala
                    </button>
                  </div>

                  {/* Kopyalandı Tooltip */}
                  {copied && (
                    <div
                      className="absolute top-2 right-1/2 transform translate-x-1/2 
                        bg-gray-800 text-white px-2 py-1 rounded text-xs"
                    >
                      Kopyalandı!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Renk Kombinasyonları */}
          <div className="bg-white rounded-md shadow-md p-6 mt-6">
            <h4 className="text-lg font-medium text-gray-700 mb-4">
              Renk Kombinasyonları
            </h4>
            <div className="flex flex-wrap gap-3">
              {combinations.map((col, index) => (
                <div
                  key={index}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full cursor-pointer 
                    border border-gray-200 shadow-sm hover:scale-105 transition"
                  style={{ backgroundColor: col.hex.value }}
                  onClick={() => setColor(col.hex.value)}
                  title={col.hex.value}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ColorWheelPage;
