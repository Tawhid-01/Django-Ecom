import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false); // Feedback loop state

  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${BASEURL}/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id, BASEURL]);

  const handleAddToCart = () => {
    // FIXED: Use navigate instead of window.location.href to preserve React state
    if (!localStorage.getItem('access_token')) {
      navigate('/login');
      return;
    }
    
    addToCart(product.id);
    
    // Trigger visual feedback success state
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  /* Unified Elegant Loading Layout */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-3">
        <svg className="animate-spin h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <div className="font-semibold text-sm text-slate-500">Loading product particulars...</div>
      </div>
    );
  }

  /* Error Banner Layout */
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center p-4">
        <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-xl font-medium text-sm text-center max-w-sm">
          ⚠️ Error: {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center text-slate-500 font-medium text-sm">
        No product found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl p-6 sm:p-8 max-w-4xl w-full overflow-hidden">
        
        {/* Back Navigation Bar */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider transition-colors"
          >
            ← Back to Catalog
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left: Product Image Container */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden border border-slate-100 max-h-[400px]">
            <img
              src={product.image?.startsWith('http') ? product.image : `${BASEURL}${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-300"
            />
          </div>

          {/* Right: Informational Context Panel */}
          <div className="flex-1 flex flex-col justify-between py-2">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="inline-block bg-green-50 text-green-700 font-black text-2xl px-3 py-1.5 rounded-xl">
                ৳{parseFloat(product.price).toFixed(2)}
              </div>
              
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {product.description || "No product description provided by merchant."}
                </p>
              </div>
            </div>

            {/* Actions: Direct Checkout Integration */}
            <div className="mt-8 pt-4 border-t border-slate-50">
              <button  
                onClick={handleAddToCart} 
                disabled={added}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow transition-all duration-150 active:scale-[0.99] ${
                  added 
                    ? "bg-emerald-600 text-white cursor-default shadow-none" 
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10"
                }`}
              >
                {added ? (
                  <span className="flex items-center justify-center gap-1.5">
                    Added to Cart ✓
                  </span>
                ) : (
                  "Add to Cart 🛒"
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;