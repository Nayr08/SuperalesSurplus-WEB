// src/pages/Shop.jsx
import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import './Shop.css'

const DEFAULT_PRODUCTS = [
  { id: '1', emoji: '🍳', name: 'Pans', category: 'kitchen', description: 'High-quality Japanese cookware with excellent heat distribution and durability. Perfect for everyday cooking.', price: 299, image_url: null },
  { id: '2', emoji: '🍽️', name: 'Plates', category: 'tableware', description: 'Elegant ceramic plates with traditional Japanese design. Ideal for dining and special occasions.', price: 149, image_url: null },
  { id: '3', emoji: '🛁', name: 'Towels', category: 'home', description: 'Premium soft towels made with authentic Japanese cotton. Highly absorbent and long-lasting.', price: 199, image_url: null },
  { id: '4', emoji: '☕', name: 'Mugs', category: 'tableware', description: 'Beautiful ceramic mugs perfect for coffee and tea. Each piece reflects Japanese artistry.', price: 129, image_url: null },
  { id: '5', emoji: '🍵', name: 'Tea Sets', category: 'tableware', description: 'Traditional Japanese tea sets for authentic tea ceremonies. Complete and ready to use.', price: 599, image_url: null },
  { id: '6', emoji: '🫗', name: 'Cups & Saucers', category: 'tableware', description: 'Delicate porcelain cups paired with matching saucers. Perfect for tea or coffee service.', price: 249, image_url: null },
  { id: '7', emoji: '🪴', name: 'Clay Pots', category: 'kitchen', description: 'Authentic clay pots used in traditional Japanese cooking. Excellent for brewing soups.', price: 349, image_url: null },
]

const EMOJI_COLLAGE = ['🍳', '🍽️', '🛁', '🍚', '🥢', '🍜']

