import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BudgetSection = () => {
  const navigate = useNavigate();
  
  // Naye custom ranges define kiye hain
  const budgetRanges = [
    { label: "49 - 499", max: 499, min: 49 },
    { label: "499 - 999", max: 999, min: 499 },
    { label: "999 - 1499", max: 1499, min: 999 },
    { label: "1499 - 1999", max: 1999, min: 1499 },
    { label: "1999 - 2499", max: 2499, min: 1999 },
    { label: "2499 - 2999", max: 2999, min: 2499 },
  ];

  return (
    <div className="py-24 text-center bg-transparent dark:bg-gray-950 transition-colors duration-500">
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-serif font-black mb-3 uppercase tracking-tighter text-gray-900 dark:text-white">
          Shop By Budget
        </h2>
        <p className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-[0.4em]">
          Premium Drip for every pocket
        </p>
      </div>

      {/* Grid Layout - 3 columns on mobile, 6 on desktop for a sleek line */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-6 max-w-7xl mx-auto">
        {budgetRanges.map((range, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -10 }}
            onClick={() => navigate(`/catalog?minPrice=${range.min}&maxPrice=${range.max}`)}
            className="group cursor-pointer bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[32px] hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-pink-500/10"
          >
            {/* Label */}
            <p className="text-[9px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest mb-2 group-hover:text-pink-600 transition-colors">
              Range (₹)
            </p>
            
            {/* Amount Display */}
            <p className="text-lg font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">
              {range.label}
            </p>
            
            {/* Minimal Underline Effect */}
            <div className="w-0 group-hover:w-full h-1 bg-pink-600 mt-4 mx-auto rounded-full transition-all duration-500"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BudgetSection;