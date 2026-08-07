import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../api/productService';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import ReviewSection from '../components/ReviewSection';

const ProductDetails = ({ showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      showToast && showToast('Failed to load product details', 'error');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast && showToast('Please login to add items to cart', 'warning');
      navigate('/login');
      return;
    }

    if (!product?.id) {
      showToast && showToast('Invalid product', 'error');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      showToast && showToast('Please select a size', 'warning');
      return;
    }

    setAddingToCart(true);
    try {
      console.log('Adding product to cart:', { id: product.id, quantity, size: selectedSize }); // Debug log
      const result = await addToCart(product.id, quantity, selectedSize);
      if (result.success) {
        showToast && showToast('Added to cart successfully!', 'success');
      } else {
        showToast && showToast(result.error || 'Failed to add to cart', 'error');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      showToast && showToast(error.message || 'Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      showToast && showToast('Please login to continue', 'warning');
      navigate('/login');
      return;
    }

    await handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Product Images */}
          <div>
            <img
              src={product.imageUrls?.[0] || 'https://via.placeholder.com/600x600?text=Product'}
              alt={product.name}
              className="w-full rounded-lg"
            />
            {/* Thumbnail images */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex text-yellow-400 text-xl">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(product.rating || 0) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating?.toFixed(1)} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xl text-green-600 font-semibold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600 font-semibold">✗ Out of Stock</span>
              )}
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-red-500 text-sm mt-2">Please select a size</p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">About this product</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">Quantity:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="px-6 py-2 border border-gray-300 rounded-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              {product.stock > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Maximum {product.stock} units available
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || addingToCart}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? 'Adding...' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Product Features */}
            {product.features && (
              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-8">
        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetails;