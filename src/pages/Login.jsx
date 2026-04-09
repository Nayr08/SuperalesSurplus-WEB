// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      navigate('/shop')
    } catch (err) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    alert('Please contact us on Facebook: Superales Melaware and Japan Surplus')
  }

  return (
    <>
      <Navbar />

      <div style={{
        paddingTop: '100px',
        minHeight: '100vh',
        backgroundColor: 'var(--cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2.5rem',
          maxWidth: '420px',
          width: '100%',
          border: '1px solid var(--border)',
        }}>
          <h2 style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: '1.75rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            color: 'var(--ink)',
          }}>
            Login
          </h2>
          <p style={{
            color: 'var(--muted)',
            marginBottom: '2rem',
            fontSize: '0.9rem',
          }}>
            Welcome back! Sign in to your account.
          </p>

          {error && (
            <div style={{
              backgroundColor: 'var(--red-light)',
              color: 'var(--red)',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: 'var(--ink)',
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: 'var(--ink)',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: 'var(--muted)',
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--red)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                textAlign: 'left',
                textDecoration: 'underline',
              }}
            >
              Forgot password?
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p style={{
            fontSize: '0.9rem',
            color: 'var(--muted)',
            marginTop: '1.75rem',
            textAlign: 'center',
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: 'var(--red)',
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Register here
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  )
}
