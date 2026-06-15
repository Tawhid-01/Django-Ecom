import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { clearToken, getAccessToken } from "../utils/auth.js";

const Navbar = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); 

  const [isLoggedIn, setIsLoggedIn] = useState(!!getAccessToken());

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
  }, [location]);

  const cartCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 px-4 sm:px-6 py-4 flex justify-between items-center fixed w-full top-0 z-50 transition-all">
      
      {/* LEFT: Brand Logo & Internal Navigation Links */}
      <div className="flex items-center gap-6 sm:gap-8">
        <Link to="/" className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800 hover:opacity-90 flex items-center gap-1.5 shrink-0">
          <span className="text-2xl sm:text-3xl">🛍️</span> 
          <span>MT <span className="text-green-600 font-medium text-sm">World</span></span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-5 border-l border-slate-200 pl-4 sm:pl-6">
          <Link 
            to="/" 
            className={`text-xs sm:text-sm font-bold transition-colors ${
              location.pathname === '/' ? 'text-green-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={`text-xs sm:text-sm font-bold transition-colors ${
              location.pathname === '/products' ? 'text-green-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Shop All
          </Link>
        </div>
      </div>

      {/* RIGHT: Auth Operations, Interactive Cart, & Profile Icon */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Authentication Group Container Section */}
        <div className="flex items-center gap-3 border-r border-slate-200 pr-2 sm:pr-4">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="text-xs sm:text-sm font-semibold bg-slate-900 text-white px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg hover:bg-slate-800 transition-all shadow-sm">
                Sign Up
              </Link>
            </>
          ) : (
            <button 
              onClick={handleLogout} 
              className="text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Interactive Cart Button Counter Badge Container */}
        <Link 
          to="/cart" 
          className="relative flex items-center gap-1.5 p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-all group"
        >
          <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-200">🛒</span>
          <span className="text-xs sm:text-sm font-bold text-slate-700 hidden md:inline">Cart</span>
          
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[9px] sm:text-[10px] font-black rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          )}
        </Link>

        {/* 🚀 NEW: Interactive Profile Icon Link */}
        <Link 
          to={isLoggedIn ? "/profile" : "/login"} 
          className={`p-1.5 sm:p-2 rounded-xl transition-all group border flex items-center justify-center ${
            location.pathname === '/profile' 
              ? 'bg-green-50 border-green-200 text-green-600' 
              : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          title={isLoggedIn ? "View Profile Dashboard" : "Login to your account"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-5 h-5 sm:w-[22px] sm:h-[22px] group-hover:scale-105 transition-transform duration-200"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.963-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" 
            />
          </svg>
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;