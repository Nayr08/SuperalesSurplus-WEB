// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'

const SUP_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
const TRUCK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="15" height="12" rx="2"/><path d="M16 6v12M17 6h6v9h-6M19 18a2 2 0 1 0 4 0M7 18a2 2 0 1 0 4 0"/></svg>'
const MSG_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>'
const DOLLAR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="5" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="19"/></svg>'

const PRODUCTS = [
  { emoji: '🍳', name: 'Pans', tag: 'Kitchen', category: 'kitchen', desc: 'High-quality Japanese cookware with excellent heat distribution and durability. Perfect for everyday cooking and professional use.' },
  { emoji: '🍽️', name: 'Plates', tag: 'Tableware', category: 'tableware', desc: 'Elegant ceramic plates with traditional Japanese design. Ideal for dining and special occasions — beautiful yet functional.' },
  { emoji: '🛁', name: 'Towels', tag: 'Home', category: 'home', desc: 'Premium soft towels made with authentic Japanese cotton. Highly absorbent and long-lasting — luxury feel at every use.' },
  { emoji: '☕', name: 'Mugs', tag: 'Tableware', category: 'tableware', desc: 'Beautiful ceramic mugs perfect for coffee and tea. Each piece reflects Japanese artistry and warmth.' },
  { emoji: '🍵', name: 'Tea Sets', tag: 'Tableware', category: 'tableware', desc: 'Traditional Japanese tea sets for authentic tea ceremonies. Complete and ready to use — bring Japan to your table.' },
  { emoji: '🫗', name: 'Cups & Saucers', tag: 'Tableware', category: 'tableware', desc: 'Delicate porcelain cups paired with matching saucers. Perfect for tea or coffee service — elegantly crafted.' },
  { emoji: '🪴', name: 'Clay Pots', tag: 'Kitchen', category: 'kitchen', desc: 'Authentic clay pots used in traditional Japanese cooking. Excellent for brewing and serving soups, teas, and stews.' },
]

