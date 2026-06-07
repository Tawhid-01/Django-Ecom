import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const {clearCart} = useCart();

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

    try {
      const res = await fetch(`${BASEURL}/api/orders/create/`, {
        method: "POST",
        body: JSON.stringify(form),
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
      setMessage("Checkout error:", error);
    }
  };

  return (
    <div className="pt-20 p-6">
      <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full p-2 border rounded"
          />

          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="ONLINE">Online Payment</option>
          </select>

          <button 
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded">
            { loading ? "Processing..." : "Placing Order"}
            Place Order
          </button>
          {message && (
            <p className="text-center text-green-500 font-semibold mt-4">{message}</p>
            )}
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage