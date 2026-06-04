import { useEffect,useState } from 'react'
import Product from '../../src/components/ProductCard'

const ProductList = () => {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL

    useEffect(() => {
        fetch(`${BASEURL}/api/products/`)
          .then(res => {
            if (!res.ok) {
              throw new Error('Failed to fetch products')
            }
            return res.json()
            
          })
          .then((data) => {
            setProducts(data);
            setLoading(false);
            
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false)
          })
      }, []);

      if (loading) {
        return <p>Loading...</p>;
      }
    
      if (error) {
        return <p>Error: {error}</p>;
      }





  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">

    <h1 className="text-2xl sm:text-3xl font-bold text-center bg-white shadow-sm border border-gray-100 py-4 mb-8 rounded-xl tracking-tight text-gray-800">
      Product List
    </h1>

  
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <Product key={product?.id || product?._id} product={product} />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <p className="text-gray-500 font-medium text-center">
            No products found
          </p>
          <p className="text-gray-400 text-sm text-center mt-1">
            Check back later or try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  </div>
  )
}

export default ProductList