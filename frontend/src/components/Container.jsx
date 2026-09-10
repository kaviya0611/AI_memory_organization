import React from 'react'

export function Container({ children, className = '' }) {
  return (
    <div className={`max-w-6xl mx-auto px-6 py-8 ${className}`}>
      {children}
    </div>
  )
}
