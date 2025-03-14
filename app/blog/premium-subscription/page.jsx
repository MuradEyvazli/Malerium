import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Star, Zap, Award, Check, X } from 'lucide-react';

const PremiumSubscriptionPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'annual'
  
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: {
        monthly: 0,
        annual: 0,
      },
      features: [
        'Create and share basic posts',
        'Personal profile',
        'Follow other creators',
        'Standard search features',
      ],
      limitedFeatures: [
        'No premium content highlights',
        'No priority in search results',
        'No featured showcase',
        'Limited analytics',
      ],
      isPremium: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: {
        monthly: 19.99,
        annual: 199.99,
      },
      features: [
        'Premium content highlighting',
        'Featured placement for your posts',
        'Priority in search results',
        'Extended showcase period',
        'Advanced analytics dashboard',
        'Premium badge on profile',
        'Access to exclusive events',
        'Priority customer support',
      ],
      isPremium: true,
      recommended: true,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: {
        monthly: 49.99,
        annual: 499.99,
      },
      features: [
        'All Premium features',
        'Custom branding options',
        'Multiple featured posts',
        'API access',
        'Collaboration tools',
        'Team member accounts (up to 3)',
        'Dedicated account manager',
        'Early access to new features',
      ],
      isPremium: true,
    },
  ];

  const handlePeriodChange = (period) => {
    setBillingPeriod(period);
  };

  const getDiscount = (monthly, annual) => {
    const monthlyTotal = monthly * 12;
    const savings = ((monthlyTotal - annual) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  return (
    <div  className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Elevate Your <span className="text-yellow-600">Creative Presence</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            Take your Malerium profile to the next level with Premium. Get featured placement, highlight your best work, and stand out in a crowded marketplace.
          </p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10"
          >
            <div className="relative inline-flex rounded-md shadow-sm mx-auto bg-white p-1">
              <button
                type="button"
                className={`relative py-2 px-6 ${
                  billingPeriod === 'monthly'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white text-gray-700'
                } rounded-md font-medium transition-all duration-200`}
                onClick={() => handlePeriodChange('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`relative py-2 px-6 ${
                  billingPeriod === 'annual'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white text-gray-700'
                } rounded-md font-medium transition-all duration-200 ml-2`}
                onClick={() => handlePeriodChange('annual')}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Save {getDiscount(plans[1].price.monthly, plans[1].price.annual)}%
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: plans.indexOf(plan) * 0.1 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                plan.recommended 
                  ? 'ring-4 ring-yellow-500 transform md:-translate-y-4 scale-105' 
                  : ''
              }`}
            >
              {plan.recommended && (
                <div className="bg-yellow-500 text-white py-2 text-center text-sm font-bold uppercase">
                  Recommended
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  {plan.isPremium ? (
                    <span className="flex items-center text-yellow-600">
                      <Star className="h-5 w-5 mr-1 fill-current" />
                      <span className="font-medium">Premium</span>
                    </span>
                  ) : null}
                </div>
                
                <div className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ${plan.price[billingPeriod].toFixed(2)}
                  </span>
                  <span className="ml-1 text-xl font-medium text-gray-500">
                    /{billingPeriod === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                
                <p className="mt-5 text-lg text-gray-500">
                  {plan.isPremium 
                    ? 'Unlock the full potential of Malerium' 
                    : 'Essential features for beginners'}
                </p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                  
                  {plan.limitedFeatures && plan.limitedFeatures.map((feature) => (
                    <li key={feature} className="flex items-start opacity-75">
                      <div className="flex-shrink-0">
                        <X className="h-5 w-5 text-red-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-500">{feature}</p>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <button
                    type="button"
                    className={`w-full rounded-md py-4 px-6 text-base font-medium text-white shadow-sm ${
                      plan.isPremium
                        ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                        : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200`}
                  >
                    {plan.id === 'basic' ? 'Current Plan' : `Get ${plan.name}`}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Benefits Showcase */}
      <div className="max-w-7xl mx-auto mt-32 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">Why Go Premium?</h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Stand out from the crowd and maximize your exposure with our premium features
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-medium text-center text-gray-900">Featured Placement</h3>
              <p className="mt-4 text-gray-500 text-center">
                Your premium posts will be highlighted and featured prominently at the top of search results and category pages.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-8">
              <div className="relative h-64 rounded-lg overflow-hidden shadow-inner">
                <div className="absolute inset-0 flex flex-col">
                  <div className="bg-yellow-600 text-white px-4 py-2 flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">Premium Content</span>
                  </div>
                  <div className="flex-1 bg-gradient-to-b from-gray-100 to-gray-200 p-4">
                    <div className="h-6 w-3/4 bg-yellow-100 rounded mb-3"></div>
                    <div className="h-4 w-1/2 bg-yellow-100 rounded mb-6"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white h-24 rounded shadow-sm"></div>
                      <div className="bg-white h-24 rounded shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-medium text-center text-gray-900">Premium Badge</h3>
              <p className="mt-4 text-gray-500 text-center">
                Display a prestigious premium badge on your profile and posts, signaling quality and commitment to the community.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-8">
              <div className="relative h-64 rounded-lg overflow-hidden shadow-inner bg-white">
                <div className="absolute inset-0 flex flex-col p-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="h-5 w-24 bg-gray-200 rounded"></div>
                        <span className="flex items-center justify-center px-2 py-1 rounded-full text-xs bg-yellow-600 text-white">
                          <Star className="h-3 w-3 mr-1" /> Premium
                        </span>
                      </div>
                      <div className="h-4 w-32 bg-gray-100 rounded mt-1"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col space-y-2">
                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="h-16 bg-gray-100 rounded shadow-sm"></div>
                    <div className="h-16 bg-gray-100 rounded shadow-sm"></div>
                    <div className="h-16 bg-gray-100 rounded shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-medium text-center text-gray-900">Analytics Dashboard</h3>
              <p className="mt-4 text-gray-500 text-center">
                Get detailed insights about your audience, content performance, and engagement metrics.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-8">
              <div className="relative h-64 rounded-lg overflow-hidden shadow-inner bg-white">
                <div className="absolute inset-0 flex flex-col p-4">
                  <div className="h-8 w-32 bg-yellow-100 rounded mb-4"></div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded p-3 flex flex-col">
                      <div className="text-xs text-gray-500 mb-1">Views</div>
                      <div className="text-xl font-bold text-yellow-600">2,547</div>
                      <div className="mt-auto h-8 bg-indigo-50"></div>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-3 flex flex-col">
                      <div className="text-xs text-gray-500 mb-1">Engagement</div>
                      <div className="text-xl font-bold text-yellow-600">18.2%</div>
                      <div className="mt-auto h-8 bg-indigo-50"></div>
                    </div>
                    
                    <div className="col-span-2 bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-500 mb-2">Traffic Sources</div>
                      <div className="grid grid-cols-4 gap-1 h-4">
                        <div className="bg-yellow-600 rounded-l"></div>
                        <div className="bg-yellow-400"></div>
                        <div className="bg-yellow-300"></div>
                        <div className="bg-yellow-200 rounded-r"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto mt-32 mb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-yellow-700 rounded-3xl overflow-hidden shadow-xl"
        >
          <div className="px-6 py-12 sm:px-12 lg:px-16">
            <div className="grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-3">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">
                  What premium members say
                </h2>
                <p className="text-lg text-yellow-100">
                  Join thousands of creative professionals who've already upgraded their Malerium experience
                </p>
              </div>
              
              {[
                {
                  quote: "Since upgrading to Premium, my designs get 3x more engagement. The featured placement has been a game-changer for my freelance business.",
                  author: "Sophia Chen",
                  title: "UI/UX Designer"
                },
                {
                  quote: "The premium badge adds instant credibility to my portfolio. Clients often mention they chose me specifically because I stood out as a premium creator.",
                  author: "Marcus Williams",
                  title: "Photographer"
                }
              ].map((testimonial, i) => (
                <div key={i} className="space-y-4">
                  <p className="text-lg italic text-white">"{testimonial.quote}"</p>
                  <div className="font-medium text-yellow-200">
                    <p>{testimonial.author}</p>
                    <p>{testimonial.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumSubscriptionPage;