'use client';
import React from 'react';
import { motion } from 'framer-motion';

const SupportPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 p-10">
      {/* Hero Section */}
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-5xl font-bold leading-tight">Need Help?</h1>
        <p className="text-lg text-gray-500 mt-4">Our support team is here for you. Reach out and let us assist you.</p>
      </div>
      
      {/* Support Options */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: "Live Chat", desc: "Talk to our experts instantly.", icon: "💬" },
          { title: "Email Support", desc: "Expect a response within 24 hours.", icon: "📧" },
          { title: "Help Center", desc: "Browse FAQs and guides.", icon: "📖" },
        ].map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md text-center hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">{option.icon}</div>
            <h3 className="text-2xl font-semibold">{option.title}</h3>
            <p className="text-gray-600 mt-2">{option.desc}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Contact Form */}
      <div className="w-full max-w-3xl mt-16 text-center">
        <h2 className="text-4xl font-bold">Contact Us</h2>
        <p className="text-lg text-gray-500 mt-4">Fill out the form below, and we’ll get back to you shortly.</p>
        <div className="mt-6 bg-gray-50 p-8 rounded-lg shadow-md border border-gray-300">
          <input type="text" placeholder="Your Name" className="w-full p-3 mb-4 border border-gray-300 rounded-md" />
          <input type="email" placeholder="Your Email" className="w-full p-3 mb-4 border border-gray-300 rounded-md" />
          <textarea placeholder="Your Message" rows="4" className="w-full p-3 mb-4 border border-gray-300 rounded-md"></textarea>
          <button className="w-full p-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
