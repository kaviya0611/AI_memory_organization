import React, { useState } from 'react'
import { decisionAPI } from '../api'
import { ExplanationCard } from './ExplanationCard'

export function RecommendationPanel({ decisionStatement }) {
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGetRecommendations = async () => {
    if (!decisionStatement || decisionStatement.trim().length < 3) {
      setError('Please enter a decision statement first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await decisionAPI.getRecommendations(decisionStatement)
      setRecommendations(response.data)
    } catch (err) {
      setError(
        'Failed to get recommendations: ' +
          (err.response?.data?.detail || err.message)
      )
    } finally {
      setLoading(false)
    }
  }

  if (!decisionStatement) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-xl p-5 space-y-4 shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
            Feature 8: Explanation-First
          </span>
          <h3 className="font-bold text-indigo-950 text-base mt-1">
            🔍 AI Smart Recommendations & Collective Memory
          </h3>
        </div>
        <button
          onClick={handleGetRecommendations}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold text-xs shadow disabled:opacity-50"
        >
          {loading ? 'Consulting Brain...' : 'Recall Past Precedents ⚡'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-xs">
          {error}
        </div>
      )}

      {recommendations && (
        <div className="space-y-4">
          {/* Explanation-First Card */}
          {recommendations.explanation && (
            <ExplanationCard
              explanation={recommendations.explanation}
              confidenceScore={recommendations.confidence_score || Math.round((recommendations.confidence || 0.9) * 100)}
              recommendation={recommendations.recommendation}
            />
          )}

          {/* Similar Past Decisions with Temporal Indicators */}
          {recommendations.all_similar?.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">
                Recalled Past Precedents ({recommendations.all_similar.length}):
              </h4>
              <div className="space-y-2">
                {recommendations.all_similar.map((d, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-xs ${
                      d.is_expired
                        ? 'border-amber-300 bg-amber-50/50'
                        : 'border-gray-200 bg-gray-50/70'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900">{d.title}</span>
                      <div className="flex items-center space-x-1">
                        {d.is_expired && (
                          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Expired 2y ago
                          </span>
                        )}
                        <span className="font-mono text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                          Sim: {(d.similarity_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 line-clamp-2">{d.decision_statement}</p>
                    {d.actual_outcome && (
                      <div className="mt-1 text-emerald-700 font-medium">
                        ✓ Actual Outcome: {d.actual_outcome}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
