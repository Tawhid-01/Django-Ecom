import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import ProductDetails from "../src/pages/ProductDetails";
import ProductList from "../src/pages/ProductList";

 function App() {
  return (
    <Router>
    <Routes>

      <Route path="/" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductDetails />} />
    </Routes>
    </Router>
  );
}

export default App