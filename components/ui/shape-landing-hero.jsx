"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AuthContext } from "@/app/context/AuthContext";

// Bu sadece css className birleştirmek için kullandığımız örnek bir util fonksiyon.
// Kendin de dilediğin şekilde yazabilir ya da tailwind-merge kullanabilirsin.
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Arkaplandaki süslü şekil componenti (isteğe bağlı)
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  // Framer Motion animasyon ayarları
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  // Normal e-mail & password login
  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login Yanıtı:", data); 

      if (res.ok && data.token) {
        toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");

        // Token'ı sakla
        localStorage.setItem("token", data.token);
        console.log("Kaydedilen Token:", data.token);

        // Global durumu güncelle
        setIsLoggedIn(true);

        // Kullanıcıyı yönlendir
        router.push("/blog");
      } else {
        toast.error(data.error || "Giriş başarısız!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Sunucu hatası, tekrar deneyin!");
    }
  };

  // Google ile giriş butonuna tıklandığında
  const handleGoogleLogin = () => {
    // Kendi oluşturacağınız /api/auth/google endpoint'ine yönlendiriyoruz
    window.location.href = "/api/auth/google"; 
  };
  

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      {/* Arkaplan geçiş efekti */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* Hareketli şekiller */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Login Formu */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center items-center mb-8 md:mb-12"
          >
            <div className="flex justify-center items-center min-h-screen">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96 text-white border border-white/20"
              >
                <h2 className="text-2xl font-semibold text-center mb-6">
                  Welcome Back
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full mt-1 p-3 bg-white/20 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full mt-1 p-3 bg-white/20 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* E-mail & Password ile Login */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg transition-all"
                >
                  Login
                </motion.button>

                {/* Google ile Login */}
                <div className="flex items-center my-4">
                  <hr className="flex-grow border-t border-white/20" />
                  <span className="mx-2 text-white/50 text-sm">OR</span>
                  <hr className="flex-grow border-t border-white/20" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoogleLogin}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold p-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-google"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.159 8.204v3.272h4.677c-.19 1.236-1.411 3.62-4.677 3.62-2.81 0-5.1-2.312-5.1-5.166 0-2.853 2.29-5.166 5.1-5.166 1.6 0 2.67.676 3.288 1.25l2.266-2.213C11.856 2.476 10.168 1.5 8.158 1.5 4.605 1.5 1.66 4.513 1.66 8.031c0 3.52 2.945 6.533 6.497 6.533 3.774 0 6.263-2.66 6.263-6.39 0-.43-.046-.756-.104-1.07H8.159z" />
                  </svg>
                  Sign in with Google
                </motion.button>

                <p className="text-sm text-center mt-4 opacity-75">
                  Don&apos;t have an account?{" "}
                  <span className="text-blue-400 cursor-pointer hover:underline">
                    <Link href="/signup">Sign up</Link>
                  </span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Öndeki gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  );
}
