// src/pages/Admin.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AdminProductForm from '../components/AdminProductForm'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

// Admin emails - whitelist of allowed admins
const ADMIN_EMAILS = ['clairejoycesuperales@yahoo.com.ph', 'admin@superales.ph']

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!ADMIN_EMAILS.includes(user.email)) {
      navigate('/')
      showToast('Unauthorized access', 'error')
      return
    }
    loadProducts()
  }, [user])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Error loading products:', err)
      showToast('Failed to load products', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error
      setProducts(products.filter(p => p.id !== productId))
      showToast('Product deleted ✓', 'success')
    } catch (err) {
      console.error('Error deleting product:', err)
      showToast('Failed to delete product', 'error')
    }
  }

  const handleToggleActive = async (productId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId)

      if (error) throw error
      
      setProducts(products.map(p =>
        p.id === productId ? { ...p, is_active: !currentStatus } : p
      ))
      showToast(
        !currentStatus ? 'Product activated ✓' : 'Product deactivated ✓',
        'success'
      )
    } catch (err) {
      console.error('Error updating product:', err)
      showToast('Failed to update product', 'error')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    loadProducts()
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'white' }}>
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <p>Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'white' }}>
        <div style={{ padding: '3rem 2rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--ink)',
                margin: 0,
              }}>
                Admin Dashboard
              </h1>
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setShowForm(true)
                }}
                style={{
                  backgroundColor: 'var(--red)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--red-dark)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--red)'}
              >
                ➕ Add Product
              </button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '2rem' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.95rem',
                }}
              />
            </div>

            {/* Form Modal */}
            {showForm && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  maxWidth: '600px',
                  width: '90%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  padding: '2rem',
                }}>
                  <AdminProductForm
                    product={editingProduct}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormClose}
                  />
                </div>
              </div>
            )}

            {/* Products Table */}
            <div style={{
              overflowX: 'auto',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid var(--border)',
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--cream)', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Category</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Price</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Stock</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 500, color: 'var(--ink)' }}>{product.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                            {product.description?.substring(0, 50)}...
                          </div>
                        </td>
                        <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{product.category}</td>
                        <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--red)' }}>
                          ₱{parseFloat(product.price).toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{product.stock}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            backgroundColor: product.is_active ? 'var(--gold-light)' : '#fee2e2',
                            color: product.is_active ? 'var(--red)' : '#991b1b',
                          }}>
                            {product.is_active ? '✓ Active' : '✕ Inactive'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => setEditingProduct(product) || setShowForm(true)}
                            style={{
                              backgroundColor: 'transparent',
                              color: 'var(--red)',
                              border: 'none',
                              cursor: 'pointer',
                              marginRight: '0.5rem',
                              fontWeight: 600,
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleActive(product.id, product.is_active)}
                            style={{
                              backgroundColor: 'transparent',
                              color: product.is_active ? '#dc2626' : 'var(--gold)',
                              border: 'none',
                              cursor: 'pointer',
                              marginRight: '0.5rem',
                              fontWeight: 600,
                            }}
                          >
                            {product.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            style={{
                              backgroundColor: 'transparent',
                              color: '#dc2626',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Stats */}
            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{
                backgroundColor: 'var(--cream)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--red)' }}>
                  {products.length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                  Total Products
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--cream)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>
                  {products.filter(p => p.is_active).length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                  Active Products
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--cream)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--ink)' }}>
                  {products.reduce((sum, p) => sum + (p.stock || 0), 0)}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                  Total Stock
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
