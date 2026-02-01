import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { fetchProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState(''); // '' (All), 'rent', 'sale'
  const navigate = useNavigate();
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('search');

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const { data } = await fetchProducts();
        
        let filtered = data;

        // 1. Apply Search Filter (if any)
        if (searchTerm) {
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // 2. Apply Type Filter (Rent vs Sale)
        if (typeFilter === 'rent') {
          filtered = filtered.filter(p => p.isForRent === true);
        } else if (typeFilter === 'sale') {
          filtered = filtered.filter(p => p.isForSale === true);
        }

        setProducts(filtered);
      } catch (error) {
        console.error("Catalog Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [location.search, typeFilter]); // Re-run when search URL or filter buttons change

  return (
    <div className="pt-28 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header & Search Results Title */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-serif">
            {searchTerm ? `Results for "${searchTerm}"` : 'The Collection'}
          </h1>
          <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">
            {products.length} Items Found
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {['', 'rent', 'sale'].map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                typeFilter === f ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              {f === '' ? 'All' : f === 'rent' ? 'To Rent' : 'To Buy'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="aspect-3/4 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-40">
          <p className="text-gray-400 italic">No dresses matching your criteria were found.</p>
          <button 
            onClick={() => {setTypeFilter(''); navigate('/catalog')}} 
            className="mt-4 text-black underline text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;