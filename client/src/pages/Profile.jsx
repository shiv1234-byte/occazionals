import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Plus, Trash2, Home, ShieldCheck, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../axios'; // ✅ Central API Instance use kar rahe hain

const Profile = () => {
  const { user, token, login } = useAuth(); 
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // ✅ Address save loading state
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', street: '', city: '', pincode: '', state: ''
  });

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // ✅ URL updated to use API instance
      const { data } = await API.post('/auth/add-address', newAddress);
      
      if (data.success) {
        // Update user context with new addresses
        login({ ...user, addresses: data.addresses }, token);
        setShowAddAddress(false);
        setNewAddress({ fullName: '', phone: '', street: '', city: '', pincode: '', state: '' });
        alert("Address successfully saved! ✨");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Address save nahi ho paya!");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Function to delete address (Optional but recommended)
  const handleDeleteAddress = async (addressId) => {
    if(!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const { data } = await API.delete(`/auth/address/${addressId}`);
      if (data.success) {
        login({ ...user, addresses: data.addresses }, token);
      }
    } catch (err) {
      alert("Address delete karne mein problem aayi.");
    }
  };

  if (!user) return (
    <div className="pt-40 text-center font-serif text-gray-500 dark:text-gray-400 min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      Account details dekhne ke liye login karein.
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen bg-transparent dark:bg-gray-950 transition-colors duration-500">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white transition-colors">My Profile</h1>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 mt-2 transition-colors"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* --- LEFT SIDE: USER CARD --- */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            <div className="w-24 h-24 bg-pink-50 dark:bg-pink-900/10 rounded-[30px] flex items-center justify-center text-pink-600 dark:text-pink-500 mb-6 shadow-inner transition-colors">
              <User size={48} />
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase font-black tracking-widest mb-1">Account Holder</p>
                <p className="font-bold text-gray-800 dark:text-white text-xl transition-colors">{user.name}</p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl transition-colors">
                <Mail className="text-gray-400 dark:text-gray-600" size={16}/>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">{user.email}</p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl transition-colors">
                <Phone className="text-gray-400 dark:text-gray-600" size={16}/>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">+91 {user.phone}</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-green-600 dark:text-green-500 font-bold text-[10px] uppercase tracking-widest transition-colors">
                <ShieldCheck size={14}/> Verified Member
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: ADDRESSES --- */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-serif font-bold text-gray-800 dark:text-white transition-colors">Saved Delivery Addresses</h2>
            <button 
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-pink-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-pink-600 dark:hover:bg-white dark:hover:text-black transition-all shadow-lg"
            >
              {showAddAddress ? <X size={14} /> : <Plus size={14} />} 
              {showAddAddress ? "Cancel" : "Add New Address"}
            </button>
          </div>

          <AnimatePresence>
            {showAddAddress && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border-2 border-dashed border-pink-100 dark:border-pink-900/30 mb-8 transition-colors"
              >
                <form onSubmit={handleAddAddress} className="grid md:grid-cols-2 gap-4">
                  <input required className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 text-sm transition placeholder:text-gray-400 dark:placeholder:text-gray-600" placeholder="Recipient's Name" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} />
                  <input required className="p-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 text-sm transition placeholder:text-gray-400 dark:placeholder:text-gray-600" placeholder="Phone Number" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                  <input required className="p-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 text-sm transition placeholder:text-gray-400 dark:placeholder:text-gray-600" placeholder="Pincode" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} />
                  <input required className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 text-sm transition placeholder:text-gray-400 dark:placeholder:text-gray-600" placeholder="House No, Area, Street" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                  <input required className="p-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 text-sm transition placeholder:text-gray-400 dark:placeholder:text-gray-600" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                  <input required className="p-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 text-sm transition placeholder:text-gray-400 dark:placeholder:text-gray-600" placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                  <button disabled={isSaving} className="md:col-span-2 bg-pink-600 text-white py-4 rounded-2xl font-bold hover:bg-black dark:hover:bg-white dark:hover:text-black transition shadow-lg disabled:bg-gray-400 flex items-center justify-center gap-2">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : "Save This Address"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LIST CARDS */}
          <div className="grid gap-6">
            {user.addresses && user.addresses.length > 0 ? (
              user.addresses.map((addr, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 flex justify-between items-center hover:shadow-xl dark:hover:shadow-pink-900/10 transition-all group">
                  <div className="flex gap-5 items-center">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 group-hover:text-pink-500 transition-colors">
                      <Home size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-100 transition-colors">{addr.fullName} <span className="text-gray-400 dark:text-gray-600 font-normal text-sm ml-2">| {addr.phone}</span></p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteAddress(addr._id || index)}
                    className="p-2 text-gray-200 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[40px] border border-dashed border-gray-100 dark:border-gray-800 transition-colors">
                <MapPin className="mx-auto text-gray-200 dark:text-gray-700 mb-3" size={40} />
                <p className="text-gray-400 dark:text-gray-600 font-serif italic text-sm">Abhi koi address save nahi hai.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;