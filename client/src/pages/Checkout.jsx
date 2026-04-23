import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, CreditCard, ChevronRight, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [itemsToOrder, setItemsToOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: 'Delhi',
    pincode: '',
    state: 'Delhi'
  });

  const [paymentMethod, setPaymentMethod] = useState('Online');

  useEffect(() => {
    const directProduct = location.state?.product;
    if (directProduct) {
      setItemsToOrder([directProduct]);
    } else if (cartItems && cartItems.length > 0) {
      setItemsToOrder(cartItems);
    } else {
      const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setItemsToOrder(savedCart);
    }
    setLoading(false);
  }, [location.state, cartItems]);

  const subTotal = itemsToOrder.reduce((acc, item) => acc + (item.salePrice || item.price || 0), 0);
  const deliveryCharge = 50;
  const grandTotal = subTotal + deliveryCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!token) return navigate('/login');
    if (itemsToOrder.length === 0) return alert("Bag is empty!");
    if (!address.phone || !address.street || !address.pincode) return alert("Please fill address details.");

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const baseOrderData = {
      orderItems: itemsToOrder.map(item => ({
        product: item._id,
        name: item.name,
        image: item.images ? item.images[0] : (item.image || ''),
        price: item.salePrice || item.price,
        qty: 1
      })),
      shippingAddress: {
        address: address.street,
        city: address.city,
        postalCode: address.pincode,
        phone: address.phone
      },
      totalPrice: grandTotal
    };

    try {
      if (paymentMethod === 'Online') {
        const { data: rzpOrderData } = await axios.post('http://localhost:5000/api/orders/pay', { amount: grandTotal }, config);

        const options = {
          key: "rzp_test_SA8wlqDgEIdnXA", 
          amount: rzpOrderData.amount,
          currency: rzpOrderData.currency,
          name: "Occasionals Jewels",
          description: "Jewelry Purchase",
          order_id: rzpOrderData.id,
          handler: async (response) => {
            try {
              const finalData = {
                ...baseOrderData,
                paymentMethod: 'Online',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              };

              const { data: successData } = await axios.post('http://localhost:5000/api/orders', finalData, config);
              if (successData.success) {
                alert("Payment Successful! Order Placed.");
                clearCart();
                navigate('/my-orders');
              }
            } catch (err) {
              alert("Payment Verification Failed!");
            }
          },
          prefill: { name: user?.name, email: user?.email, contact: address.phone },
          theme: { color: "#db2777" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();

      } else {
        const codData = { ...baseOrderData, paymentMethod: 'COD' };
        const { data } = await axios.post('http://localhost:5000/api/orders', codData, config);
        if (data.success) {
          alert("COD Order Placed Successfully!");
          clearCart();
          navigate('/my-orders');
        }
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Server error"));
    }
  };

  if (loading) return <div className="pt-40 text-center dark:text-white">Loading Checkout...</div>;

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 bg-transparent dark:bg-gray-950 transition-colors duration-500 min-h-screen">
      
      {/* LEFT CONTENT: Forms */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Shipping Section */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3 text-gray-900 dark:text-white">
            <MapPin className="text-pink-600 dark:text-pink-500" /> Shipping Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none text-gray-400 dark:text-gray-500 font-medium" value={address.fullName} readOnly />
            <input required className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:border-pink-500 dark:text-white outline-none transition" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
            <input required className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:border-pink-500 dark:text-white outline-none transition" placeholder="Full Address (House, Street, Landmark)" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
            <input className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-2xl outline-none text-gray-400 dark:text-gray-500" value={address.city} readOnly />
            <input required className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:border-pink-500 dark:text-white outline-none transition" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
          </div>
        </div>

        {/* Payment Selection */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3 text-gray-900 dark:text-white">
            <CreditCard className="text-pink-600 dark:text-pink-500" /> Payment Method
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setPaymentMethod('COD')} 
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'COD' 
                ? 'border-pink-600 bg-pink-50 dark:bg-pink-900/10' 
                : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <p className={`font-bold ${paymentMethod === 'COD' ? 'text-pink-600' : 'text-gray-900 dark:text-white'}`}>COD</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black">Cash on Delivery</p>
            </div>
            <div 
              onClick={() => setPaymentMethod('Online')} 
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'Online' 
                ? 'border-pink-600 bg-pink-50 dark:bg-pink-900/10' 
                : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <p className={`font-bold ${paymentMethod === 'Online' ? 'text-pink-600' : 'text-gray-900 dark:text-white'}`}>Online</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black">UPI / Card / Razorpay</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Order Summary */}
      <div className="lg:col-span-4">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-2xl dark:shadow-none sticky top-32 transition-colors">
          <h2 className="text-xl font-serif font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
            {itemsToOrder.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="truncate w-40 text-gray-600 dark:text-gray-400">{item.name}</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{item.salePrice || item.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
            <div className="flex justify-between text-gray-500 dark:text-gray-500 text-sm italic">
              <span>Delivery Charge:</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between font-serif font-bold text-xl pt-4 text-gray-900 dark:text-white">
              <span>Grand Total:</span>
              <span className="text-pink-600 dark:text-pink-500">₹{grandTotal}</span>
            </div>
          </div>
          <button 
            onClick={handlePlaceOrder} 
            className="w-full bg-black dark:bg-pink-600 text-white py-6 rounded-3xl font-bold uppercase tracking-widest text-[10px] mt-8 hover:bg-pink-600 dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center gap-2 group"
          >
            Confirm Order <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="mt-6 flex items-center justify-center gap-2 text-[9px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-500" /> Secure SSL Checkout
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;