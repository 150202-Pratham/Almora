# Technical Reference - Payment API Integration

## 🔍 Error Analysis & Solutions

### Error Category 1: Order Placement Failures

#### Error: "400 Bad Request - Cannot read property 'email'"
**Root Cause:** Frontend sending query params, backend expects JSON body

**Solution Applied:**
```javascript
// ❌ BEFORE - Query params approach
axiosInstance.post('/orders/place', null, { 
  params: { email, address: JSON.stringify(...) }
})

// ✅ AFTER - JSON body approach
axiosInstance.post('/orders/place', {
  email,
  shippingAddress: JSON.stringify(...),
  paymentMethod
})
```

**File:** `src/api/orderService.js` line 6-24

---

### Error Category 2: Invalid Status Values

#### Error: "400 Bad Request - Invalid status PLACED"
**Root Cause:** Backend updated status enum values

**Solution Applied:**
```javascript
// ❌ BEFORE - Old status values
if (!['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status))

// ✅ AFTER - New status values
if (!['PENDING', 'PAID', 'CANCELLED', 'SHIPPED', 'DELIVERED'].includes(status))
```

**File:** `src/api/orderService.js` line 70-73

---

### Error Category 3: Missing Order Fields

#### Error: "Cannot read property 'orderDate' of undefined"
**Root Cause:** Response field name changed from `orderDate` to `createdAt`

**Solution Applied:**
```javascript
// ❌ BEFORE - Single field reference
new Date(order.orderDate)

// ✅ AFTER - Fallback reference
new Date(order.createdAt || order.orderDate)
```

**File:** `src/pages/Orders.jsx` line 89

---

### Error Category 4: Missing Total Amount

#### Error: "Cannot read property 'totalPrice' of undefined"
**Root Cause:** Response might have `totalAmount` or `totalPrice`

**Solution Applied:**
```javascript
// ❌ BEFORE - Single field reference
order.totalPrice?.toLocaleString()

// ✅ AFTER - Null coalescing
(order.totalPrice || order.totalAmount || 0)?.toLocaleString()
```

**File:** `src/pages/Orders.jsx` line 97

---

## 📊 Data Flow Mapping

### Request to Backend

```
Frontend Checkout Form
    ↓
handleSubmit()
    ↓
orderService.placeOrder(shippingAddress, paymentMethod, paymentIntentId)
    ↓
Build orderData JSON:
{
  email: "user@example.com",
  shippingAddress: "stringified object",
  paymentMethod: "cod|card|upi|netbanking",
  paymentIntentId: "pi_xxx" (if online payment)
}
    ↓
POST /api/orders/place
    ↓
Backend Processes Order
```

### Response from Backend

```
Backend Order Response
{
  id: 1,
  status: "PENDING|PAID|SHIPPED|DELIVERED|CANCELLED",
  createdAt: "ISO datetime",
  totalPrice: 500.0,
  totalAmount: 500.0,
  paymentIntentId: "pi_xxx or null",
  shippingAddress: "string",
  items: [...OrderItem],
  user: {...User}
}
    ↓
Frontend receives response
    ↓
Orders.jsx maps fields:
- createdAt → date display
- totalPrice/totalAmount → price display
- status → color coding
    ↓
Display in Orders page
```

---

## 🔐 Payment Intent Flow

### With Payment Intent ID

```
User selects Online Payment
    ↓
paymentService.createPaymentIntent(amount, 'INR')
    ↓
POST /api/payment/create-intent
    ↓
Backend returns:
{
  clientSecret: "pi_xxx_secret_yyy",
  paymentIntentId: "pi_xxx"
}
    ↓
Frontend shows Stripe form with clientSecret
    ↓
User completes payment in Stripe
    ↓
stripe.confirmPayment() succeeds
    ↓
Get paymentIntent.id from response
    ↓
orderService.placeOrder(..., paymentIntentId)
    ↓
POST /api/orders/place
{
  email: "...",
  shippingAddress: "...",
  paymentMethod: "card|upi|netbanking",
  paymentIntentId: "pi_xxx"  ← LINKED TO ORDER
}
    ↓
Backend verifies paymentIntentId with Stripe
    ↓
Order created with status: PAID
    ↓
Return to frontend with paymentIntentId in response
```

---

## 🧪 Status Enum Reference

### Status Values & Their Meanings

```
PENDING
├─ Description: Order created, awaiting payment
├─ When Set: When COD order placed
├─ Next Status: PAID (for online) or SHIPPED (for COD after payment)
└─ Example: COD orders start in PENDING

PAID
├─ Description: Payment confirmed
├─ When Set: After successful online payment OR manual payment for COD
├─ Next Status: SHIPPED
└─ Example: Online orders move to PAID immediately

SHIPPED
├─ Description: Order dispatched to customer
├─ When Set: Admin updates status
├─ Next Status: DELIVERED
└─ Example: Order in transit

DELIVERED
├─ Description: Order received by customer
├─ When Set: Admin/delivery confirmation
├─ Next Status: None (Final state)
└─ Example: Order completed

CANCELLED
├─ Description: Order cancelled
├─ When Set: Manual cancellation by user/admin
├─ Next Status: None (Final state)
└─ Example: Order cancelled before shipment
```

