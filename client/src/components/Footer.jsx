import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone, Gem, ShieldCheck, Truck, MessageCircle } from 'lucide-react';

const Footer = () => {
  // Helper function: Link click par page ko upar le jane ke liye
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-50 dark:bg-[#121212] text-gray-600 dark:text-gray-300 pt-16 pb-8 transition-colors duration-500 border-t border-gray-200 dark:border-none">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- Top Section: Trust Badges --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 border-b border-gray-200 dark:border-gray-800 pb-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="text-pink-600 dark:text-pink-500" size={32} />
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900 dark:text-white">Quality Assured</h4>
            <p className="text-xs text-gray-500 dark:text-gray-500">Premium Finish & Long Lasting Shine</p>
          </div>
          <div className="flex flex-col items-center gap-3 border-x border-gray-200 dark:border-gray-800">
            <Truck className="text-pink-600 dark:text-pink-500" size={32} />
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900 dark:text-white">Fast Shipping</h4>
            <p className="text-xs text-gray-500 dark:text-gray-500">Safe Delivery across India from Kota Hub</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Gem className="text-pink-600 dark:text-pink-500" size={32} />
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900 dark:text-white">Authentic Designs</h4>
            <p className="text-xs text-gray-500 dark:text-gray-500">Handpicked Kundan & AD Collections</p>
          </div>
        </div>

        {/* --- Main Footer Content --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* 1. Brand Intro */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold tracking-tighter text-gray-900 dark:text-white uppercase">Occasionals.</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Based in Kota, Rajasthan. We bring you the finest artificial jewelry that looks as real as gold. Perfect for weddings and daily elegance.
            </p>
            <div className="flex gap-4 pt-2">
              <a 
                href="https://www.instagram.com/occasionals_affordableluxury" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-colors"
              >
                <Instagram size={20}/>
              </a>
              <a 
                href="https://wa.me/919251194430" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
              >
                <MessageCircle size={20}/>
              </a>
            </div>
          </div>

          {/* 2. Quick Shop */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-gray-400 dark:text-gray-500">Collections</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/catalog" onClick={handleLinkClick} className="hover:text-pink-600 dark:hover:text-white transition">Kundan Jewellery</Link></li>
              <li><Link to="/catalog" onClick={handleLinkClick} className="hover:text-pink-600 dark:hover:text-white transition">Anti Tarnish Sets</Link></li>
              <li><Link to="/catalog" onClick={handleLinkClick} className="hover:text-pink-600 dark:hover:text-white transition">American Diamond</Link></li>
              <li><Link to="/catalog" onClick={handleLinkClick} className="hover:text-pink-600 dark:hover:text-white transition">Jhumka Earrings</Link></li>
            </ul>
          </div>

          {/* 3. Information (✅ Clickable Pages Added) */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-gray-400 dark:text-gray-500">Customer Care</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/about" onClick={handleLinkClick} className="hover:text-pink-600 dark:hover:text-white transition">Our Story</Link></li>
              <li><Link to="/shipping-policy" onClick={handleLinkClick} className="hover:text-pink-600 dark:hover:text-white transition">Shipping Policy</Link></li>
              <li><Link to="/returns-policy" onClick={handleLinkClick} className="hover:text-pink-600 dark:hover:text-white transition">Return & Exchange</Link></li>
              <li><Link to="/privacy-policy" onClick={handleLinkClick} className="hover:text-pink-600 dark:hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" onClick={handleLinkClick} className="hover:text-pink-600 dark:hover:text-white transition">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* 4. Contact Details */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-gray-400 dark:text-gray-500">Contact Us</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex gap-3 items-start">
                <MapPin size={18} className="text-pink-600 dark:text-pink-500 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 font-medium">Kota, Rajasthan - 324005</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={18} className="text-pink-600 dark:text-pink-500 shrink-0" />
                <span className="text-gray-900 dark:text-white font-bold">+91 92511 94430</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={18} className="text-pink-600 dark:text-pink-500 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 font-medium">support@occasionalsjewels.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* --- Bottom Copyright --- */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
          <p className="text-[10px] font-bold uppercase tracking-widest dark:text-gray-600">
            © 2026 Occasionals Jewels. Created by Shiv Kumar Rathor.
          </p>
          <div className="flex gap-4 items-center opacity-40 dark:opacity-30 grayscale transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;