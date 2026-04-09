// src/components/ProductCard.jsx
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()

  // Fallback placeholder image for null image_url
  const imageUrl = product.image_url || `https://picsum.photos/seed/${product.name.toLowerCase().replace(/\s+/g, '-')}/400/400`

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      emoji: product.emoji,
      category: product.category,
    })
    showToast(`${product.name} added to cart! ✓`, 'success', 2000)
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '1rem',
      transition: 'all 0.3s ease',
    }}>
      {/* Product Image */}
      <div style={{
        width: '100%',
        height: '200px',
        overflow: 'hidden',
        borderRadius: '8px',
        marginBottom: '1rem',
        backgroundColor: 'var(--cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src={imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${product.category}/400/400`
          }}
        />
      </div>

      {/* Product Details */}
      <span style={{
        display: 'inline-block',
        backgroundColor: 'var(--gold-light)',
        color: 'var(--red)',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'capitalize',
        marginBottom: '0.5rem',
      }}>
        {product.category}
      </span>
      
      <div style={{
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--ink)',
        marginBottom: '0.5rem',
        marginTop: '0.5rem',
      }}>
        {product.name}
      </div>
      
      <p style={{
        fontSize: '0.85rem',
        color: 'var(--muted)',
        marginBottom: '1rem',
        lineHeight: 1.4,
      }}>
        {product.description}
      </p>
      
      <div style={{ marginBottom: '1rem', fontWeight: 700, color: 'var(--red)', fontSize: '1.1rem' }}>
        ₱{parseFloat(product.price).toFixed(2)}
      </div>
      
      <button
        onClick={handleAddToCart}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--red)',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '0.95rem',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--red-dark)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--red)'}
      >
        🛍️ Add to Cart
      </button>
    </div>
  )
}
