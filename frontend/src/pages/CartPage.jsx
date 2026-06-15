import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

function CartPage() {
  const { cartItems, total, removeFromCart, updateQuantity } = useCart();

  // Guard safety to prevent crash if context is loading/undefined
  const items = cartItems || [];
  const finalTotal = total || 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-8">
          Shopping Cart <span className="text-sm font-normal text-slate-500 ml-2">({items.length} items)</span>
        </h1>

        {items.length === 0 ? (
          /* Premium Empty Cart View */
          <div className="text-center bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/50 p-12 max-w-md mx-auto">
            <span className="text-5xl block mb-4">🛒</span>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Your cart is empty</h2>
            <p className="text-sm text-slate-500 mb-6">Looks like you hasn't added any products to your cart yet.</p>
            <Link 
              to="/" 
              className="inline-block bg-green-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-green-700 transition duration-150 shadow"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Split Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Hand Column: Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white border border-slate-100 p-4 sm:p-5 rounded-2xl shadow-sm transition hover:shadow-md"
                >
                  {/* Left: Product Image & Details */}
                  <div className="flex items-center gap-4">
                    {item.product_image && (
                      <img
                        src={`${BASEURL}${item.product_image}`}
                        alt={item.product_name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-slate-50"
                      />
                    )}
                    <div className="space-y-1">
                      <h2 className="text-sm sm:text-base font-bold text-slate-800 line-clamp-1">
                        {item.product_name}
                      </h2>
                      <p className="text-sm font-extrabold text-slate-900">
                        ৳{item.price}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quantity Controls & Remove Action */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                    
                    {/* Stepper Input Counter Container */}
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-slate-600 rounded-lg font-bold hover:bg-white hover:text-slate-900 transition shadow-none hover:shadow-sm disabled:opacity-30"
                        disabled={item.quantity <= 1} // Safety boundary guard clause
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        —
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-slate-800 select-none">
                        {item.quantity}
                      </span>
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-slate-600 rounded-lg font-bold hover:bg-white hover:text-slate-900 transition shadow-none hover:shadow-sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Product Action Anchor */}
                    <button 
                      className="text-xs font-semibold text-rose-500 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition duration-150"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Hand Column: Sticky Summary Card Card Panel */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/50 p-6 space-y-6 lg:sticky lg:top-28">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-3">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-700">৳{finalTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between items-end">
                  <span className="text-base font-bold text-slate-800">Total Amount</span>
                  <span className="text-xl font-black text-slate-900">৳{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="block text-center bg-green-600 text-white font-semibold text-sm py-3 rounded-xl shadow-md shadow-green-600/10 hover:bg-green-700 transition active:scale-[0.99] duration-150"
              >
                Proceed to Checkout
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;