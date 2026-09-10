import React from 'react'

export function Header() {
  return (
    <header className="bg-gradient-to-r from-primary-900 to-primary-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">🚀</div>
          <h1 className="text-3xl font-bold">
            Organizational Memory Platform
          </h1>
        </div>
        <p className="text-primary-100">
          Capture, learn, and make smarter decisions from organizational experience
        </p>
      </div>
    </header>
  )
}
