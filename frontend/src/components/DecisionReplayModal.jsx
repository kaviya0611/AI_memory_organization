import React, { useState, useEffect } from 'react'
import { decisionAPI } from '../api'

export function DecisionReplayModal({ decisionId = 'phoenix', onClose }) {
  const [replay, setReplay] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReplay(decisionId)
  }, [decisionId])

  const loadReplay = async (id) => {
    setLoading(true)
    try {
      const res = await decisionAPI.getDecisionReplay(id)
      setReplay(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
        <div className="animate-spin text-3xl mb-2">⏳</div>
        <p className="text-sm">Reconstructing decision journey from organizational archives...</p>
      </div>
    )
  }

  if (!replay) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
        Decision journey could not be replayed.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center space-x-2 bg-indigo-900/60 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 border border-indigo-500/40">
            <span>⏪ Feature 6</span>
            <span>•</span>
            <span>Time-Travel Decision Replay</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm bg-white/10 px-2.5 py-1 rounded-lg"
            >
              Close ✕
            </button>
          )}
        </div>
        <h3 className="text-xl font-bold">{replay.title}</h3>
        <div className="flex flex-wrap gap-4 text-xs text-gray-300 mt-2">
          <span><strong>Decision Maker:</strong> {replay.decision_maker}</span>
          <span><strong>Formulated:</strong> {replay.initial_decision_date}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Original Assumptions vs Divergence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2 flex items-center">
              <span className="mr-1.5">🔮</span> Day 0 Assumptions (What Was Expected):
            </h4>
            <ul className="space-y-1.5 text-xs text-indigo-950">
              {(replay.original_assumptions || []).map((assump, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{assump}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50/60 border border-red-200 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-900 mb-2 flex items-center">
              <span className="mr-1.5">💥</span> Root Cause of Failure:
            </h4>
            <p className="text-xs text-red-950 leading-relaxed">
              {replay.root_cause_of_failure || 'Assumptions broke down under live operational constraints.'}
            </p>
            <div className="mt-3 pt-2 border-t border-red-200/60 text-xs text-red-800 font-medium">
              {replay.divergence_analysis}
            </div>
          </div>
        </div>

        {/* Timeline of Journey Checkpoints */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">⏱️</span> Decision Journey Timeline (Assumptions vs Reality Checkpoints):
          </h4>
          <div className="relative border-l-2 border-indigo-300 ml-4 space-y-6">
            {(replay.timeline_checkpoints || []).map((cp, idx) => (
              <div key={idx} className="relative pl-6">
                {/* Timeline Dot */}
                <div className="absolute -left-2.5 top-1 w-5 h-5 bg-indigo-600 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-[10px] text-white">
                  {idx + 1}
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-gray-200">
                    <span className="font-bold text-gray-900 text-sm">{cp.phase}</span>
                    <span className="font-mono text-gray-500 bg-white px-2 py-0.5 rounded border">
                      {cp.timestamp}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-gray-500 block text-[11px] font-semibold">Assumptions Held:</span>
                      <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                        {cp.assumptions.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-red-600 block text-[11px] font-semibold">Actual Reality:</span>
                      <p className="text-gray-900 font-medium">{cp.actual_state}</p>
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded border border-gray-200 text-gray-600 text-[11px] italic">
                    Note: {cp.notes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Lessons Learned */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-xl p-5">
          <h4 className="text-sm font-bold text-emerald-950 mb-2 flex items-center">
            <span className="mr-2">💡</span> Permanent Organizational Lessons Learned:
          </h4>
          <ul className="space-y-1.5 text-xs text-emerald-900">
            {(replay.lessons_learned || []).map((lesson, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="font-medium">{lesson}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
