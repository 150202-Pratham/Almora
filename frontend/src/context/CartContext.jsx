import { createContext, useState, useEffect } from 'react';
import cartService from '../api/cartService';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      console.log('Fetching cart for authenticated user:', isAuthenticated);
      const data = await cartService.getCart();
      console.log('Cart data received:', data);
      
      // Cart is now CartDTO with items as CartItemDTO[]
      // No need to clean reviews since CartItemDTO doesn't contain product objects
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      console.error('Error details:', error.response?.data || error.message);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (!productId) {
        return { success: false, error: 'Product ID is required' };
      }

      console.log('Adding to cart:', { productId, quantity });
      const response = await cartService.addToCart(productId, quantity);
      console.log('Add to cart response:', response);
      
      // Update cart with new CartDTO response
      setCart(response);
      return { success: true };
    } catch (error) {
      console.error('Add to cart error:', error);
      console.error('Error details:', error.response?.data || error.message);
      return { success: false, error: error.message || 'Failed to add to cart' };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (quantity < 1) {
        return { success: false, error: 'Quantity must be at least 1' };
      }

      const response = await cartService.updateCartItem(productId, quantity);
      // Update cart with new CartDTO response
      setCart(response);
      return { success: true };
    } catch (error) {
      console.error('Update cart error:', error);
      return { success: false, error: error.message || 'Failed to update cart' };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (!productId) {
        return { success: false, error: 'Product ID is required' };
      }

      const response = await cartService.removeFromCart(productId);
      // Update cart with new CartDTO response
      setCart(response);
      return { success: true };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return { success: false, error: error.message || 'Failed to remove from cart' };
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
      return { success: true };
    } catch (error) {
      console.error('Clear cart error:', error);
      return { success: false, error: error.message || 'Failed to clear cart' };
    }
  };

  const applyCoupon = async (couponCode) => {
    try {
      const data = await cartService.applyCoupon(couponCode);
      setCart(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to apply coupon' };
    }
  };

  const getCartCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    if (!cart) return 0;
    return cart.total || 0;
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    fetchCart,
    cartCount: getCartCount(),
    cartTotal: getCartTotal(),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};