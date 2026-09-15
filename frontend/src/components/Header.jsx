import React, { useState, useEffect } from 'react'
import { decisionAPI } from '../api'
import { Brain, Database, Sparkles, ExternalLink, Presentation, CheckCircle2 } from 'lucide-react'

export function Header({ onSeedSuccess, onSwitchToPitch, isPitchMode }) {
  const [seeding, setSeeding] = useState(false)
  const [seededNotice, setSeededNotice] = useState(false)
  const [decisionCount, setDecisionCount] = useState(null)

  const fetchStats = async () => {
    try {
      const res = await decisionAPI.listDecisions()
      if (Array.isArray(res.data)) {
        setDecisionCount(res.data.length)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [seededNotice])

  const handleSeed = async () => {
    setSeeding(true)
    try {
      await decisionAPI.seedEnterpriseData()
      setSeededNotice(true)
      if (onSeedSuccess) onSeedSuccess()
      fetchStats()
      setTimeout(() => setSeededNotice(false), 4000)
    } catch (e) {
      console.error(e)
    } finally {
      setSeeding(false)
    }
  }

  return (
    <header className="bg-[#071A45] text-white shadow-xl border-b border-[#14388D]/70 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1C52C2] to-[#FFC000] p-0.5 shadow-glow-blue flex items-center justify-center">
              <div className="w-full h-full bg-[#071A45] rounded-[9px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#FFC000] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-display font-black tracking-tight text-white">
                  Decision<span className="text-[#FFC000]">Brain</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#1C52C2]/40 text-blue-200 border border-[#1C52C2]">
                  Live Platform
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
                  FastAPI + SQLite Active {decisionCount !== null && `(${decisionCount} records)`}
                </span>
              </div>
              <p className="text-slate-300 text-xs hidden md:block">
                AI Organizational Memory &amp; Decision Intelligence Platform
              </p>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="bg-[#1C52C2] hover:bg-[#2563eb] text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow transition flex items-center space-x-1.5 border border-blue-400/30"
              title="Populates the database with real historical enterprise scenarios"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFC000]" />
              <span>{seeding ? 'Seeding Brain...' : 'Seed Enterprise Scenarios'}</span>
            </button>

            {seededNotice && (
              <span className="text-emerald-400 text-xs font-semibold animate-pulse hidden sm:inline">
                ✓ Ready!
              </span>
            )}

            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-slate-700/60 transition"
              title="Open Swagger REST API Documentation"
            >
              <span>API Docs</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={onSwitchToPitch}
              className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold bg-gradient-to-r from-amber-500 to-[#FFC000] text-[#071A45] hover:opacity-95 shadow transition flex items-center space-x-1.5"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>{isPitchMode ? 'Back to App' : 'Pitch Presentation 📑'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  )
}

