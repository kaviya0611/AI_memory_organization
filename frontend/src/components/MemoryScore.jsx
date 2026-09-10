import React, { useState, useEffect } from 'react'
import { decisionAPI } from '../api'

export function MemoryScore() {
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMemoryScore()
  }, [])

  const loadMemoryScore = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await decisionAPI.getMemoryScore()
      setScore(response.data)
    } catch (err) {
      setError(
        'Failed to load memory score: ' + (err.response?.data?.detail || err.message)
      )
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-700'
    if (score >= 60) return 'text-blue-700'
    if (score >= 40) return 'text-yellow-700'
    return 'text-red-700'
  }

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-blue-50 border-blue-200'
    if (score >= 40) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 animate-pulse h-32"></div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {error}
      </div>
    )
  }

  if (!score) {
    return null
  }

  return (
    <div className={`border rounded-lg p-6 ${getScoreBgColor(score.organizational_memory_score)}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            Organizational Memory Score
          </p>
          <div className={`text-4xl font-bold ${getScoreColor(score.organizational_memory_score)}`}>
            {score.organizational_memory_score}
            <span className="text-xl text-gray-600">/100</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Status: <span className="font-semibold">{score.interpretation}</span>
          </p>
        </div>
        <button
          onClick={loadMemoryScore}
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white rounded p-3">
          <p className="text-gray-600 text-xs font-semibold">Total Decisions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {score.total_decisions}
          </p>
        </div>
        <div className="bg-white rounded p-3">
          <p className="text-gray-600 text-xs font-semibold">With Outcomes</p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {score.decisions_with_outcomes}
          </p>
        </div>
        <div className="bg-white rounded p-3">
          <p className="text-gray-600 text-xs font-semibold">Outcome Rate</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {score.outcome_tracking_rate}%
          </p>
        </div>
        <div className="bg-white rounded p-3">
          <p className="text-gray-600 text-xs font-semibold">Avg Confidence</p>
          <p className="text-2xl font-bold text-purple-700 mt-1">
            {(score.average_extraction_confidence * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white rounded text-xs text-gray-600">
        <p className="font-semibold text-gray-700 mb-1">How it's calculated:</p>
        <ul className="space-y-1 text-gray-600">
          <li>• Outcome tracking rate (50%): {score.outcome_tracking_rate}%</li>
          <li>• Average extraction confidence (50%): {(score.average_extraction_confidence * 100).toFixed(0)}%</li>
        </ul>
      </div>
    </div>
  )
}
