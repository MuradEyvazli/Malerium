'use client';

import React, { useState, useEffect } from 'react';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Search, 
  FileText, 
  Shield, 
  DollarSign, 
  UserCheck, 
  Eye, 
  X, 
  Settings, 
  Scale, 
  Globe, 
  Mail,
  ArrowRight,
  Download,
  Printer,
  Clock,
  Copy
} from 'lucide-react';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastUpdated] = useState('March 15, 2025');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  
  // Placeholders for search component
  const placeholders = [
    "Search legal terms...",
    "Look up copyright policy...",
    "Find refund information...",
    "Search user rights...",
    "Look up data privacy..."
  ];
  
  // Section data with icons and content
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <FileText size={24} />,
      content: `
        <p>Welcome to Malerium! These Terms of Service ("Terms") govern your access to and use of the Malerium website, services, and applications (collectively, the "Services").</p>
        
        <p>By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these terms, you must not access or use our Services.</p>
        
        <p>Malerium is a design blog and resource platform that provides inspiration, tutorials, and creative resources to designers and creative professionals worldwide. Our mission is to foster a community of creativity and innovation.</p>
        
        <p>Please read these Terms carefully before using our platform. If you have any questions or concerns about these Terms, please contact us at <a href="mailto:legal@malerium.com">legal@malerium.com</a>.</p>
      `
    },
    {
      id: 'user-responsibilities',
      title: 'User Responsibilities',
      icon: <UserCheck size={24} />,
      content: `
        <p>As a user of our Services, you are responsible for:</p>
        
        <ul>
          <li><strong>Account Security:</strong> Maintaining the security of your account and password. Malerium cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</li>
          
          <li><strong>Accurate Information:</strong> Providing accurate and complete information when creating an account or using our Services.</li>
          
          <li><strong>Legal Compliance:</strong> Ensuring that your use of our Services complies with all applicable laws, regulations, and these Terms.</li>
          
          <li><strong>Content Responsibility:</strong> Any content you post, upload, or otherwise make available through our Services. You represent and warrant that you own or have the necessary rights to use such content.</li>
          
          <li><strong>Prohibited Activities:</strong> You must not engage in any activity that could harm our Services or other users, including but not limited to: distributing malware, attempting to gain unauthorized access, or engaging in any form of harassment.</li>
        </ul>
        
        <p>Any violation of these responsibilities may result in immediate termination of your account and access to our Services, at our sole discretion.</p>
      `
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: <Shield size={24} />,
      content: `
        <p>All content, features, and functionality of our Services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, software, and the design, selection, and arrangement thereof, are owned by Malerium, its licensors, or other providers of such material.</p>
        
        <p><strong>Copyright Protection:</strong> Our content is protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
        
        <p><strong>Limited License:</strong> We grant you a limited, non-exclusive, non-transferable, and revocable license to access and use our Services for your personal, non-commercial use. This license is subject to these Terms and does not include:</p>
        
        <ul>
          <li>Modifying or copying our materials</li>
          <li>Using any material for any commercial purpose or public display</li>
          <li>Attempting to decompile or reverse engineer any software contained in our Services</li>
          <li>Removing any copyright or other proprietary notations</li>
          <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
        </ul>
        
        <p><strong>User-Generated Content:</strong> You retain ownership of any content you submit, post, or display on or through our Services. By submitting content, you grant Malerium a worldwide, royalty-free, non-exclusive license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in connection with providing our Services.</p>
      `
    },
    {
      id: 'payment-subscriptions',
      title: 'Payment & Subscriptions',
      icon: <DollarSign size={24} />,
      content: `
        <p>Malerium offers both free and premium subscription plans to access our Services. When you subscribe to a premium plan, the following terms apply:</p>
        
        <p><strong>Payment Terms:</strong></p>
        <ul>
          <li>All payments are processed securely through our payment processors.</li>
          <li>Prices are in USD unless otherwise specified and do not include taxes, which may be added to the final price.</li>
          <li>You agree to pay all charges at the prices then in effect for your subscription.</li>
          <li>You authorize us to charge your chosen payment method for all fees incurred.</li>
        </ul>
        
        <p><strong>Subscription Terms:</strong></p>
        <ul>
          <li>Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.</li>
          <li>You can cancel your subscription at any time through your account settings or by contacting our support team.</li>
          <li>Upon cancellation, you will continue to have access to premium features until the end of your current billing period.</li>
        </ul>
        
        <p><strong>Refund Policy:</strong></p>
        <ul>
          <li>All payments are final and non-refundable unless required by law or at our sole discretion.</li>
          <li>If you believe you are entitled to a refund, please contact our support team at <a href="mailto:support@malerium.com">support@malerium.com</a>.</li>
        </ul>
        
        <p><strong>Price Changes:</strong> We reserve the right to adjust pricing for our Services at any time. If we change pricing, we will provide notice of the change on our website or by email at least 30 days before the change takes effect.</p>
      `
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      icon: <Eye size={24} />,
      content: `
        <p>At Malerium, we take your privacy seriously. Our Privacy Policy explains how we collect, use, and protect your personal information when you use our Services.</p>
        
        <p>By using our Services, you agree to the collection and use of information in accordance with our Privacy Policy. Some key points include:</p>
        
        <ul>
          <li><strong>Data Collection:</strong> We collect information you provide directly to us, information we collect automatically when you use our Services, and information from third parties.</li>
          
          <li><strong>Use of Data:</strong> We use your information to provide, maintain, and improve our Services, to communicate with you, and to personalize your experience.</li>
          
          <li><strong>Data Sharing:</strong> We do not sell your personal information. We may share your information with third-party service providers who help us operate our Services, comply with legal obligations, or for other limited purposes with your consent.</li>
          
          <li><strong>Data Security:</strong> We implement appropriate technical and organizational measures to protect your personal information.</li>
          
          <li><strong>Your Rights:</strong> Depending on your location, you may have rights regarding your personal information, such as the right to access, correct, or delete your data.</li>
        </ul>
        
        <p>For complete details, please review our full <a href="/privacy-policy" class="text-blue-600 hover:underline">Privacy Policy</a>.</p>
      `
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: <X size={24} />,
      content: `
        <p>Malerium reserves the right to terminate or suspend your account and access to our Services immediately, without prior notice or liability, for any reason, including, without limitation, if you breach these Terms.</p>
        
        <p><strong>Effects of Termination:</strong></p>
        <ul>
          <li>Upon termination, your right to use our Services will immediately cease.</li>
          <li>If applicable, any outstanding balance owed to us will become immediately due.</li>
          <li>We may delete your account information and content at our discretion.</li>
          <li>Certain provisions of these Terms will survive termination, including intellectual property rights, limitation of liability, and dispute resolution provisions.</li>
        </ul>
        
        <p><strong>Account Deactivation:</strong> You may deactivate your account at any time by following the instructions in your account settings or by contacting our support team.</p>
        
        <p>Malerium is not liable to you or any third party for termination of your access to our Services.</p>
      `
    },
    {
      id: 'changes-to-terms',
      title: 'Changes to Terms',
      icon: <Settings size={24} />,
      content: `
        <p>We may revise and update these Terms from time to time at our sole discretion. All changes are effective immediately when we post them.</p>
        
        <p><strong>Notification of Changes:</strong></p>
        <ul>
          <li>For material changes to these Terms, we will provide notice through our Services or by other means, such as email.</li>
          <li>For non-material changes, we may not provide notice before the change takes effect.</li>
        </ul>
        
        <p>Your continued use of our Services following the posting of revised Terms means that you accept and agree to the changes. We encourage you to review these Terms regularly to stay informed about our policies.</p>
        
        <p>The date these Terms were last revised is provided at the top of this page.</p>
      `
    },
    {
      id: 'dispute-resolution',
      title: 'Dispute Resolution',
      icon: <Scale size={24} />,
      content: `
        <p>In the event of any dispute, claim, question, or disagreement arising from or relating to these Terms or your use of our Services, we encourage you to first contact us directly to seek a resolution.</p>
        
        <p><strong>Informal Resolution:</strong> If you have a concern or dispute, please contact us at <a href="mailto:legal@malerium.com">legal@malerium.com</a>. Most concerns can be resolved quickly through this process.</p>
        
        <p><strong>Formal Dispute Resolution:</strong> If we cannot resolve a dispute informally, any legal action or proceeding shall be settled by binding arbitration, in accordance with the commercial arbitration rules of the American Arbitration Association (AAA).</p>
        
        <p><strong>Arbitration Process:</strong></p>
        <ul>
          <li>The arbitration will be conducted in the English language.</li>
          <li>The arbitration will be conducted by a single arbitrator selected by mutual agreement.</li>
          <li>The arbitration will take place in [Jurisdiction].</li>
          <li>The arbitrator's decision will be final and binding on both parties.</li>
        </ul>
        
        <p><strong>Class Action Waiver:</strong> You agree that any proceedings to resolve disputes will be conducted on an individual basis and not as a class action, consolidated action, or private attorney general action.</p>
      `
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      icon: <Globe size={24} />,
      content: `
        <p>These Terms and your use of our Services are governed by and construed in accordance with the laws of Azerbaijan, without giving effect to any principles of conflicts of law.</p>
        
        <p>Any legal suit, action, or proceeding arising out of or related to these Terms or our Services shall be instituted exclusively in the courts of Azerbaijan, although we retain the right to bring any suit, action, or proceeding against you for breach of these Terms in your country of residence or any other relevant country.</p>
        
        <p>You agree to waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.</p>
      `
    },
    {
      id: 'contact-information',
      title: 'Contact Information',
      icon: <Mail size={24} />,
      content: `
        <p>If you have any questions or concerns about these Terms, please contact us:</p>
        
        <p><strong>By Email:</strong> <a href="mailto:legal@malerium.com">legal@malerium.com</a> or <a href="mailto:support@malerium.com">support@malerium.com</a></p>
        
        <p><strong>By Mail:</strong><br>
        Malerium Legal Department<br>
        12 Design District<br>
        Baku, Azerbaijan</p>
        
        <p>We strive to respond to all inquiries within 2 business days.</p>
        
        <p>For urgent matters, please include "URGENT" in your email subject line.</p>
      `
    },
  ];

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 2) {
      // Search through all sections
      const results = sections.filter(section => {
        const contentText = stripHtml(section.content).toLowerCase();
        return contentText.includes(e.target.value.toLowerCase()) || 
               section.title.toLowerCase().includes(e.target.value.toLowerCase());
      });
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  // Helper function to strip HTML tags
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Copy to clipboard function
  const copyToClipboard = () => {
    const termsText = sections.map(section => {
      return `${section.title}\n\n${stripHtml(section.content)}\n\n`;
    }).join('');
    
    navigator.clipboard.writeText(termsText).then(() => {
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    });
  };

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
      
      // Find active section based on scroll position
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      ).filter(Boolean);
      
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        const rect = element.getBoundingClientRect();
        
        if (rect.top <= 150) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      
      // Expand the section when navigated to
      setExpandedSections(prev => ({
        ...prev,
        [sectionId]: true
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      {/* Progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />
      
      {/* Header */}
      <div className="relative bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-gray-500 mt-1 flex items-center">
                <Clock size={16} className="mr-1" /> Last updated: {lastUpdated}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {copiedToClipboard ? (
                  <>
                    <Check size={16} className="text-green-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
              
              <a 
                href="#" 
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const termsText = sections.map(section => {
                    return `${section.title}\n\n${stripHtml(section.content)}\n\n`;
                  }).join('');
                  
                  const blob = new Blob([termsText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'malerium-terms-of-service.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download size={16} />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="bg-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">Looking for something specific?</h2>
            <div className="relative">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
                className="w-full py-3 px-4 pr-12 rounded-lg text-gray-900 placeholder-gray-500 border-none focus:ring-2 focus:ring-white/30 bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search size={20} className="text-gray-400" />
              </div>
              
              {/* Search results dropdown */}
              {showSearchResults && searchTerm.length > 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <ul className="py-2">
                      {searchResults.map(result => (
                        <li key={result.id}>
                          <button 
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => {
                              scrollToSection(result.id);
                              setShowSearchResults(false);
                              setSearchTerm('');
                            }}
                          >
                            {result.icon}
                            <span className="text-gray-900">{result.title}</span>
                            <ArrowRight size={16} className="ml-auto text-gray-400" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No matching terms found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content with sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24">
              <nav className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Contents</h3>
                </div>
                <ul className="py-2">
                  {sections.map(section => (
                    <li key={section.id}>
                      <button 
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors ${
                          activeSection === section.id ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-blue-600">{section.icon}</span>
                        <span>{section.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              
              {/* Help card */}
              <div className="mt-6 bg-blue-50 rounded-lg p-5 border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Need Help?</h3>
                <p className="text-blue-700 text-sm mb-4">If you have any questions about our Terms of Service, we're here to help.</p>
                <a 
                  href="/contact"
                  className="inline-flex items-center text-sm text-blue-600 font-medium hover:text-blue-700"
                >
                  Contact Support
                  <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-8 md:p-10">
                {sections.map(section => (
                  <motion.div 
                    key={section.id}
                    id={section.id}
                    className={`mb-10 pb-10 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                          {section.icon}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{section.title}</h2>
                      </div>
                      
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        {expandedSections[section.id] ? (
                          <ChevronUp size={20} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-500" />
                        )}
                      </button>
                    </div>
                    
                    {(expandedSections[section.id] === undefined || expandedSections[section.id]) && (
                      <div className="mt-6 text-gray-700 prose prose-blue prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Agreement section */}
            <div className="mt-8 bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Agreement</h3>
              <p className="text-gray-700 mb-6">
                By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
              <div className="flex items-center gap-2">
                <Check size={20} className="text-green-600" />
                <p className="text-gray-900 font-medium">Last updated: {lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related links */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Related Legal Documents</h2>
            <p className="text-gray-400">Other important policies you should be aware of</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/privacy-policy" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Privacy Policy</h3>
              <p className="text-gray-400 mb-4">Learn how we collect, use, and protect your personal information.</p>
              <div className="flex items-center text-blue-400 font-medium">
                Read More <ArrowRight size={16} className="ml-1" />
              </div>
            </a>
            
            <a href="/cookie-policy" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Cookie Policy</h3>
              <p className="text-gray-400 mb-4">Understand how we use cookies and similar technologies.</p>
              <div className="flex items-center text-blue-400 font-medium">
                Read More <ArrowRight size={16} className="ml-1" />
              </div>
            </a>
            
            <a href="/community-guidelines" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Community Guidelines</h3>
              <p className="text-gray-400 mb-4">Our standards for maintaining a respectful community.</p>
              <div className="flex items-center text-blue-400 font-medium">
                Read More <ArrowRight size={16} className="ml-1" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;