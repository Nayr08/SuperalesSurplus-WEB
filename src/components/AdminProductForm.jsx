// src/components/AdminProductForm.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useToast } from '../context/ToastContext'

export default function AdminProductForm({ product, onSuccess, onCancel }) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'kitchen',
    image_url: '',
    emoji: '🛍',
    stock: 0,
    is_active: true,
  })

  useEffect(() => {
    if (product) {
      setFormData(product)
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      showToast('Product name is required', 'error')
      return
    }

    setLoading(true)

    try {
      if (product?.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', product.id)

        if (error) throw error
        showToast('Product updated ✓', 'success')
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([formData])

        if (error) throw error
        showToast('Product added ✓', 'success')
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving product:', err)
      showToast('Failed to save product', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'var(--ink)',
        marginBottom: '1.5rem',
      }}>
        {product?.id ? 'Edit Product' : 'Add New Product'}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Name */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--ink)' }}>
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Non-stick Frying Pan"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.95rem',
            }}
            disabled={loading}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--ink)' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description (max 120 characters)"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.95rem',
              minHeight: '80px',
              resize: 'vertical',
            }}
            disabled={loading}
            maxLength={120}
          />
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
            {formData.description.length}/120
          </div>
        </div>

        {/* Price & Stock */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--ink)' }}>
              Price (₱) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.95rem',
              }}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--ink)' }}>
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.95rem',
              }}
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Category & Emoji */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--ink)' }}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.95rem',
              }}
              disabled={loading}
            >
              <option value="kitchen">Kitchen</option>
              <option value="tableware">Tableware</option>
              <option value="home">Home</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--ink)' }}>
              Emoji
            </label>
            <input
              type="text"
              name="emoji"
              value={formData.emoji}
              onChange={handleChange}
              maxLength="2"
              placeholder="🛍"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.95rem',
              }}
              disabled={loading}
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--ink)' }}>
            Image URL
          </label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.95rem',
            }}
            disabled={loading}
          />
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
            Leave empty to auto-generate from product name
          </div>
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            disabled={loading}
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer',
            }}
          />
          <label style={{ color: 'var(--ink)', fontWeight: 500, cursor: 'pointer' }}>
            Active (show on shop)
          </label>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--red)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Saving...' : (product?.id ? 'Update Product' : 'Add Product')}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: 'var(--red)',
              border: '2px solid var(--red)',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
