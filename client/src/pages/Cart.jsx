import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Cart = () => {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!user || !token) {
      alert("Please login to proceed with the payment.");
      navigate('/login');
      return;
    }

    try {
      // 1. Create Order on Backend
      const { data: order } = await axios.post(
        'http://localhost:5000/api/orders/pay', 
        { amount: cartTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_SA8wlqDgEIdnXA", 
        amount: order.amount,
        currency: order.currency,
        name: "Occazionals",
        description: "Premium Fashion Rental/Purchase",
        order_id: order.id,
        handler: async (response) => {
          try {
            // FIX: Map items to match your order.js schema exactly
            const formattedItems = cartItems.map(item => ({
              product: item._id,
              // 'Rent' or 'Sale' must be capitalized to match your Enum in order.js
              orderType: item.orderType === 'rent' ? 'Rent' : 'Sale',
              price: item.orderType === 'rent' ? item.rentalPrice : item.salePrice,
              rentalDuration: item.orderType === 'rent' ? 3 : 0
            }));

            const config = {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            };

            // 2. Verify Payment
            const { data } = await axios.post('http://localhost:5000/api/orders/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderItems: formattedItems, 
              amount: cartTotal
            }, config);

            if (data.success) {
              alert("Order Placed Successfully!");
              clearCart();
              navigate('/catalog');
            }
          } catch (error) {
            console.error("Verification Error:", error.response?.data || error);
            alert(`Order Failed: ${error.response?.data?.error || "Check console"}`);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Could not initialize payment.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center px-6">
        <ShoppingBag size={60} className="mx-auto text-gray-200 mb-6" />
        <h2 className="text-3xl font-serif">Your bag is empty</h2>
        <p className="text-gray-500 mt-2 mb-8">Discover something special.</p>
        <Link to="/catalog" className="bg-black text-white px-8 py-3 rounded-full uppercase tracking-widest text-xs">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl font-serif mb-12 text-center">Your Bag</h1>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-2 space-y-8 w-full lg:w-2/3">
          {cartItems.map((item) => (
            <motion.div layout key={item.cartId} className="flex gap-6 border-b pb-8 group">
              <div className="w-32 h-44 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 uppercase tracking-tighter">Size: {item.selectedSize}</p>
                  <div className="mt-2 inline-block px-3 py-1 bg-gray-50 border rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {item.orderType === 'rent' ? 'Rental (3 Days)' : 'Full Purchase'}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xl font-medium">₹{item.orderType === 'rent' ? item.rentalPrice : item.salePrice}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex-1 lg:w-1/3">
          <div className="bg-gray-50 p-8 rounded-2xl sticky top-28 shadow-sm">
            <h2 className="text-xl font-serif mb-6">Summary</h2>
            <div className="space-y-4 text-sm border-b pb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>
            <div className="flex justify-between py-6 text-xl font-medium">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
            <button onClick={handlePayment} className="w-full bg-black text-white py-5 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-xl group">
              Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;