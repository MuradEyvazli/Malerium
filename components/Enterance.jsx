'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { Boxes, BoxesCore } from "./ui/background-boxes";
import { cn } from "@/lib/utils";
import { RevealImageList } from "./ui/reveal-images";
import { SparklesText } from "./ui/sparkles-text";
import Link from "next/link";


const Enterance = () => {
    const [hovered, setHovered] = useState(false);
  return (
    <div className="h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center">
      <div className=" absolute h-screen  w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className={cn("mb-4 text-4xl font-extrabold leading-tight text-center")}
      >
        <SparklesText text="Malerium Galery" />
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className={cn("relative text-lg text-gray-300 text-center max-w-lg")}
      >
        Discover the elegance of simplicity. Explore unique artworks and immerse
        yourself in the beauty of minimalism.
      </motion.p>

      <motion.button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        className={cn(` relative mt-10 px-6 py-3 font-medium text-lg border-2 rounded-lg shadow-lg transition-all duration-300
          ${hovered ? "bg-white text-black" : "bg-transparent border-white text-white"}`)}
      >
        <Link href="/">
        Explore Gallery
        </Link>
      </motion.button>
    </div>
    </div>
  )
}

export default Enterance