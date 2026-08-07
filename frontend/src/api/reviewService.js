import axiosInstance from './axios';

const BASE_API = '/reviews';

export const reviewService = {
  // Get reviews for a specific product
  getProductReviews: async (productId) => {
    try {
      const response = await axiosInstance.get(`${BASE_API}/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  },

  // Get review summary (ratings distribution) for a product
  getReviewSummary: async (productId) => {
    try {
      const response = await axiosInstance.get(`${BASE_API}/product/${productId}/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching review summary:', error);
      throw error;
    }
  },

  // Add a new review
  addReview: async (reviewData) => {
    try {
      const response = await axiosInstance.post(`${BASE_API}/addReview`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
};