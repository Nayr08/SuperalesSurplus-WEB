// src/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const ADMIN_EMAILS = ['clairejoycesuperales@yahoo.com.ph', 'admin@superales.ph']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const { totalItems, setIsOpen } = useCart()
  const navigate = useNavigate()
  const isAdmin = user && ADMIN_EMAILS.includes(user.email)

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById('navbar')
      if (window.scrollY > 40) {
        navbar?.classList.add('scrolled')
        setScrolled(true)
      } else {
        navbar?.classList.remove('scrolled')
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav id="navbar">
      <Link to="/" className="nav-logo">
        ⛩ <span>Superales</span>
      </Link>

      <ul className={`nav-links ${navOpen ? 'open' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><a href="/#why">Why Us</a></li>
        <li><a href="/#live">Live Selling</a></li>
        <li><a href="/#contact">Contact</a></li>
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Cart Icon */}
        <div
          className="nav-cart-icon"
          onClick={() => setIsOpen(true)}
          title="Shopping cart"
        >
          🛒
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </div>

        {/* Auth Buttons */}
        <div className="nav-auth-buttons">
          {user && profile ? (
            <>
              <span style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                Hi, {profile.full_name?.split(' ')[0]}
              </span>
              {isAdmin && (
                <Link to="/admin" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'var(--gold-light)', color: 'var(--gold)' }}>
                  🔧 Admin
                </Link>
              )}
              <Link to="/profile" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="btn-outline"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Menu */}
        <div
          className="hamburger"
          id="hamburger"
          onClick={() => setNavOpen(!navOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  )
}
