import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Menu, X, Search as SearchIcon, LogOut, Package } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAuthenticated, logout } = useAuth() || {};
  const { cartItems } = useCart() || { cartItems: [] };
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery.trim()}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isHomePage = location.pathname === '/';
  const textColor = (isScrolled || !isHomePage || isSearchOpen) ? 'text-black' : 'text-white';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || !isHomePage ? 'bg-white shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl auto px-6 flex justify-between items-center">
        
        {/* Left: Brand */}
        <Link to="/" className={`text-2xl font-serif tracking-widest ${textColor}`}>
          OCCAZIONALS
        </Link>

        {/* Center: Navigation Links */}
        {!isSearchOpen && (
          <div className={`hidden md:flex items-center gap-8 ${textColor}`}>
            <Link to="/catalog" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition">
              Catalog
            </Link>
            <Link to="/about" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition">
              About Us
            </Link>
            
            {/* Conditional My Orders Link */}
            {isAuthenticated && (
              <Link to="/my-orders" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition">
                My Orders
              </Link>
            )}

            {user?.isAdmin && (
              <Link to="/admin" className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 hover:opacity-50 transition">
                Admin
              </Link>
            )}
          </div>
        )}

        {/* Right: Icons (Search, Auth, Cart) */}
        <div className="flex items-center space-x-6">
          
          {/* Search Toggle */}
          <div className="flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-1.5 animate-in fade-in zoom-in duration-300">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search collections..." 
                  className="bg-transparent border-none outline-none text-sm w-32 md:w-64 text-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                />
                <X size={16} className="cursor-pointer text-gray-500" onClick={() => setIsSearchOpen(false)} />
              </div>
            ) : (
              <SearchIcon 
                size={20} 
                className={`cursor-pointer hover:opacity-70 transition ${textColor}`} 
                onClick={() => setIsSearchOpen(true)} 
              />
            )}
          </div>

          {/* User Section */}
          <div className={`hidden md:flex items-center gap-4 ${textColor}`}>
            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Member</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{user?.name?.split(' ')[0]}</span>
                </div>
                <button onClick={logout} className="hover:text-red-500 transition" title="Logout">
                  <LogOut size={18}/>
                </button>
              </div>
            ) : (
              <Link to="/login" className="hover:opacity-70" title="Login">
                <User size={20} />
              </Link>
            )}
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className={`relative hover:opacity-70 transition ${textColor}`}>
            <ShoppingBag size={20} />
            {cartItems?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;