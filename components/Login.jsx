'use client'
import React from 'react';
import { motion } from 'framer-motion';

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 to-black">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96 text-white border border-white/20"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Welcome Back</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input type="email" placeholder="Enter your email" className="w-full mt-1 p-3 bg-white/20 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium">Password</label>
          <input type="password" placeholder="Enter your password" className="w-full mt-1 p-3 bg-white/20 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg transition-all"
        >
          Login
        </motion.button>

        <p className="text-sm text-center mt-4 opacity-75">Don't have an account? <span className="text-blue-400 cursor-pointer hover:underline">Sign up</span></p>
      </motion.div>
    </div>
  );
}

export default Login;