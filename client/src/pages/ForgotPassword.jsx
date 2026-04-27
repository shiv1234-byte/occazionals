import React, { useState } from 'react';
import API from '../axios';
import { useNavigate } from 'react-router-dom';

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
      setServerOtp(String(data.otpValue));
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Email error");
    } finally { setLoading(false); }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (otpInput !== serverOtp) return alert("Wrong OTP!");

    setLoading(true);
    try {
      await API.post('/auth/reset-password', { email, password: newPassword });
      alert("Password Reset Done! ✨");
      navigate('/login');
    } catch (err) {
      alert("Error resetting password");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-10 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800">
        
        {step === 1 && (
          <form onSubmit={handleSendEmail} className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-center dark:text-white">Reset Password</h2>
            <input required type="email" placeholder="Enter Registered Email" className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 dark:text-white" onChange={e => setEmail(e.target.value)} />
            <button className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold">{loading ? "Sending..." : "Send OTP"}</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-center dark:text-white">New Credentials</h2>
            <input required maxLength="4" placeholder="4-digit OTP" className="w-full p-4 text-center text-2xl tracking-[1rem] bg-gray-50 dark:bg-gray-800 rounded-2xl dark:text-white" onChange={e => setOtpInput(e.target.value)} />
            <input required type="password" placeholder="Set New Password" className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl dark:text-white" onChange={e => setNewPassword(e.target.value)} />
            <button className="w-full bg-black text-white py-4 rounded-2xl font-bold">{loading ? "Updating..." : "Update Password"}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;