"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "@/app/store/store";
import { AuthProvider } from "@/app/context/AuthContext";
import { ToastContainer } from "react-toastify";
import { Navbar1Demo } from "@/components/NavbarDemo";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function ClientProviders({ children }) {
  const pathname = usePathname();
  const showNavbar = !pathname.startsWith('/blog');

  return (
    <Provider store={store}>
      <AuthProvider>
        {showNavbar && <Navbar1Demo />}
        <ToastContainer position="top-right" autoClose={3000} />
        {children}
        <Footer />
      </AuthProvider>
    </Provider>
  );
}