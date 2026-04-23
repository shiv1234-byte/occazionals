import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, CheckCircle, Download, ShoppingBag, Truck } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingInvoice, setLoadingInvoice] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  const downloadPremiumInvoice = async (orderId) => {
    setLoadingInvoice(orderId);
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = `Occasionals_Invoice_${orderId.slice(-6).toUpperCase()}.pdf`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Invoice generate nahi ho paya!");
    } finally {
      setLoadingInvoice(null);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen bg-transparent dark:bg-gray-950 transition-colors duration-500">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-pink-600 text-white rounded-2xl shadow-xl shadow-pink-100 dark:shadow-none transition-colors">
           <ShoppingBag size={24} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white transition-colors">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-32 bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-800 rounded-[40px] transition-colors">
          <Package className="mx-auto text-gray-200 dark:text-gray-800 mb-6" size={80} />
          <p className="text-xl text-gray-400 dark:text-gray-600 font-serif italic">Aapka jewelry box khaali hai.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => (
            <div key={order._id} className="group bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-500">
              
              {/* Order Header Card - Subtle contrast */}
              <div className="bg-gray-50/50 dark:bg-black/20 px-10 py-6 flex flex-wrap justify-between items-center border-b border-gray-100 dark:border-gray-800 gap-4 transition-colors">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-1">Date</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-500 transition-colors">
                       <CheckCircle size={14} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">{order.status || 'Processing'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-1">Order ID</p>
                   <p className="text-xs font-mono font-bold text-gray-400 dark:text-gray-600">#{order._id.toUpperCase()}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="p-10">
                <div className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-8 py-6 first:pt-0 last:pb-0">
                      <div className="w-20 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0">
                         <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-serif font-bold text-gray-900 dark:text-white transition-colors">{item.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-tighter">Premium Collection | Qty: {item.qty || 1}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xl font-bold text-gray-900 dark:text-white transition-colors">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-end md:items-center gap-6 transition-colors">
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => downloadPremiumInvoice(order._id)}
                      disabled={loadingInvoice === order._id}
                      className={`flex items-center gap-2 px-6 py-4 bg-black dark:bg-pink-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-pink-600 dark:hover:bg-white dark:hover:text-black transition-all ${loadingInvoice === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loadingInvoice === order._id ? 'Generating...' : <><Download size={14} /> Download Premium Invoice</>}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                       <Truck size={14} /> Track Order
                    </button>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-1">Total Amount</p>
                     <p className="text-3xl font-serif font-bold text-gray-900 dark:text-white transition-colors">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;