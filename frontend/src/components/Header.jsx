import React, { useState } from 'react'
import { decisionAPI } from '../api'

export function Header({ onSeedSuccess }) {
  const [seeding, setSeeding] = useState(false)
  const [seededNotice, setSeededNotice] = useState(false)

  const handleSeed = async () => {
    setSeeding(true)
    try {
      await decisionAPI.seedEnterpriseData()
      setSeededNotice(true)
      if (onSeedSuccess) onSeedSuccess()
      setTimeout(() => setSeededNotice(false), 4000)
    } catch (e) {
      console.error(e)
    } finally {
      setSeeding(false)
    }
  }

  return (
    <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl border-b border-indigo-800/40">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="text-3xl bg-indigo-600/30 p-2 rounded-xl border border-indigo-500/40">
                🧠
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  AI Organizational Memory & Decision Intelligence Platform
                </h1>
                <p className="text-indigo-200 text-xs sm:text-sm mt-0.5">
                  A living enterprise brain that captures reasoning, enforces guardrails, and makes collective judgment permanent.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow-md transition flex items-center space-x-1.5 border border-indigo-400/40"
            >
              <span>{seeding ? 'Seeding Brain...' : 'Seed Priya Scenario 🌱'}</span>
            </button>
            {seededNotice && (
              <span className="text-emerald-400 text-xs font-semibold animate-pulse">
                ✓ Ready!
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
