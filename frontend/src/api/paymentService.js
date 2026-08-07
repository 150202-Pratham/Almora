import axiosInstance from './axios';
import authService from './authService';

// Stripe will be loaded dynamically
let stripePromise = null;

const getStripePromise = async () => {
  if (stripePromise) return stripePromise;
  
  try {
    // Use Stripe's CDN to load stripe.js
    if (!window.Stripe) {
      // Load Stripe from CDN
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => {
          if (window.Stripe) {
            const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo');
            stripePromise = Promise.resolve(stripe);
            resolve(stripe);
          } else {
            reject(new Error('Stripe failed to load'));
          }
        };
        script.onerror = () => reject(new Error('Failed to load Stripe script'));
        document.head.appendChild(script);
      });
    } else {
      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo');
      stripePromise = Promise.resolve(stripe);
      return stripe;
    }
  } catch (error) {
    console.error('Failed to load Stripe:', error);
    return null;
  }
};

const paymentService = {
  // Get Stripe instance
  getStripe: async () => {
    return getStripePromise();
  },

  // Create payment intent for order
  createPaymentIntent: async (amount, currency = 'INR', orderId = null) => {
    try {
      const response = await axiosInstance.post('/payment/create-intent', {
        amount,
        currency,
        orderId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create payment intent' };
    }
  },

  // Confirm payment with Stripe
  confirmPayment: async (stripe, elements, clientSecret) => {
    if (!stripe || !elements) {
      throw new Error('Stripe not initialized');
    }

    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    return result;
  },

  // Verify payment status
  verifyPaymentStatus: async (paymentIntentId) => {
    try {
      const response = await axiosInstance.get(`/payment/verify/${paymentIntentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to verify payment status' };
    }
  },

  // Handle webhook for payment confirmation (backend handles this)
  // Frontend just needs to check payment intent status

  // Create demo order (for testing without actual payment)
  createDemoOrder: async (shippingAddress) => {
    try {
      const email = authService.getUserEmail();
      if (!email) throw new Error('User not logged in');

      const response = await axiosInstance.post('/payment/demo-order', {
        email,
        shippingAddress,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create demo order' };
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const email = authService.getUserEmail();
      if (!email) throw new Error('User not logged in');

      const response = await axiosInstance.get('/payment/history', {
        params: { email },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payment history' };
    }
  },

  // Cancel payment
  cancelPayment: async (paymentIntentId) => {
    try {
      const response = await axiosInstance.post(`/payment/cancel/${paymentIntentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel payment' };
    }
  }
};

export default paymentService;
