import { Link } from "react-router-dom";
import ProductSlider from "../components/ProductSlider"; // 👈 Updated Import reference target

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-slate-950 pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
            ✨ Premium Shopping Experience
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight max-w-3xl leading-none">
            Upgrade Your Lifestyle With <span className="text-green-500">MT World</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl font-normal leading-relaxed">
            Explore authentic collections, exclusive digital gear, and daily lifestyle essentials. Fast delivery, secure payments, and a hassle-free checkout experience.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link 
              to="/products" 
              href="#catalog" 
              className="px-6 py-3 rounded-xl font-bold text-sm bg-green-600 text-white shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all active:scale-[0.99]"
            >
              Shop Collection 🛒
            </Link>
            <Link 
              to="/cart" 
              className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              View Your Cart
            </Link>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION FEATURE BADGES */}
      <section className="max-w-7xl mx-auto -mt-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-start gap-4">
            <span className="text-3xl p-2.5 bg-green-50 rounded-xl">🚚</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Free Shipping</h3>
              <p className="text-xs text-slate-500 mt-0.5">On orders all across Dhaka & nationwide.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-3xl p-2.5 bg-green-50 rounded-xl">🛡️</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Secure Payments</h3>
              <p className="text-xs text-slate-500 mt-0.5">Cash on Delivery or digital transaction shields.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-3xl p-2.5 bg-green-50 rounded-xl">⚡</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Instant Support</h3>
              <p className="text-xs text-slate-500 mt-0.5">Dedicated client assistance around the clock.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-3xl p-2.5 bg-green-50 rounded-xl">💯</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Genuine Products</h3>
              <p className="text-xs text-slate-500 mt-0.5">100% authentic curated inventory guarantee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CAROUSEL SLIDER WRAPPER */}
      <main id="catalog" className="scroll-mt-20">
        {/* 👈 SWAPPED: Displays a sleek horizontal carousel track here instead of the massive grid */}
        <ProductSlider />
      </main>

      {/* 4. PREMIUM FOOTER STRIP */}
      <footer className="bg-white border-t border-slate-100 py-8 px-4 mt-12 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm">
            <span>🛍️</span> MT World
          </div>
          <p>© 2026 MT World Marketplace. Built with Django & React. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;