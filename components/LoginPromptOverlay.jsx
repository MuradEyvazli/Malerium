"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HiLogin, HiUserAdd, HiOutlineX } from 'react-icons/hi';

const LoginPromptOverlay = ({ 
  show, 
  onClose, 
  redirectTo = '/login',
  message = 'Please log in to continue',
  featureName = 'this feature'
}) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const timerRef = useRef(null);
  
  // Handle countdown
  useEffect(() => {
    if (!show) return;
    
    // Reset countdown when modal opens
    setCountdown(10);
    setShouldRedirect(false);
    
    // Create countdown timer
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        const newCount = prev - 1;
        if (newCount <= 0) {
          clearInterval(timerRef.current);
          // Set flag to redirect instead of directly using router
          setShouldRedirect(true);
          return 0;
        }
        return newCount;
      });
    }, 1000);
    
    // Clear timer on unmount or when modal closes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [show]);
  
  // Handle redirect in a separate effect
  useEffect(() => {
    if (shouldRedirect && show) {
      const encodedRedirectUrl = encodeURIComponent(redirectTo);
      router.push(`/login?callbackUrl=${encodedRedirectUrl}`);
    }
  }, [shouldRedirect, redirectTo, router, show]);
  
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.4 
            }}
            className="relative bg-white bg-opacity-90 backdrop-blur-md w-full max-w-md mx-4 rounded-xl overflow-hidden shadow-2xl z-10 border border-white/20"
          >
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              aria-label="Close"
            >
              <HiOutlineX className="w-6 h-6" />
            </button>
            
            <div className="p-6 md:p-8">
              {/* Logo/Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500 to-purple-600 flex items-center justify-center">
                <HiLogin className="w-10 h-10 text-white" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-2">
                Authentication Required
              </h3>
              
              {/* Message */}
              <p className="text-center text-gray-600 mb-6">
                You need to log in or register to use {featureName}. {message}
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(redirectTo)}`}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <HiLogin className="w-5 h-5" />
                  <span>Log In</span>
                </Link>
                
                <Link
                  href={`/signup?callbackUrl=${encodeURIComponent(redirectTo)}`}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <HiUserAdd className="w-5 h-5" />
                  <span>Sign Up</span>
                </Link>
              </div>
              
              {/* Continue as guest or skip option */}
              <button
                onClick={onClose}
                className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                Continue browsing as guest
              </button>
              
              {/* Countdown */}
              <div className="mt-6 text-center">
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: `${countdown * 10}%` }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-purple-600"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Redirecting to login page in <span className="font-medium">{countdown}</span> seconds
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginPromptOverlay;