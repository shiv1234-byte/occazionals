import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cartItems, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!user) {
      // Login par bhejte waqt current page yaad rakhein taaki login ke baad wapas cart pe aaye
      alert("Please login to proceed with your jewelry order.");
      navigate('/login', { state: { from: '/cart' } }); 
      return;
    }
    navigate('/checkout');
  };

  // EMPTY CART STATE
  if (cartItems.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center px-6 animate-in fade-in duration-700 bg-transparent dark:bg-gray-950 transition-colors duration-500 min-h-screen">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-pink-50 dark:bg-pink-900/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ShoppingBag size={60} className="text-pink-200 dark:text-pink-900/40" />
        </motion.div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Your jewelry box is empty</h2>
        <p className="text-gray-400 dark:text-gray-500 mt-2 mb-10 tracking-widest uppercase text-[10px] font-black flex items-center justify-center gap-2">
          <Sparkles size={12} className="text-pink-500"/> Add some sparkle to your life <Sparkles size={12} className="text-pink-500"/>
        </p>
        <Link to="/catalog" className="bg-black dark:bg-pink-600 text-white px-10 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-pink-600 dark:hover:bg-white dark:hover:text-black transition-all shadow-lg">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto min-h-screen bg-transparent dark:bg-gray-950 transition-colors duration-500">
      <div className="flex items-baseline gap-4 mb-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">Shopping Bag</h1>
        <span className="text-gray-400 dark:text-gray-500 text-sm font-medium tracking-tighter">
          ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cart Items List */}
        <div className="lg:w-2/3 space-y-8">
          <AnimatePresence mode='popLayout'>
            {cartItems.map((item) => (
              <motion.div 
                layout 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.cartId} 
                className="flex flex-col sm:flex-row gap-8 bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 group shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Product Image */}
                <div className="w-full sm:w-32 h-40 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shrink-0">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => {e.target.src = 'https://placehold.co/400x400?text=Jewelry'}}
                  />
                </div>
                
                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-pink-600 dark:text-pink-500 font-black uppercase tracking-[0.2em] mb-1">{item.category}</p>
                        <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.cartId)} 
                        className="p-3 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-all"
                        title="Remove Item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    {/* Trust Badges */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                       <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-500 dark:text-green-600"/> Certified Quality</span>
                       <span className="flex items-center gap-1"><Truck size={14} className="text-blue-500 dark:text-blue-400"/> Kota Hub Dispatch</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end pt-4">
                    <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full border border-transparent dark:border-gray-700">Quantity: 1</div>
                    <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">₹{item.salePrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary Card */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[40px] sticky top-32 shadow-2xl shadow-pink-100/20 dark:shadow-none border border-gray-50 dark:border-gray-800 transition-colors">
            <h2 className="text-2xl font-serif font-bold mb-8 text-gray-900 dark:text-white">Order Summary</h2>
            
            <div className="space-y-4 text-sm border-b border-gray-100 dark:border-gray-800 pb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 dark:text-gray-500 font-medium">Bag Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 dark:text-gray-500 font-medium">Shipping</span>
                <span className="text-green-600 dark:text-green-500 font-black uppercase text-[10px] tracking-widest">Complimentary</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 dark:text-gray-500 font-medium">Estimated GST (3%)</span>
                <span className="text-gray-900 dark:text-white font-bold italic">Included</span>
              </div>
            </div>
            
            <div className="flex justify-between py-10">
              <span className="text-xl font-serif font-bold text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-3xl font-serif font-bold text-pink-600 dark:text-pink-500">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            <button 
              onClick={handleProceedToCheckout} 
              className="w-full bg-black dark:bg-pink-600 text-white py-6 rounded-[24px] font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-pink-600 dark:hover:bg-white dark:hover:text-black transition-all shadow-xl shadow-gray-200 dark:shadow-none group"
            >
              Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
            
            <div className="mt-8 flex flex-col items-center gap-4">
               <div className="flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-1 w-8 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                  ))}
               </div>
               <p className="text-[9px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest text-center">
                 Secure checkout with buyer protection
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;