"use client";

import { useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { fetchCurrentUser } from "@/app/features/UserSlice"; // Adjust the import path as needed

export default function AuthStateDetector() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { isLoggedIn, setIsLoggedIn, setUser } = useContext(AuthContext);
  
  // Function to check for authentication tokens
  const hasAuthTokens = () => {
    if (typeof window === "undefined") return false;
    
    const localToken = localStorage.getItem("token");
    
    const getCookieValue = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    
    const cookieToken = getCookieValue("clientToken") || getCookieValue("token");
    
    return Boolean(localToken || cookieToken);
  };

  // Effect to handle initial page load
  useEffect(() => {
    if (!isLoggedIn && hasAuthTokens()) {
      console.log("Auth tokens detected, fetching user data...");
      dispatch(fetchCurrentUser())
        .unwrap()
        .then(userData => {
          if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
          }
        })
        .catch(error => {
          console.error("Failed to fetch user data:", error);
        });
    }
  }, [isLoggedIn, dispatch, setUser, setIsLoggedIn]);
  
  // Effect to handle Google OAuth redirects
  useEffect(() => {
    const isPostGoogleAuth = 
      pathname === "/blog" && 
      typeof window !== "undefined" && 
      document.referrer.includes("/api/auth/google");
    
    if (isPostGoogleAuth) {
      console.log("Detected redirect from Google auth, refreshing user data");
      
      setTimeout(() => {
        dispatch(fetchCurrentUser())
          .unwrap()
          .then(userData => {
            if (userData) {
              setUser(userData);
              setIsLoggedIn(true);
            }
          })
          .catch(error => {
            console.error("Failed to fetch user data after Google auth:", error);
          });
      }, 300);
    }
  }, [pathname, dispatch, setUser, setIsLoggedIn]);
  
  return null;
}