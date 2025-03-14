'use client';
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 px-6">
      {/* Hero Section */}
      <div className="text-center mb-16 mt-5">
        <h1 className="text-6xl font-bold">Contact Us</h1>
        <p className="text-lg text-gray-600 mt-4">Let's connect and collaborate!</p>
      </div>
      
      {/* Contact Form & Info */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-12">
        {/* Contact Form */}
        <div className="flex-1 bg-gray-100 p-10 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6">Send us a message</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full p-4 border border-gray-300 rounded-lg" />
            <input type="email" placeholder="Email Address" className="w-full p-4 border border-gray-300 rounded-lg" />
            <textarea placeholder="Your Message" rows="5" className="w-full p-4 border border-gray-300 rounded-lg"></textarea>
            <button className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition">Submit</button>
          </form>
        </div>
        
        {/* Contact Info */}
        <div className="flex-1 flex flex-col justify-center gap-8">
          <div className="flex items-center gap-4">
            <MapPin className="size-8 text-black" />
            <p className="text-lg font-medium">Baku, Azerbaijan</p>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="size-8 text-black" />
            <p className="text-lg font-medium">+994 50 123 45 67</p>
          </div>
          <div className="flex items-center gap-4">
            <Mail className="size-8 text-black" />
            <p className="text-lg font-medium">support@malerium.com</p>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="w-full max-w-6xl mt-16 h-80 overflow-hidden rounded-lg shadow-lg">
        <iframe
          className="w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.848689306354!2d49.86709281526303!3d40.40926137936542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d55caa07c97%3A0x97f5ef48f02687a2!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1649782653672!5m2!1sen!2s"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
