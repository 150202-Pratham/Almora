import { useState, useEffect } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';

const StripePaymentForm = ({ 
  clientSecret, 
  onSuccess, 
  onError, 
  loading = false,
  amount = 0
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   // Check if stripe and elements are ready
  //   if (stripe && elements) {
  //     console.log('Stripe and elements are ready');
  //     setIsReady(true);
  //   } else {
  //     console.log('Waiting for Stripe and elements:', { 
  //       stripe: !!stripe, 
  //       elements: !!elements 
  //     });
  //     setIsReady(false);
  //   }
  // }, [stripe, elements]);
  useEffect(() => {
  if (!elements) return;

  const paymentElement = elements.getElement(PaymentElement);
  if (!paymentElement) return;

  paymentElement.on('ready', () => {
    console.log("PaymentElement is ready & mounted");
    setIsReady(true);
  });
}, [elements]);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      setErrorMessage('Stripe not initialized - please wait and try again');
      onError?.('Stripe not initialized');
      return;
    }

    // Ensure PaymentElement is mounted
    if (!isReady) {
      setErrorMessage('Payment form is still loading - please wait');
      onError?.('Payment form not ready');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required', // Don't redirect immediately
      });

      if (error) {
        // This point is only reached if there is an immediate error
        setErrorMessage(error.message || 'Payment failed');
        onError?.(error.message || 'Payment failed');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        onSuccess?.(paymentIntent);
      } else if (paymentIntent) {
        // Payment requires further action or is processing
        onSuccess?.(paymentIntent);
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during payment');
      onError?.(error.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Card Details</h3>

      <div className="space-y-4">
        {/* Payment Element - displays card input or other payment methods */}
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <PaymentElement
            options={{
              layout: 'tabs',
              defaultValues: {
                billingDetails: {
                  email: '',
                  name: '',
                },
              },
            }}
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Amount Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-gray-600">Amount to pay</p>
          <p className="text-lg font-bold text-blue-600">₹{amount.toLocaleString()}</p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isProcessing || loading || !stripe || !elements || !isReady}
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          {!isReady ? 'Loading...' : isProcessing ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Your payment information is secured and encrypted
        </p>
      </div>
    </div>
  );
};

export default StripePaymentForm;
