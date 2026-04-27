import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2, Sparkles } from 'lucide-react';
import API from '../axios'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Backend se user aur token mangwaya
      const { data } = await API.post('/auth/login', { email, password });
      
      if (data.success) {
        // ✅ data.user mein 'isAdmin' field hona zaroori hai
        login(data.user, data.token); 
        
        // Agar admin hai toh direct dashboard bhej sakte ho, varna catalog
        if (data.user.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/catalog');
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Details check karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 flex items-center justify-center px-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl p-10 border border-gray-100 dark:border-gray-800 transition-colors duration-500"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-2">
             <Sparkles className="text-pink-500 animate-pulse" size={24} />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2 text-gray-900 dark:text-white uppercase tracking-tighter">Welcome Back</h1>
          <p className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">Premium jewelry box access karein ✨</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end pr-2">
            <Link 
              to="/forgot-password" 
              className="text-[10px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-black dark:bg-pink-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl uppercase tracking-widest text-xs ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600">
            New to Occasionals? 
            <Link to="/signup" className="ml-2 text-pink-600 dark:text-pink-500 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;