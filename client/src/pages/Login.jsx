import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import axios from 'axios';

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
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (data.success) {
        login(data.user, data.token); 
        navigate('/catalog');
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl p-10 border border-gray-100 dark:border-gray-800 transition-colors duration-500"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold mb-2 text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm italic tracking-wide">Premium jewelry box access karein ✨</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-black dark:bg-pink-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-pink-600 dark:hover:bg-white dark:hover:text-black transition-all shadow-xl group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <LogIn size={18} className="group-hover:translate-x-1 transition-transform" /> 
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          New to Occasionals? <Link to="/signup" className="text-pink-600 dark:text-pink-500 font-bold hover:underline">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;