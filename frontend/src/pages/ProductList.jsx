import { useEffect, useState } from 'react';
import Product from '../../src/components/ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    fetch(`${BASEURL}/api/products/`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch products from system server');
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

  /* Elegant Animated Shimmer Skeleton Loading State Grid */
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          {/* Mock Header Banner */}
          <div className="h-24 bg-slate-200 rounded-2xl w-full max-w-md mx-auto sm:mx-0" />
          {/* Skeleton Cards Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 h-[340px] space-y-4">
                <div className="bg-slate-200 h-48 w-full rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-slate-200 rounded w-1/4" />
                  <div className="h-8 bg-slate-200 rounded-xl w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* Beautifully Bound Error Banner Layout */
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 flex items-center justify-center p-4">
        <div className="bg-rose-50 border border-rose-100 text-rose-800 p-5 rounded-2xl font-semibold text-sm text-center max-w-md shadow-sm">
          <span className="text-xl block mb-1">⚠️ System Sync Failure</span>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50/30">
      
      {/* Premium Catalog Hero Header Title */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Explore Collection
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md font-medium">
          Discover curated top-tier items from MT World catalog, shipped straight to your doorstep.
        </p>
      </div>

      {/* Responsive Products Layout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Product key={product?.id || product?._id} product={product} />
          ))
        ) : (
          /* Empty Catalog Fallback Banner Block */
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 border border-dashed border-slate-200 rounded-2xl bg-white shadow-sm max-w-lg mx-auto w-full">
            <span className="text-4xl block mb-3">📦</span>
            <p className="text-slate-800 font-bold text-center text-base">
              No products found
            </p>
            <p className="text-slate-400 text-xs text-center mt-1 max-w-xs leading-relaxed">
              Our inventory system is updating. Please refresh or check back in a few moments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;