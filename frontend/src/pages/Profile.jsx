import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/auth.js";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    const token = getAccessToken();
    
    // Auth Guard: Direct unauthenticated guest sessions safely back to login
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user profile info and order logs concurrently from Django
    Promise.all([
      fetch(`${BASEURL}/api/user/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASEURL}/api/orders/my-orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ])
      .then(async ([userRes, ordersRes]) => {
        if (!userRes.ok || !ordersRes.ok) throw new Error("Failed to synchronize user data account modules.");
        
        const userData = await userRes.json();
        const ordersData = await ordersRes.json();
        
        setUser(userData);
        setOrders(ordersData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [BASEURL, navigate]);

  // Status Badge Color Class Formatter Mapping Function
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-50 text-green-700 border-green-200";
      case "processing": return "bg-blue-50 text-blue-700 border-blue-200";
      case "shipped": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
        <div className="h-40 bg-slate-200 rounded-2xl w-full" />
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="space-y-4">
          {[...Array(2)].map((_, idx) => <div key={idx} className="h-24 bg-slate-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 flex items-center justify-center p-4">
        <div className="bg-rose-50 border border-rose-100 text-rose-800 p-5 rounded-2xl max-w-md text-center text-sm font-bold">
          ⚠️ Profile Sync Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50/30">
      
      {/* 1. IDENTITY PACK HEADER CARD */}
      <section className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 mb-10">
        {/* Dynamic First Letter Monogram Graphic Avatar */}
        <div className="w-20 h-20 bg-gradient-to-tr from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-md shadow-green-600/10 shrink-0">
          {(user?.username || user?.email || "U")[0].toUpperCase()}
        </div>
        
        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Welcome Back, {user?.first_name || user?.username || "Shopper"}!
          </h1>
          <p className="text-sm font-medium text-slate-500">{user?.email}</p>
          <div className="pt-1.5 flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-900 text-white px-2 py-0.5 rounded-md">
              Verified Client
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-md">
              MT Member
            </span>
          </div>
        </div>
      </section>

      {/* 2. ORDER ARCHIVE LOGS SECTION */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>📦</span> Order Purchase Logs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Review status history and track logistics updates on all current and past invoices.
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Meta Identifiers block layout */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-800">Order #{order.id}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusStyle(order.status)}`}>
                      {order.status || "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Placed on: {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently"}
                  </p>
                </div>

                {/* Quantitative Order Value Summary Info Block */}
                <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-none pt-3 md:pt-0 border-slate-50">
                  <div className="text-left md:text-right">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Amount</span>
                    <span className="text-base font-extrabold text-slate-900">৳{order.total_price || order.total}</span>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Item Count</span>
                    <span className="text-sm font-bold text-slate-700">{order.items_count || order.order_items?.length || 1} item(s)</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Empty Order Log Empty State Display Block */
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto w-full shadow-sm">
            <span className="text-4xl block mb-3">🛒</span>
            <p className="text-slate-800 font-bold text-base">No orders recorded yet</p>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-xs mx-auto">
              You haven't checked out any marketplace items yet. Your finalized orders will pop up cleanly inside this portal container.
            </p>
          </div>
        )}
      </section>

    </div>
  );
};

export default Profile;