export default function Shop() {
  const { addToCart } = useCart()
  
  // State management
  const [viewMode, setViewMode] = useState('landing')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState({})
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Carousel ref
  const carouselRef = useRef(null)

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)

        if (error) throw error

        if (data && data.length > 0) {
          setProducts(data)
        } else {
          setProducts(DEFAULT_PRODUCTS)
        }
      } catch (err) {
        setProducts(DEFAULT_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Auto-rotate hero carousel images every 5 seconds
  useEffect(() => {
    const carousel = products.filter(p => 
      p.name && ['Pans', 'Plates', 'Mugs'].includes(p.name)
    ).slice(0, 3)
    
    if (carousel.length === 0) return

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % carousel.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [products])

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products]

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory)
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by price
    if (priceFilter !== 'all') {
      if (priceFilter === 'under200') filtered = filtered.filter(p => p.price < 200)
      else if (priceFilter === '200to500') filtered = filtered.filter(p => p.price >= 200 && p.price <= 500)
      else if (priceFilter === 'above500') filtered = filtered.filter(p => p.price > 500)
    }

    // Sort
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price)
    else if (sortBy === 'newest') filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))

    setFilteredProducts(filtered)
  }, [products, activeCategory, searchQuery, priceFilter, sortBy])

  // View switching handlers
  const switchToCatalog = () => setViewMode('catalog')
  const switchToLanding = () => {
    setViewMode('landing')
    setSearchQuery('')
    setActiveCategory('all')
    setPriceFilter('all')
    setSortBy('default')
  }

  const handleCategoryClick = (category) => {
    setActiveCategory(category)
    switchToCatalog()
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value) switchToCatalog()
  }

  const clearFilters = () => {
    setActiveCategory('all')
    setPriceFilter('all')
    setSortBy('default')
  }

  // Carousel scroll
  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return
    const scrollAmount = 300
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  // Get category counts
  const categoryCounts = {
    all: products.length,
    kitchen: products.filter(p => p.category === 'kitchen').length,
    tableware: products.filter(p => p.category === 'tableware').length,
    home: products.filter(p => p.category === 'home').length,
  }

  // Get best sellers (first 6 products)
  const bestSellers = products.slice(0, 6)

  // Get carousel products for hero (Pans, Plates, Mugs with custom images)
  const carouselProducts = products.filter(p => 
    p.name && ['Pans', 'Plates', 'Mugs'].includes(p.name)
  ).slice(0, 3)

  if (carouselProducts.length > 0) {
    console.log('=== CAROUSEL PRODUCT DETAILS ===')
    carouselProducts.forEach((p, idx) => {
      console.log(`Product ${idx + 1}: ${p.name}`)
      console.log(`  - Image URL: ${p.image_url}`)
      console.log(`  - Has image: ${!!p.image_url}`)
    })
  }

  // Handle image load error
  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  // Get category tag color
  const getCategoryColor = (category) => {
    const colors = {
      kitchen: 'amber',
      tableware: 'red',
      home: 'green',
    }
    return colors[category] || 'slate'
  }

  // Render loading skeletons
  const LoadingSkeletons = () => (
    <div className="skeleton-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text" style={{ width: '80%' }}></div>
          <div className="skeleton-text" style={{ width: '60%' }}></div>
        </div>
      ))}
    </div>
  )

  // Render product image with fallback
  const ProductImage = ({ product }) => {
    const isErrored = imageErrors[product.id]

    if (isErrored || !product.image_url) {
      return (
        <div className={`product-image-fallback ${getCategoryColor(product.category)}`}>
          <span className="fallback-emoji">{product.emoji || '🎁'}</span>
        </div>
      )
    }

    return (
      <img
        src={product.image_url}
        alt={product.name}
        className="product-image"
        onError={() => handleImageError(product.id)}
      />
    )
  }

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    let categoryLabel = activeCategory === 'all' ? 'All' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
    return (
      <div className="breadcrumbs">
        <span onClick={switchToLanding} className="breadcrumb-link">Shop</span>
        <span className="breadcrumb-separator">›</span>
        <span>{categoryLabel}</span>
        {searchQuery && (
          <>
            <span className="breadcrumb-separator">›</span>
            <span>{searchQuery}</span>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <CartDrawer />

      <div className="shop-container">
        {/* --- LANDING VIEW --- */}
        <div className={`view-landing ${viewMode === 'landing' ? 'active' : ''}`}>
          {/* Hero Banner */}
          <div className="hero-banner">
            <div className="hero-left">
              <div className="badge">🌸 New Arrivals</div>
              <h1>Authentic Japan Surplus</h1>
              <p>Quality items direct from Japan</p>
              <button className="btn-hero" onClick={switchToCatalog}>Browse All Items</button>
            </div>
            <div className="hero-right">
              {/* Auto-Rotating Product Images - Pans, Plates, Mugs */}
              {!loading && carouselProducts.length > 0 && (
                <div className="hero-auto-carousel">
                  {carouselProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`hero-image-slide ${index === currentImageIndex ? 'active' : ''}`}
                    >
                      {imageErrors[product.id] || !product.image_url ? (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'var(--cream)',
                          fontSize: '4rem',
                        }}>
                          {product.emoji || '🎁'}
                        </div>
                      ) : (
                        <img
                          src={product.image_url}
                          alt={`Product ${index + 1}`}
                          onError={() => handleImageError(product.id)}
                        />
                      )}
                    </div>
                  ))}

                  {/* Carousel Indicators */}
                  <div className="carousel-indicators">
                    {carouselProducts.map((_, index) => (
                      <div
                        key={index}
                        className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category Quick Links - REMOVED */}

          {/* Featured Carousel */}
          {!loading && (
            <div className="featured-carousel">
              <h2>Best Sellers</h2>
              <div className="carousel-wrapper">
                <button className="carousel-arrow left" onClick={() => scrollCarousel('left')}>
                  <span>&lt;</span>
                </button>
                <div className="carousel-container" ref={carouselRef}>
                  <div className="carousel-items">
                    {bestSellers.map(product => (
                      <div key={product.id} className="product-card carousel-card">
                        <ProductImage product={product} />
                        <h3>{product.name}</h3>
                        <p className="price">₱{product.price.toLocaleString()}</p>
                        <button className="btn-add-cart" onClick={() => addToCart(product)}>
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="carousel-arrow right" onClick={() => scrollCarousel('right')}>
                  <span>&gt;</span>
                </button>
              </div>
            </div>
          )}

          {/* Special Offer Banner */}
          <div className="special-banner">
            🚚 Free Shipping on orders ₱500 and above · COD Available · GCash Accepted
          </div>
        </div>

        {/* --- CATALOG VIEW --- */}
        <div className={`view-catalog ${viewMode === 'catalog' ? 'active' : ''}`}>
          {/* Breadcrumbs */}
          {renderBreadcrumbs()}

          {/* Top Bar */}
          <div className="top-bar">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <span className="search-icon">🔍</span>
            </div>
            <span className="product-count">Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-dropdown">
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="catalog-layout">
            {/* Sidebar */}
            <div className="sidebar">
              <h3>Filters</h3>

              <div className="filter-section">
                <h4>Category</h4>
                {['all', 'kitchen', 'tableware', 'home'].map(cat => (
                  <div
                    key={cat}
                    className={`filter-item ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat === 'all' ? 'All Items' : cat.charAt(0).toUpperCase() + cat.slice(1)}{' '}
                    <span className="filter-count">({categoryCounts[cat]})</span>
                  </div>
                ))}
              </div>

              <div className="filter-section">
                <h4>Price Range</h4>
                {[
                  { key: 'all', label: 'All Prices' },
                  { key: 'under200', label: 'Under ₱200' },
                  { key: '200to500', label: '₱200 - ₱500' },
                  { key: 'above500', label: 'Above ₱500' },
                ].map(range => (
                  <div
                    key={range.key}
                    className={`filter-item ${priceFilter === range.key ? 'active' : ''}`}
                    onClick={() => setPriceFilter(range.key)}
                  >
                    {range.label}
                  </div>
                ))}
              </div>

              <button className="btn-clear-filters" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>

            {/* Product Grid */}
            <div className="products-section">
              {loading ? (
                <LoadingSkeletons />
              ) : filteredProducts.length > 0 ? (
                <div className="product-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-image-wrapper">
                        <ProductImage product={product} />
                        <span className={`category-tag category-tag-${getCategoryColor(product.category)}`}>
                          {product.category}
                        </span>
                      </div>
                      <h3>{product.name}</h3>
                      <p className="description">{product.description}</p>
                      <p className="price">₱{product.price.toLocaleString()}</p>
                      <button className="btn-add-cart" onClick={() => addToCart(product)}>
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-emoji">😔</span>
                  <p>No products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
