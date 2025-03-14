import { useEffect, useRef } from "react";

/**
 * Fare veya dokunmatik hareketleriyle oluşan x,y koordinatlarını
 * containerRef içinde relative olarak takip eder. (containerRef yoksa
 * doğrudan clientX, clientY döndürür).
 *
 * @param {React.RefObject<HTMLElement | null>} containerRef - Konumu buna göre hesaplanacak container
 * @returns {React.MutableRefObject<{ x: number; y: number }>} Konum değerini içeren Ref
 */
export const useMousePositionRef = (containerRef) => {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Yardımcı fonksiyon: x,y değerlerini containerRef'e göre hesapla
    const updatePosition = (x, y) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;
        positionRef.current = { x: relativeX, y: relativeY };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev) => {
      updatePosition(ev.clientX, ev.clientY);
    };

    const handleTouchMove = (ev) => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    // Fare ve dokunma hareketleri için eventListener ekliyoruz
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // Bileşen unmount olursa eventListener'ları kaldır
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
};
