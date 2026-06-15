import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { authFetch } from '../utils/auth';

const CheckoutPage = () => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment_method: "COD",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    // --- Format the phone number to match Backend expectations ---
    let formattedPhone = form.phone.trim();
    if (!formattedPhone.startsWith("+88")) {
      // If the user typed a 0 at the start (e.g. 01849...), we can just prepend +88
      // If they didn't write the 0, it still handles it safely.
      formattedPhone = `+88${formattedPhone}`;
    }

    // Prepare the final payload using the updated phone number
    const payload = {
      ...form,
      phone: formattedPhone
    };

    try {
      const res = await authFetch(`${BASEURL}/api/orders/create/`, {
        method: "POST",
        body: JSON.stringify(payload), // 👈 Sending payload with formatted phone now
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Order placed successfully!");
        fetch(`${BASEURL}/api/cart/`);
        clearCart();
        setTimeout(() => {
          navigate("/");
        }, 2000);
        
      } else {
        setMessage(data.error || "Order failed");
      }
    } catch (error) {
      setMessage("Checkout error structural failure.");
      console.error(error);
    } finally {
      setLoading(false); // Make sure loading states flip back safely
    }
  };

  return (
   <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
    {/* Header Banner Section */}
    <div className="bg-slate-900 px-6 py-5 sm:px-8">
      <h1 className="text-xl font-bold text-white tracking-tight">Checkout Details</h1>
      <p className="text-xs text-slate-400 mt-1">Please provide accurate shipping and contact information.</p>
    </div>

    {/* Form Section */}
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
      
      {/* Name Input Group */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Full Name
        </label>
        <div className="relative">
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-500/10"
          />
        </div>
      </div>

      {/* Address Input Group */}
      <div className="space-y-1.5">
        <label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Shipping Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={form.address}
          onChange={handleChange}
          placeholder="House/Apartment, Street Name, City"
          required
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-500/10"
        />
      </div>

      {/* Phone Input Group */}
      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Phone Number
        </label>
        <div className="relative flex items-center">
          {/* Subtle Indicator for BD numbers */}
          <span className="absolute left-3.5 text-sm font-medium text-slate-400 pointer-events-none select-none">
            BD
          </span>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="01849xxxxxx"
            required
            className="w-full pl-11 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-500/10"
          />
        </div>
      </div>

      {/* Payment Method Selector Group */}
      <div className="space-y-1.5">
        <label htmlFor="payment_method" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Payment Mode
        </label>
        <div className="relative">
          <select
            id="payment_method"
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 appearance-none cursor-pointer transition-all duration-200 outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-500/10"
          >
            <option value="COD">💵 Cash on Delivery (COD)</option>
            <option value="ONLINE">💳 Online Digital Payment</option>
          </select>
          {/* Custom Select Dropdown Arrow */}
          <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Submit Action Wrapper */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold text-sm shadow-md shadow-green-600/10 hover:bg-green-700 active:scale-[0.99] active:shadow-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-150"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Securing Order...
            </span>
          ) : (
            "Confirm & Place Order"
          )}
        </button>
      </div>

      {/* Dynamic Status Notification Banner */}
      {message && (
        <div 
          className={`mt-4 p-3.5 rounded-xl border text-center text-sm font-medium animate-fadeIn ${
            message.toLowerCase().includes("successfully")
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : "bg-rose-50 border-rose-100 text-rose-800"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  </div>
</div>
  );
};

export default CheckoutPage;