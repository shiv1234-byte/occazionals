import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(data.user, data.token); // Save to Global Context
      navigate('/catalog');
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 flex items-center justify-center px-6 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to manage your rentals and orders.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" 
              placeholder="Email" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-black text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg">
            <LogIn size={18} /> Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          New to Occazionals? <Link to="/signup" className="text-black font-semibold underline">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;