import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, User, Menu, X, Search, LogOut, Info, Layers, Sun, Moon, LayoutDashboard 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navLinks = [
    { name: 'Collections', path: '/catalog', icon: <Layers size={18} /> },
    { name: 'About Us', path: '/about', icon: <Info size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-[9999] h-20 flex items-center transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800 shadow-md py-4' 
            : 'bg-transparent border-b border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          
          {/* --- MOBILE: Hamburger Menu --- */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setIsOpen(true)} 
              className="p-3 bg-pink-600 text-white rounded-xl shadow-lg hover:scale-105 transition"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* --- CENTER/LEFT: LOGO & DESKTOP LINKS --- */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center">
              <span className={`text-xl md:text-2xl font-serif font-black tracking-tighter uppercase transition-colors duration-500 ${
                isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'
              }`}>
                OCCASIONALS<span className="text-pink-600">.</span>
              </span>
            </Link>

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
                    isScrolled 
                      ? 'text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-500' 
                      : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* ✅ ADMIN BUTTON (Desktop) - Only for occasionalsjewels */}
              {user && user.isAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className="bg-pink-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg animate-pulse"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* --- RIGHT: ICONS --- */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2 transition-colors duration-500 ${
                isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'
              } hover:text-pink-600`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className={`p-2 transition-colors duration-500 ${
                isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'
              } hover:text-pink-600`}
            >
              <Search size={20} />
            </button>

            {/* DESKTOP ACCOUNT SECTION */}
            <div className={`hidden md:flex items-center gap-4 border-l pl-4 transition-colors duration-500 ${
              isScrolled ? 'border-gray-100 dark:border-gray-800' : 'border-white/20'
            }`}>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/profile" 
                    className={`text-[10px] font-black uppercase tracking-widest hover:text-pink-500 transition-colors duration-500 ${
                      isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-200'
                    }`}
                  >
                    My Account
                  </Link>
                  <button onClick={handleLogout} className="text-red-500 hover:scale-110 transition">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className={`text-[10px] font-black uppercase tracking-widest hover:text-pink-500 transition-colors duration-500 ${
                    isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-200'
                  }`}
                >
                  Login
                </Link>
              )}
            </div>

            <Link 
              to="/cart" 
              className={`relative p-2 transition-colors duration-500 ${
                isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'
              } hover:text-pink-600`}
            >
              <ShoppingBag size={22} />
              {cartItems?.length > 0 && (
                <span className="absolute top-0 right-0 bg-pink-600 text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0a0a0a]">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR DRAWER (FOR MOBILE) --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsOpen(false)} 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10001]" 
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'tween' }} 
              className="fixed top-0 left-0 w-[80%] max-w-[300px] h-screen bg-white dark:bg-[#0a0a0a] z-[10002] shadow-2xl p-8 flex flex-col" 
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-serif font-black text-xl dark:text-white uppercase tracking-tighter">
                  Menu<span className="text-pink-600">.</span>
                </span>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full dark:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {/* ✅ ADMIN LINK (Mobile Sidebar) */}
                {user && user.isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center gap-4 text-lg font-bold text-pink-600 bg-pink-50 dark:bg-pink-900/20 p-4 rounded-2xl"
                  >
                    <LayoutDashboard size={20} /> Admin Dashboard
                  </Link>
                )}

                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center gap-4 text-xl font-bold dark:text-white hover:text-pink-600 p-2"
                  >
                    <span className="text-pink-600">{link.icon}</span> {link.name}
                  </Link>
                ))}

                <hr className="border-gray-100 dark:border-gray-800 my-2" />

                {user ? (
                  <div className="space-y-6">
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-lg font-bold dark:text-gray-300 p-2">
                      <User size={20} className="text-pink-600"/> My Account
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-4 text-lg font-bold text-red-500 uppercase tracking-widest p-2"
                    >
                      <LogOut size={20} /> Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)} 
                    className="w-full bg-pink-600 text-white py-4 rounded-2xl text-center font-bold uppercase tracking-widest shadow-lg"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;