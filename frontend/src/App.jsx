import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages (Standardized relative paths starting from the current directory)
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails"; // 👈 Standardized from "../src/pages"
import ProductList from "./pages/ProductList";
import CartPage from "./pages/CartPage";             // 👈 Standardized from "../src/pages"
import CheckoutPage from "./pages/CheckoutPage";     // 👈 Standardized from "../src/pages"
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Components
import Navbar from "./components/Navbar";             // 👈 Standardized from "../src/components"
import PrivateRouter from "./components/PrivateRouter";
import AllProducts from "./pages/AllProducts";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      {/* Sticky Glassmorphism Navigation Header */}
      <Navbar />
      
      <Routes>
        {/* Unified Marketplace Landing Page */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<AllProducts />} />
        {/* Public Catalog Routes */}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Protected Checkout Pipeline */}
        <Route element={<PrivateRouter />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;