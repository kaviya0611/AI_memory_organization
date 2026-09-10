import React, { useState, useEffect } from 'react'
import { decisionAPI } from '../api'
import { formatDistanceToNow } from 'date-fns'
import { DecisionReplayModal } from './DecisionReplayModal'

export function DecisionList() {
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState({ status: null, department_id: null })
  const [expandedId, setExpandedId] = useState(null)
  const [replayId, setReplayId] = useState(null)
  const [outcomeModalId, setOutcomeModalId] = useState(null)
  const [outcomeText, setOutcomeText] = useState('')

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
        limit: 50,
      })
      setDecisions(response.data)
    } catch (err) {
      setError('Failed to load decisions: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleRecordOutcome = async (id) => {
    if (!outcomeText.trim()) return
    try {
      await decisionAPI.recordOutcome(id, outcomeText)
      setOutcomeModalId(null)
      setOutcomeText('')
      loadDecisions()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSeedData = async () => {
    setLoading(true)
    try {
      await decisionAPI.seedEnterpriseData()
      loadDecisions()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Replay Modal */}
      {replayId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-8">
            <DecisionReplayModal decisionId={replayId} onClose={() => setReplayId(null)} />
          </div>
        </div>
      )}

      {/* Outcome Modal (Feature 9: Adaptive Learning) */}
      {outcomeModalId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-gray-900 text-base flex items-center">
              <span className="mr-2">📈</span> Record Actual Outcome (Adaptive Learning)
            </h3>
            <p className="text-xs text-gray-600">
              Tracking real outcomes allows the platform to adaptively boost pattern confidence or flag emerging anti-patterns.
            </p>
            <textarea
              rows={3}
              value={outcomeText}
              onChange={(e) => setOutcomeText(e.target.value)}
              placeholder="e.g. Delivered 100% on time with zero defects during monsoon season..."
              className="w-full border rounded-lg p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setOutcomeModalId(null)}
                className="px-4 py-2 border rounded-lg text-xs text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRecordOutcome(outcomeModalId)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
              >
                Log Outcome & Reinforce
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Action Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <select
            value={filter.status || ''}
            onChange={(e) => setFilter({ ...filter, status: e.target.value || null })}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium"
          >
            <option value="">All Statuses</option>
            <option value="pending_review">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={filter.department_id || ''}
            onChange={(e) => setFilter({ ...filter, department_id: e.target.value || null })}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium"
          >
            <option value="">All Departments</option>
            <option value="Procurement">Procurement</option>
            <option value="Operations">Operations</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        <button
          onClick={handleSeedData}
          className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold px-3 py-1.5 rounded-lg border border-indigo-200 transition"
        >
          Reset / Seed Scenario Data 🌱
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          {error}
        </div>
      )}

      {decisions.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border p-8">
          <p className="text-base font-bold text-gray-700">No decisions recorded yet</p>
          <button
            onClick={handleSeedData}
            className="mt-3 bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
          >
            Load Complete Enterprise Memory Dataset 🌱
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {decisions.map((decision) => {
            const isExpanded = expandedId === decision.id
            const isExpired = decision.is_expired
            const hasOutcome = Boolean(decision.actual_outcome)

            return (
              <div
                key={decision.id}
                className={`bg-white rounded-xl shadow-sm border transition ${
                  isExpired ? 'border-amber-300 bg-amber-50/20' : 'border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="p-5">
                  {/* Top Badges & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      {isExpired ? (
                        <span className="bg-red-100 text-red-800 border border-red-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center">
                          <span className="mr-1">⏳</span> Expired Knowledge (2y ago)
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                          ✓ Active Memory
                        </span>
                      )}

                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        Tier: {decision.trust_tier?.replace(/_/g, ' ') || 'Human Confirmed'}
                      </span>

                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {decision.department_id || 'Procurement'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-gray-400">
                        {formatDistanceToNow(new Date(decision.created_at), { addSuffix: true })}
                      </span>
                      <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        Conf: {(decision.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Title & Statement */}
                  <h3 className="text-base font-bold text-gray-900 mb-1">{decision.title}</h3>
                  <p className="text-xs text-gray-700 leading-relaxed mb-3">
                    <strong>Decision:</strong> {decision.decision_statement}
                  </p>

                  {/* Temporal Expiration Warning Banner */}
                  {decision.temporal_warning && (
                    <div className="bg-amber-50 border border-amber-300 text-amber-900 p-2.5 rounded-lg text-xs mb-3 flex items-center space-x-2">
                      <span>⚠️</span>
                      <span>{decision.temporal_warning}</span>
                    </div>
                  )}

                  {/* Outcomes Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg text-xs mb-3 border border-gray-100">
                    <div>
                      <span className="text-gray-500 font-medium block">Expected Outcome:</span>
                      <p className="text-gray-800 font-medium mt-0.5">
                        {decision.expected_outcome || 'Full operational adherence.'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block">Actual Tracked Outcome:</span>
                      {hasOutcome ? (
                        <p className="text-emerald-700 font-bold mt-0.5 flex items-center">
                          <span className="mr-1">✓</span> {decision.actual_outcome}
                        </p>
                      ) : (
                        <button
                          onClick={() => setOutcomeModalId(decision.id)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold text-xs mt-0.5 inline-block"
                        >
                          + Record Outcome (Adaptive Loop)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : decision.id)}
                        className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
                      >
                        <span>{isExpanded ? 'Hide Full Reasoning ▲' : 'Inspect Decision Memory (Triggers & Constraints) ▼'}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setReplayId(decision.id)}
                        className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 shadow-sm"
                      >
                        <span>⏪</span>
                        <span>Show Replay</span>
                      </button>

                      {!hasOutcome && (
                        <button
                          onClick={() => setOutcomeModalId(decision.id)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded-lg border border-indigo-200"
                        >
                          Log Outcome
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Decision Memory Drawer */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-indigo-100 space-y-3 text-xs bg-indigo-50/40 p-4 rounded-xl">
                      {decision.triggers && (
                        <div>
                          <strong className="text-indigo-950 block">Decision Trigger:</strong>
                          <p className="text-gray-700">{decision.triggers}</p>
                        </div>
                      )}

                      {decision.reasoning && (
                        <div>
                          <strong className="text-indigo-950 block">Comprehensive Reasoning:</strong>
                          <p className="text-gray-700 leading-relaxed">{decision.reasoning}</p>
                        </div>
                      )}

                      {decision.constraints?.length > 0 && (
                        <div>
                          <strong className="text-indigo-950 block">Documented Constraints:</strong>
                          <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                            {decision.constraints.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {decision.rejected_reasons && Object.keys(decision.rejected_reasons).length > 0 && (
                        <div>
                          <strong className="text-red-900 block">Why Other Options Were Rejected:</strong>
                          <div className="space-y-1 mt-1">
                            {Object.entries(decision.rejected_reasons).map(([opt, why], i) => (
                              <div key={i} className="bg-white p-2 rounded border border-red-200 text-red-950">
                                <span className="font-bold">{opt}:</span> {why}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {decision.assumptions?.length > 0 && (
                        <div>
                          <strong className="text-indigo-950 block">Assumptions Made at Decision Time:</strong>
                          <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                            {decision.assumptions.map((a, i) => (
                              <li key={i}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {decision.evidence_links?.length > 0 && (
                        <div>
                          <strong className="text-indigo-950 block">Evidence Links:</strong>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {decision.evidence_links.map((ev, i) => (
                              <span
                                key={i}
                                className="bg-white text-indigo-700 border border-indigo-300 px-2 py-0.5 rounded font-mono text-[10px]"
                              >
                                {ev}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
