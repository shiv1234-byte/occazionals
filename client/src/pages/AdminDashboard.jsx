import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PackagePlus, Trash2, Eye, EyeOff, RefreshCw, Gem } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const JEWELRY_CATEGORIES = [
    "Long Sets", "Pearl Jewellery", "Kundan Jewellery", "American Diamond",
    "Choker", "Anti Tarnish", "Gold Jewellery", "Temple Jewellery",
    "Jhumka Earrings", "Kashmiri Earrings", "Bracelet", "Bangles"
  ];

  const [formData, setFormData] = useState({
    name: '', category: '', description: '', salePrice: '', 
    material: 'Alloy', finish: 'Gold Plated', images: '', countInStock: 1
  });

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products?adminView=true');
      setProducts(data);
    } catch (err) { console.error("Failed to fetch products"); }
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
      await axios.post('http://localhost:5000/api/products', productData, config);
      alert("Jewelry successfully published!");
      setFormData({ name: '', category: '', description: '', salePrice: '', material: 'Alloy', finish: 'Gold Plated', images: '', countInStock: 1 });
      fetchProducts(); 
    } catch (err) { alert("Upload Failed"); } finally { setLoading(false); }
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/${id}/status`, {}, config);
      fetchProducts(); 
    } catch (err) { alert("Status update failed"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove permanently?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        fetchProducts();
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div className="pt-28 pb-16 px-6 max-w-7xl mx-auto space-y-12 bg-gray-50/30 dark:bg-gray-950 transition-colors duration-500 min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-pink-600 text-white rounded-3xl shadow-xl shadow-pink-200 dark:shadow-none animate-pulse">
            <Gem size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Inventory Control</h1>
            <p className="text-[10px] text-pink-600 font-black uppercase tracking-[0.3em]">Occazi-Jewels Delhi</p>
          </div>
        </div>
        <button onClick={fetchProducts} className="p-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 transition shadow-sm text-gray-600 dark:text-gray-300">
          <RefreshCw size={20}/>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Add Jewelry Form */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm sticky top-28 transition-colors">
            <h2 className="text-xl font-serif mb-8 flex items-center gap-3 text-gray-800 dark:text-white">
              <PackagePlus size={22} className="text-pink-500"/> New Collection Drop
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase ml-2">Product Name</label>
                <input required type="text" className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent focus:border-pink-500 dark:text-white outline-none transition" placeholder="e.g. Kundan Choker Set" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase ml-2">Category</label>
                  <select required className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent dark:text-white outline-none"
                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select</option>
                    {JEWELRY_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase ml-2">Price (₹)</label>
                  <input required type="number" className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent dark:text-white outline-none" 
                    value={formData.salePrice} onChange={(e) => setFormData({...formData, salePrice: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase ml-2">Image URLs (Comma separated)</label>
                <textarea required className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent dark:text-white outline-none h-24 text-xs" 
                  value={formData.images} onChange={(e) => setFormData({...formData, images: e.target.value})} />
              </div>

              <button disabled={loading} className="w-full bg-black dark:bg-pink-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-pink-700 transition-all disabled:opacity-50 shadow-xl">
                {loading ? "Publishing..." : "Publish Drop"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Live Products Table */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-black/20 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  <tr>
                    <th className="p-6">Product Details</th>
                    <th className="p-6 text-center">Price</th>
                    <th className="p-6 text-center">Visibility</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {products.map((product) => (
                    <tr key={product._id} className={`group ${!product.isAvailable ? 'opacity-40 grayscale' : 'hover:bg-gray-50/50 dark:hover:bg-white/5'}`}>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={product.images[0]} className="w-14 h-14 object-cover rounded-2xl border border-gray-100 dark:border-gray-800" alt="" />
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{product.name}</p>
                            <p className="text-[9px] text-pink-500 font-black uppercase tracking-tighter">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center text-sm font-black text-gray-900 dark:text-white">₹{product.salePrice}</td>
                      <td className="p-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.isAvailable ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => handleToggle(product._id)} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-pink-600 transition">
                          {product.isAvailable ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-400 hover:text-red-600 transition">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <div className="p-20 text-center text-gray-400 dark:text-gray-600 italic text-sm">Collection is empty. Start adding.</div>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;