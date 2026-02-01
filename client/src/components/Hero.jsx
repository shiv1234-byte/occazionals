import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Background Image - Replace URL with your fashion shot */}
      <img 
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070" 
        alt="Fashion Banner" 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-5xl md:text-7xl font-serif mb-6"
        >
          Elegance, <span className="italic">Redefined.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-gray-200 text-lg md:text-xl max-w-2xl mb-10 font-light"
        >
          Rent designer outfits for your special occasions or own them forever. 
          Sustainable luxury for the modern woman.
        </motion.p>

        <motion.div 
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.8 }}
  className="flex flex-col md:flex-row gap-4 items-center"
>
  {/* EXPLORE COLLECTION LINK */}
  <Link 
    to="/catalog" 
    className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-200 transition flex items-center group shadow-xl"
  >
    Explore Collection 
    <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
  </Link>

  {/* HOW IT WORKS LINK (Points to About page or opens modal) */}
  <Link 
    to="/about"
    className="border border-white text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black transition"
  >
    How It Works
  </Link>
</motion.div>
      </div>

      {/* Bottom Gradient overlay */}
      <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero;