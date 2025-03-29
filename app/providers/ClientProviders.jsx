"use client";
import React from "react";
import { Provider } from "react-redux";
import store from "@/app/store/store";
import { AuthProvider } from "@/app/context/AuthContext";
import { ToastContainer } from "react-toastify";
import { Navbar1Demo } from "@/components/NavbarDemo";
import Footer from "@/components/Footer";
import AuthStateDetector from "@/components/AuthStateDetector";
import { usePathname } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function ClientProviders({ children }) {
  const pathname = usePathname();
  const showNavbar = !pathname.startsWith('/blog');
  const showFooter = !pathname.startsWith('/login') && !pathname.startsWith('/signup');
  
  return (
    <Provider store={store}>
      <AuthProvider>
        <AuthStateDetector />
        {showNavbar && <Navbar1Demo />}
        <ToastContainer position="top-right" autoClose={3000} />
        {children}
        {showFooter && <Footer />}
      </AuthProvider>
    </Provider>
  );
}