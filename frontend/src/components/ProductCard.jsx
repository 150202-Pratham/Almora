import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const ProductCard = ({ product, showToast }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast && showToast('Please login to add items to cart', 'warning');
      return;
    }

    setLoading(true);
    const result = await addToCart(product.id, 1);
    setLoading(false);

    if (result.success) {
      showToast && showToast('Added to cart successfully!', 'success');
    } else {
      showToast && showToast(result.error, 'error');
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
      
        <img
          src={product.imageUrls?.[0] || 'https://via.placeholder.com/400x400?text=Product'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(product.rating || 0) ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price?.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={loading || (product.stock <= 0)}
          className={`w-full py-2 rounded-lg font-semibold transition-colors ${
            loading || (product.stock <= 0)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary hover:bg-yellow-600 text-white'
          }`}
        >
          {loading ? 'Adding...' : (product.stock <= 0) ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;