import React, { useState } from 'react';
import API from '../axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      // OTP string mein convert kar rahe hain comparison ke liye
      setServerOtp(String(data.otpValue));
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "User not found or Email error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (otpInput !== serverOtp) return alert("Invalid OTP code!");

    setLoading(true);
    try {
      await API.post('/auth/reset-password', { email, password: newPassword });
      alert("Success! Your password has been reset. ✨");
      navigate('/login');
    } catch (err) {
      alert("Failed to update password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-900 p-10 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800"
      >
        {/* Back to Login Link */}
        <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-pink-600 mb-8 transition-colors text-xs font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Back to login
        </Link>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <Mail className="text-pink-500" size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Recover Access</h2>
                <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-widest leading-relaxed">
                  Apna registered email enter karein <br/> hum aapko 4-digit OTP bhejenge.
                </p>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                  <input 
                    required 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-white border-none transition" 
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Send OTP"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <ShieldCheck className="text-pink-500" size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white uppercase tracking-tighter">New Credentials</h2>
                <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-widest">
                  Email check karein aur naya password set karein.
                </p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                  <input 
                    required 
                    maxLength="4" 
                    placeholder="4-digit OTP" 
                    className="w-full pl-12 pr-4 py-4 text-center text-xl tracking-[0.5rem] font-bold bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-white border-none transition" 
                    onChange={e => setOtpInput(e.target.value)} 
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                  <input 
                    required 
                    type="password" 
                    placeholder="Set New Password" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-white border-none transition" 
                    onChange={e => setNewPassword(e.target.value)} 
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-pink-600 transition-all shadow-lg"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;