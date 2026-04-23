import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, MapPin, Building, Hash, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Signup = () => {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [address, setAddress] = useState({ fullName: '', phone: '', street: '', city: '', pincode: '', state: '' });
  const [otpInput, setOtpInput] = useState('');
  const [serverOtp, setServerOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/send-otp', { phone: formData.phone });
      setServerOtp(data.otpHash);
      setStep(2);
    } catch (err) {
      alert("OTP bhejne mein dikat aayi.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (otpInput === serverOtp.toString()) {
      setLoading(true);
      try {
        await axios.post('http://localhost:5000/api/auth/register', formData);
        setStep(3);
      } catch (err) {
        alert(err.response?.data?.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Invalid OTP! Try again.");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/add-initial-address', { 
        email: formData.email, 
        address: { ...address, fullName: address.fullName || formData.name, phone: address.phone || formData.phone } 
      });
      alert("Registration & Address Setup Complete!");
      navigate('/login');
    } catch (err) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 flex items-center justify-center px-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      <motion.div 
        layout
        className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl p-10 border border-gray-100 dark:border-gray-800 transition-colors duration-500 overflow-hidden"
      >
        <AnimatePresence mode='wait'>
          
          {/* STEP 1: BASIC DETAILS */}
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Create Account</h1>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 italic">Premium Jewelry awaits you ✨</p>
              </div>
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                  <input required className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition placeholder:text-gray-400" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                  <input required className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition placeholder:text-gray-400" placeholder="Mobile (WhatsApp)" onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                  <input required type="email" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition placeholder:text-gray-400" placeholder="Email Address" onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                  <input required type="password" title="Min 6 characters" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition placeholder:text-gray-400" placeholder="Set Password" onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <button disabled={loading} className="w-full bg-black dark:bg-pink-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-pink-600 dark:hover:bg-white dark:hover:text-black transition shadow-xl disabled:bg-gray-400">
                  {loading ? "Sending..." : <>Verify Mobile <ArrowRight size={18} /></>}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
            <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
              <div className="text-center">
                <ShieldCheck className="mx-auto text-pink-600 dark:text-pink-500 mb-4" size={64} />
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Verify OTP</h2>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">OTP sent to <b className="text-gray-900 dark:text-gray-200">+91 {formData.phone}</b></p>
                <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                  <input 
                    required 
                    maxLength="6"
                    className="w-full text-center text-3xl tracking-[1rem] font-bold py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-2 border-dashed border-pink-200 dark:border-pink-900/30 focus:border-pink-500 outline-none transition" 
                    placeholder="000000"
                    onChange={e => setOtpInput(e.target.value)}
                  />
                  <button className="w-full bg-pink-600 text-white py-5 rounded-2xl font-bold shadow-lg hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all">Confirm & Next</button>
                  <p onClick={() => setStep(1)} className="text-sm text-gray-400 dark:text-gray-600 cursor-pointer underline">Edit Phone Number</p>
                </form>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ADDRESS SETUP */}
          {step === 3 && (
            <motion.div key="step3" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <div className="text-center mb-6">
                <MapPin className="mx-auto text-pink-600 dark:text-pink-500 mb-2" size={32} />
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Delivery Address</h2>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 italic">Kota ship karne ke liye address add karein 📍</p>
              </div>
              <form onSubmit={handleAddAddress} className="space-y-3">
                <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" size={16} />
                   <input required className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-1 focus:ring-pink-500 text-sm transition" placeholder="Full Name (Delivery)" onChange={e => setAddress({...address, fullName: e.target.value})} />
                </div>
                <div className="relative">
                   <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" size={16} />
                   <input required className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-1 focus:ring-pink-500 text-sm transition" placeholder="House No / Street / Landmark" onChange={e => setAddress({...address, street: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" size={16} />
                    <input required className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-1 focus:ring-pink-500 text-sm transition" placeholder="City" onChange={e => setAddress({...address, city: e.target.value})} />
                  </div>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" size={16} />
                    <input required className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-1 focus:ring-pink-500 text-sm transition" placeholder="Pincode" onChange={e => setAddress({...address, pincode: e.target.value})} />
                  </div>
                </div>
                <input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-1 focus:ring-pink-500 text-sm transition" placeholder="State" onChange={e => setAddress({...address, state: e.target.value})} />
                
                <button className="w-full bg-black dark:bg-pink-600 text-white py-4 rounded-xl font-bold mt-4 hover:bg-pink-600 dark:hover:bg-white dark:hover:text-black transition-all shadow-lg shadow-gray-200 dark:shadow-none">
                  Complete Setup
                </button>
                <p onClick={() => navigate('/login')} className="text-center text-[10px] text-gray-400 dark:text-gray-600 cursor-pointer hover:underline mt-2 uppercase font-black tracking-widest">
                  Skip for now
                </p>
              </form>
            </motion.div>
          )}

        </AnimatePresence>

        {step === 1 && (
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account? <Link to="/login" className="text-pink-600 dark:text-pink-500 font-bold hover:underline">Login</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Signup;