import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const Catalog = () => {
  const [view, setView] = useState('categories'); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Ab selectedBudget mein hum pura object store karenge {min, max}
  const [selectedBudget, setSelectedBudget] = useState({ min: 0, max: 10000 });
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: "Long Sets", img: "https://i.pinimg.com/originals/13/44/2c/13442ca0241f391864116d445cc3340b.jpg" },
    { name: "Pearl Jewellery", img: "https://tse1.mm.bing.net/th/id/OIP.4Ylufhfy-DxWGH7s4gy9GAHaGw?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { name: "Kundan Jewellery", img: "https://i.etsystatic.com/14348866/r/il/d65d82/4963037875/il_1080xN.4963037875_e61c.jpg" },
    { name: "American Diamond", img: "https://th.bing.com/th/id/R.07b1ef5e2ee08c87812ef9ff953c747b?rik=b2yXF1yERnoM3w&riu=http%3a%2f%2fwww.thejewelbox.in%2fcdn%2fshop%2fcollections%2fSimpleGreenAmericanDiamondChokerNecklaceSet-TheJewelbox-1_1.jpg%3fv%3d1741581958&ehk=j5%2bVFwU4lNkA%2fHSOy%2bpvA8CYsArVE3U6SXdlZcnuhAE%3d&risl=&pid=ImgRaw&r=0" },
    { name: "Choker", img: "https://5.imimg.com/data5/SELLER/Default/2023/8/338654187/LY/HO/TL/56298350/mahavir-plus-necklace-set-vilandi-meena-golden-d-no-nk-737-1000x1000.jpg" },
    { name: "Anti Tarnish", img: "https://5.imimg.com/data5/SELLER/Default/2024/11/463473419/US/VA/RK/88514832/316l-stainless-steel-jewelry-1000x1000.jpg" },
    { name: "Gold Jewellery", img: "https://reysrefinedradiance.files.wordpress.com/2023/05/swarajshop-gold-plated-golden-necklace-sdl140095747-1-998ef.jpg?w=850" },
    { name: "Temple Jewellery", img: "https://i.pinimg.com/originals/ac/11/9e/ac119e6f01360ef96f5d7a64171fad51.jpg" },
    { name: "Jhumka Earrings", img: "https://tse3.mm.bing.net/th/id/OIP.C5-9WkuAj5iwpIeT4dWExQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { name: "Kashmiri Earrings", img: "https://ishhaara.com/cdn/shop/files/ishhaara-long-kashmiri-earrings-74041861902866.jpg?v=1761388244" }
  ];

  // Naye ranges jo aapne bataye
  const budgetRanges = [
    { label: "49 - 499", min: 49, max: 499 },
    { label: "499 - 999", min: 499, max: 999 },
    { label: "999 - 1499", min: 999, max: 1499 },
    { label: "1499 - 1999", min: 1499, max: 1999 },
    { label: "1999 - 2499", min: 1999, max: 2499 },
    { label: "2499 - 2999", min: 2499, max: 2999 },
  ];

  useEffect(() => {
    if (view === 'products') {
      const fetchFiltered = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`http://localhost:5000/api/products`, {
            params: { 
              category: selectedCategory, 
              minPrice: selectedBudget.min, // minPrice pass kiya
              maxPrice: selectedBudget.max  // maxPrice pass kiya
            }
          });
          setProducts(data);
        } catch (err) {
          console.error("Filter Fetch Error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchFiltered();
    }
  }, [view, selectedCategory, selectedBudget]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-28 min-h-screen transition-colors duration-500 bg-gray-50/30 dark:bg-gray-950 font-sans">
      
      {/* 1. Category View */}
      {view === 'categories' && (
        <div className="animate-in fade-in duration-700">
          <h2 className="text-3xl font-serif font-bold text-center mb-10 uppercase tracking-[0.2em] text-gray-900 dark:text-white">
            Select Collection
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <div 
                key={cat.name} 
                onClick={() => { setSelectedCategory(cat.name); setView('budgets'); }}
                className="cursor-pointer group relative overflow-hidden rounded-2xl shadow-sm aspect-[4/5] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
              >
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {e.target.src = 'https://placehold.co/600x800?text=Jewelry'}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end justify-center p-6">
                  <span className="text-white font-bold text-sm md:text-md uppercase tracking-widest text-center">{cat.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Budget View (NEW RANGES IMPLEMENTED) */}
      {view === 'budgets' && (
        <div className="text-center max-w-4xl mx-auto animate-in slide-in-from-right duration-500">
          <button onClick={() => setView('categories')} className="mb-10 text-xs font-bold text-pink-600 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:translate-x-[-4px] transition-all">
            <ArrowLeft size={14}/> Back to Collections
          </button>
          <h2 className="text-3xl font-serif font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">Your Budget</h2>
          <p className="text-gray-400 dark:text-gray-500 text-xs mb-12 uppercase tracking-[0.3em] font-bold">Browsing {selectedCategory}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgetRanges.map((range, idx) => (
              <div 
                key={idx} 
                onClick={() => { setSelectedBudget({ min: range.min, max: range.max }); setView('products'); }}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-12 rounded-[40px] cursor-pointer hover:border-pink-500 dark:hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-50 dark:hover:shadow-pink-900/20 transition-all group relative overflow-hidden"
              >
                <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase block mb-1 font-black">Range (₹)</span>
                <span className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">
                  {range.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Products Final View */}
      {view === 'products' && (
        <div className="animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4 border-b pb-8 border-gray-100 dark:border-gray-800">
            <button onClick={() => setView('budgets')} className="text-[10px] font-bold text-pink-600 uppercase tracking-widest flex items-center gap-2 bg-pink-50 dark:bg-pink-900/20 px-5 py-3 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/40 transition">
              <ArrowLeft size={14}/> Change Budget
            </button>
            <div className="text-center">
                <h2 className="text-2xl font-serif font-bold uppercase tracking-wider text-gray-900 dark:text-white">{selectedCategory}</h2>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-[0.4em] uppercase">RANGE: ₹{selectedBudget.min} - ₹{selectedBudget.max}</p>
            </div>
            <div className="w-32 hidden md:block"></div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-600"></div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 text-center">Loading Collection...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {products.length > 0 ? products.map(p => (
                <Link 
                  to={`/product/${p._id}`} 
                  key={p._id} 
                  className="group block bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-500"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800 relative">
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x400?text=Jewelry'
                      }}
                    />
                    <div className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                       <ShoppingBag size={18} className="text-pink-600"/>
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm truncate uppercase tracking-wider group-hover:text-pink-600 transition-colors">{p.name}</h3>
                    <div className="flex justify-between items-center">
                       <p className="text-black dark:text-white font-black text-xl">₹{p.salePrice}</p>
                       <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter group-hover:text-pink-500 transition-colors">Details →</span>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="col-span-full text-center py-24 bg-white dark:bg-gray-900 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-800">
                  <div className="mb-6 opacity-20">
                    <ShoppingBag size={64} className="mx-auto dark:text-white" />
                  </div>
                  <p className="text-gray-400 dark:text-gray-500 italic mb-6 font-serif text-lg">No jewelry found in this price range.</p>
                  <button onClick={() => setView('budgets')} className="bg-black dark:bg-pink-600 text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-pink-600 dark:hover:bg-white dark:hover:text-black transition shadow-xl">Try another budget</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Catalog;