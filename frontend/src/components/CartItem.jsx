import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const CartItem = ({ item, showToast }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setLoading(true);
    const result = await updateCartItem(item.productId, newQuantity);
    setLoading(false);

    if (!result.success) {
      showToast && showToast(result.error, 'error');
    }
  };

  const handleRemove = async () => {
    if (!confirm('Remove this item from cart?')) return;

    setLoading(true);
    try {
      const result = await removeFromCart(item.productId);
      if (result.success) {
        showToast && showToast('Item removed from cart', 'success');
      } else {
        showToast && showToast(result.error, 'error');
      }
    } catch (error) {
      showToast && showToast(error.message || 'Failed to remove item', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    console.log('Invalid cart item:', item);
    return null;
  }

  console.log('Rendering cart item:', item);

  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* Product Image */}
      <Link to={`/products/${item.productId}`} className="flex-shrink-0">
        <img
          src={item.productImage || 'https://via.placeholder.com/150x150?text=Product'}
          alt={item.productName}
          className="w-24 h-24 object-cover rounded-md"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1">
        <Link
          to={`/products/${item.productId}`}
          className="font-semibold text-lg hover:text-primary transition-colors"
        >
          {item.productName}
        </Link>
        
        {item.productBrand && (
          <p className="text-gray-600 text-sm mt-1">
            Brand: {item.productBrand}
          </p>
        )}

        <div className="flex items-center gap-4 mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={loading || item.quantity <= 1}
              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="px-4 py-1 border-x border-gray-300">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={loading}
              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={loading}
            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <p className="text-2xl font-bold text-gray-900">
          ₹{(item.subtotal || 0).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          ₹{(item.price || 0).toLocaleString()} each
        </p>
      </div>
    </div>
  );
};

export default CartItem;