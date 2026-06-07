import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import ProductDetails from "../src/pages/ProductDetails";
import ProductList from "../src/pages/ProductList";
import CartPage from "../src/pages/CartPage";
import Navbar from "../src/components/Navbar";
import CheckoutPage from "../src/pages/CheckoutPage";

 function App() {
  return (
    <Router>
    <Navbar />
    <Routes>

      <Route path="/" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

    </Routes>
    </Router>
  );
}

export default App