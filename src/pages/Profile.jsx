// src/pages/Profile.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const statusColors = {
  pending: { bg: '#FEF3C7', color: '#B45309' },
  payment_verified: { bg: '#DBEAFE', color: '#0369A1' },
  processing: { bg: '#FED7AA', color: '#92400E' },
  shipped: { bg: '#E9D5FF', color: '#6B21A8' },
  delivered: { bg: '#DCFCE7', color: '#166534' },
}

export default function Profile() {
  const { user, profile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [address, setAddress] = useState(profile?.address || '')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
      setAddress(profile.address || '')
    }

    loadOrders()
  }, [profile, user])

  const loadOrders = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error('Load orders error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          address,
        })
        .eq('id', user.id)

      if (error) throw error

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Save profile error:', err)
      alert('Failed to save profile')
    } finally {
      setIsSaving(false)
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
            My Profile
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
          }}>
            {/* Profile Form */}
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
                Profile Information
              </h2>

              {saveSuccess && (
                <div style={{
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                }}>
                  ✓ Profile updated successfully
                </div>
              )}

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                    rows="4"
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

                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Order History */}
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
                Order History
              </h2>

              {loading ? (
                <p style={{ color: 'var(--muted)' }}>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p style={{ color: 'var(--muted)' }}>No orders yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map(order => {
                    const statusStyle = statusColors[order.status] || statusColors.pending
                    return (
                      <div
                        key={order.id}
                        style={{
                          padding: '1rem',
                          border: '1px solid var(--border)',
                          borderRadius: '0.5rem',
                          backgroundColor: 'var(--cream)',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '0.5rem',
                        }}>
                          <div>
                            <p style={{
                              fontWeight: 600,
                              color: 'var(--ink)',
                              marginBottom: '0.25rem',
                            }}>
                              Order #{order.id.slice(0, 8)}
                            </p>
                            <p style={{
                              fontSize: '0.85rem',
                              color: 'var(--muted)',
                            }}>
                              {new Date(order.created_at).toLocaleDateString('en-PH')}
                            </p>
                          </div>
                          <span style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            padding: '0.35rem 0.75rem',
                            borderRadius: '2rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}>
                            {order.status === 'payment_verified' ? 'Verified' : order.status}
                          </span>
                        </div>

                        <div style={{
                          paddingTop: '0.75rem',
                          borderTop: '1px solid var(--border)',
                        }}>
                          {order.order_items?.map(item => (
                            <p
                              key={item.id}
                              style={{
                                fontSize: '0.85rem',
                                color: 'var(--muted)',
                                marginBottom: '0.25rem',
                              }}
                            >
                              {item.product_name} x {item.quantity} = ₱{(item.unit_price * item.quantity).toFixed(2)}
                            </p>
                          ))}
                        </div>

                        <div style={{
                          paddingTop: '0.75rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                            Total:
                          </span>
                          <span style={{
                            fontWeight: 700,
                            color: 'var(--red)',
                            fontSize: '0.95rem',
                          }}>
                            ₱{order.total_amount}
                          </span>
                        </div>
                      </div>
                    )
                  })}
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
