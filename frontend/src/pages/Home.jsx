import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../api/productService';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import HeroCarousel from '../components/HeroCarousel';
import VideoSection from '../components/VideoSection';
import FeaturedProductsCarousel from '../components/FeaturedProductsCarousel';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState([
    { value: '10K+', label: 'Happy Customers' },
    { value: '5000+', label: 'Products' },
    { value: '50+', label: 'Local Artisans' },
    { value: '4.8/5', label: 'Customer Rating' },
  ]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const data = await productService.getFeaturedProducts();
      setFeaturedProducts(data);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Traditional Wear', icon: '👗', color: 'bg-red-50' },
            { name: 'Handicrafts', icon: '🎨', color: 'bg-blue-50' },
            { name: 'Home Decor', icon: '🏠', color: 'bg-green-50' },
            { name: 'Accessories', icon: '💍', color: 'bg-yellow-50' },
          ].map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name.toLowerCase()}`}
              className={`${category.color} p-8 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-center group`}
            >
              <div className="text-5xl mb-4">{category.icon}</div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore our handpicked selection of premium artisan products. Click on any item to discover more details.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : featuredProducts.length > 0 ? (
          <>
            <FeaturedProductsCarousel products={featuredProducts} />
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                View All Products
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600 text-lg">No featured products available</p>
        )}
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Features */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
              <div className="text-5xl mb-4 transform transition-transform hover:scale-110">🚚</div>
              <h3 className="font-bold text-xl mb-3">Free Delivery</h3>
              <p className="text-gray-600">Free shipping on orders over ₹500. Fast and reliable delivery across India.</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
              <div className="text-5xl mb-4 transform transition-transform hover:scale-110">🔒</div>
              <h3 className="font-bold text-xl mb-3">Secure Payment</h3>
              <p className="text-gray-600">Multiple secure payment options. 100% safe and encrypted transactions.</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
              <div className="text-5xl mb-4 transform transition-transform hover:scale-110">↩️</div>
              <h3 className="font-bold text-xl mb-3">Easy Returns</h3>
              <p className="text-gray-600">Hassle-free 30-day return policy with quick refunds guaranteed.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;