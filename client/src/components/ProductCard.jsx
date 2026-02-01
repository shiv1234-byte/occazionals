import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const isOutOfStock = product.isAvailable === false;

  // This function forces the navigation
  const handleClick = () => {
    if (!isOutOfStock) {
      console.log("Navigating to:", `/product/${product._id}`);
      navigate(`/product/${product._id}`);
    }
  };

  return (
    <motion.div 
      whileHover={!isOutOfStock ? { y: -8 } : {}}
      onClick={handleClick} // Clicking anywhere on the card will trigger navigation
      className={`group relative flex flex-col h-full ${isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-3/4">
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/400x500'} 
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            isOutOfStock ? "grayscale opacity-50" : "group-hover:scale-110"
          }`}
        />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isOutOfStock && (
            <span className="bg-red-600 text-white px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] font-black shadow-lg rounded-sm">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col grow">
        <div className="flex justify-between items-start">
          <div className="max-w-[70%]">
            <h3 className={`text-sm font-serif truncate ${isOutOfStock ? "text-gray-400" : "text-gray-900"}`}>
              {product.name}
            </h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{product.category}</p>
          </div>
          <p className={`text-sm font-bold ${isOutOfStock ? "text-gray-300" : "text-gray-900"}`}>
            ₹{product.salePrice}
          </p>
        </div>

        <div className="mt-auto pt-4">
          <button 
            type="button"
            className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border
              ${isOutOfStock 
                ? "bg-gray-50 text-gray-300 border-gray-100" 
                : "bg-black text-white border-black"
              }`}
          >
            {isOutOfStock ? 'Sold Out' : 'View Details'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;