"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AuthContext } from "@/app/context/AuthContext";
import Image from "next/image";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  // Login handler for email/password
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        router.push("/blog");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  // Google login handler
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google"; 
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 h-full w-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-full border-r border-white/5" />
            ))}
          </div>
          <div className="grid grid-rows-12 h-full w-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-full border-b border-white/5" />
            ))}
          </div>
        </div>

        {/* Gradient spheres */}
        <motion.div 
          className="absolute top-1/4 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-orange-600/20 to-transparent blur-xl"
          animate={{
            y: [0, 40, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-gradient-to-tr from-orange-500/20 to-transparent blur-xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col md:flex-row h-screen">
        {/* Left side - branding */}
        <motion.div 
          className="hidden md:flex flex-col justify-center items-start flex-1 pr-10"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold tracking-tighter text-white mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
              Malerium
            </span> Space
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            Showcase your work-portfoilo, explore innovative designs from around the world and be with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500" >malerium</span> family
          </p>
          
          {/* Feature highlights */}
          <div className="mt-12 space-y-6">
            {[
              { title: "Global Exposure", desc: "Get your work seen by clients worldwide" },
              { title: "Designer Network", desc: "Connect with like-minded creatives" },
              { title: "Advanced Portfolio", desc: "Showcase your work with cutting-edge tools" },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + (i * 0.2) }}
                className="flex items-start space-x-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">{feature.title}</h3>
                  <p className="text-white/60 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side - login form */}
        <motion.div 
          className="flex items-center justify-center flex-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full max-w-md relative">
            {/* Card backdrop blur */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10"></div>
            
            {/* Login container */}
            <div className="relative p-8 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-white/60">Access your creative dashboard</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Email</label>
                  <div className="relative">
                    <motion.div 
                      className="absolute inset-0 rounded-lg"
                      animate={{ 
                        boxShadow: email ? "0 0 0 1px rgba(246, 192, 92, 0.5)" : "none" 
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-4 py-3.5 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white placeholder-white/40"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="block text-sm font-medium text-white/80">Password</label>
                    <Link href="/forgot-password" className="text-xs text-orange-400 hover:text-orange-300 transition">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <motion.div 
                      className="absolute inset-0 rounded-lg"
                      animate={{ 
                        boxShadow: password ? "0 0 0 1px rgba(246, 187, 92, 0.5)" : "none" 
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-3.5 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-white/40"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <motion.button
                  onClick={handleLogin}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-600 text-white rounded-lg font-medium relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <span>Sign In</span>
                  )}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-orange-600/80"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow bg-white/10 h-px"></div>
                  <span className="flex-shrink mx-3 text-xs text-white/50">OR CONTINUE WITH</span>
                  <div className="flex-grow bg-white/10 h-px"></div>
                </div>

                <motion.button
                  onClick={handleGoogleLogin}
                  className="w-full py-3.5 bg-white/10 border border-white/10 hover:bg-white/15 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.159 8.204v3.272h4.677c-.19 1.236-1.411 3.62-4.677 3.62-2.81 0-5.1-2.312-5.1-5.166 0-2.853 2.29-5.166 5.1-5.166 1.6 0 2.67.676 3.288 1.25l2.266-2.213C11.856 2.476 10.168 1.5 8.158 1.5 4.605 1.5 1.66 4.513 1.66 8.031c0 3.52 2.945 6.533 6.497 6.533 3.774 0 6.263-2.66 6.263-6.39 0-.43-.046-.756-.104-1.07H8.159z" />
                  </svg>
                  Google
                </motion.button>
              </div>

              <p className="text-center text-white/60 text-sm mt-8">
                Don't have an account?{" "}
                <Link href="/signup" className="text-orange-400 hover:text-orange-300 transition font-medium">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}