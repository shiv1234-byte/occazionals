import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PackagePlus, Trash2, Eye, EyeOff, RefreshCw, Layers, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    category: '', 
    description: '',
    salePrice: '', 
    rentalPrice: '', 
    images: '', 
    sizes: 'S,M,L,XL',
    countInStock: 1
  });

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // 1. Fetch Products (Includes adminView=true to see hidden items)
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products?adminView=true');
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Add New Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare clean data for the backend
      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        salePrice: Number(formData.salePrice),
        rentalPrice: Number(formData.rentalPrice),
        images: formData.images.split(',').map(img => img.trim()),
        sizes: formData.sizes.split(',').map(s => s.trim()),
        countInStock: Number(formData.countInStock) || 1,
        isForRent: Number(formData.rentalPrice) > 0,
        isForSale: Number(formData.salePrice) > 0
      };

      await axios.post('http://localhost:5000/api/products', productData, config);
      
      alert("Dress added to Occazionals collection!");
      
      // Reset form fields
      setFormData({ 
        name: '', category: '', description: '', 
        salePrice: '', rentalPrice: '', images: '', 
        sizes: 'S,M,L,XL', countInStock: 1 
      });
      
      fetchProducts(); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Check your backend connection.";
      alert(`Upload Failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Toggle Availability
  const handleToggle = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/${id}/status`, {}, config);
      fetchProducts(); 
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // 4. Delete Product
  const handleDelete = async (id) => {
    if (window.confirm("Delete this product permanently?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        fetchProducts();
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="pt-28 pb-16 px-6 max-w-7xl mx-auto space-y-12">
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="p-3 bg-black text-white rounded-2xl shadow-lg"><PackagePlus /></div>
        <h1 className="text-3xl font-serif tracking-tight">Inventory Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Add Product Form */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-28">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
              <Layers size={20} className="text-gray-400"/> New Arrival
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required type="text" className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border focus:border-black transition" placeholder="Dress Name" 
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              
              <input required type="text" className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border focus:border-black transition" placeholder="Category (e.g. Saree, Lehenga)" 
                value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border focus:border-black transition" placeholder="Sale Price ₹" 
                  value={formData.salePrice} onChange={(e) => setFormData({...formData, salePrice: e.target.value})} />
                <input required type="number" className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border focus:border-black transition" placeholder="Rent Price ₹" 
                  value={formData.rentalPrice} onChange={(e) => setFormData({...formData, rentalPrice: e.target.value})} />
              </div>

              <input required type="number" className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border focus:border-black transition" placeholder="Stock Quantity" 
                value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} />

              {/* RESTORED DESCRIPTION TEXTAREA */}
              <textarea required className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm h-32 border focus:border-black transition" 
                placeholder="Product Description (Fabric, Work, Details...)"
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />

              <textarea required className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm h-24 border focus:border-black transition" placeholder="Image URLs (comma separated)"
                value={formData.images} onChange={(e) => setFormData({...formData, images: e.target.value})} />

              <button disabled={loading} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50 shadow-md">
                {loading ? "Publishing..." : "Add to Collection"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Product Table */}
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif">Live Collection ({products.length})</h2>
            <button onClick={fetchProducts} className="p-2 hover:bg-gray-100 rounded-full transition active:rotate-180"><RefreshCw size={20}/></button>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <tr>
                    <th className="p-6">Product Details</th>
                    <th className="p-6 text-center">Stock</th>
                    <th className="p-6 text-center">Visibility</th>
                    <th className="p-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product._id} className={`transition-all ${!product.isAvailable ? 'bg-gray-50/70' : 'hover:bg-gray-50/40'}`}>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={product.images[0]} className={`w-12 h-16 object-cover rounded-lg shadow-sm ${!product.isAvailable ? 'grayscale opacity-40' : ''}`} alt="" />
                            {!product.isAvailable && <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-500 uppercase">Hidden</div>}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${!product.isAvailable ? 'text-gray-400' : 'text-gray-900'}`}>{product.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span className="text-xs font-medium text-gray-600">{product.countInStock || 0}</span>
                      </td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => handleToggle(product._id)}
                          className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                            product.isAvailable 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {product.isAvailable ? 'Live' : 'Hidden'}
                        </button>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2 text-gray-400">
                          <button onClick={() => handleToggle(product._id)} className="p-2 hover:text-black transition-colors" title="Toggle Privacy">
                            {product.isAvailable ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="p-2 hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;