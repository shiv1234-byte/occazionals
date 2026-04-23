import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, User, Menu, X, Heart, Search, LogOut 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext'; // Ensure Path is correct
import { useCart } from '../context/CartContext'; // Ensure Path is correct

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/catalog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed w-full z-[100] bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* --- LEFT: HAMBURGER (Mobile Only) --- */}
        <button 
          className="md:hidden p-2 -ml-2 text-gray-900 dark:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* --- CENTER/LEFT: LOGO --- */}
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-serif font-black tracking-tighter text-gray-900 dark:text-white">
            OCCASIONALS<span className="text-pink-600">.</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* --- RIGHT: ICONS (Always Visible) --- */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Search - Hidden on very small screens */}
          <button className="hidden sm:block p-2 text-gray-900 dark:text-white hover:text-pink-600 transition">
            <Search size={20} />
          </button>

          {/* User Profile / Login */}
          <Link to={user ? "/profile" : "/login"} className="p-2 text-gray-900 dark:text-white hover:text-pink-600 transition flex items-center gap-2">
            <User size={20} />
            {user && <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest">{user.name.split(' ')[0]}</span>}
          </Link>

          {/* Cart with Badge */}
          <Link to="/cart" className="relative p-2 text-gray-900 dark:text-white hover:text-pink-600 transition">
            <ShoppingBag size={20} />
            {cartItems?.length > 0 && (
              <span className="absolute top-0 right-0 bg-pink-600 text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-950">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-xl md:hidden overflow-hidden"
          >
            <div className="p-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-serif font-bold text-gray-900 dark:text-white"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />
              
              {user ? (
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="flex items-center gap-3 text-red-500 font-bold uppercase text-xs tracking-widest"
                >
                  <LogOut size={18} /> Logout Account
                </button>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-black dark:bg-pink-600 text-white py-4 rounded-2xl text-center font-bold uppercase text-xs tracking-[0.2em]"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;