'use client';
import React from 'react';
import { motion } from 'framer-motion';


const CareersPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-800  text-white py-16 px-6 flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-7xl text-center mb-16">
      
        <h1 className="text-6xl font-extrabold leading-tight text-gray-800 drop-shadow-md">Join Our Team</h1>
        <p className="text-lg text-gray-500 mt-4 max-w-3xl mx-auto">We are looking for passionate and talented individuals to grow with us. Be part of something big and impactful.</p>
      </div>
      
      {/* Job Openings Section */}
      <div className="w-full max-w-7xl mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="bg-gradient-to-b from-gray-400 to-neutral-500 dark:from-neutral-950 dark:to-neutral-800 p-8 rounded-2xl shadow-2xl border border-gray-200 hover:shadow-gray-800 transform hover:scale-105 transition duration-500 ease-in-out"
            >
              <h3 className="text-2xl font-semibold text-gray-900">Job Title {index + 1}</h3>
              <p className="text-white mt-2">Exciting opportunity to work in a dynamic environment with a supportive team.</p>
              <button className="mt-4 bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 transition">Apply Now</button>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* About Careers Section */}
      <div className="w-full max-w-6xl text-center mb-16">
        <h2 className="text-5xl font-bold text-gray-800 drop-shadow-md">Why Work With Us?</h2>
        <p className="text-lg text-gray-500 mt-4 max-w-4xl mx-auto">
          We provide a dynamic work environment, career growth opportunities, and an innovative culture where you can thrive.
        </p>
      </div>
      
      {/* Application Process */}
      <div className="w-full max-w-7xl mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {['Submit Application', 'Interview', 'Job Offer'].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 hover:shadow-gray-700 transform hover:scale-105 transition duration-500 ease-in-out"
            >
              <h3 className="text-2xl font-semibold text-blue-300">{step}</h3>
              <p className="text-gray-300 mt-2">Understand the process and get prepared for the best career opportunity.</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="mt-16 w-full max-w-7xl text-center">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:bg-gray-800 transition duration-300 drop-shadow-md"
        >
          Explore Careers
        </motion.button>
      </div>
    </div>
  );
};

export default CareersPage;
