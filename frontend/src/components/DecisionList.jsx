import React, { useState, useEffect } from 'react'
import { decisionAPI } from '../api'
import { formatDistanceToNow } from 'date-fns'

export function DecisionList() {
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState({ status: null, department_id: null })

  useEffect(() => {
    loadDecisions()
  }, [filter])

  const loadDecisions = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await decisionAPI.listDecisions({
        status: filter.status,
        department_id: filter.department_id,
        limit: 20,
      })
      setDecisions(response.data)
    } catch (err) {
      setError('Failed to load decisions: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (id, newStatus) => {
    // Update locally
    setDecisions(
      decisions.map((d) =>
        d.id === id ? { ...d, status: newStatus } : d
      )
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
        <select
          value={filter.status || ''}
          onChange={(e) =>
            setFilter({ ...filter, status: e.target.value || null })
          }
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Statuses</option>
          <option value="pending_review">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {decisions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No decisions recorded yet</p>
          <p className="text-sm">Create your first decision to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {decision.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(decision.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    decision.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : decision.status === 'pending_review'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {decision.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <p className="text-gray-700 mb-3">{decision.decision_statement}</p>

              {decision.reasoning && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-600">Reasoning:</p>
                  <p className="text-sm text-gray-700">{decision.reasoning}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 text-sm">
                {decision.stakeholders && decision.stakeholders.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-600">
                      Stakeholders:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {decision.stakeholders.map((s, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {decision.confidence_score > 0 && (
                  <div>
                    <span className="font-semibold text-gray-600">
                      Confidence:
                    </span>
                    <p className="text-gray-700">
                      {(decision.confidence_score * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
                {decision.department_id && (
                  <div>
                    <span className="font-semibold text-gray-600">Department:</span>
                    <p className="text-gray-700">{decision.department_id}</p>
                  </div>
                )}
              </div>

              {decision.actual_outcome && (
                <div className="mt-3 p-2 bg-green-50 rounded">
                  <p className="text-sm font-semibold text-green-700">
                    Actual Outcome:
                  </p>
                  <p className="text-sm text-green-600">{decision.actual_outcome}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
