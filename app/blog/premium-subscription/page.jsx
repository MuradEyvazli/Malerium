"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Check, CreditCard, Eye, BarChart4, Zap, Shield, Heart } from 'lucide-react';
import { HiOutlineHeart, HiHeart, HiOutlineChat, HiOutlineGlobeAlt } from "react-icons/hi";
import { motion } from 'framer-motion';
import axios from 'axios';

const PremiumSubscriptionPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Premium plan details
  const plan = {
    monthly: {
      price: 19.99,
      period: 'month'
    },
    annual: {
      price: 199.99,
      period: 'year',
      discount: 17 // Calculated discount percentage
    }
  };
  
  // Key benefits of premium membership
  const benefits = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Enhanced Visibility",
      description: "Your work appears in the Discover section for maximum exposure to potential clients and collaborators"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Featured Projects",
      description: "Your best projects stay at the top of search results with premium placement across the platform"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Premium Badge",
      description: "Stand out with an exclusive badge that highlights your premium status to visitors"
    },
    {
      icon: <BarChart4 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Access detailed insights about who's viewing your work and how they interact with it"
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Posts per page for pagination
  const postsPerPage = 6;
  
  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/auth/all-posts");
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
    
    // Get current user
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const response = await axios.get("/api/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data.currentUser);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // Handle post view increment
  const handlePostView = async (postId) => {
    if (!postId) return;
    
    try {
      await axios.post(
        "/api/auth/view-post",
        { postId },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Failed to record view:", error);
    }
  };
  
  // Handle like
  const handleLike = async (postId) => {
    if (!currentUser) {
      alert("Please log in first!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/auth/like-post",
        { postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update posts state with the new like
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? {
                ...post,
                likes: post.likes?.includes(currentUser._id)
                  ? post.likes.filter(id => id !== currentUser._id)
                  : [...(post.likes || []), currentUser._id]
              }
            : post
        )
      );
    } catch (error) {
      console.error("Like error:", error);
    }
  };
  
  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24">
        {/* Background elements */}
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-6">
              <Star className="h-3.5 w-3.5 mr-2 text-purple-600" />
              Premium Experience
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Elevate Your Creative Presence
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mb-10">
              Get discovered faster, showcase your work to a wider audience, and join the exclusive community of premium creators.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white shadow-sm transition-all">
                Get Premium Now
              </button>
              <button className="px-8 py-4 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                Explore Features
              </button>
            </div>
          </div>
          
          {/* Preview Cards */}
          <div className="relative max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Featured project card 1 */}
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="https://images.pexels.com/photos/31174247/pexels-photo-31174247/free-photo-of-cin-mahallesi-nde-semsiyeyle-yuruyen-kadin.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                    alt="Premium project showcase"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center px-2 py-1 bg-purple-600 rounded text-xs font-medium text-white">
                      <Star className="h-3 w-3 mr-1" fill="white" />
                      Premium
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Digital Product Design</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Alex Morgan</p>
                        <p className="text-xs text-gray-500">Product Designer</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">14.5K views</div>
                  </div>
                </div>
              </div>
              
              {/* Featured project card 2 */}
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md transform md:scale-105 z-10">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="https://images.pexels.com/photos/26794620/pexels-photo-26794620/free-photo-of-doga-tekneler-gemiler-orman.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Premium project showcase"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center px-2 py-1 bg-purple-600 rounded text-xs font-medium text-white">
                      <Star className="h-3 w-3 mr-1" fill="white" />
                      Premium
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">3D Character Animation</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">David Wong</p>
                        <p className="text-xs text-gray-500">3D Illustrator</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">22.8K views</div>
                  </div>
                </div>
              </div>
              
              {/* Featured project card 3 */}
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="https://images.pexels.com/photos/29983389/pexels-photo-29983389/free-photo-of-istanbul-da-bitkilerle-dolu-renkli-balkon.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Premium project showcase"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center px-2 py-1 bg-purple-600 rounded text-xs font-medium text-white">
                      <Star className="h-3 w-3 mr-1" fill="white" />
                      Premium
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Brand Identity System</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Sophia Chen</p>
                        <p className="text-xs text-gray-500">Brand Designer</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">18.3K views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-white py-16 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900 mb-2">3.2x</p>
              <p className="text-purple-600">More Profile Views</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900 mb-2">42%</p>
              <p className="text-purple-600">More Engagement</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900 mb-2">50K+</p>
              <p className="text-purple-600">Premium Creators</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900 mb-2">2.8M+</p>
              <p className="text-purple-600">Monthly Visitors</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stand out from the crowd with exclusive features designed to showcase your creative work and build your professional presence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-5 text-purple-600">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial */}
      <section className="py-24 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-full bg-purple-100 mx-auto flex items-center justify-center">
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 italic mb-8">
            "Going premium completely transformed my creative career. Within just a month, I received three major client inquiries, and my portfolio views increased by 400%."
          </blockquote>
          <div className="flex items-center justify-center">
            <div className="w-14 h-14 bg-gray-200 rounded-full mr-4">
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Markus Andersson</p>
              <p className="text-gray-600">Creative Director & UI Designer</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Premium Plan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Invest in your creative career with our flexible premium plans. Cancel anytime.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              {/* Billing Toggle */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-center">
                  <div className="inline-flex rounded-lg p-1 bg-gray-100">
                    <button
                      type="button"
                      className={`relative py-2 px-6 text-sm rounded-lg ${
                        billingPeriod === 'monthly'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                      } transition-all duration-200`}
                      onClick={() => setBillingPeriod('monthly')}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      className={`relative py-2 px-6 text-sm rounded-lg ${
                        billingPeriod === 'annual'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                      } transition-all duration-200`}
                      onClick={() => setBillingPeriod('annual')}
                    >
                      Annual
                      <span className={`absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full ${billingPeriod === 'annual' ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                        Save {plan.annual.discount}%
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Price */}
              <div className="p-8 text-center">
                <div className="mb-8">
                  <span className="text-5xl font-bold text-gray-900">${plan[billingPeriod].price}</span>
                  <span className="text-gray-500 ml-2">/{plan[billingPeriod].period}</span>
                </div>
                
                <ul className="space-y-4 mb-8 text-left max-w-sm mx-auto">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-gray-700">Priority placement in Discover section</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-gray-700">Premium badge on your profile and projects</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-gray-700">Detailed performance analytics for your work</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-gray-700">Direct messaging with potential clients</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                    <span className="text-gray-700">Priority customer support</span>
                  </li>
                </ul>
                
                <button className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white shadow-sm transition-all flex items-center justify-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Get Premium Now
                </button>
                
                <p className="text-gray-500 text-sm mt-4 flex items-center justify-center">
                  <Shield className="h-4 w-4 mr-1" />
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Premium Projects - Updated to show all posts like blog page */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how you can showcase your work and being discovered
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : currentPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <div className="w-16 h-16 text-gray-300 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500 mb-6">
                Check back later for new premium content.
              </p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {currentPosts.map((post, i) => (
                <motion.div
                  key={`post-${post._id || i}`}
                  variants={fadeInUp}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  {/* Post Image */}
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <div className="absolute inset-0">
                      <Link href={`/blog/${post._id}`} className="block w-full h-full">
                        {post.images && post.images.length > 0 ? (
                          <div className="w-full h-full relative">
                            <Image
                              src={post.images[0]}
                              alt={post.title || "No Title"}
                              fill
                              className="object-cover transition-transform duration-700 hover:scale-105"
                              priority
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <HiOutlineGlobeAlt className="text-gray-400 w-10 h-10" />
                          </div>
                        )}
                      </Link>      
                      {/* Categories */}
                      {post.categories && post.categories.length > 0 && (
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                          {post.categories.slice(0, 2).map((cat, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-purple-500/90 text-white px-2 py-1 rounded-full font-medium backdrop-blur-sm"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <Link href={`/blog/${post._id}`}>
                      <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-purple-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {post.title || "Untitled Post"}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                      {post.description || post.content?.substring(0, 120) || "No Content"}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="relative overflow-hidden rounded-full group">
                          <Image
                            src={post.author?.avatar || "/fallback-avatar.png"}
                            alt={post.author?.name || "Anonymous User"}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {post.author?.name || "Anonymous User"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {post.createdAt 
                          ? new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) 
                          : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleLike(post._id)}
                        className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        {post.likes?.includes(currentUser?._id) ? (
                          <HiHeart className="w-5 h-5 text-red-500" />
                        ) : (
                          <HiOutlineHeart className="w-5 h-5" />
                        )}
                        <span className="text-sm">{post.likes?.length || 0}</span>
                      </button>
                      
                      <div className="flex items-center gap-1 text-gray-600">
                        <HiOutlineChat className="w-5 h-5" />
                        <span className="text-sm">{post.comments?.length || 0}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-gray-600">
                        <Eye className="h-5 w-5" />
                        <span className="text-sm">{post.views || 0}</span>
                      </div>
                      
                      <Link 
                        href={`/blog/${post._id}`}
                        onClick={() => handlePostView(post._id)}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors hover:underline"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
                disabled={currentPage === 1}
                className={`mx-1 px-3 h-10 flex items-center justify-center rounded-l-lg text-sm font-semibold transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={`page-${index + 1}`}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`mx-1 w-10 h-10 flex items-center justify-center rounded-md text-sm font-semibold transition ${
                    currentPage === index + 1
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                disabled={currentPage === totalPages}
                className={`mx-1 px-3 h-10 flex items-center justify-center rounded-r-lg text-sm font-semibold transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Elevate Your Creative Presence?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of creative professionals who are getting discovered and growing their careers with premium features.
          </p>
          <button className="px-8 py-4 bg-purple-600 text-white rounded-lg font-medium shadow-sm hover:bg-purple-700 transition-all text-lg">
            Get Premium Today
          </button>
          <p className="mt-4 text-gray-500">
            30-day money-back guarantee
          </p>
        </div>
      </section>
      
      {/* CSS for line clamping */}
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PremiumSubscriptionPage;