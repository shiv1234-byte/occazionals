import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Calendar, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  if (loading) return <div className="pt-40 text-center">Loading your history...</div>;

  return (
    <div className="pt-28 pb-16 px-6 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-3xl font-serif mb-10">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={order._id} 
              className="bg-white border rounded-2xl p-6 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-xl">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order #{order._id.slice(-8)}</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold">Total</p>
                    <p className="font-semibold text-lg">₹{order.totalPrice}</p>
                  </div>
                  
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.isDelivered ? 'Delivered' : 'In Transit'}
                  </div>
                  
                  <ChevronRight size={20} className="text-gray-300" />
                </div>
              </div>

              {/* Items Preview */}
              <div className="mt-6 pt-6 border-t flex gap-3 overflow-x-auto">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg min-w-200px">
                    <img src={item.image} alt="" className="w-12 h-16 object-cover rounded" />
                    <div className="text-xs">
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-gray-400 uppercase">{item.orderType} • {item.size}</p>
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