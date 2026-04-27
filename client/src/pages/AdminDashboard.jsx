import React, { useState, useEffect } from 'react';
import API from '../axios'; // ✅ Always use your custom API instance
import { useAuth } from '../context/AuthContext';
import { 
  PackagePlus, Trash2, Eye, EyeOff, RefreshCw, Gem, 
  ChevronRight, LayoutDashboard, BarChart3, PlusCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const JEWELRY_CATEGORIES = [
    "Long Sets", "Pearl Jewellery", "Kundan Jewellery", "American Diamond",
    "Choker", "Anti Tarnish", "Gold Jewellery", "Temple Jewellery",
    "Jhumka Earrings", "Kashmiri Earrings", "Bracelet", "Bangles"
  ];

  const [formData, setFormData] = useState({
    name: '', category: '', description: '', salePrice: '', 
    material: 'Alloy', finish: 'Gold Plated', images: '', countInStock: 1
  });

  // ✅ Headers are handled by your axios interceptor, but keeping config for safety
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchProducts = async () => {
    setRefreshing(true);
    try {
      const { data } = await API.get('/products?adminView=true'); // ✅ Fixed: Use API instance
      setProducts(data);
    } catch (err) { 
      console.error("Failed to fetch products"); 
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        ...formData,
        salePrice: Number(formData.salePrice),
        images: formData.images.split(',').map(img => img.trim()),
        countInStock: Number(formData.countInStock) || 1,
        isForRent: false,
        isForSale: true
      };
      await API.post('/products', productData); // ✅ Fixed: Use API instance
      alert("Jewelry successfully published! ✨");
      setFormData({ name: '', category: '', description: '', salePrice: '', material: 'Alloy', finish: 'Gold Plated', images: '', countInStock: 1 });
      fetchProducts(); 
    } catch (err) { 
      alert("Upload Failed. Backend check karein."); 
    } finally { setLoading(false); }
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/products/${id}/status`, {}); // ✅ Fixed: Use API instance
      fetchProducts(); 
    } catch (err) { alert("Status update failed"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this masterpiece permanently?")) {
      try {
        await API.delete(`/products/${id}`); // ✅ Fixed: Use API instance
        fetchProducts();
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div className="pt-28 pb-16 px-6 min-h-screen bg-[#fdf2f8] dark:bg-[#050505] transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Top Glassmorphic Header --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between p-8 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-[40px] border border-white dark:border-white/10 shadow-2xl shadow-pink-200/50 dark:shadow-none"
        >
          <div className="flex items-center gap-5">
            <div className="p-5 bg-gradient-to-br from-pink-500 to-pink-700 text-white rounded-[24px] shadow-lg shadow-pink-500/40">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Studio Control</h1>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                <p className="text-[10px] text-pink-600 font-black uppercase tracking-[0.4em]">Occasionals. Admin Engine</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6 md:mt-0">
             <div className="hidden sm:block text-right mr-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Pieces</p>
                <p className="text-2xl font-serif font-black text-gray-900 dark:text-white leading-none">{products.length}</p>
             </div>
            <button 
              onClick={fetchProducts} 
              className={`p-4 bg-black dark:bg-pink-600 text-white rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-xl ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={20}/>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: Add Product Form --- */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl sticky top-28">
              <div className="flex items-center gap-3 mb-8">
                <PlusCircle size={22} className="text-pink-500"/>
                <h2 className="text-xl font-serif font-bold dark:text-white uppercase tracking-tighter">Drop New Collection</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-pink-600 uppercase ml-2 tracking-widest">Masterpiece Name</label>
                  <input required type="text" className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-transparent focus:border-pink-500 dark:text-white outline-none transition-all font-bold text-sm" placeholder="e.g. Royal Kundan Choker" 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Category</label>
                    <select required className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none dark:text-white outline-none font-bold text-xs appearance-none"
                      value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                      <option value="">Select</option>
                      {JEWELRY_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Value (₹)</label>
                    <input required type="number" className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none dark:text-white outline-none font-bold text-sm" 
                      value={formData.salePrice} onChange={(e) => setFormData({...formData, salePrice: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Image Vault (Cloudinary URLs)</label>
                  <textarea required className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none dark:text-white outline-none h-24 text-[10px] font-mono leading-relaxed" 
                    placeholder="URL 1, URL 2..."
                    value={formData.images} onChange={(e) => setFormData({...formData, images: e.target.value})} />
                </div>

                <button disabled={loading} className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white py-5 rounded-[24px] font-black uppercase tracking-widest hover:shadow-pink-500/20 hover:shadow-2xl transition-all disabled:opacity-50 text-xs flex items-center justify-center gap-3">
                  {loading ? <RefreshCw className="animate-spin" size={16}/> : <><PackagePlus size={18}/> Publish to Store</>}
                </button>
              </form>
            </div>
          </div>

          {/* --- RIGHT: Product List --- */}
          <div className="lg:col-span-8">
            <div className="bg-white/50 dark:bg-gray-900 rounded-[40px] border border-white dark:border-gray-800 overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 className="font-serif font-black text-gray-900 dark:text-white uppercase tracking-tighter">Live Inventory</h3>
                <BarChart3 className="text-gray-300 dark:text-gray-700" size={24} />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 dark:bg-black/40 text-[9px] font-black uppercase tracking-widest text-gray-400">
                    <tr>
                      <th className="p-6 text-left">The Piece</th>
                      <th className="p-6 text-center">Retail</th>
                      <th className="p-6 text-center">Status</th>
                      <th className="p-6 text-right">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <AnimatePresence>
                      {products.map((product) => (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          key={product._id} 
                          className={`group transition-all ${!product.isAvailable ? 'bg-gray-50/50 dark:bg-black/20' : 'hover:bg-white dark:hover:bg-white/5'}`}
                        >
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="relative group">
                                <img src={product.images[0]} className="w-16 h-16 object-cover rounded-[20px] shadow-md border-2 border-white dark:border-gray-800" alt="" />
                                {!product.isAvailable && <div className="absolute inset-0 bg-black/40 rounded-[20px] flex items-center justify-center text-[8px] text-white font-black uppercase">Hidden</div>}
                              </div>
                              <div>
                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">{product.name}</p>
                                <p className="text-[9px] text-pink-500 font-black uppercase tracking-widest mt-1">{product.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 text-center">
                             <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-black text-gray-900 dark:text-white">₹{product.salePrice}</span>
                          </td>
                          <td className="p-6 text-center">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${product.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {product.isAvailable ? 'Live' : 'Archived'}
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => handleToggle(product._id)} className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 hover:text-pink-600">
                                {product.isAvailable ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <button onClick={() => handleDelete(product._id)} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {products.length === 0 && !refreshing && (
                  <div className="py-24 text-center">
                    <Gem size={48} className="mx-auto text-gray-200 dark:text-gray-800 mb-4" />
                    <p className="text-gray-400 dark:text-gray-600 uppercase font-black tracking-widest text-xs italic">Your jewelry vault is empty.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;