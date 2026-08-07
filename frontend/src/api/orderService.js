import axiosInstance from './axios';
import authService from './authService';

const orderService = {
  // Place new order with payment - now using JSON body
  placeOrder: async (shippingAddress, paymentMethod = 'cod', paymentIntentId = null) => {
    try {
      const email = authService.getUserEmail();
      if (!email) throw new Error('User not logged in');
      
      const orderData = {
        email,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod,
      };

      // Add payment intent ID if payment is online
      if (paymentMethod !== 'cod' && paymentIntentId) {
        orderData.paymentIntentId = paymentIntentId;
      }
      
      const response = await axiosInstance.post('/orders/place', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to place order' };
    }
  },

  // Create demo order for testing (without payment processing)
  createDemoOrder: async (shippingAddress) => {
    try {
      const email = authService.getUserEmail();
      if (!email) throw new Error('User not logged in');
      
      const response = await axiosInstance.post('/payment/demo-order', null, {
        params: {
          email,
          address: JSON.stringify(shippingAddress)
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create demo order' };
    }
  },

  // Get order history for user - requires email
  getUserOrders: async () => {
    try {
      const email = authService.getUserEmail();
      if (!email) throw new Error('User not logged in');
      
      const response = await axiosInstance.get('/orders/history', {
        params: { email }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/orders/get/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order details' };
    }
  },

  // Update order status - requires orderId and status enum
  updateOrderStatus: async (orderId, status) => {
    try {
      // Status must be one of: PENDING, PAID, CANCELLED, SHIPPED, DELIVERED
      if (!['PENDING', 'PAID', 'CANCELLED', 'SHIPPED', 'DELIVERED'].includes(status)) {
        throw new Error('Invalid order status');
      }
      
      const response = await axiosInstance.put(`/orders/${orderId}/status`, null, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  },

  // Cancel order - convenience method that sets status to CANCELLED
  cancelOrder: async (orderId) => {
    return orderService.updateOrderStatus(orderId, 'CANCELLED');
  },
};

export default orderService;