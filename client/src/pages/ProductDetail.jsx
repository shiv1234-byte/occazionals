import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../utils/api';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, Calendar, ShieldCheck, 
  Share2, Check, Heart, ArrowLeft, Info ,X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [orderType, setOrderType] = useState('rent'); 
  const [mainImage, setMainImage] = useState('');
  const [addedPopup, setAddedPopup] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      if (!id || id === 'undefined') return;
      try {
        setLoading(true);
        const { data } = await fetchProductById(id);
        setProduct(data);
        setMainImage(data.images[0]);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  // Social Share Logic
  const handleShare = async () => {
    const shareData = {
      title: `Occazionals | ${product.name}`,
      text: `Check out this beautiful ${product.category} on Occazionals!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }
    addToCart(product, orderType, selectedSize);
    setAddedPopup(true);
    setTimeout(() => setAddedPopup(false), 3000);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-black"></div>
    </div>
  );

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Dress not found.</p>
      <button onClick={() => navigate('/catalog')} className="underline">Back to Catalog</button>
    </div>
  );

  return (
    <div className="pt-28 pb-16 px-6 max-w-7xl mx-auto min-h-screen font-sans">
      
      {/* Added to Bag Popup */}
      <AnimatePresence>
        {addedPopup && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-60 bg-black text-white px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 text-sm font-medium"
          >
            <Check size={18} className="text-green-400" />
            Added to your Occazionals bag
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Left: Image Gallery */}
        <div className="flex-1 space-y-4">
          <div className="aspect-3/4 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition ${mainImage === img ? 'border-black' : 'border-transparent opacity-60'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="thumb" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex-1 lg:max-w-lg">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-4xl font-serif text-gray-900 leading-tight">{product.name}</h1>
              <p className="text-gray-400 uppercase tracking-widest text-[10px] font-black">{product.category}</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleShare}
                className="p-3 rounded-full bg-gray-50 hover:bg-gray-100 transition relative group"
              >
                {isCopied ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
                {isCopied && <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded">Copied!</span>}
              </button>
              <button className="p-3 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-500 transition">
                <Heart size={18} />
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-baseline gap-4">
            <span className="text-3xl font-medium">₹{orderType === 'rent' ? product.rentalPrice : product.salePrice}</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">
              {orderType === 'rent' ? '3-Day Rental' : 'Full Ownership'}
            </span>
          </div>

          <hr className="my-10 border-gray-100" />

          {/* Type Toggle */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Service Plan</span>
             <button 
  onClick={() => setIsInfoOpen(true)}
  className="text-[10px] text-gray-500 flex items-center gap-1 cursor-pointer hover:underline hover:text-black transition"
>
  <Info size={12}/> How it works
</button>
            </div>
            <div className="flex p-1.5 bg-gray-100 rounded-2xl gap-1.5">
              <button 
                onClick={() => setOrderType('rent')}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${orderType === 'rent' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
              >
                Rent It
              </button>
              <button 
                onClick={() => setOrderType('sale')}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${orderType === 'sale' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
              >
                Buy It
              </button>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mt-8 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Size</span>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-12 w-12 rounded-full border text-xs font-bold transition-all ${selectedSize === size ? 'bg-black text-white border-black scale-110' : 'border-gray-200 hover:border-black'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 space-y-4">
            <button 
              onClick={handleAddToBag}
              className="w-full bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition shadow-xl"
            >
              <ShoppingBag size={20} /> Add to Bag
            </button>
          </div>

          {/* Trust Factors */}
          <div className="mt-12 pt-8 border-t grid grid-cols-2 gap-8">
            <div className="flex gap-3">
              <ShieldCheck className="text-black shrink-0" size={20} />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest">Hygiene First</h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Sterilized & professionally dry-cleaned after every use.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Calendar className="text-black shrink-0" size={20} />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest">On-Time Delivery</h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Guaranteed delivery 1 day before your event.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
};
const InfoModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Dark Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-70 backdrop-blur-sm"
        />
        {/* Modal Content */}
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-32px z-80 p-10 max-w-2xl mx-auto shadow-2xl"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif">How Occazionals Works</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="h-10 w-10 shrink-0 bg-gray-100 rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Choose your Duration</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Select a 3-day or 7-day rental period. We recommend booking your start date 1-2 days before your event.</p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="h-10 w-10 shrink-0 bg-gray-100 rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Pristine Delivery</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Your outfit arrives professionally dry-cleaned and sterilized in our signature sustainable packaging.</p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="h-10 w-10 shrink-0 bg-gray-100 rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Easy Returns</h4>
                <p className="text-gray-500 text-sm leading-relaxed">When your time is up, just place the item back in the bag. We'll handle the pickup and the dry cleaning!</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-black text-white py-4 rounded-xl mt-10 font-bold uppercase tracking-widest text-xs"
          >
            Got it, thanks!
          </button>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default ProductDetail;