'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, X, Loader2, Instagram, Twitter, Facebook, Linkedin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ContactPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  // Form status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
      setFormError('Please fill in all required fields');
      setTimeout(() => setFormError(null), 3000);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      setTimeout(() => setFormError(null), 3000);
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Send form data to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
      
      // Set success state
      setFormSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setFormSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Notification message */}
      {(formSuccess || formError) && (
        <div className={`fixed bottom-4 right-4 z-50 py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 ${
          formSuccess ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {formSuccess ? (
            <Check className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
          <span>{formSuccess ? 'Message sent successfully!' : formError}</span>
        </div>
      )}
      
      {/* Hero Section with Parallax Effect */}
      <div className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-20 -left-20 w-60 h-60 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md h-1 bg-gradient-to-r from-transparent via-black to-transparent opacity-5"></div>
        </div>
        
        {/* Hero content */}
        <div className="relative container mx-auto px-6 md:px-12 py-20 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
              Let's Start a <span className="text-blue-600 relative">
                Conversation
                <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 400 30" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5,13.5 C76.5,11.5 150.5,11.5 225.5,13.5 C300.5,15.5 375.5,17.5 400,22" stroke="rgb(37 99 235 / 20%)" strokeWidth="8" fill="none" strokeLinecap="round"></path>
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Have a question, project idea, or want to collaborate? We'd love to hear from you. 
              Let's create something amazing together.
            </p>
            
            <div className="mt-8 flex justify-center space-x-4">
              <motion.a 
                href="#contact-form"
                className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send a Message <ArrowRight className="ml-2 h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Contact Main Section */}
      <div className="container mx-auto px-6 md:px-12 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
          {/* Contact Form */}
          <motion.div 
            id="contact-form"
            className="lg:col-span-3 bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Send us a message</h2>
              </div>
              
              {formSuccess ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="Tell us about your project, questions or feedback..."
                      required
                    ></textarea>
                  </div>
                  
                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-white font-medium transition-all ${
                        isSubmitting 
                          ? 'bg-blue-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
          
          {/* Contact Information and Social Links */}
          <motion.div 
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <motion.div className="space-y-6" variants={containerVariants}>
                {/* Address */}
                <motion.div className="flex items-start gap-4" variants={itemVariants}>
                  <div className="mt-1 flex-shrink-0 h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Our Location</h4>
                    <p className="text-gray-600 mt-1">
                      Malerium Ofice <br />
                      Baku, Azerbaijan
                    </p>
                  </div>
                </motion.div>
                
                {/* Phone */}
                <motion.div className="flex items-start gap-4" variants={itemVariants}>
                  <div className="mt-1 flex-shrink-0 h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Phone Number</h4>
                    <p className="text-gray-600 mt-1">+90 536 996 54 84</p>
                    <p className="text-gray-500 text-sm">(Mon-Fri, 9am-6pm)</p>
                  </div>
                </motion.div>
                
                {/* Email */}
                <motion.div className="flex items-start gap-4" variants={itemVariants}>
                  <div className="mt-1 flex-shrink-0 h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email Address</h4>
                    <p className="text-gray-600 mt-1">malerium@gmail.com</p>
                    <p className="text-gray-600 mt-1">muradeyvazli18@gmail.com</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Social Media Links */}
            <motion.div 
              className="bg-blue-600 text-white rounded-2xl shadow-xl p-8 md:p-10"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold mb-6">Follow Us</h3>
              <p className="mb-6 text-blue-100">
                Stay connected and updated with our latest work, events, and design insights.
              </p>
              
              <div className="flex space-x-4">
                <a href="#" className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Map Section */}
        <motion.div 
          className="max-w-7xl mx-auto mt-16 rounded-2xl overflow-hidden shadow-xl h-96 sm:h-[500px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.848689306354!2d49.86709281526303!3d40.40926137936542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d55caa07c97%3A0x97f5ef48f02687a2!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1649782653672!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
        
        {/* FAQ Section (Optional) */}
        <div className="max-w-4xl mx-auto mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <p className="text-gray-600 mb-12">
            Can't find the answer you're looking for? Reach out to our customer support team.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">What services does Malerium offer?</h3>
              <p className="text-gray-600">
                Malerium specializes in design blogging, creative solutions, and curating design inspiration from around the world.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">How can I collaborate with Malerium?</h3>
              <p className="text-gray-600">
                We're always open to collaborations! Fill out our contact form with your proposal, and our team will get back to you.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Do you offer design consultations?</h3>
              <p className="text-gray-600">
                Yes, we provide personalized design consultations. Contact us with your requirements for more information.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">How quickly do you respond to inquiries?</h3>
              <p className="text-gray-600">
                We typically respond to all inquiries within 24-48 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;