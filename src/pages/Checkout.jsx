// src/pages/Checkout.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Checkout() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { items, totalPrice, clearCart } = useCart()
  
  const [customerName, setCustomerName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [address, setAddress] = useState(profile?.address || '')
  const [city, setCity] = useState('')
  const [barangay, setBarangay] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [gcashReceipt, setGcashReceipt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
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
              Please Login to Checkout
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
              You need to be logged in to place an order.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (items.length === 0) {
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
              Your Cart is Empty
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
              Add some items to your cart before checking out.
            </p>
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let gcashReceiptUrl = null

      // Upload GCash receipt if provided
      if (paymentMethod === 'gcash' && gcashReceipt) {
        const fileName = `${user.id}-${Date.now()}-${gcashReceipt.name}`
        const { error: uploadError } = await supabase.storage
          .from('gcash-receipts')
          .upload(fileName, gcashReceipt)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('gcash-receipts')
          .getPublicUrl(fileName)

        gcashReceiptUrl = publicUrl
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: customerName,
          phone,
          address,
          city,
          barangay,
          payment_method: paymentMethod,
          gcash_receipt_url: gcashReceiptUrl,
          total_amount: totalPrice,
          status: paymentMethod === 'gcash' ? 'payment_verified' : 'pending',
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart and redirect
      clearCart()
      navigate(`/order-success?orderId=${orderData.id}`)
    } catch (err) {
      setError(err.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
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
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '2rem',
            color: 'var(--ink)',
          }}>
            Checkout
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
          }}>
            {/* Form */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid var(--border)',
            }}>
              <h2 style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: '1.3rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                color: 'var(--ink)',
              }}>
                Delivery Information
              </h2>

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

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: 'var(--ink)',
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--border)',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem',
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
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--border)',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem',
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
                    Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--border)',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem',
                      resize: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      color: 'var(--ink)',
                    }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Hagonoy"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem',
                        fontSize: '0.95rem',
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
                      Barangay
                    </label>
                    <input
                      type="text"
                      value={barangay}
                      onChange={(e) => setBarangay(e.target.value)}
                      placeholder="e.g. Sinayawan"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem',
                        fontSize: '0.95rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <h3 style={{
                    fontFamily: "'Noto Serif JP', serif",
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    color: 'var(--ink)',
                  }}>
                    Payment Method
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      padding: '0.75rem',
                      border: `2px solid ${paymentMethod === 'cod' ? 'var(--red)' : 'var(--border)'}`,
                      borderRadius: '0.5rem',
                      backgroundColor: paymentMethod === 'cod' ? 'var(--red-light)' : 'transparent',
                    }}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Cash on Delivery (COD)</span>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      padding: '0.75rem',
                      border: `2px solid ${paymentMethod === 'gcash' ? 'var(--red)' : 'var(--border)'}`,
                      borderRadius: '0.5rem',
                      backgroundColor: paymentMethod === 'gcash' ? 'var(--red-light)' : 'transparent',
                    }}>
                      <input
                        type="radio"
                        name="payment"
                        value="gcash"
                        checked={paymentMethod === 'gcash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>GCash</span>
                    </label>
                  </div>

                  {paymentMethod === 'gcash' && (
                    <div style={{
                      marginTop: '1.5rem',
                      padding: '1rem',
                      backgroundColor: 'var(--gold-light)',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border)',
                    }}>
                      <p style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                        📱 Send ₱{totalPrice.toFixed(2)} to:
                      </p>
                      <p style={{ color: 'var(--ink)', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                        0909 051 2856 (Claire Superales)
                      </p>
                      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        After sending, take a screenshot and upload it below:
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setGcashReceipt(e.target.files?.[0] || null)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px dashed var(--gold)',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                        }}
                      />
                      {gcashReceipt && (
                        <p style={{ color: 'var(--red)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                          ✓ {gcashReceipt.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || (paymentMethod === 'gcash' && !gcashReceipt)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid var(--border)',
              height: 'fit-content',
            }}>
              <h2 style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: '1.3rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                color: 'var(--ink)',
              }}>
                Order Summary
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                {items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>
                        {item.name}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                        {item.quantity} x ₱{item.price.toFixed(2)}
                      </p>
                    </div>
                    <p style={{ fontWeight: 700, color: 'var(--red)' }}>
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{
                padding: '1.5rem 0',
                borderTop: '2px solid var(--border)',
                borderBottom: '2px solid var(--border)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}>
                  <span style={{ color: 'var(--muted)' }}>Subtotal:</span>
                  <span style={{ fontWeight: 600 }}>₱{totalPrice.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}>
                  <span style={{ color: 'var(--muted)' }}>Shipping:</span>
                  <span style={{ fontWeight: 600 }}>Free</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1.5rem 0',
                fontSize: '1.1rem',
              }}>
                <span style={{ fontWeight: 700, color: 'var(--ink)' }}>Total:</span>
                <span style={{ fontWeight: 700, color: 'var(--red)' }}>
                  ₱{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
