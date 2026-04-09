# 🚀 SUPERALES REACT + SUPABASE - COMPLETE SETUP GUIDE

## ✅ Project Generation Complete!

All 25+ files have been generated. Your project structure is ready.

---

## 📦 Installation & Setup (Step by Step)

### Step 1: Install Dependencies

```bash
cd "c:\Users\User\Desktop\COMPUTER ENGR\Superales-WEB"
npm install
```

This will install:
- react 18.2.0
- react-router-dom 6.20.0
- @supabase/supabase-js 2.38.0
- tailwindcss 3.3.0
- vite 5.0.0

**Time**: ~2-3 minutes

### Step 2: Create .env.local File

```bash
# Copy the example
cp .env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLC...
```

**How to get credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy URL and anon key

### Step 3: Set Up Supabase Database

1. **Create Storage Bucket for GCash Receipts:**
   - Supabase Dashboard → Storage
   - New Bucket → Name: `gcash-receipts`
   - Make it PUBLIC (important!)

2. **Create Database Tables:**
   - Go to SQL Editor in Supabase
   - Copy entire contents of `supabase_schema.sql`
   - Paste in new query and execute
   - This creates tables + RLS policies + triggers

3. **Enable Auth:**
   - Go to Authentication → Providers
   - Enable Email provider (default)
   - Set password requirements (optional)

### Step 4: Run Development Server

```bash
npm run dev
```

**Output:**
```
VITE v5.0.0  ready in 245 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Test the App

### Test Registration
1. Click "Register"
2. Fill form with test data
3. Enter password (min 6 chars)
4. Click "Create Account"
5. Should redirect to /shop

### Test Shopping
1. Click "Shop" or "Shop Now" button
2. Browse products
3. Click "Add to Cart" button
4. Click cart icon (🛒) to open drawer
5. Update quantities, view subtotal

### Test Checkout
1. With items in cart, click "Checkout"
2. Fill delivery form
3. Select payment method:
   - **COD**: Just click "Place Order"
   - **GCash**: Upload test receipt image
4. Click "Place Order"
5. View order confirmation

### Test Profile
1. Click username dropdown
2. Click "Profile"
3. Edit information and click "Save Changes"
4. View order history below

---

## 🏗️ Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

**Output:**
```
dist/index.html          37.45 kB
dist/assets/index.js     245.67 kB
dist/assets/index.css    12.34 kB
```

---

## 🚀 Deploy Options

### Option 1: Firebase Hosting (Recommended)

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Build
npm run build

# 4. Deploy
firebase deploy
```

**URL format**: https://your-project.web.app

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**URL format**: https://your-project.vercel.app

