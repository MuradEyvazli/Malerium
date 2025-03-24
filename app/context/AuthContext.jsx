"use client";

import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.currentUser) {
            setUser(data.currentUser);
            setIsLoggedIn(true);
          }
        } else {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();
  }, []);

  // Enhanced logout function
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "clientToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setIsLoggedIn(false);
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}