export default function Home() {
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({})
  const navigate = useNavigate()

  // Initialize petals
  useEffect(() => {
    const petalContainer = document.getElementById('petals')
    if (!petalContainer) return
    
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div')
      p.className = 'petal'
      const size = 8 + Math.random() * 12
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        animation-duration:${6 + Math.random() * 10}s;
        animation-delay:${Math.random() * 8}s;
        opacity:0;
      `
      petalContainer.appendChild(p)
    }
  }, [])

  // Scroll reveal observer
  useEffect(() => {
    const observeReveal = () => {
      const els = document.querySelectorAll('.reveal:not(.visible)')
      const obs = new IntersectionObserver(
        entries => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('visible')
              obs.unobserve(e.target)
            }
          })
        },
        { threshold: 0.12 }
      )
      els.forEach(el => obs.observe(el))
    }

    observeReveal()
    const timer = setTimeout(observeReveal, 500)
    return () => clearTimeout(timer)
  }, [filter])

  const openModal = (product) => {
    setModalContent({
      emoji: product.emoji,
      name: product.name,
      desc: product.desc,
    })
    setModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = (e) => {
    if (!e || e.target.id === 'modal' || e.target.classList.contains('modal-close')) {
      setModalOpen(false)
      document.body.style.overflow = ''
    }
  }

  const filteredProducts = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter)

  return (
    <>
      <Navbar />
      <CartDrawer />

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg"></div>
        <div className="hero-pattern"></div>

        <svg className="torii" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="30" width="140" height="12" rx="6" fill="#B91C1C"/>
          <rect x="0" y="48" width="160" height="8" rx="4" fill="#B91C1C"/>
          <rect x="28" y="56" width="16" height="140" rx="8" fill="#B91C1C"/>
          <rect x="116" y="56" width="16" height="140" rx="8" fill="#B91C1C"/>
          <rect x="36" y="90" width="88" height="6" rx="3" fill="#B91C1C" opacity="0.6"/>
        </svg>

        <svg className="torii-left" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="30" width="140" height="12" rx="6" fill="#B91C1C"/>
          <rect x="0" y="48" width="160" height="8" rx="4" fill="#B91C1C"/>
          <rect x="28" y="56" width="16" height="140" rx="8" fill="#B91C1C"/>
          <rect x="116" y="56" width="16" height="140" rx="8" fill="#B91C1C"/>
          <rect x="36" y="90" width="88" height="6" rx="3" fill="#B91C1C" opacity="0.6"/>
        </svg>

        <div id="petals"></div>

        <div className="hero-content">
          <span className="hero-badge">🌸 Japan Surplus Store · Davao del Sur</span>
          <h1 className="hero-title">
            <em>Superales</em><br />
            Melaware &<br />
            Japan Surplus
          </h1>
          <p className="hero-sub">
            High-quality, affordable products with a<br />
            unique touch of Japanese craftsmanship.
          </p>
          <div className="hero-cta">
            <button onClick={() => navigate('/shop')} className="btn-primary">
              🛍 Shop Now
            </button>
            <a href="#live" className="btn-outline">
              📺 Watch Live
            </a>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track" id="marqueeTrack">
          <span>🌸 We Ship Nationwide</span><span className="marquee-dot">✦</span>
          <span>Japan Surplus Items</span><span className="marquee-dot">✦</span>
          <span>Authentic Quality</span><span className="marquee-dot">✦</span>
          <span>Live Selling on Facebook</span><span className="marquee-dot">✦</span>
          <span>Pans · Plates · Towels · Mugs · Tea Sets</span><span className="marquee-dot">✦</span>
          <span>🌸 We Ship Nationwide</span><span className="marquee-dot">✦</span>
          <span>Japan Surplus Items</span><span className="marquee-dot">✦</span>
          <span>Authentic Quality</span><span className="marquee-dot">✦</span>
          <span>Live Selling on Facebook</span><span className="marquee-dot">✦</span>
          <span>Pans · Plates · Towels · Mugs · Tea Sets</span><span className="marquee-dot">✦</span>
        </div>
      </div>

      {/* PRODUCTS */}
      <section id="products">
        <div className="container">
          <div className="products-header reveal">
            <span className="section-label">Curated Collection</span>
            <h2 className="section-title">Our Products</h2>
            <div className="section-divider"></div>
          </div>

          <div className="products-filter reveal">
            {['all', 'kitchen', 'tableware', 'home'].map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'All Items' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="products-grid" id="productsGrid">
            {filteredProducts.map((p, i) => (
              <div
                key={i}
                className="product-card reveal"
                style={{ transitionDelay: `${i * 0.06}s` }}
                onClick={() => openModal(p)}
              >
                <div className="product-icon">{p.emoji}</div>
                <span className="product-tag">{p.tag}</span>
                <div className="product-name">{p.name}</div>
                <p className="product-desc">{p.desc}</p>
                <button className="product-inquire">💬 Inquire</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Our Promise</span>
            <h2 className="section-title">Why Choose Superales?</h2>
            <div className="section-divider"></div>
          </div>
          <div className="why-grid">
            <div className="why-card reveal reveal-delay-1">
              <div className="why-icon" dangerouslySetInnerHTML={{ __html: SUP_ICON }} />
              <div className="why-title">Genuine Japan Quality</div>
              <p className="why-desc">Every item is sourced directly from Japan — authentic pre-loved goods with real Japanese craftsmanship and durability.</p>
            </div>
            <div className="why-card reveal reveal-delay-2">
              <div className="why-icon" dangerouslySetInnerHTML={{ __html: TRUCK_ICON }} />
              <div className="why-title">Ships Nationwide</div>
              <p className="why-desc">From Luzon to Mindanao, we deliver your orders anywhere in the Philippines — fast and reliable shipping.</p>
            </div>
            <div className="why-card reveal reveal-delay-3">
              <div className="why-icon" dangerouslySetInnerHTML={{ __html: MSG_ICON }} />
              <div className="why-title">Live Selling Events</div>
              <p className="why-desc">Join our Facebook Live sessions for exclusive deals, real-time Q&A, and the freshest arrivals from Japan.</p>
            </div>
            <div className="why-card reveal reveal-delay-4">
              <div className="why-icon" dangerouslySetInnerHTML={{ __html: DOLLAR_ICON }} />
              <div className="why-title">Affordable Prices</div>
              <p className="why-desc">Premium quality at budget-friendly prices. Get more value with every purchase — quality you can feel, prices you'll love.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE SELLING */}
      <section id="live">
        <div className="container reveal">
          <div className="live-badge">
            <span className="live-dot"></span> Live
          </div>
          <h2 className="section-title">Join Our Facebook<br />Live Selling Events</h2>
          <p className="live-desc">
            Discover exclusive deals and interact with us in real-time. Follow us on Facebook for our latest live streams, flash sales, and new arrivals straight from Japan!
          </p>
          <a
            href="https://www.facebook.com/superalesmelawareandjapansurplus"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-white"
          >
            👍 Follow on Facebook
          </a>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Reach Us</span>
            <h2 className="section-title">Get in Touch</h2>
            <div className="section-divider"></div>
          </div>
          <div className="contact-grid">
            <a href="tel:09090512856" className="contact-card reveal reveal-delay-1">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <span className="contact-label">Call Us</span>
              <div className="contact-value">0909 051 2856</div>
              <p className="contact-sub">Available Monday – Sunday</p>
            </a>
            <a href="mailto:clairejoycesuperales@yahoo.com.ph" className="contact-card reveal reveal-delay-2">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M2 6l10 7 10-7"/>
                </svg>
              </div>
              <span className="contact-label">Email Us</span>
              <div className="contact-value" style={{ fontSize: '0.78rem' }}>
                clairejoycesuperales<br />@yahoo.com.ph
              </div>
              <p className="contact-sub">We reply within 24 hours</p>
            </a>
            <a href="https://maps.app.goo.gl/hSocLmkasSG75SS7A" target="_blank" rel="noopener noreferrer" className="contact-card reveal reveal-delay-3">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                </svg>
              </div>
              <span className="contact-label">Visit Us</span>
              <div className="contact-value">Purok 2, Brgy. Sinayawan</div>
              <p className="contact-sub">Hagonoy, Davao del Sur</p>
            </a>
            <a href="https://www.facebook.com/superalesmelawareandjapansurplus" target="_blank" rel="noopener noreferrer" className="contact-card reveal reveal-delay-4">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="contact-label">Facebook</span>
              <div className="contact-value">Superales Melaware<br />and Japan Surplus</div>
              <p className="contact-sub">Like & Follow our page</p>
            </a>
          </div>
        </div>
      </section>

      {/* FLOATING MESSENGER */}
      <a
        href="https://m.me/superalesmelawareandjapansurplus"
        target="_blank"
        rel="noopener noreferrer"
        className="float-btn"
        title="Message us on Facebook"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </a>

      {/* MODAL */}
      <div
        className={`modal-overlay ${modalOpen ? 'open' : ''}`}
        id="modal"
        onClick={closeModal}
      >
        <div className="modal">
          <button className="modal-close" onClick={closeModal}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div className="modal-icon">{modalContent.emoji}</div>
          <h3 className="modal-title">{modalContent.name}</h3>
          <p className="modal-desc">{modalContent.desc}</p>
          <div className="modal-actions">
            <a
              href="https://www.facebook.com/superalesmelawareandjapansurplus"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Inquire on Facebook
            </a>
            <a href="tel:09090512856" className="btn-outline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
