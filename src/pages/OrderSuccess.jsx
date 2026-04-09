// src/pages/OrderSuccess.jsx
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (!orderId) {
      navigate('/shop')
      return
    }

    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (err) {
      console.error('Load order error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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
        }}>
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!order) {
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
            textAlign: 'center',
          }}>
            <h2 style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--ink)',
            }}>
              Order Not Found
            </h2>
            <button
              onClick={() => navigate('/shop')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div style={{
        paddingTop: '100px',
        minHeight: '100vh',
        backgroundColor: 'var(--cream)',
        padding: '2rem',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Success Message */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '3rem 2rem',
            textAlign: 'center',
            border: '1px solid var(--border)',
            marginBottom: '2rem',
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem',
            }}>
              ✓
            </div>
            <h1 style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: 'var(--ink)',
            }}>
              Order Placed Successfully!
            </h1>
            <p style={{
              color: 'var(--muted)',
              fontSize: '1rem',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}>
              Thank you for your order. We'll process it as soon as possible and keep you updated.
            </p>
          </div>

          {/* Order Details */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid var(--border)',
            marginBottom: '2rem',
          }}>
            <h2 style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--ink)',
            }}>
              Order Details
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--muted)' }}>Order ID:</span>
              <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{order.id}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--muted)' }}>Date:</span>
              <span style={{ fontWeight: 600 }}>
                {new Date(order.created_at).toLocaleDateString('en-PH')}
              </span>
            </div>

            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid var(--border)',
              marginTop: '1rem',
            }}>
              <h3 style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
                color: 'var(--ink)',
              }}>
                Items Ordered
              </h3>
              {order.order_items?.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <span>
                    {item.product_name} x {item.quantity}
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    ₱{(item.unit_price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid var(--border)',
              marginTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.1rem',
            }}>
              <span style={{ fontWeight: 700, color: 'var(--ink)' }}>Total Amount:</span>
              <span style={{ fontWeight: 700, color: 'var(--red)' }}>
                ₱{order.total_amount}
              </span>
            </div>
          </div>

          {/* Delivery Info */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid var(--border)',
            marginBottom: '2rem',
          }}>
            <h2 style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--ink)',
            }}>
              Delivery Information
            </h2>

            <p style={{ marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Name:</span><br />
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{order.customer_name}</span>
            </p>

            <p style={{ marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Phone:</span><br />
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{order.phone}</span>
            </p>

            <p style={{ marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Address:</span><br />
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                {order.address}
                {order.barangay && `, ${order.barangay}`}
                {order.city && `, ${order.city}`}
              </span>
            </p>
          </div>

          {/* Payment Info */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid var(--border)',
            marginBottom: '2rem',
          }}>
            <h2 style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--ink)',
            }}>
              Payment Method
            </h2>

            <p style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Method:</span><br />
              <span style={{ fontWeight: 600, color: 'var(--ink)', textTransform: 'uppercase' }}>
                {order.payment_method === 'cod' ? 'Cash on Delivery' : 'GCash'}
              </span>
            </p>

            <p style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor:
                order.payment_method === 'gcash'
                  ? 'var(--gold-light)'
                  : 'var(--red-light)',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              color: order.payment_method === 'gcash' ? 'var(--gold)' : 'var(--red)',
            }}>
              {order.payment_method === 'cod'
                ? 'Pay when your order arrives'
                : 'Payment receipt uploaded. We will verify soon.'}
            </p>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="https://m.me/superalesmelawareandjapansurplus"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                flex: 1,
                minWidth: '200px',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              💬 Message us on Facebook
            </a>
            <button
              onClick={() => navigate('/shop')}
              className="btn-outline"
              style={{
                flex: 1,
                minWidth: '200px',
                justifyContent: 'center',
              }}
            >
              🛍️ Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
