import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// ✅ Agar error phir bhi aaye, toh check karein ki file src/api/axios.js hi hai
import API from '../axios'; 
import { 
  ShoppingBag, ShieldCheck, Share2, Check, Heart, Info, X, 
  Truck, CreditCard, ChevronRight, Gem, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        // ✅ API Instance calling Render/Localhost
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        setMainImage(data.images[0]);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) getProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAddedToCartToast(true);
      setTimeout(() => setAddedToCartToast(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      navigate('/checkout', { state: { product: product } });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) { console.error('Error sharing:', err); }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-500">
      <Loader2 className="animate-spin h-10 w-10 text-pink-600" />
      <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">Fetching Jewelry Details...</p>
    </div>
  );

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 text-center px-6 bg-white dark:bg-gray-950 transition-colors duration-500">
      <p className="text-gray-500 dark:text-gray-400 font-serif text-xl">Oops! This jewelry piece is no longer in our collection.</p>
      <button onClick={() => navigate('/catalog')} className="bg-black dark:bg-pink-600 text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg">Back to Catalog</button>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen bg-transparent dark:bg-gray-950 transition-colors duration-500">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {addedToCartToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-[100] bg-black dark:bg-pink-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border border-gray-800 dark:border-pink-500/30"
          >
            <Check size={20} className="text-green-400 dark:text-white" />
            <span className="text-sm font-bold tracking-wide">Jewelry added to your bag!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Left: Image Gallery */}
        <div className="flex-1 space-y-6">
          <div className="aspect-square rounded-[40px] overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm group">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {e.target.src = 'https://placehold.co/800x800?text=Premium+Jewelry'}}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img, idx) => (
              <button key={idx} onClick={() => setMainImage(img)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-pink-500 scale-95' : 'border-transparent dark:border-gray-800 opacity-60'}`}>
                <img src={img} className="w-full h-full object-cover" alt="preview" onError={(e) => {e.target.src = 'https://placehold.co/200x200?text=Preview'}} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex-1 space-y-8 lg:max-w-lg">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-pink-600 dark:text-pink-500 font-black uppercase tracking-[0.3em] text-[10px]">{product.category}</p>
              <h1 className="text-4xl font-serif text-gray-900 dark:text-white leading-tight transition-colors">{product.name}</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={handleShare} className="p-3 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition relative">
                {isCopied ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
                {isCopied && <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded">Link Copied!</span>}
              </button>
              <button className="p-3 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white hover:text-red-500 dark:hover:text-red-400 transition"><Heart size={18} /></button>
            </div>
          </div>

          <div className="flex items-baseline gap-4 border-b pb-8 border-gray-100 dark:border-gray-800 transition-colors">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{product.salePrice?.toLocaleString('en-IN')}</span>
            <span className="text-lg text-gray-400 dark:text-gray-600 line-through">₹{(product.salePrice + 500).toLocaleString('en-IN')}</span>
            <span className="bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Handcrafted</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">About this Piece</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium transition-colors">{product.description}</p>
          </div>

          {/* Delivery & Trust Section */}
          <div className="bg-gray-50/50 dark:bg-gray-900/50 p-6 rounded-[32px] space-y-4 border border-gray-100 dark:border-gray-800 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Delivery & Trust</span>
              <button onClick={() => setIsInfoOpen(true)} className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 hover:underline"><Info size={12}/> Policy</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-50 dark:border-gray-700 shadow-sm transition-colors">
                <Truck className="text-pink-600 dark:text-pink-500" size={20} /> Insured Shipping from Kota Hub
              </div>
              <div className="flex items-center gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-50 dark:border-gray-700 shadow-sm transition-colors">
                <ShieldCheck className="text-green-600 dark:text-green-500" size={20} /> Secure Payments & COD Verified
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 border-2 border-black dark:border-white text-black dark:text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 transition-all group"
            >
              <ShoppingBag size={20} /> ADD TO BAG
            </button>
            
            <button 
              onClick={handleBuyNow}
              className="flex-[1.5] bg-[#121212] dark:bg-pink-600 text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 hover:bg-pink-600 dark:hover:bg-white dark:hover:text-black transition-all shadow-xl shadow-gray-200 dark:shadow-none group"
            >
              BUY NOW <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust Factors */}
          <div className="pt-8 grid grid-cols-2 gap-8 border-t border-gray-100 dark:border-gray-800 transition-colors">
            <div className="flex gap-3">
              <Gem className="text-pink-600 dark:text-pink-500" size={20} />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Authentic</h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">High-grade finishing on every piece.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="text-pink-600 dark:text-pink-500" size={20} />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Skin Safe</h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Anti-tarnish and Allergy-free polish.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
};

// Modal for Payment Info
const InfoModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="fixed inset-0 bg-black/60 z-[110] backdrop-blur-md" />
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-[40px] z-[120] p-10 max-w-2xl mx-auto shadow-2xl transition-colors">
          <div className="flex justify-between items-center mb-8 border-b dark:border-gray-800 pb-4">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Shopping Policy</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-gray-900 dark:text-white"><X size={24} /></button>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-full text-pink-600 dark:text-pink-400 h-fit transition-colors"><CreditCard size={20} /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Secure Transaction</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">We use Razorpay for 100% secure UPI and card payments.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-500 h-fit transition-colors"><Truck size={20} /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Express Shipping</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Every order is shipped within 24 hours with tracking.</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-full bg-black dark:bg-pink-600 text-white py-4 rounded-2xl mt-10 font-bold uppercase text-[10px] tracking-widest shadow-xl">Close</button>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default ProductDetail;