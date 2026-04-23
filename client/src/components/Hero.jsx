import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900 transition-colors duration-500">
      {/* Background Image - Opacity low rakhi hai taaki text hamesha visible rahe */}
      <img 
        src="https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/469699e7-9925-4c5d-8e98-99cd365c1f80.png" 
        alt="Fashion Banner" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40 transition-opacity duration-500"
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-5xl md:text-7xl font-serif mb-6"
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
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          {/* Main Button - Adaptive in Dark Mode */}
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
            How It Works
          </Link>
        </motion.div>
      </div>

      {/* Bottom Gradient overlay - FIX: Now Adaptive to Theme */}
      <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-white dark:from-gray-950 to-transparent transition-colors duration-500"></div>
    </div>
  );
};

export default Hero;