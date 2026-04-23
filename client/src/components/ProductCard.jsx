import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <Link 
      to={`/product/${product._id}`} 
      className="group block relative z-10 cursor-pointer no-underline pointer-events-auto transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Container: Adaptive Background & Border */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800">
        
        {/* Product Image Section */}
        <div className="aspect-square overflow-hidden relative pointer-events-none bg-gray-50 dark:bg-gray-800">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x400?text=Occasionals+Jewelry'
            }}
          />
          
          {/* Badge: Adaptive colors */}
          {product.countInStock < 5 && product.countInStock > 0 && (
            <span className="absolute top-3 left-3 bg-orange-500 dark:bg-orange-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter shadow-lg">
              Low Stock
            </span>
          )}

          {/* Quick View Icon Overlay (Visible on Hover) */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
             <div className="bg-white/90 dark:bg-pink-600/90 backdrop-blur-sm p-3 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                <Eye size={20} className="text-pink-600 dark:text-white" />
             </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-5 space-y-2 pointer-events-none">
          <p className="text-[10px] text-pink-600 dark:text-pink-500 font-black uppercase tracking-[0.2em]">
            {product.category}
          </p>
          
          {/* Name: Black to White Toggle */}
          <h3 className="text-gray-900 dark:text-gray-100 font-bold text-sm truncate group-hover:text-pink-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between pt-3">
            <div className="flex flex-col">
              {/* Sale Price: Black to White Toggle */}
              <span className="text-lg font-black text-gray-900 dark:text-white">₹{product.salePrice}</span>
              
              {/* MRP: Gray contrast */}
              {product.mrp > product.salePrice && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500 line-through font-medium">
                  MRP ₹{product.mrp}
                </span>
              )}
            </div>
            
            {/* Bottom Icon: Subtle Adaptive background */}
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 dark:text-gray-500 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 group-hover:text-pink-600 transition-all">
              <ShoppingCart size={18} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;