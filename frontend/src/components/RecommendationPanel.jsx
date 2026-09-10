import React, { useState } from 'react'
import { decisionAPI } from '../api'

export function RecommendationPanel({ decisionStatement }) {
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGetRecommendations = async () => {
    if (!decisionStatement || decisionStatement.trim().length < 10) {
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
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-blue-900">🔍 AI Recommendations</h3>
        <button
          onClick={handleGetRecommendations}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-semibold"
        >
          {loading ? 'Analyzing...' : 'Get Recommendations'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {recommendations && (
        <div className="space-y-4">
          <div className="bg-white p-3 rounded border-l-4 border-green-500">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              💡 Recommendation
            </p>
            <p className="text-sm text-gray-700 mb-2">
              {recommendations.recommendation}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${recommendations.confidence * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {(recommendations.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {recommendations.insights && recommendations.insights.length > 0 && (
            <div className="bg-white p-3 rounded">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                📊 Insights
              </p>
              <ul className="space-y-1">
                {recommendations.insights.map((insight, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.warnings && recommendations.warnings.length > 0 && (
            <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                ⚠️ Warnings
              </p>
              <ul className="space-y-1">
                {recommendations.warnings.map((warning, i) => (
                  <li key={i} className="text-sm text-yellow-700">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.lessons && recommendations.lessons.length > 0 && (
            <div className="bg-purple-50 p-3 rounded">
              <p className="text-sm font-semibold text-purple-900 mb-2">
                🎓 Lessons from Past
              </p>
              <ul className="space-y-1">
                {recommendations.lessons.map((lesson, i) => (
                  <li key={i} className="text-sm text-purple-700">
                    • {lesson}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.all_similar &&
            recommendations.all_similar.length > 0 && (
              <div className="bg-white p-3 rounded">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  📚 Similar Decisions ({recommendations.all_similar.length})
                </p>
                <div className="space-y-2">
                  {recommendations.all_similar.map((similar, i) => (
                    <div
                      key={i}
                      className="text-xs bg-gray-50 p-2 rounded border-l-2 border-blue-300"
                    >
                      <p className="font-semibold text-gray-900">
                        {similar.title}
                      </p>
                      <p className="text-gray-600 mt-1">
                        Similarity: {(similar.similarity_score * 100).toFixed(0)}%
                      </p>
                      {similar.actual_outcome && (
                        <p className="text-green-700 mt-1 italic">
                          Result: {similar.actual_outcome}
                        </p>
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
