import { Link } from "react-router-dom"

const ProductCard = ({product}) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL
  return (
    <Link to={`/product/${product.id}`}>
    <div className="bg-white shadow-md rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 ease-in-out p-4 mb-4">
        <img
         src= {`${BASEURL}${product.image}`} alt={product.name}
         className="w-full h-56 object-cover rounded-lg mb-4" />
      <h2 className="text-lg font-semibold text-gray-800 translate-middle">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-gray-600 font-medium">${product.price}</p>
    </div>
    </Link>
  )
}

export default ProductCard