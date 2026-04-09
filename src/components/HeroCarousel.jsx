import { useState, useEffect } from 'react'

// Static image placeholders - 4 images max
const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=320&fit=crop', // Tea set
  'https://images.unsplash.com/photo-1578181494822-d7c5c9b1c925?w=500&h=320&fit=crop', // Tableware
  'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=320&fit=crop', // Japanese ceramics
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=320&fit=crop', // Kitchen items
]

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hero-carousel">
      <div className="carousel-container">
        {CAROUSEL_IMAGES.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Product ${idx + 1}`}
            className={`carousel-image ${idx === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Dots indicator only */}
      <div className="carousel-dots">
        {CAROUSEL_IMAGES.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
