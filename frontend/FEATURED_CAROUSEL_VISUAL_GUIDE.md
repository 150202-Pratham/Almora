# Featured Products Carousel - Visual Guide

## 🎨 Component Layout

### Desktop View (3 Products)
```
┌─────────────────────────────────────────────────────────────┐
│  < Featured Products Section >                              │
│                                                              │
│  ◄         ┌─────────┐  ┌─────────┐  ┌─────────┐         ► │
│            │ Product │  │ Product │  │ Product │            │
│            │    1    │  │    2    │  │    3    │            │
│            │         │  │         │  │         │            │
│            │ Image   │  │ Image   │  │ Image   │            │
│            │ ★★★★★   │  │ ★★★★☆   │  │ ★★★★★   │            │
│            │ Details │  │ Details │  │ Details │            │
│            │ Stock   │  │ Stock   │  │ Stock   │            │
│            │Explore  │  │Explore  │  │Explore  │            │
│            └─────────┘  └─────────┘  └─────────┘            │
│                                                              │
│             ● ● ● ● ●                                       │
│        ✓ Auto-rotating                                       │
└─────────────────────────────────────────────────────────────┘
```

### Tablet View (2 Products)
```
┌───────────────────────────────────────┐
│  Featured Products Section            │
│                                        │
│  ◄    ┌──────────┐  ┌──────────┐    ► │
│       │ Product  │  │ Product  │       │
│       │    1     │  │    2     │       │
│       │  Image   │  │  Image   │       │
│       │ ★★★★☆    │  │ ★★★★★    │       │
│       │ Details  │  │ Details  │       │
│       │Explore   │  │Explore   │       │
│       └──────────┘  └──────────┘       │
│                                        │
│            ● ● ● ●                     │
│       ✓ Auto-rotating                  │
└───────────────────────────────────────┘
```

### Mobile View (1 Product)
```
┌──────────────────────┐
│ Featured Products    │
│                      │
│  ◄ ┌──────────────┐ ► │
│    │  Product 1   │   │
│    │   Image      │   │
│    │  ★★★★★       │   │
│    │  Details     │   │
│    │ Explore Btn  │   │
│    └──────────────┘   │
│                      │
│      ● ● ● ●         │
│  ✓ Auto-rotating     │
└──────────────────────┘
```

---

## 📱 Responsive Breakpoints

```
Mobile                Tablet              Desktop
< 640px              640px - 1024px      ≥ 1024px
   │                      │                   │
   ▼                      ▼                   ▼
1 Product           2 Products           3 Products
 per view            per view             per view
   │                      │                   │
   └──────────────────────┴───────────────────┘
         Smooth Transitions on Resize
```

---

## 🎬 Auto-Rotation Flow

```
Page Loads
   │
   ▼
Component Initializes
   │
   ├─ currentIndex = 0
   ├─ itemsPerPage = 3 (desktop)
   ├─ autoplay = true
   └─ displayedProducts = [Product 1, 2, 3]
   │
   ▼
4-Second Timer Starts ⏱️
   │
   ├─ 0s: Showing Product 1, 2, 3
   ├─ 1s: Auto-rotating... (green pulse indicator)
   ├─ 2s: Auto-rotating... (green pulse indicator)
   ├─ 3s: Auto-rotating... (green pulse indicator)
   │
   ▼ (4 seconds passed)
   │
   ├─ currentIndex++
   ├─ displayedProducts = [Product 2, 3, 4]
   ├─ Smooth transition animation
   │
   ▼
4-Second Timer Restarts
   │
   └─ Process repeats...
```

---

## 🖱️ User Interaction Flow

### Hover on Carousel
```
Page with Carousel
        │
        ▼
User Hovers
        │
        ├─ Arrows fade in (opacity-0 → opacity-100)
        ├─ Dots become more visible
        └─ Auto-play continues
```

