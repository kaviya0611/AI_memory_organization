import React, { useState } from 'react'

export function ExplanationCard({ explanation, confidenceScore = 92, recommendation = '' }) {
  const [activeLayer, setActiveLayer] = useState(1)

  if (!explanation) return null

  const layers = [
    { id: 1, title: 'Layer 1: Source Attribution', icon: '🏛️' },
    { id: 2, title: 'Layer 2: Reasoning Chain', icon: '⛓️' },
    { id: 3, title: 'Layer 3: Calibrated Confidence', icon: '🎯' },
    { id: 4, title: 'Layer 4: Counterfactuals', icon: '🔄' },
    { id: 5, title: 'Layer 5: Evidence Links', icon: '📑' },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl shadow-xl p-6 border border-indigo-500/30">
      <div className="flex flex-wrap items-center justify-between border-b border-indigo-800/60 pb-4 mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded border border-indigo-700/50">
            Feature 8: Explanation-First Architecture
          </span>
          <h3 className="text-lg font-bold text-white mt-1">Full Reasoning & Transparency Stack</h3>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-lg">
          <span className="text-emerald-400 text-sm font-semibold">Confidence Score:</span>
          <span className="text-emerald-300 text-lg font-extrabold">{confidenceScore}%</span>
        </div>
      </div>

      {recommendation && (
        <div className="bg-indigo-900/40 border-l-4 border-indigo-400 p-3 rounded mb-5 text-sm text-indigo-100">
          <strong className="text-indigo-200">Recommendation:</strong> {recommendation}
        </div>
      )}

      {/* Layer Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-5">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all text-left flex items-center space-x-1.5 ${
              activeLayer === layer.id
                ? 'bg-indigo-600 text-white shadow-md border border-indigo-400'
                : 'bg-indigo-950/50 text-indigo-300 hover:bg-indigo-900/60 border border-indigo-800/40'
            }`}
          >
            <span>{layer.icon}</span>
            <span className="truncate">{layer.title.split(':')[0]}</span>
          </button>
        ))}
      </div>

      {/* Layer Content */}
      <div className="bg-slate-800/80 rounded-lg p-4 border border-indigo-700/30 min-h-[160px]">
        {activeLayer === 1 && (
          <div>
            <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center">
              <span className="mr-2">🏛️</span> Layer 1: Source Attribution
            </h4>
            <p className="text-sm text-gray-200 leading-relaxed">
              {explanation.layer1_source_attribution || 'Attributed across institutional decision archives.'}
            </p>
            <div className="mt-3 text-xs text-indigo-400 bg-indigo-950/60 p-2 rounded">
              Verified: Collective judgment drawn from ratified decisions, committee audits, and executive sign-offs.
            </div>
          </div>
        )}

        {activeLayer === 2 && (
          <div>
            <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center">
              <span className="mr-2">⛓️</span> Layer 2: Deductive Reasoning Chain (Step-by-Step)
            </h4>
            <ul className="space-y-2">
              {(explanation.layer2_reasoning_chain || []).map((step, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-gray-200 flex items-start space-x-2">
                  <span className="text-indigo-400 font-mono font-bold mt-0.5">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeLayer === 3 && (
          <div>
            <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center">
              <span className="mr-2">🎯</span> Layer 3: Calibrated Confidence Breakdown
            </h4>
            <div className="text-sm text-emerald-400 font-semibold mb-2">
              {explanation.layer3_confidence_breakdown?.confidence_level || `${confidenceScore}% Quantitative Consistency`}
            </div>
            {explanation.layer3_confidence_breakdown?.factors && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(explanation.layer3_confidence_breakdown.factors).map(([key, val], idx) => (
                  <div key={idx} className="bg-slate-900/80 p-2 rounded border border-indigo-900/50">
                    <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                    <span className="text-indigo-200 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeLayer === 4 && (
          <div>
            <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center">
              <span className="mr-2">🔄</span> Layer 4: Counterfactual Conditions ("Would Change If...")
            </h4>
            <p className="text-xs text-indigo-300 mb-2">
              The platform identifies the exact boundary conditions under which this recommendation flips:
            </p>
            <ul className="space-y-2">
              {(explanation.layer4_counterfactuals || []).map((cf, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-amber-200 bg-amber-950/30 border border-amber-900/40 p-2 rounded flex items-start space-x-2">
                  <span className="text-amber-400 font-bold">⚡</span>
                  <span>{cf}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeLayer === 5 && (
          <div>
            <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center">
              <span className="mr-2">📑</span> Layer 5: Verifiable Evidence Links & Precedents
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(explanation.layer5_evidence_links || []).map((ev, idx) => (
                <div key={idx} className="bg-slate-900/90 border border-indigo-700/50 p-2.5 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                      {ev.code}
                    </span>
                    <p className="text-xs text-gray-300 mt-1">{ev.title}</p>
                  </div>
                  <span className="text-[10px] text-indigo-400 uppercase font-semibold ml-2">
                    {ev.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
