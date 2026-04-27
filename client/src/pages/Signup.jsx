import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, MapPin, Building, Hash, Navigation, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../axios'; 

const Signup = () => {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [address, setAddress] = useState({ fullName: '', phone: '', street: '', city: '', pincode: '', state: '' });
  const [otpInput, setOtpInput] = useState('');
  const [receivedOtp, setReceivedOtp] = useState(''); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- STEP 1: Send OTP ---
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    
    // Form Validation
    if (!formData.phone || formData.phone.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      // ✅ String conversion to prevent ".toString()" undefined errors
      const phoneStr = String(formData.phone || "").trim();
      
      const { data } = await API.post('/auth/send-otp', { phone: phoneStr });
      
      // Agar backend testing ke liye OTP bhej raha hai (Fast2SMS bina DLT wale logic ke liye)
      if (data.otpValue) {
        setReceivedOtp(String(data.otpValue));
      }
      
      setStep(2);
    } catch (err) {
      console.error("OTP Error:", err);
      alert(err.response?.data?.message || "OTP service down. Check API Balance or Network.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: Verify & Final Register ---
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Frontend OTP Check (Backend validation is safer, but this is for instant UI feedback)
      if (receivedOtp && otpInput.toString() !== receivedOtp) {
        setLoading(false);
        alert("Invalid OTP! Check the message again.");
        return;
      }

      // Backend par final registration call
      await API.post('/auth/register', formData);
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Email or Phone might exist.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 3: Initial Address Setup ---
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/add-initial-address', { 
        email: formData.email, 
        address: { 
          ...address, 
          fullName: address.fullName || formData.name, 
          phone: address.phone || formData.phone 
        } 
      });
      alert("Registration Successful! ✨ Welcome to Occasionals.");
      navigate('/login');
    } catch (err) {
      // User create ho chuka hai, address fail bhi hua toh login bhejo
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
          
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Occasionals.</h1>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 italic">Luxury in every detail ✨</p>
              </div>
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                  <input required className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition placeholder:text-gray-400" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                  <input required type="tel" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition placeholder:text-gray-400" placeholder="Mobile Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                  <input required type="email" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition placeholder:text-gray-400" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                  <input required type="password" minLength={6} className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition placeholder:text-gray-400" placeholder="Set Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <button disabled={loading} className="w-full bg-black dark:bg-pink-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-pink-600 transition shadow-xl disabled:bg-gray-400">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <>Continue <ArrowRight size={18} /></>}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: OTP UI */}
          {step === 2 && (
            <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
              <div className="text-center">
                <ShieldCheck className="mx-auto text-pink-600 dark:text-pink-500 mb-4" size={64} />
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Verify Code</h2>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">Sent to <b className="text-gray-900 dark:text-gray-200">+91 {formData.phone}</b></p>
                <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                  <input 
                    required 
                    maxLength="4"
                    className="w-full text-center text-3xl tracking-[1.5rem] font-bold py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-2 border-dashed border-pink-200 dark:border-pink-900/30 focus:border-pink-500 outline-none transition" 
                    placeholder="0000"
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                  />
                  <button disabled={loading} className="w-full bg-pink-600 text-white py-5 rounded-2xl font-bold shadow-lg hover:bg-black transition-all disabled:bg-gray-400 uppercase tracking-widest text-xs">
                    {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Verify & Register"}
                  </button>
                  <p onClick={() => setStep(1)} className="text-[10px] text-gray-400 dark:text-gray-600 cursor-pointer uppercase font-black tracking-widest hover:text-pink-500 transition">Edit Number</p>
                </form>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ADDRESS */}
          {step === 3 && (
            <motion.div key="step3" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <div className="text-center mb-6">
                <MapPin className="mx-auto text-pink-600 dark:text-pink-500 mb-2" size={32} />
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Shipping Info</h2>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 italic">Deliveries from Kota Hub 📍</p>
              </div>
              <form onSubmit={handleAddAddress} className="space-y-3">
                <input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-1 focus:ring-pink-500 text-sm transition" placeholder="Recipient Name" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} />
                <input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-1 focus:ring-pink-500 text-sm transition" placeholder="Building / Street / Area" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                <div className="grid grid-cols-2 gap-3">
                  <input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-1 focus:ring-pink-500 text-sm transition" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                  <input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-1 focus:ring-pink-500 text-sm transition" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                </div>
                <input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-1 focus:ring-pink-500 text-sm transition" placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                
                <button disabled={loading} className="w-full bg-black dark:bg-pink-600 text-white py-4 rounded-xl font-bold mt-4 hover:opacity-90 transition-all shadow-lg disabled:bg-gray-400 uppercase tracking-widest text-xs">
                  {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Save & Finish"}
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>

        {step === 1 && (
          <p className="mt-8 text-center text-[10px] text-gray-500 dark:text-gray-400 uppercase font-black tracking-widest">
            Member already? <Link to="/login" className="text-pink-600 dark:text-pink-500 hover:underline">Sign In</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Signup;