### Click Next Arrow
```
Auto-rotating Carousel
        │
        ▼
User Clicks Next Arrow
        │
        ├─ currentIndex++ (1 position)
        ├─ displayedProducts update
        ├─ autoplay = false (PAUSE)
        ├─ Smooth 500ms transition
        └─ Status: "Paused" (gray indicator)
        │
        ▼
5-Second Timer Starts
        │
        ├─ 1s: ...
        ├─ 2s: ...
        ├─ 3s: ...
        ├─ 4s: ...
        │
        ▼ (5 seconds passed)
        │
        ├─ autoplay = true (RESUME)
        ├─ Status: "Auto-rotating" (green indicator)
        └─ 4-second rotation timer restarts
```

### Click Product Card
```
Product Card in Carousel
        │
        ▼
User Clicks
        │
        ├─ Navigate to /products/:productId
        ├─ Product Details page loads
        ├─ PRICE IS NOW VISIBLE
        ├─ User can:
        │  ├─ View full images
        │  ├─ Read description
        │  ├─ See reviews
        │  ├─ Check inventory
        │  └─ Add to cart
        │
        ▼
Back to Home (if navigated back)
        │
        └─ Carousel continues auto-rotating
```

---

## 🎨 Visual States

### Normal State
```
┌────────────────────────────────────┐
│        Product Card                 │
├────────────────────────────────────┤
│                                    │
│          Product Image             │  ← Normal size
│                                    │  ← Soft shadow
│                                    │
├────────────────────────────────────┤
│ ◆ Category Badge                  │
│ Product Name Here                  │
│ ★★★★★ (142 reviews)                │
│ Description text here...           │
│ [████████░░] 14 left               │
│ [ Explore Button ]                 │
└────────────────────────────────────┘
```

### Hover State
```
┌────────────────────────────────────┐
│        Product Card                 │
├────────────────────────────────────┤
│      ┌──────────────────┐          │
│      │ View Details ►   │          │  ← Dark overlay
│      │                  │          │  ← Image scaled 110%
│      │   Product Image  │          │  ← Enhanced shadow
│      │                  │          │
│      └──────────────────┘          │
├────────────────────────────────────┤
│ ◆ Category Badge                  │
│ Product Name Here  (Orange hover) │
│ ★★★★★ (142 reviews)                │
│ Description text here...           │
│ [████████░░] 14 left               │
│ [ Explore Button ↑ ]               │  ← 105% scale
└────────────────────────────────────┘
```

### Out of Stock State
```
┌────────────────────────────────────┐
│        Product Card                 │
├────────────────────────────────────┤
│                                    │
│     ┌────────────────────┐         │
│     │  OUT OF STOCK      │         │  ← Dark overlay
│     └────────────────────┘         │  ← Backdrop blur
│                                    │
├────────────────────────────────────┤
│ ◆ Category Badge                  │
│ Product Name Here                  │
│ ★★★★☆ (89 reviews)                 │
│ Description text here...           │
│ [░░░░░░░░░░] 0 left (Red)          │
│ [ Out of Stock ] (Disabled)        │
└────────────────────────────────────┘
```

---

## 📊 Stock Indicator Color Guide

```
Stock Level     Color       Width      User Signal
──────────────────────────────────────────────────
> 10 items      🟢 Green    ~100%      "Buy now!"
5-10 items      🟡 Yellow   ~50%       "Limited"
1-4 items       🟡 Yellow   ~25%       "Hurry!"
0 items         🔴 Red      ~0%        "Sold out"
```

Example Progress Bar:
```
Good Stock:      [████████████████░░] 18 left
Low Stock:       [███░░░░░░░░░░░░░░] 7 left
Very Low:        [░░░░░░░░░░░░░░░░░░] 1 left
Out of Stock:    [░░░░░░░░░░░░░░░░░░] 0 left
```

---

## ⏱️ Timing Diagram

