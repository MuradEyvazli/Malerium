"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Register handler for form submission
  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration successful! Redirecting to login user...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Server error, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  // Google signup handler
  const handleGoogleSignUp = () => {
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
          className="absolute top-1/3 -right-20 w-60 h-60 rounded-full bg-gradient-to-tr from-violet-600/20 to-transparent blur-xl"
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
          className="absolute bottom-1/3 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-orange-500/20 to-transparent blur-xl"
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
        {/* Left side - signup form */}
        <motion.div 
          className="flex items-center justify-center flex-1 order-2 md:order-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full max-w-md relative">
            {/* Card backdrop blur */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10"></div>
            
            {/* Signup container */}
            <div className="relative p-8 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Join Our Creative Community</h2>
                <p className="text-white/60">Start your design journey today</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="name-input" className="block text-sm font-medium text-white/80 mb-1.5">Full Name</label>
                  <input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-4 py-3.5 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-white/40"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email-input" className="block text-sm font-medium text-white/80 mb-1.5">Email</label>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3.5 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-white/40"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password-input" className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3.5 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-white/40"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  onClick={handleRegister}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-medium relative overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow bg-white/10 h-px"></div>
                  <span className="flex-shrink mx-3 text-xs text-white/50">OR CONTINUE WITH</span>
                  <div className="flex-grow bg-white/10 h-px"></div>
                </div>

                <button
                  onClick={handleGoogleSignUp}
                  className="w-full py-3.5 bg-white/10 border border-white/10 hover:bg-white/15 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.159 8.204v3.272h4.677c-.19 1.236-1.411 3.62-4.677 3.62-2.81 0-5.1-2.312-5.1-5.166 0-2.853 2.29-5.166 5.1-5.166 1.6 0 2.67.676 3.288 1.25l2.266-2.213C11.856 2.476 10.168 1.5 8.158 1.5 4.605 1.5 1.66 4.513 1.66 8.031c0 3.52 2.945 6.533 6.497 6.533 3.774 0 6.263-2.66 6.263-6.39 0-.43-.046-.756-.104-1.07H8.159z" />
                  </svg>
                  Google
                </button>
              </div>

              <p className="text-center text-white/60 text-sm mt-8">
                Already have an account?{" "}
                <Link href="/login" className="text-orange-400 hover:text-orange-300 transition font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right side - benefits */}
        <motion.div 
          className="hidden md:flex flex-col justify-center items-start flex-1 pl-10 order-1 md:order-2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold tracking-tighter text-white mb-3">
            Showcase Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500"> Malerium Vision</span>
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            Join thousands of creative professionals who use our platform to share their work, build their brand, and find new opportunities.
          </p>
          
          {/* Benefit highlights */}
          <div className="mt-12 space-y-6">
            {[
              { title: "Portfolio Showcase", desc: "Customizable portfolio templates that highlight your work" },
              { title: "Professional Network", desc: "Connect with clients and fellow designers worldwide" },
              { title: "Project Management", desc: "Tools to manage your creative projects efficiently" },
            ].map((benefit, i) => (
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
                  <h3 className="text-white font-medium">{benefit.title}</h3>
                  <p className="text-white/60 text-sm">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Designer statistics */}
          <div className="mt-12 grid grid-cols-3 gap-6 w-full max-w-lg">
            {[
              { value: "10k+", label: "Designers" },
              { value: "3.5M", label: "Projects" },
              { value: "96%", label: "Success Rate" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + (i * 0.2) }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}