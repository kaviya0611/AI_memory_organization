import React, { useState, useEffect } from 'react'
import { decisionAPI } from '../api'
import { RecommendationPanel } from './RecommendationPanel'

export function DecisionForm({ onSuccess, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    decision_statement: '',
    reasoning: '',
    stakeholders: ['Sarah Chen (Supply Chain)', 'Raj Malhotra (Finance)'],
    risks: ['Monsoon weather volatility', '12% cost variance'],
    expected_outcome: '',
    project_id: '',
    department_id: 'Procurement',
    created_by: 'Current Manager',
    monetary_value: 48.0,
    trust_tier: 'human_confirmed',
    triggers: 'Annual supplier evaluation & monsoon risk mitigation',
    constraints: ['Budget cap: ₹60L', 'Deadline: July 15', 'Minimum 95% SLA'],
    alternatives_considered: ['Supplier A', 'Supplier B', 'Supplier C'],
    rejected_reasons: {
      'Supplier A': 'Monsoon reliability issues (3 failures in 5 years)',
      'Supplier C': 'Known dead end (40% defect rate in 2021)',
    },
    assumptions: ['Budget allows for 12% premium', 'Demand stays at 2,000 units/week'],
    evidence_links: ['DEC-2021-00334', 'Policy-15'],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showExtractor, setShowExtractor] = useState(false)
  const [extractorText, setExtractorText] = useState('')
  const [guardrailAlert, setGuardrailAlert] = useState(null)
  const [checkingGuardrails, setCheckingGuardrails] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLiveGuardrailCheck = async (textToCheck = formData.decision_statement) => {
    if (!textToCheck || textToCheck.length < 5) return
    setCheckingGuardrails(true)
    try {
      const res = await decisionAPI.checkGuardrails({
        decision_draft: textToCheck,
        department_id: formData.department_id,
        monetary_value: parseFloat(formData.monetary_value) || 0,
      })
      setGuardrailAlert(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setCheckingGuardrails(false)
    }
  }

  const handleExtract = async () => {
    if (!extractorText.trim()) {
      setError('Please enter text to extract from')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await decisionAPI.extractDecision(extractorText, 'text')
      const data = response.data

      setFormData((prev) => ({
        ...prev,
        decision_statement: data.decision_statement || prev.decision_statement,
        reasoning: data.reasoning || prev.reasoning,
        stakeholders: data.stakeholders || prev.stakeholders,
        risks: data.risks || prev.risks,
        expected_outcome: data.expected_outcome || prev.expected_outcome,
        triggers: data.triggers || prev.triggers,
        constraints: data.constraints || prev.constraints,
        alternatives_considered: data.alternatives_considered || prev.alternatives_considered,
        rejected_reasons: data.rejected_reasons || prev.rejected_reasons,
        assumptions: data.assumptions || prev.assumptions,
      }))

      setShowExtractor(false)
      setExtractorText('')
      handleLiveGuardrailCheck(data.decision_statement)
    } catch (err) {
      setError('Failed to extract decision: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await decisionAPI.createDecision({
        ...formData,
        monetary_value: parseFloat(formData.monetary_value) || 0,
      })
      if (onSuccess) onSuccess()
    } catch (err) {
      setError('Failed to save decision: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-xl shadow-md">
        <div>
          <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-1">
            <span>Feature 1: Decision Memory</span>
            <span>•</span>
            <span>Full Reasoning, Triggers & Constraints</span>
          </div>
          <h2 className="text-xl font-bold">Record New Organizational Decision</h2>
          <p className="text-indigo-100 text-xs mt-0.5">
            Capture the full decision journey — not just the final outcome.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowExtractor(!showExtractor)}
          className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-4 py-2 rounded-lg text-xs shadow transition"
        >
          {showExtractor ? 'Close AI Extractor ✕' : 'Extract from Email / Chat 🤖'}
        </button>
      </div>

      {/* AI Unstructured Text Extractor Modal / Drawer */}
      {showExtractor && (
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-indigo-900">
            🤖 AI Decision Extractor (Paste Meeting Notes, Email, or Report)
          </h3>
          <textarea
            rows={4}
            value={extractorText}
            onChange={(e) => setExtractorText(e.target.value)}
            placeholder="Paste raw conversation, email, or meeting transcript here..."
            className="w-full border rounded-lg p-3 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleExtract}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow"
            >
              {loading ? 'Extracting Structure...' : 'Auto-Extract Decision Memory ⚡'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Decision Fields */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
            1. What Decision is Being Made?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Decision Title *</label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Approved Supplier B for Q3 Monsoon Components"
                className="w-full border rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2.5 text-xs bg-white"
              >
                <option value="Procurement">Procurement</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-gray-700">Decision Statement *</label>
              <button
                type="button"
                onClick={() => handleLiveGuardrailCheck()}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold"
              >
                {checkingGuardrails ? 'Checking...' : 'Run Guardrail Check 🛡️'}
              </button>
            </div>
            <textarea
              rows={2}
              required
              name="decision_statement"
              value={formData.decision_statement}
              onChange={(e) => {
                handleInputChange(e)
                if (e.target.value.length > 20) {
                  // Debounce check
                }
              }}
              placeholder="Explicitly state what decision is made..."
              className="w-full border rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Real-time Guardrail Intercept Alert */}
          {guardrailAlert && (
            <div
              className={`p-3 rounded-lg border text-xs ${
                guardrailAlert.status === 'BLOCKED'
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : guardrailAlert.status === 'INTERVENTION_REQUIRED'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>
                  {guardrailAlert.status === 'BLOCKED' ? '🛑 Guardrail Blocked' : guardrailAlert.status === 'INTERVENTION_REQUIRED' ? '⚠️ Guardrail Warning' : '✅ Guardrail Verified'}
                </span>
                <span className="uppercase text-[10px]">{guardrailAlert.status}</span>
              </div>
              <p className="mt-1">{guardrailAlert.recommendation}</p>
            </div>
          )}

          {/* Embedded Recommendation Panel */}
          {formData.decision_statement && (
            <RecommendationPanel decisionStatement={formData.decision_statement} />
          )}
        </div>

        {/* Feature 1: Full Reasoning, Triggers, and Constraints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
            2. Decision Memory (Why, Constraints & Alternatives)
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">What Triggered This Decision?</label>
            <input
              type="text"
              name="triggers"
              value={formData.triggers}
              onChange={handleInputChange}
              placeholder="e.g. Rising logistics costs and monsoon failure rate of legacy vendors"
              className="w-full border rounded-lg p-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Detailed Reasoning</label>
            <textarea
              rows={3}
              name="reasoning"
              value={formData.reasoning}
              onChange={handleInputChange}
              placeholder="Document why this choice was made..."
              className="w-full border rounded-lg p-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Expected Outcome</label>
              <textarea
                rows={2}
                name="expected_outcome"
                value={formData.expected_outcome}
                onChange={handleInputChange}
                placeholder="What do you expect will happen?"
                className="w-full border rounded-lg p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Key Assumptions Made</label>
              <textarea
                rows={2}
                value={Array.isArray(formData.assumptions) ? formData.assumptions.join('\n') : ''}
                onChange={(e) =>
                  setFormData({ ...formData, assumptions: e.target.value.split('\n').filter(Boolean) })
                }
                placeholder="One assumption per line (e.g. Monsoon starts in July)"
                className="w-full border rounded-lg p-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Feature 11: Governance & Authority Matrix */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
            3. Governance & Authority Gates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Monetary Value (₹ Lakhs)</label>
              <input
                type="number"
                name="monetary_value"
                value={formData.monetary_value}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 text-xs"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                {formData.monetary_value < 10
                  ? '• Routine (< ₹10L): AI Autonomous'
                  : formData.monetary_value <= 50
                  ? '• Medium (₹10L–₹50L): Line Manager Sign-off'
                  : '• High-Stakes (> ₹50L): Executive Committee'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Trust Tier</label>
              <select
                name="trust_tier"
                value={formData.trust_tier}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 text-xs bg-white"
              >
                <option value="human_confirmed">Tier 3: Human Confirmed</option>
                <option value="ai_derived">Tier 2: AI Derived</option>
                <option value="raw_source">Tier 1: Raw Source</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Decision Maker / Owner</label>
              <input
                type="text"
                name="created_by"
                value={formData.created_by}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition text-sm disabled:opacity-50"
          >
            {loading ? 'Committing to Memory...' : 'Permanently Save Decision Journey 💾'}
          </button>
        </div>
      </form>
    </div>
  )
}
