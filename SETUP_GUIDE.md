# Superales Melaware & Japan Surplus - React + Supabase E-Commerce

A modern, fully-functional e-commerce website for Superales, a Japan surplus store in Davao del Sur, Philippines.

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Custom CSS (with Google Fonts)
- **State Management**: React Context API
- **Storage**: Supabase Storage (for GCash payment receipts)

## 📋 Features

### ✅ Completed
- **Authentication**: Sign up, login, logout with Supabase Auth
- **Product Catalog**: Dynamic products from Supabase with fallback to hardcoded items
- **Shopping Cart**: Add to cart, quantity management, cart drawer
- **Filtering & Search**: Filter by category, search products
- **Checkout**: Multi-step checkout with COD and GCash payment options
- **GCash Integration**: Upload payment receipts to Supabase Storage
- **Order Management**: Create orders, order history, status tracking
- **User Profile**: Edit profile information, view order history
- **Responsive Design**: Mobile-friendly, hamburger menu
- **Japanese Aesthetic**: Original design preserved (sakura animations, torii gates, wave patterns)
- **Live Selling Events**: Facebook integration for live streams
- **Floating Messenger**: Direct Facebook Messenger link

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
cd "c:\Users\User\Desktop\COMPUTER ENGR\Superales-WEB"
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a bucket named `gcash-receipts` for storing payment receipts
   - Go to Storage → Create Bucket → Name: `gcash-receipts` → Make public
3. Run the database schema:
   - Copy contents of `supabase_schema.sql`
   - Go to Supabase Dashboard → SQL Editor → New Query
   - Paste and execute the SQL

### 3. Configure Environment Variables

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local with your Supabase credentials:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get your credentials from:
- Supabase Dashboard → Project Settings → API
- Copy the URL and Anon Key

### 4. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── App.jsx                 # Router configuration
├── main.jsx               # React entry point
├── components/
│   ├── Navbar.jsx        # Navigation with auth & cart
│   ├── Footer.jsx        # Footer section
│   ├── CartDrawer.jsx    # Shopping cart sidebar
│   ├── ProductCard.jsx   # Reusable product card
│   └── ProtectedRoute.jsx # Auth guard for pages
├── context/
│   ├── AuthContext.jsx   # User authentication state
│   └── CartContext.jsx   # Shopping cart state
├── lib/
│   └── supabase.js       # Supabase client config
├── pages/
│   ├── Home.jsx          # Landing page (pixel-perfect from original HTML)
│   ├── Shop.jsx          # Product catalog
│   ├── Login.jsx         # Login form
│   ├── Register.jsx      # Registration form
│   ├── Checkout.jsx      # Checkout & payment
│   ├── OrderSuccess.jsx  # Order confirmation
│   └── Profile.jsx       # User profile & orders
└── styles/
    └── globals.css       # All original CSS + Tailwind
```

## 🔑 Key Features Explained

### Authentication Context (`AuthContext`)
- Manages user login/logout
- Persists user session
- Loads user profile from Supabase

### Cart Context (`CartContext`)
- Add/remove items from cart
- Update item quantities
- Calculate totals
- Cart drawer visibility

### Payment Methods
1. **Cash on Delivery (COD)**: Order status starts as "pending"
2. **GCash**: Upload receipt → status marked as "payment_verified"

### Order Tracking
Users can view their orders on the Profile page with status badges:
- 🟡 **Pending**: Order placed, awaiting payment (COD only)
- 🔵 **Payment Verified**: Payment receipt confirmed
- 🟠 **Processing**: Order being prepared
- 🟣 **Shipped**: On the way to customer
- 🟢 **Delivered**: Order completed

## 📊 Database Schema

### Tables
- **profiles**: Extended user profiles (full_name, phone, address)
- **products**: Product catalog with details and images
- **orders**: Customer orders with payment method and status
- **order_items**: Line items in each order

### Row Level Security (RLS)
- Users can only view/edit their own profiles and orders
- Products are publicly readable

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
# 1. Build the app
npm run build

# 2. Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# 3. Login to Firebase
firebase login

# 4. Initialize Firebase (select your project)
firebase init hosting

# 5. Deploy
firebase deploy
```

### Deploy to Vercel (Alternative)

```bash
# 1. Build
npm run build

# 2. Install Vercel CLI
npm install -g vercel

# 3. Deploy
vercel
```

## 🔐 Security Notes

- Environment variables are never committed to git (.gitignore)
- Supabase RLS policies protect data
- Anon key is safe to expose (read-only operations)
- GCash receipts stored in Supabase Storage

## 📱 Mobile Optimization

- Responsive grid layout (auto-fill with minmax)
- Mobile hamburger menu
- Touch-friendly buttons and inputs
- Optimized font sizes with clamp()

## 🎨 Design System

### Color Palette
- **Primary Red**: #B91C1C
- **Gold Accent**: #B45309
- **Cream Background**: #FDFAF4
- **Dark Ink**: #1C1410

### Typography
- **Serif**: Noto Serif JP (headings)
- **Sans**: DM Sans (body)

### Animations
- Sakura petal fall animation
- Floating torii gates
- Scroll reveal effects
- Smooth transitions

## 🐛 Troubleshooting

### Supabase Connection Errors
- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Ensure RLS policies are enabled

### Products Not Loading
- Check Supabase products table has data
- Check `is_active` flag is true
- Fallback to hardcoded products works automatically

### Cart Not Persisting
- Cart is session-only (clears on page refresh) - this is intentional
- To add persistence, use `localStorage` in CartContext

### GCash Receipt Upload Fails
- Verify `gcash-receipts` bucket exists and is public
- Check bucket policies allow anon uploads
- Use smaller image files (< 5MB)

## 📝 Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Optional
VITE_API_URL=http://localhost:5173
```

## 📞 Support

For issues, contact:
- **Phone**: 0909 051 2856
- **Email**: clairejoycesuperales@yahoo.com.ph
- **Facebook**: Superales Melaware and Japan Surplus
- **Messenger**: m.me/superalesmelawareandjapansurplus

## 📄 License

© 2025 Superales Trading. All rights reserved.

---

**Last Updated**: April 2025
**Version**: 1.0.0
