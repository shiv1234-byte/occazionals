import React, { useEffect, useState } from 'react';
import API from '../axios'; // ✅ Central API Instance use kar rahe hain
import { useAuth } from '../context/AuthContext';
import { Package, CheckCircle2, Truck, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // ✅ Localhost URL removed, using API instance
        // Token headers automatically handle honge agar aapne axios interceptor lagaya hai, 
        // warna ye manual headers bhi Render par sahi kaam karenge.
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-500">
      <Loader2 className="animate-spin h-10 w-10 text-pink-600" />
      <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Loading History...</p>
    </div>
  );

  return (
    <div className="pt-28 pb-16 px-6 max-w-5xl mx-auto min-h-screen bg-transparent dark:bg-gray-950 transition-colors duration-500">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-3xl font-serif text-gray-900 dark:text-white">Your Purchase History</h1>
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-gray-800 transition-colors">
          <Package className="mx-auto text-gray-200 dark:text-gray-800 mb-6" size={64} />
          <p className="text-gray-400 dark:text-gray-600 font-serif italic text-xl">Your jewelry box is empty.</p>
          <button 
            onClick={() => navigate('/catalog')}
            className="mt-8 bg-black dark:bg-pink-600 text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={order._id} 
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-6 md:p-8 hover:shadow-2xl hover:shadow-pink-500/5 dark:hover:shadow-pink-500/10 transition-all group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 text-pink-600 dark:text-pink-500 rounded-2xl group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors">
                    {order.isDelivered ? <CheckCircle2 size={24} /> : <Truck size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest">ID: #{order._id.slice(-8).toUpperCase()}</p>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${order.paymentMethod === 'Online' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-500' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-500'}`}>
                        {order.paymentMethod === 'Online' ? 'Paid' : 'COD'}
                      </span>
                    </div>
                    <p className="font-serif text-xl text-gray-900 dark:text-white mt-1 transition-colors">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between border-t md:border-none border-gray-50 dark:border-gray-800 pt-6 md:pt-0 transition-colors">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase font-black tracking-widest mb-1">Grand Total</p>
                    <p className="font-bold text-2xl text-gray-900 dark:text-white transition-colors">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
                      order.isDelivered 
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-500' 
                      : 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-500'
                    }`}>
                      {order.isDelivered ? 'Delivered' : 'Arriving Soon'}
                    </div>
                    <ChevronRight size={20} className="text-gray-300 dark:text-gray-700 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>

              {/* Jewelry Items Preview */}
              <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 flex gap-4 overflow-x-auto no-scrollbar transition-colors">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-gray-50/50 dark:bg-gray-800/40 p-4 rounded-2xl min-w-[260px] border border-transparent hover:border-pink-100 dark:hover:border-pink-900/40 transition-all">
                    <img src={item.image} alt="" className="w-16 h-16 object-cover rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" onError={(e) => {e.target.src = 'https://placehold.co/400x400?text=Jewelry'}} />
                    <div className="text-xs">
                      <p className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1 uppercase tracking-tight transition-colors">{item.name}</p>
                      <p className="text-pink-600 dark:text-pink-500 font-black mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-1 uppercase font-black tracking-tighter">Premium Jewelry</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;