### Option 3: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
netlify deploy --prod --dir dist
```

**URL format**: https://your-project.netlify.app

---

## 📋 File Checklist

All 25 files have been created:

✅ **1. supabase_schema.sql** - Database schema  
✅ **2. .env.example** - Environment template  
✅ **3. package.json** - Dependencies  
✅ **4. vite.config.js** - Vite configuration  
✅ **5. tailwind.config.js** - Tailwind config  
✅ **6. index.html** - Vite entry point  
✅ **7. src/lib/supabase.js** - Supabase client  
✅ **8. src/context/AuthContext.jsx** - Auth state  
✅ **9. src/context/CartContext.jsx** - Cart state  
✅ **10. src/App.jsx** - Router setup  
✅ **11. src/main.jsx** - React entry  
✅ **12. src/styles/globals.css** - All CSS + Tailwind  
✅ **13. src/components/Navbar.jsx** - Navigation  
✅ **14. src/components/Footer.jsx** - Footer  
✅ **15. src/components/CartDrawer.jsx** - Cart sidebar  
✅ **16. src/components/ProductCard.jsx** - Product card  
✅ **17. src/components/ProtectedRoute.jsx** - Auth guard  
✅ **18. src/pages/Home.jsx** - Landing page (pixel-perfect)  
✅ **19. src/pages/Shop.jsx** - Product catalog  
✅ **20. src/pages/Login.jsx** - Login form  
✅ **21. src/pages/Register.jsx** - Registration  
✅ **22. src/pages/Checkout.jsx** - Checkout flow  
✅ **23. src/pages/OrderSuccess.jsx** - Order confirmation  
✅ **24. src/pages/Profile.jsx** - User profile  
✅ **25. firebase.json** - Firebase config  

Plus: postcss.config.js, .gitignore, SETUP_GUIDE.md

---

## 🔗 Navigation Routes

| Page | URL | Auth Required |
|------|-----|--------------|
| Home | / | No |
| Shop | /shop | No |
| Login | /login | No |
| Register | /register | No |
| Checkout | /checkout | **YES** |
| Order Success | /order-success | No |
| Profile | /profile | **YES** |

---

## 💾 Environment Template

Create `.env.local` with this format:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Never commit .env.local to git!** (it's in .gitignore)

---

## 🧪 Test Accounts

### Test User 1
- Email: `test@example.com`
- Password: `password123`

### Test User 2
- Email: `customer@superales.ph`
- Password: `superales123`

(Create any test accounts you want during registration)

---

## 🎨 Customization Guide

### Change Colors
Edit `src/styles/globals.css`:
```css
:root {
  --red: #B91C1C;           /* Primary color */
  --gold: #B45309;          /* Accent */
  --cream: #FDFAF4;         /* Background */
  --ink: #1C1410;           /* Text */
}
```

### Change Contact Info
1. **Navbar**: `src/components/Navbar.jsx`
2. **Footer**: `src/components/Footer.jsx`
3. **Home Page**: `src/pages/Home.jsx`
4. **Contact Section**: `src/pages/Home.jsx` (lines 400-500)

### Add/Edit Products
1. **Supabase**: Insert into `products` table
2. **Fallback**: Edit `DEFAULT_PRODUCTS` in `src/pages/Shop.jsx`

### Change GCash Number
Edit in `src/pages/Checkout.jsx` (search for "0909 051 2856")

---

## 🔍 Debugging Tips

### Check Console Errors
```bash
# Terminal where dev server runs shows errors
npm run dev
```

### Check Supabase Auth
1. Supabase Dashboard → Authentication → Users
2. See registered users there

### Check Database
1. Supabase Dashboard → Table Editor
2. View data in all tables (products, orders, profiles, etc.)

### Check Storage
1. Supabase Dashboard → Storage → Buckets
2. View uploaded GCash receipts

### Check Logs
```bash
# Firefox/Chrome DevTools
F12 → Console tab
# React DevTools Extension (install from store)
```

---

## 🚨 Common Issues & Solutions

### "Supabase client error"
**Problem**: credentials not found  
**Solution**: Check `.env.local` has correct values, restart dev server

### "Products not loading"
**Problem**: Supabase query failed  
**Solution**: Check `products` table exists, has data, `is_active = true`

### "Can't upload GCash receipt"
**Problem**: Storage bucket error  
**Solution**: Make sure `gcash-receipts` bucket is PUBLIC

### "Cart not saving after refresh"
**Problem**: Cart state is session-based  
**Solution**: This is intentional (no persistence). To add: use localStorage

### "Getting 'not authenticated' on checkout"
**Problem**: User not logged in  
**Solution**: Login first or click "Go to Login" button

---

## 📞 Support Resources

- **Local Contact**: 0909 051 2856 (Claire)
- **Email**: clairejoycesuperales@yahoo.com.ph
- **Facebook**: Superales Melaware and Japan Surplus
- **Chat**: m.me/superalesmelawareandjapansurplus

---

## 🎯 Next Steps Checklist

- [ ] `npm install`
- [ ] Set up Supabase account & project
- [ ] Create .env.local with credentials
- [ ] Create gcash-receipts bucket
- [ ] Execute supabase_schema.sql
- [ ] `npm run dev`
- [ ] Test registration & login
- [ ] Test shopping & checkout
- [ ] `npm run build`
- [ ] Deploy to Firebase/Vercel

---

## 📚 Additional Reading

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Status**: ✅ Ready to Deploy  
**Last Updated**: April 2025  
**Version**: 1.0.0
