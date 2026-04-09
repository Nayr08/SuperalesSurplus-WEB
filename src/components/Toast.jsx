// src/components/Toast.jsx
import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'success', duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(!!message)

  useEffect(() => {
    if (!message) {
      setIsVisible(false)
      return
    }

    setIsVisible(true)
    const timer = setTimeout(() => setIsVisible(false), duration)
    return () => clearTimeout(timer)
  }, [message, duration])

  if (!isVisible) return null

  const bgColor = type === 'success' ? 'var(--red)' : type === 'error' ? '#dc2626' : '#3b82f6'

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: bgColor,
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      animation: 'slideIn 0.3s ease-out',
      fontWeight: 500,
      maxWidth: '300px',
    }}>
      {message}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