---

## 🎯 Implementation Guide

### Step 1: Verify Backend API
```bash
# Check if backend endpoints exist and respond correctly
curl -X POST http://localhost:8080/api/payment/create-intent \
  -H "Content-Type: application/json" \
  -d '{"amount":50000,"currency":"INR"}'

# Expected response:
# {"clientSecret":"pi_...","paymentIntentId":"pi_..."}
```

### Step 2: Test Order Placement
```bash
curl -X POST http://localhost:8080/api/orders/place \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "shippingAddress":"{...}",
    "paymentMethod":"cod"
  }'

# Expected response:
# {"id":1,"status":"PENDING","totalPrice":500.0,...}
```

### Step 3: Frontend Testing
```javascript
// Test COD order
const order = await orderService.placeOrder(shippingAddress, 'cod');
console.log('Order created:', order.id, order.status); // Should be PENDING

// Test online payment order (with payment intent)
const order = await orderService.placeOrder(shippingAddress, 'card', 'pi_xxx');
console.log('Order created:', order.id, order.status); // Should be PAID
```

---

## 📋 Compatibility Matrix

### Backend Version 1.0.0 (Updated)
| Feature | Supported | Notes |
|---------|-----------|-------|
| JSON Body for Order | ✅ YES | New format |
| Query Params for Order | ❌ NO | Old format (removed) |
| Status: PENDING | ✅ YES | New value |
| Status: PAID | ✅ YES | New value |
| Status: PLACED | ❌ NO | Changed to PENDING |
| Field: createdAt | ✅ YES | New/standard name |
| Field: orderDate | ❌ NO | Changed to createdAt |
| Payment Intent ID | ✅ YES | New field |

### Frontend (Current)
| Feature | Status |
|---------|--------|
| JSON Body Support | ✅ YES |
| New Status Enum | ✅ YES |
| Field Mapping | ✅ YES |
| Payment Intent Support | ✅ YES |
| Fallback Fields | ✅ YES |

---

## 🐛 Common Issues & Debugging

### Issue: "POST /api/orders/place returns 400"
```javascript
// Debug checklist:
1. Check if data is JSON body (not query params)
   ✓ Use: axiosInstance.post('/orders/place', orderData)
   ✗ Don't: axiosInstance.post('/orders/place', null, {params:...})

2. Verify field names match:
   ✓ email, shippingAddress, paymentMethod, paymentIntentId
   ✗ address, paymentIntentID (wrong casing)

3. Check shippingAddress is stringified:
   ✓ shippingAddress: JSON.stringify({...})
   ✗ shippingAddress: {...} (object instead of string)
```

### Issue: "Order status shows as undefined"
```javascript
// Debug checklist:
1. Check if status enum is valid:
   ✓ PENDING, PAID, SHIPPED, DELIVERED, CANCELLED
   ✗ PLACED (old value)

2. Verify status color mapping:
   getStatusColor() function must have all 5 new values

3. Check API response:
   console.log('Order response:', order);
   // Should have: status: "PENDING" or "PAID" etc.
```

### Issue: "Order total shows as 0"
```javascript
// Debug checklist:
1. Check field name in response:
   console.log('Total field:', order.totalPrice, order.totalAmount)
   // At least one should have value

2. Verify calculation:
   (order.totalPrice || order.totalAmount || 0)
   // Correct order of fallback: totalPrice → totalAmount → 0

3. Check formatting:
   .toLocaleString() // Adds commas (500000 → 500,000)
```

---

## ✅ Verification Checklist

- ✅ `src/api/orderService.js` updated with JSON body
- ✅ Status enum validation updated
- ✅ `src/pages/Orders.jsx` status colors mapping
- ✅ Date field reference updated (createdAt with fallback)
- ✅ Total amount calculation updated (with fallback)
- ✅ Build successful (0 errors)
- ✅ Payment intent ID support added
- ⏳ Backend API verified (test endpoints)
- ⏳ Integration testing in progress
- ⏳ Production deployment ready

---

## 📞 Support Reference

### For Issues with:
- **Order Placement:** Check `orderService.placeOrder()` method
- **Status Display:** Check `Orders.jsx` `getStatusColor()` function
- **Payment Tracking:** Check `paymentIntentId` in order response
- **Date/Amount Display:** Check fallback values in Orders.jsx

### Key Files Modified:
```
src/api/orderService.js
├─ Line 6-24: placeOrder() method
└─ Line 70-73: updateOrderStatus() validation

src/pages/Orders.jsx
├─ Line 35-43: getStatusColor() function
├─ Line 89: Date field reference
└─ Line 97: Total amount reference
```

---

**Last Updated:** November 16, 2025
**Status:** Production Ready for Integration Testing
