import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900 transition-colors duration-500">
      
      {/* ✅ Background Image - Public folder se direct '/' path use karke */}
      <img 
        src="/hero_banner.png" 
        alt="Occasionals Fashion Banner" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40 transition-opacity duration-500"
        onError={(e) => {
          // Backup agar image na mile toh ye solid dark color rakhega
          e.target.src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop"; 
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-5xl md:text-7xl font-serif mb-6 uppercase tracking-tighter"
        >
          Where Tradition Meets <span className="italic text-pink-500">Trend.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-gray-200 dark:text-gray-300 text-lg md:text-xl max-w-2xl mb-10 font-light"
        >
          Discover the art of fine craftsmanship at Occasionals Delhi. 
          <br/> <span className="text-sm tracking-[0.3em] font-bold text-pink-500">KOTA HUB 📍</span>
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          {/* Main Button */}
          <Link 
            to="/catalog" 
            className="bg-white dark:bg-pink-600 text-black dark:text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-pink-600 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center group shadow-xl"
          >
            Explore Collection 
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
          </Link>

          {/* Secondary Button */}
          <Link 
            to="/about"
            className="border border-white text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Our Story
          </Link>
        </motion.div>
      </div>

      {/* Bottom Gradient overlay - Matches the page transition */}
      <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent transition-colors duration-500"></div>
    </div>
  );
};

export default Hero;