```
Timeline (Auto-rotating):

0s ──┐
     ├─ Shows: [Product 1, 2, 3]
     │         ●●●●●
     │         Auto-rotating ✓
2s ──┤
     │
4s ──┼─ TRANSITION (smooth 500ms)
     │ Slides to: [Product 2, 3, 4]
     │           ●●●●●
6s ──┤
     │ Shows: [Product 2, 3, 4]
     │        ●●●●●
     │        Auto-rotating ✓
8s ──┼─ TRANSITION
     │ Slides to: [Product 3, 4, 5]
     │
10s ─┤
     │ Shows: [Product 3, 4, 5]
     │        ●●●●●
     └─ ...continues
```

---

## 🔄 Carousel Life Cycle

```
┌─────────────────────────────────┐
│   Component Mounts              │
│                                 │
│   Initialize State:             │
│   - currentIndex = 0            │
│   - autoplay = true             │
│   - Get window.innerWidth       │
│   - Calculate itemsPerPage      │
│   - Setup auto-rotate timer     │
│   - Setup resize listener       │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│   Component Active              │
│                                 │
│   - Auto-rotate every 4s        │
│   - Listen for resize events    │
│   - Listen for user clicks      │
│   - Display carousel            │
│   - Show navigation controls    │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│   Component Unmounts            │
│                                 │
│   Cleanup:                      │
│   - Clear auto-rotate timer     │
│   - Remove resize listener      │
│   - Clear state                 │
└─────────────────────────────────┘
```

---

## 📸 Screenshot Layout

### Full Section View
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Featured Products                              │
│  ═══════════════════════════════════            │
│  Explore our handpicked selection of premium    │
│  artisan products...                            │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│    ◄         ┌─────────┐  ┌─────────┐        ► │
│              │Product 1│  │Product 2│          │
│              │         │  │         │          │
│              │ Image   │  │ Image   │          │
│              │Details  │  │Details  │          │
│              └─────────┘  └─────────┘          │
│                                                 │
│                    ● ● ● ●                     │
│               ✓ Auto-rotating                   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│    [ View All Products → ]                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Navigation Button Visibility

```
Normal View              Hover View
(Arrows hidden)         (Arrows visible)

┌─────────────────┐    ┌─────────────────┐
│                 │    │ ◄               │
│  [ Product ]    │    │  [ Product ]    │
│                 │    │ ◄          ►    │
│                 │    │ ◄               │
└─────────────────┘    └─────────────────┘

Opacity: 0              Opacity: 1
Display: none           Display: block
(Hidden behind)         (Visible, clickable)
```

---

## 💾 Data Flow Architecture

```
┌──────────────────┐
│  Backend API     │
│  (Featured Prod) │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│  productService.getFeaturedProducts()
│  - Fetches from backend          │
│  - Returns array of products     │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Home.jsx                        │
│  - Calls fetchFeaturedProducts   │
│  - Sets state: featuredProducts  │
│  - Passes to carousel            │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  FeaturedProductsCarousel        │
│  - Receives products array       │
│  - Manages carousel state        │
│  - Handles display & rotation    │
│  - Renders product cards         │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Browser Display                 │
│  - Shows carousel UI             │
│  - Handles user interactions     │
│  - Navigates on product click    │
└──────────────────────────────────┘
```

---

## 🎬 Animation Timeline

```
Click Next Arrow:
│
├─ Click detected ─┐
│                 │
├─ 0ms: Set autoplay=false
│       Display: "Paused"
│       Indicator: Gray
│
├─ 0-500ms: Transition
│           Image scale continues
│           Shadow enhances
│
├─ 500ms: Transition complete
│         New products displayed
│
├─ 500-5000ms: Waiting
│              Status shows "Paused"
│              Indicator stays gray
│
├─ 5000ms: Timeout complete ─┐
│                             │
├─ Set autoplay=true
│   Display: "Auto-rotating"
│   Indicator: Green + pulse
│
└─ 5000+ms: Auto-rotate resumes
            4-second timer restarts
```

---

**Visual Guide Complete** ✨

