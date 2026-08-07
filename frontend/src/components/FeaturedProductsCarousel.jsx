import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FeaturedProductsCarousel = ({ products = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [autoplay, setAutoplay] = useState(true);

  // Get visible products based on screen size
  const getVisibleProducts = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth < 640) return 1; // Mobile
    if (window.innerWidth < 1024) return 2; // Tablet
    return 3; // Desktop
  };

  const [itemsPerPage, setItemsPerPage] = useState(getVisibleProducts());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getVisibleProducts());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Calculate visible products
    const visible = [];
    for (let i = 0; i < itemsPerPage; i++) {
      visible.push(products[(currentIndex + i) % products.length]);
    }
    setDisplayedProducts(visible);
  }, [currentIndex, products, itemsPerPage]);

  // Auto-rotate carousel
  useEffect(() => {
    if (!autoplay || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4000); // Change product every 4 seconds

    return () => clearInterval(interval);
  }, [autoplay, products.length]);

  const handlePrev = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    // Resume autoplay after 5 seconds
    setTimeout(() => setAutoplay(true), 5000);
  };

  const handleNext = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % products.length);
    // Resume autoplay after 5 seconds
    setTimeout(() => setAutoplay(true), 5000);
  };

  const handleDotClick = (index) => {
    setAutoplay(false);
    setCurrentIndex(index);
    // Resume autoplay after 5 seconds
    setTimeout(() => setAutoplay(true), 5000);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full group">
      {/* Main Carousel */}
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-out">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product, index) => (
              <Link
                key={`${product.id}-${index}`}
                to={`/products/${product.id}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group/card"
              >
                {/* Product Image Container */}
                <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                  <img
                    src={product.imageUrls?.[0] || 'https://via.placeholder.com/400x500?text=Product'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                  />

                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {product.discount}% OFF
                    </div>
                  )}

                  {/* Stock Status */}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-white text-red-600 px-6 py-2 rounded-full font-bold text-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* View Details Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white text-sm font-semibold flex items-center gap-2">
                      <span>View Details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  {/* Category Tag */}
                  <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {product.category || 'Featured'}
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover/card:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(product.rating || product.averageRating || 0) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description || 'Premium artisan product'}
                  </p>

                  {/* Stock Indicator */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          product.stock > 10
                            ? 'bg-green-500'
                            : product.stock > 0
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 font-semibold">
                      {product.stock} left
                    </span>
                  </div>

                  {/* Hover Button */}
                  <button
                    onClick={(e) => e.preventDefault()}
                    disabled={product.stock <= 0}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform group-hover/card:scale-105 ${
                      product.stock <= 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-yellow-500 text-white hover:shadow-lg'
                    }`}
                  >
                    {product.stock <= 0 ? 'Out of Stock' : 'Explore'}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Previous Button */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
        aria-label="Previous products"
      >
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
        aria-label="Next products"
      >
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-3 mt-8">
        {[...Array(Math.ceil(products.length / itemsPerPage))].map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index * itemsPerPage)}
            className={`h-3 rounded-full transition-all duration-300 ${
              Math.floor(currentIndex / itemsPerPage) === index
                ? 'bg-primary w-8'
                : 'bg-gray-300 w-3 hover:bg-gray-400'
            }`}
            aria-label={`Go to product ${index * itemsPerPage + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="flex justify-center items-center gap-2 mt-4 text-xs text-gray-600">
        <div className={`w-2 h-2 rounded-full ${autoplay ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
        <span>{autoplay ? 'Auto-rotating' : 'Paused'}</span>
      </div>
    </div>
  );
};

export default FeaturedProductsCarousel;
