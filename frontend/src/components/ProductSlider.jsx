import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Product from '../components/ProductCard';

// Import Swiper styles inside your component
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    fetch(`${BASEURL}/api/products/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch carousel data');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [BASEURL]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 h-[340px] space-y-4">
                <div className="bg-slate-200 h-48 w-full rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-5 bg-slate-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) return null; // Failsafe fallback if error or empty inventory

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/30">
      
      {/* Slider Title Block */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trending Products
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Our most popular items handpicked for you this week.
          </p>
        </div>
      </div>

      {/* Responsive Swiper Carousel Container */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-14 !px-2 pt-2 custom-product-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product?.id || product?._id} className="h-auto">
            {/* Reusing your signature styling card layout wrapper */}
            <div className="h-full transform hover:-translate-y-1 transition-transform duration-200">
              <Product product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;