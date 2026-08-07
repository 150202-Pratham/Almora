import axiosInstance from './axios';
import authService from './authService';

const cartService = {
  // Get user's cart - requires email parameter
  // Returns CartDTO with userId, items (CartItemDTO[]), and total
  getCart: async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) throw new Error('User not logged in');
      
      const response = await axiosInstance.get('/cart', {
        params: { email }
      });
      
      // Handle CartDTO response structure
      let data = response.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return data;
    } catch (error) {
      console.error('Get cart error:', error);
      throw error.response?.data || { message: 'Failed to fetch cart' };
    }
  },

  // Add item to cart - requires email, productId, quantity
  // Returns updated CartDTO
  addToCart: async (productId, quantity = 1) => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) throw new Error('User not logged in');
      
      if (quantity < 1) throw new Error('Quantity must be at least 1');
      if (!productId) throw new Error('Product ID is required');
      
      const response = await axiosInstance.post('/cart/add', null, {
        params: {
          email,
          productId,
          quantity
        }
      });
      
      if (!response.data) throw new Error('No data received from server');
      
      console.log('Add to cart response:', response.data);
      
      let data = response.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return data;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error.response?.data || { message: 'Failed to add item to cart' };
    }
  },

  // Update cart item quantity - requires email, productId, quantity
  // Returns updated CartDTO
  updateCartItem: async (productId, quantity) => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) throw new Error('User not logged in');
      
      if (!productId) throw new Error('Product ID is required');
      if (quantity < 1) throw new Error('Quantity must be at least 1');
      
      const response = await axiosInstance.put('/cart/update', null, {
        params: {
          email,
          productId,
          quantity
        }
      });
      
      let data = response.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return data;
    } catch (error) {
      console.error('Update cart error:', error);
      throw error.response?.data || { message: 'Failed to update cart item' };
    }
  },

  // Remove item from cart - requires email, productId
  // Returns updated CartDTO
  removeFromCart: async (productId) => {
    try {
      const email = localStorage.getItem('userEmail');
      console.log('Email from storage:', email);
      
      if (!email) {
        console.error('No email found in storage');
        throw new Error('User not logged in');
      }
      
      if (!productId) {
        console.error('No product ID provided');
        throw new Error('Product ID is required');
      }
      
      console.log('Removing from cart:', { email, productId });
      
      const response = await axiosInstance.delete('/cart/remove', {
        params: {
          email: email,
          productId: productId
        }
      });
      
      let data = response.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return data;
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error.response?.data || { message: 'Failed to remove item from cart' };
    }
  },

  // Clear entire cart - requires email as query param per API spec
  clearCart: async () => {
    try {
      const email = authService.getUserEmail();
      if (!email) throw new Error('User not logged in');
      
      const response = await axiosInstance.delete('/cart/clear', {
        params: { email }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to clear cart' };
    }
  },
};

export default cartService;