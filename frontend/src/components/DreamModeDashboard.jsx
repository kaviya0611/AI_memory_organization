import React, { useState, useEffect } from 'react'
import { decisionAPI } from '../api'

export function DreamModeDashboard() {
  const [dreamData, setDreamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    loadLatestDream()
  }, [])

  const loadLatestDream = async () => {
    setLoading(true)
    try {
      const res = await decisionAPI.getLatestDreamMode()
      setDreamData(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleTriggerDream = async () => {
    setRunning(true)
    try {
      const res = await decisionAPI.runDreamMode()
      setDreamData(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-900 via-violet-800 to-indigo-950 text-white p-6 rounded-xl shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-950/80 px-3 py-1 rounded-full text-xs font-semibold text-purple-200 border border-purple-700/60 mb-2">
              <span>🌙 Feature 10</span>
              <span>•</span>
              <span>Self-Improving Organizational Memory</span>
            </div>
            <h2 className="text-2xl font-bold">Dream Mode: Autonomous Memory Consolidation</h2>
            <p className="text-purple-200 text-sm mt-1 max-w-3xl">
              Mimicking human sleep, Dream Mode runs autonomously in the background to review recent decisions, detect contradictory approvals, merge duplicate knowledge into heuristics, prune expired rules, and surface organizational blind spots.
            </p>
          </div>
          <button
            onClick={handleTriggerDream}
            disabled={running}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-5 rounded-lg text-xs shadow-lg transition flex items-center space-x-2"
          >
            <span>{running ? 'Consolidating Memory...' : 'Trigger Nightly Consolidation Now ⚡'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Retrieving consolidation report...</div>
      ) : dreamData ? (
        <div className="space-y-6">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
              <span className="text-xs text-gray-500 font-medium">Consolidated Patterns</span>
              <p className="text-2xl font-black text-purple-700 mt-1">{dreamData.consolidated_count}</p>
              <span className="text-[11px] text-emerald-600 font-semibold">Rules merged</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
              <span className="text-xs text-gray-500 font-medium">Contradictions Flagged</span>
              <p className="text-2xl font-black text-amber-600 mt-1">{dreamData.contradictions_detected}</p>
              <span className="text-[11px] text-amber-700 font-semibold">Policy divergence</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
              <span className="text-xs text-gray-500 font-medium">Pruned Outdated Records</span>
              <p className="text-2xl font-black text-red-600 mt-1">{dreamData.pruned_items_count}</p>
              <span className="text-[11px] text-gray-500 font-semibold">Expired knowledge</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
              <span className="text-xs text-gray-500 font-medium">Knowledge Gaps Surfaced</span>
              <p className="text-2xl font-black text-blue-600 mt-1">{dreamData.gaps_identified}</p>
              <span className="text-[11px] text-blue-700 font-semibold">Blindspot areas</span>
            </div>
          </div>

          {/* Strategic Meta-Insights */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-6 shadow-md border border-indigo-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center">
              <span className="mr-2">💡</span> Strategic Meta-Insights Surfaced by Dream Mode:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(dreamData.insights || []).map((ins, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-lg text-xs leading-relaxed flex items-start space-x-2">
                  <span className="text-amber-400 font-bold mt-0.5">✦</span>
                  <span className="text-gray-200">{ins}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Consolidated Patterns */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <span className="mr-2">✅</span> Consolidated Heuristics & Rules
              </h3>
              <div className="space-y-2.5">
                {(dreamData.consolidated_patterns || []).map((pat, idx) => (
                  <div key={idx} className="bg-purple-50/70 border border-purple-200 p-3 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-purple-950 text-sm">{pat.pattern_name}</span>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-200 px-2 py-0.5 rounded">
                        Confidence: {(pat.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-gray-700">{pat.rule_summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contradictions Detected */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <span className="mr-2">⚠️</span> Detected Policy Contradictions
              </h3>
              <div className="space-y-2.5">
                {(dreamData.contradiction_reports || []).map((contra, idx) => (
                  <div key={idx} className="bg-amber-50/70 border-l-4 border-amber-500 p-3 rounded-r-lg text-xs space-y-1">
                    <span className="font-bold text-amber-950 text-sm block">Contradiction: {contra.contradiction_id}</span>
                    <p className="text-gray-700">• <strong>Decision A:</strong> {contra.decision_a}</p>
                    <p className="text-gray-700">• <strong>Decision B:</strong> {contra.decision_b}</p>
                    <p className="text-red-700 font-medium">Root: {contra.root_difference}</p>
                    <p className="text-indigo-800 font-bold mt-1">Action: {contra.action_required}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Knowledge Gaps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center">
              <span className="mr-2">🔍</span> Identified Organizational Blindspots (Knowledge Gaps):
            </h3>
            <ul className="space-y-1.5 text-xs text-blue-950">
              {(dreamData.knowledge_gaps || []).map((gap, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">→</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
