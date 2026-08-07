import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import orderService from '../api/orderService';
import paymentService from '../api/paymentService';
import StripePaymentForm from '../components/StripePaymentForm';
import { Elements } from '@stripe/react-stripe-js';

const Checkout = ({ showToast }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise, setStripePromise] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle payment processing
  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      setPaymentProcessing(true);
      
      // Create order after payment is successful
      const shippingAddress = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      const _order = await orderService.placeOrder(
        shippingAddress,
        formData.paymentMethod,
        paymentIntent?.id
      );

      // Clear cart after successful order
      await clearCart();

      showToast && showToast('Payment successful! Order placed.', 'success');
      navigate(`/orders`);
    } catch (error) {
      showToast && showToast(error.message || 'Failed to place order', 'error');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePaymentError = (errorMessage) => {
    showToast && showToast(errorMessage || 'Payment failed', 'error');
  };

  // Initialize Stripe and create payment intent for card/online payments
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripe = await paymentService.getStripe();
        if (!stripe) {
          throw new Error('Stripe failed to initialize');
        }
        setStripePromise(stripe);

        // Create payment intent for the order total
        const amount = Math.round((cart?.total || cartTotal || 0) * 100); // Convert to cents
        
        if (amount <= 0) {
          throw new Error('Invalid order amount');
        }

        console.log('Creating payment intent with amount:', amount);
        const intentData = await paymentService.createPaymentIntent(
          amount,
          'INR'
        );
        
        console.log('Payment intent response:', intentData);
        
        if (!intentData || !intentData.clientSecret) {
          throw new Error('Invalid client secret received from server');
        }
        
        setClientSecret(intentData.clientSecret);
      } catch (error) {
        console.error('Payment initialization error:', error);
        showToast && showToast(error.message || 'Failed to initialize payment', 'error');
      }
    };

    if (formData.paymentMethod !== 'cod' && cart) {
      initializeStripe();
    }
  }, [formData.paymentMethod, cart, cartTotal, showToast]);

  const handleCODSubmit = async (e) => {
    e.preventDefault();

    if (!cart || !cart.items || cart.items.length === 0) {
      showToast && showToast('Your cart is empty', 'warning');
      navigate('/cart');
      return;
    }

    // Validate form
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      showToast && showToast('Please fill in all required fields', 'warning');
      return;
    }

    setLoading(true);

    try {
      const shippingAddress = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      // Handle COD (Cash on Delivery) - Direct order placement
      const _order = await orderService.placeOrder(
        shippingAddress,
        'cod'
      );

      // Clear cart after successful order
      await clearCart();

      showToast && showToast('Order placed successfully!', 'success');
      navigate(`/orders`);
    } catch (error) {
      showToast && showToast(error.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* COD Path - Wrapped in form */}
      {formData.paymentMethod === 'cod' ? (
        <form onSubmit={handleCODSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Shipping & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+91 1234567890"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="input-field"
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-gray-600">Pay when you receive</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-semibold">Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, RuPay</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-semibold">UPI</div>
                      <div className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={formData.paymentMethod === 'netbanking'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-semibold">Net Banking</div>
                      <div className="text-sm text-gray-600">All major banks</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.productImage || 'https://via.placeholder.com/60x60'}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-2">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₹{(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ₹{((cart.subtotal || cartTotal || 0)).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">
                      ₹{((cart.tax || 0)).toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">
                      ₹{((cart.total || cartTotal || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || paymentProcessing}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By placing your order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      ) : (
        // Online Payment Path - No outer form (Stripe form handles submission)
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping & Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info Display (Read-only) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>Name:</strong> {formData.fullName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Address:</strong> {formData.address}</p>
                <p><strong>City:</strong> {formData.city}, <strong>State:</strong> {formData.state}</p>
                <p><strong>Pincode:</strong> {formData.pincode}</p>
              </div>
            </div>

            {/* Payment Method Display */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <p className="text-gray-700 font-semibold">
                {formData.paymentMethod === 'card' && 'Credit/Debit Card'}
                {formData.paymentMethod === 'upi' && 'UPI'}
                {formData.paymentMethod === 'netbanking' && 'Net Banking'}
              </p>
            </div>

            {/* Stripe Payment Form - ONLY form in this section */}
            {stripePromise && clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                  },
                }}
              >
                <StripePaymentForm
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  loading={paymentProcessing}
                  amount={cart.total || cartTotal || 0}
                />
              </Elements>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  Loading payment gateway...
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.productImage || 'https://via.placeholder.com/60x60'}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ₹{(item.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ₹{((cart.subtotal || cartTotal || 0)).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">
                    ₹{((cart.tax || 0)).toLocaleString()}
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary">
                    ₹{((cart.total || cartTotal || 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
