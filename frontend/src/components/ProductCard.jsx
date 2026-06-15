import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-100 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
      
      {/* Product Image & Link Area */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden relative">
        <img
          src={`${BASEURL}${product.image}`}
          alt={product.name}
          className="w-full h-52 object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Subtle dark overlay effect on hover */}
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Content Details Area */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Product Title Linked */}
          <Link to={`/product/${product.id}`} className="block">
            <h2 className="text-base font-bold text-slate-800 hover:text-green-600 line-clamp-1 transition-colors duration-150">
              {product.name}
            </h2>
          </Link>
          
          {/* Description with Line Clamp (Prevents broken grid layouts) */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer actions: Price & Buy Trigger */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-50">
          <span className="text-base font-black text-slate-900">
            ৳{product.price}
          </span>
          
          {/* Isolated Interactive Action Button */}
          <Link 
            to={`/product/${product.id}`}
            className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-600 hover:text-white px-3.5 py-2 rounded-xl transition-all duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;