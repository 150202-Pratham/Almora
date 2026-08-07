# Stripe Payment Integration Setup

## Environment Configuration

### 1. Create `.env` file in project root:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
VITE_API_BASE_URL=http://localhost:8080
```

### 2. Get Your Stripe Publishable Key:
1. Go to https://dashboard.stripe.com
2. Sign in to your Stripe account
3. Navigate to **Developers** → **API Keys**
4. Copy your **Publishable Key** (starts with `pk_`)
5. Paste into `.env` file

### 3. Install Dependencies:
```bash
npm install @stripe/react-stripe-js stripe
```

## Payment Methods Implemented

### 1. **Cash on Delivery (COD)** ✅
- Direct order placement
- No payment processing
- Best for testing

### 2. **Credit/Debit Card** ✅
- Via Stripe Payment Element
- Supports Visa, Mastercard, RuPay, etc.

### 3. **UPI** ✅
- Via Stripe Payment Element
- Indian payment method

### 4. **Net Banking** ✅
- Via Stripe Payment Element
- All major Indian banks supported

## Test Cards for Stripe (Development Mode)

### Successful Payment:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (12/25)
- CVC: Any 3 digits (123)
- Result: Payment succeeds

### Declined Payment:
- Card: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits
- Result: Payment declined

### Requires Authentication:
- Card: `4000 0025 0000 3155`
- Expiry: Any future date
- CVC: Any 3 digits
- Result: Requires 3D Secure verification

## Project Structure

```
src/
├── api/
│   ├── paymentService.js       (NEW - Stripe payment operations)
│   ├── orderService.js         (UPDATED - accepts paymentIntentId)
│   └── ...
├── pages/
│   ├── Checkout.jsx            (UPDATED - Stripe form integration)
│   └── ...
├── components/
│   ├── StripePaymentForm.jsx   (NEW - Stripe payment UI)
│   └── ...
└── ...
```

## Backend API Endpoints Required

### 1. Create Payment Intent
```
POST /payment/create-intent
Content-Type: application/json

{
  "amount": 50000,        // Amount in cents (₹500 = 50000)
  "currency": "INR",
  "orderId": null
}

Response:
{
  "clientSecret": "pi_1Abc..._secret_xyz",
  "paymentIntentId": "pi_1Abc..."
}
```

### 2. Verify Payment Status
```
GET /payment/verify/{paymentIntentId}

Response:
{
  "status": "succeeded",
  "amount": 50000,
  "currency": "INR",
  "paymentIntentId": "pi_1Abc..."
}
```

### 3. Updated Order Placement
```
POST /orders/place
Query Params:
  - email: user@example.com
  - address: JSON stringified address object
  - paymentIntentId: "pi_1Abc..." (optional, for online payments)

Response:
{
  "id": 1,
  "status": "PLACED",
  "totalPrice": 500.00,
  "orderDate": "2025-11-16T10:30:00Z"
}
```

## Files Modified/Created Summary

### Created Files:
1. **src/api/paymentService.js** - Payment gateway integration
2. **src/components/StripePaymentForm.jsx** - Stripe payment form component
3. **STRIPE_INTEGRATION_GUIDE.md** - Complete integration guide

### Modified Files:
1. **src/pages/Checkout.jsx** - Added Stripe payment form and logic
2. **src/api/orderService.js** - Updated to support payment intent IDs

### Updated Dependencies:
- Added `@stripe/react-stripe-js`
- Added `stripe`

## Running the Application

### Development:
```bash
npm run dev
```

### Build for Production:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run preview
```

## Testing the Integration

### 1. Start Development Server:
```bash
npm run dev
```

### 2. Navigate to Checkout Page:
- Add items to cart
- Go to checkout

### 3. Test COD:
- Select "Cash on Delivery"
- Fill shipping details
- Click "Place Order"
- Order should be placed immediately

### 4. Test Online Payment:
- Select payment method (Card/UPI/NetBanking)
- Fill shipping details
- Wait for Stripe form to load
- Enter test card details
- Click "Pay" button
- Verify payment completion

## Error Handling

The system handles:
- ✅ Missing Stripe key
- ✅ Network failures
- ✅ Payment failures
- ✅ Form validation errors
- ✅ Empty cart validation
- ✅ Invalid payment methods

## Security Features

- ✅ PCI DSS Compliance (via Stripe)
- ✅ No card data stored on frontend
- ✅ Client secrets for authentication
- ✅ HTTPS required (production)
- ✅ Secure payment processing

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Stripe not initialized" | Check `.env` has VITE_STRIPE_PUBLISHABLE_KEY |
| Payment form not showing | Verify backend `/payment/create-intent` works |
| Build errors | Run `npm install` and clear `node_modules` |
| Card payment fails | Use test cards from Stripe docs |

## Next Steps

1. **Backend Team:** Implement payment endpoints in Spring Boot
2. **Setup Webhooks:** Configure Stripe webhooks for payment confirmations
3. **Testing:** Test all payment flows with Stripe sandbox
4. **Production:** Update Stripe key and switch to live mode

## Support Resources

- Stripe Documentation: https://stripe.com/docs
- Stripe React Stripe.js: https://stripe.com/docs/stripe-js/react
- Stripe Test Data: https://stripe.com/docs/testing

---

**Last Updated:** November 16, 2025
**Status:** ✅ Development Ready
