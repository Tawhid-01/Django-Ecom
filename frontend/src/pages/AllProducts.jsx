import { useEffect, useState } from 'react';
import Product from '../components/ProductCard';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track selected category state ('All' acts as baseline)
  const [selectedCategory, setSelectedCategory] = useState('All'); 

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    fetch(`${BASEURL}/api/products/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to synchronize catalog from core marketplace server');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [BASEURL]);

  // 1. DYNAMIC CATEGORY EXTRACTION
  // Automatically gathers unique categories from your product list data
 const categories = [
  'All', 
  ...new Set(
    products.map((p) => {
      // If category is an object, get its name. If it's a string, use it directly.
      if (p.category && typeof p.category === 'object') return p.category.name;
      if (p.category_name) return p.category_name;
      return p.category; // fallback string/number
    }).filter(cat => typeof cat === 'string') // Strict insurance: only allow actual text strings
  )
];

// 2. MULTI-TIER FILTER PIPELINE (Category Sync + Advanced Multi-Field Match)
  const filteredProducts = products.filter((product) => {
    // A. Extract Category String safely
    let productCategory = '';
    if (product.category && typeof product.category === 'object') {
      productCategory = product.category.name || '';
    } else if (product.category_name) {
      productCategory = product.category_name;
    } else if (product.category) {
      productCategory = String(product.category);
    }

    // B. Category Sidebar Match Check
    const matchesCategory = 
      selectedCategory === 'All' || 
      productCategory.toLowerCase() === selectedCategory.toLowerCase();

    // C. Advanced Search Query Match (Checks Name, Category, Description, and Price)
    const cleanQuery = searchQuery.toLowerCase().trim();
    
    const productName = (product.name || '').toLowerCase();
    const productDesc = (product.description || '').toLowerCase();
    const productPrice = product.price ? product.price.toString() : '';
    const categoryString = productCategory.toLowerCase();

    const matchesSearch = 
      productName.includes(cleanQuery) ||
      productDesc.includes(cleanQuery) ||
      categoryString.includes(cleanQuery) ||
      productPrice.includes(cleanQuery);

    // Both rules must pass
    return matchesCategory && matchesSearch;
  });

  /* Loading State Layout Mirroring the Sidebar */
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
            <div className="space-y-3 hidden lg:block"><div className="h-48 bg-slate-200 rounded-2xl" /></div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 h-[350px] space-y-4">
                  <div className="bg-slate-200 h-48 w-full rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 flex items-center justify-center p-4">
        <div className="bg-rose-50 border border-rose-100 text-rose-800 p-5 rounded-2xl font-bold text-sm text-center max-w-md">
          ⚠️ Connection Interrupted: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50/30">
      
      {/* Top Banner Control Board */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Complete Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Displaying {filteredProducts.length} filtered choice{filteredProducts.length !== 1 && 's'} within MT World store setup.
          </p>
        </div>

        {/* Live Filter Input Field */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search catalog items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-slate-800 transition-all placeholder-slate-400"
          />
          <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm pointer-events-none">🔍</span>
        </div>
      </div>

      {/* Main Container Layout Grid Splitter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* 🚀 CATEGORY SIDEBAR COMPONENT */}
        <aside className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm sticky top-28 lg:block">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>📁</span> Browse Categories
          </h2>
          
          {/* Horizontal scroll track array layout map on Mobile screens, vertical column stacking list on Desktop panels */}
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none snap-x">
            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`snap-center shrink-0 text-left text-xs sm:text-sm px-4 py-2.5 rounded-xl font-semibold transition-all duration-150 border lg:border-none ${
                    isSelected
                      ? 'bg-green-600 text-white shadow-md shadow-green-600/10 scale-[1.01]'
                      : 'bg-slate-50 lg:bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Products Display Board Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Product key={product?.id || product?._id} product={product} />
              ))}
            </div>
          ) : (
            /* Fallback Card Board Placeholder */
            <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-slate-200 rounded-2xl bg-white text-center">
              <span className="text-4xl block mb-3">📦</span>
              <p className="text-slate-800 font-bold text-base">No products matching active criteria</p>
              <p className="text-slate-400 text-xs mt-1 max-w-xs leading-relaxed">
                Try switching the selected category partition or clearing out your current lookup filter queries.
              </p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-5 text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all"
              >
                Reset System Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AllProducts;