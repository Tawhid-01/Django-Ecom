import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); // For smoother React Router navigation
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // FIX 1: Uncommented hook to get access to addToCart
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
    if (!localStorage.getItem('access_token')) {
      navigate('/login');
      return;
    }

    if (!product) return;

    const cartProduct = {
      id: product.id,
      product_name: product.name,
      product_image: product.image,
      price: parseFloat(product.price),
    };

    addToCart(cartProduct);
  };

  if (loading) {
     return <div className="text-center pt-20 font-medium text-gray-600">Loading product details...</div>;
  }
  if (error) {
    return <div className="text-center pt-20 text-red-500 font-medium">Error: {error}</div>;
  }
  if (!product) {
    return <div className="text-center pt-20 font-medium text-gray-600">No product found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* FIX 3: Conditionally prepend BASEURL if Django returns relative paths */}
          <img
            src={product.image?.startsWith('http') ? product.image : `${BASEURL}${product.image}`}
            alt={product.name}
            className="w-full md:w-1/2 h-auto object-cover rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-semibold text-green-600 mb-6">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            
            {/* FIX 4: Linked to the protective handleAddToCart instead of direct execution */}
            <button  
              onClick={()=> addToCart(product.id)} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full md:w-auto text-center"
            >
                Add to Cart 🛒
            </button>
            
            {/* Home Button */}
            <div className="mt-4">
              <a
                href="/"
                className="text-blue-600 hover:underline inline-block"
              >
                &larr; Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;