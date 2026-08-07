# Featured Products Carousel - Implementation Guide

## ✨ Overview

The Featured Products Carousel displays your inventory items in an auto-rotating carousel without showing prices. Users can click on any product to view full details including pricing.

---

## 🎯 Key Features

### 1. **Auto-Rotating Carousel**
- Products automatically change every 4 seconds
- Shows 1 item on mobile, 2 on tablet, 3 on desktop
- Smooth transitions and animations
- Auto-pause on user interaction (5-second timeout before resuming)

### 2. **No Prices Displayed**
- Focus on product showcase
- Prices only visible after clicking on product details page
- Drives engagement by encouraging exploration

### 3. **Inventory-Aware Display**
- Shows stock levels as visual indicators
- Green for healthy stock (>10 items)
- Yellow for low stock (1-10 items)
- Red for out of stock
- Products update automatically from your backend

### 4. **Responsive Design**
- **Mobile:** 1 product per view
- **Tablet (640px+):** 2 products per view
- **Desktop (1024px+):** 3 products per view
- Automatically adjusts on window resize

### 5. **Navigation Controls**
- Previous/Next arrows (appear on hover)
- Dot indicators at bottom for quick navigation
- Click dots to jump to specific product sets
- Auto-play status indicator

### 6. **Visual Enhancements**
- Product category badges
- Star ratings
- Discount badges (if applicable)
- Hover scale animations
- Shadow effects on hover
- Stock status overlay for out-of-stock items
- "View Details" overlay on hover

---

## 📁 Files Changed/Created

### New Component Created
```
src/components/FeaturedProductsCarousel.jsx
├── Main carousel component
├── Handles auto-rotation
├── Responsive grid management
└── Navigation controls
```

### Modified Files
```
src/pages/Home.jsx
├── Added import for FeaturedProductsCarousel
├── Replaced grid layout with carousel
└── Updated section styling with gradient title
```

---

## 🎨 Component Structure

### FeaturedProductsCarousel Component

**Props:**
```javascript
{
  products: Array[Product]  // Array of product objects from backend
}
```

**Product Object Structure:**
```javascript
{
  id: string,
  name: string,
  description: string,
  imageUrls: string[],      // First image will be displayed
  category: string,
  rating: number,           // 0-5
  reviewCount: number,
  stock: number,
  discount?: number,        // Optional discount percentage
  price?: number            // Not displayed in carousel
}
```

**State Management:**
```javascript
{
  currentIndex: number,        // Current position in carousel
  displayedProducts: Array,    // Products visible in current view
  autoplay: boolean,           // Auto-rotation status
  itemsPerPage: number         // 1, 2, or 3 based on screen size
}
```

---

## 🎬 How It Works

### 1. **Initialization**
- Component receives products array from Home page
- Detects screen size and sets items per page
- Initializes at product index 0

### 2. **Display**
- Shows 1, 2, or 3 products based on screen width
- Calculates which products to display based on current index
- Updates on resize

### 3. **Auto-Rotation**
- Timer triggers every 4 seconds
- Increments current index by 1
- Wraps around to start when end is reached
- Pauses on user interaction (arrow clicks, dot clicks)
- Resumes after 5 seconds of inactivity

### 4. **Navigation**
- **Previous Arrow:** Decrements index, pauses autoplay
- **Next Arrow:** Increments index, pauses autoplay
- **Dots:** Jump to specific index, pause autoplay
- All pause autoplay for 5 seconds before resuming

### 5. **Responsive Behavior**
- Listens to window resize events
- Recalculates items per page
- Updates display automatically

---

## 🚀 Usage in Home Page

### Before (Grid Layout)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {featuredProducts.map((product) => (
    <ProductCard product={product} showToast={showToast} />
  ))}
</div>
```

### After (Carousel Layout)
```jsx
<FeaturedProductsCarousel products={featuredProducts} />
```

---

## 🎯 User Interactions

### **Auto-Rotate Mode** ✅
- Products change automatically every 4 seconds
- Status shows "Auto-rotating" with green indicator
- Arrows and dots are semi-transparent

### **Manual Navigation**
```
User hovers carousel
    ↓
Arrows become visible
    ↓
User clicks arrow or dot
    ↓
Auto-play pauses
    ↓
Carousel displays selected product
    ↓
5-second timeout starts
    ↓
Auto-play resumes
```

### **Product Click**
```
User clicks product card
    ↓
Navigates to /products/:productId
    ↓
Product details page shows (with price!)
    ↓
User can add to cart from there
```

---

## 📊 Responsive Breakpoints

| Screen Size | Items Per View | Breakpoint |
|-------------|----------------|-----------|
| Mobile | 1 | < 640px |
| Tablet | 2 | 640px - 1024px |
| Desktop | 3 | ≥ 1024px |

---

## 🎨 Styling Features

### Colors & Gradients
```jsx
// Gradient title
"bg-gradient-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent"

// Gradient button
"bg-gradient-to-r from-primary to-yellow-500"

// Category badge
"bg-primary/10 text-primary"
```

### Animations
- **Image Zoom:** Scale up 110% on hover (500ms)
- **Card Lift:** Lift on hover with shadow increase
- **Button Scale:** 105% scale on hover
- **Transitions:** 300-500ms smooth transitions
- **Auto-play pulse:** Green dot pulses when auto-rotating

### Shadows
- Base: `shadow-lg`
- Hover: `shadow-2xl`
- Buttons: `hover:shadow-lg`

---

## 🔄 Data Flow

```
Backend API
    ↓
