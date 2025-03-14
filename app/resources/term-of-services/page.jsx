'use client';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import React from 'react';

const TermsOfService = () => {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];
  const handleChange = (e) => {
    console.log(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10 px-10 flex flex-col items-center">
      
      <div className="h-[20rem] flex flex-col justify-center  items-center px-4">
      <h2 className="mb-4 sm:mb-8 text-2xl text-center sm:text-5xl dark:text-white text-black">
        Terms of Service,<br />Please read these terms carefully before using our platform.
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>

      
      {/* Terms Content */}
      <div className="w-full max-w-7xl bg-white p-12 rounded-lg shadow-xl">
        <h2 className="text-4xl font-semibold mb-8">1. Introduction</h2>
        <p className="text-lg text-gray-700 mb-10">By accessing and using our website, you agree to abide by these terms and conditions. If you do not agree with any part of the terms, you must discontinue use of our services.</p>
        
        <h2 className="text-4xl font-semibold mb-8">2. User Responsibilities</h2>
        <p className="text-lg text-gray-700 mb-10">Users must ensure that any content posted on the platform does not violate any laws or infringe on the rights of others. Any form of misuse or abuse will result in account suspension.</p>
        
        <h2 className="text-4xl font-semibold mb-8">3. Intellectual Property</h2>
        <p className="text-lg text-gray-700 mb-10">All content, including but not limited to logos, images, and text, is the property of our platform. Unauthorized reproduction or distribution is strictly prohibited.</p>
        
        <h2 className="text-4xl font-semibold mb-8">4. Payment & Subscriptions</h2>
        <p className="text-lg text-gray-700 mb-10">For premium features, we offer subscription plans. All payments are final and non-refundable unless otherwise stated.</p>
        
        <h2 className="text-4xl font-semibold mb-8">5. Privacy Policy</h2>
        <p className="text-lg text-gray-700 mb-10">We value your privacy and ensure that your data is protected. Please refer to our Privacy Policy for further details.</p>
        
        <h2 className="text-4xl font-semibold mb-8">6. Termination</h2>
        <p className="text-lg text-gray-700 mb-10">We reserve the right to terminate user accounts that violate our terms or engage in harmful activities.</p>
        
        <h2 className="text-4xl font-semibold mb-8">7. Changes to Terms</h2>
        <p className="text-lg text-gray-700 mb-10">We may update these terms from time to time. Users will be notified of any significant changes.</p>
        
        <h2 className="text-4xl font-semibold mb-8">8. Dispute Resolution</h2>
        <p className="text-lg text-gray-700 mb-10">Any disputes related to these terms shall be resolved through arbitration in accordance with applicable laws.</p>
        
        <h2 className="text-4xl font-semibold mb-8">9. Governing Law</h2>
        <p className="text-lg text-gray-700 mb-10">These terms are governed by the laws of the country in which we operate. Any legal matters must be resolved in the designated jurisdiction.</p>
        
        <h2 className="text-4xl font-semibold mb-8">10. Contact Information</h2>
        <p className="text-lg text-gray-700 mb-10">If you have any questions regarding these terms, please contact our support team at <span className="text-blue-600 font-semibold">support@malerium.com</span>.</p>
        
        <div className="text-center mt-16">
          <p className="text-gray-600 text-lg">For additional information, visit our <span className="text-blue-600 font-semibold">Help Center</span> or reach out to our customer support.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