productService.getFeaturedProducts()
    ↓
setFeaturedProducts(data)
    ↓
<FeaturedProductsCarousel products={featuredProducts} />
    ↓
Maps products to displayable cards
    ↓
User clicks product → /products/:id
```

---

## ⚙️ Configuration Options

You can customize the carousel behavior by modifying these values in `FeaturedProductsCarousel.jsx`:

### Auto-rotate Interval
```javascript
// Change product every 4 seconds (line ~64)
}, 4000);  // Change this value
```

### Auto-play Resume Timeout
```javascript
// Resume after 5 seconds of inactivity (line ~91)
setTimeout(() => setAutoplay(true), 5000);  // Change this value
```

### Items Per Page Breakpoints
```javascript
// Modify getVisibleProducts() function (line ~13)
if (window.innerWidth < 640) return 1;    // Mobile threshold
if (window.innerWidth < 1024) return 2;   // Tablet threshold
return 3;                                  // Desktop
```

---

## 🧪 Testing the Carousel

### Test Scenarios

1. **Auto-Rotation**
   - Open home page
   - Wait 4 seconds
   - Verify product changes automatically
   - Check auto-play indicator is green and pulsing

2. **Manual Navigation**
   - Hover over carousel
   - Click next arrow → product advances
   - Click previous arrow → product goes back
   - Verify autoplay pauses (indicator turns gray)
   - Wait 5 seconds → autoplay resumes (indicator turns green)

3. **Dot Navigation**
   - Click any dot
   - Carousel jumps to that product set
   - Autoplay pauses for 5 seconds
   - Then resumes

4. **Responsive**
   - View on mobile (< 640px) → 1 product shows
   - View on tablet (640px-1024px) → 2 products show
   - View on desktop (≥ 1024px) → 3 products show
   - Resize browser → layout adjusts dynamically

5. **Product Click**
   - Click any product card
   - Navigates to product details page
   - Price is now visible
   - Add to cart works normally

6. **Out of Stock Handling**
   - If product stock = 0
   - "Out of Stock" overlay appears
   - Product still clickable
   - Button shows "Out of Stock"
   - Stock indicator shows red

---

## 💡 Product Listing Tips

To make the carousel work best:

### Recommended Product Data
```javascript
{
  id: 1,
  name: "Premium Wool Shawl",
  description: "Handwoven traditional shawl",
  imageUrls: ["https://..."],
  category: "Textiles",
  rating: 4.8,
  reviewCount: 142,
  stock: 15,
  discount: 10,  // Optional
}
```

### Image Best Practices
- Use high-quality images (at least 400x500px)
- First image in array is displayed
- Keep aspect ratio consistent
- Optimize for web (compress images)

### Stock Management
- Update stock in backend as inventory changes
- Carousel reflects changes automatically
- Visual indicators help customers make choices

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Carousel not auto-rotating | Check if `autoplay` state is true, verify 4000ms interval is set |
| Products not displaying | Verify `featuredProducts` array has data, check image URLs |
| Responsive not working | Check window resize listener, verify Tailwind breakpoints |
| Dots not working | Verify `handleDotClick` function, check `currentIndex` calculation |
| Arrows hidden | Arrows only show on hover - hover over carousel to see them |
| Stock indicator wrong color | Check stock value calculation (green >10, yellow 1-10, red ≤0) |

---

## 🎯 Future Enhancements

Possible improvements:

1. **Keyboard Navigation**
   - Left/Right arrow keys to navigate
   - Space to toggle autoplay

2. **Touch Gestures**
   - Swipe left/right on mobile
   - Swipe to navigate carousel

3. **Drag to Scroll**
   - Desktop drag support
   - Smooth scroll animation

4. **Product Filtering**
   - Filter by category
   - Filter by price range
   - Filter by rating

5. **Analytics**
   - Track which products are viewed most
   - Track carousel interaction
   - A/B test different products

6. **Wishlist Integration**
   - Heart icon on hover
   - Add to wishlist without navigating

---

## 📝 Performance Notes

- Component is optimized with `useEffect` dependencies
- Auto-play interval cleaned up on unmount
- Resize listener cleaned up on unmount
- Smooth CSS transitions used instead of animations
- Responsive calculations done once per resize
- No unnecessary re-renders

---

## ✅ Build Status

```
Build Output:
✓ 475 modules transformed
✓ 0 errors
✓ CSS: 56.13 kB (gzip: 10.93 kB)
✓ JS: 484.70 kB (gzip: 145.98 kB)
```

---

## 📚 Related Files

- `src/components/FeaturedProductsCarousel.jsx` - Main component
- `src/pages/Home.jsx` - Home page using carousel
- `src/api/productService.js` - Fetches featured products
- `src/pages/ProductDetails.jsx` - Product details after click

---

## 🚀 Next Steps

1. ✅ Carousel component created
2. ✅ Integrated into Home page
3. ✅ Build verified (0 errors)
4. 📋 Test on various screen sizes
5. 📋 Monitor product engagement
6. 📋 Adjust auto-rotate timing if needed
7. 📋 Consider future enhancements

---

**Implementation Date:** November 2025
**Status:** ✅ Complete and Production Ready

