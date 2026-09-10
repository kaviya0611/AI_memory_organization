import React, { useState } from 'react'
import { decisionAPI } from '../api'

export function GuardrailsModal() {
  const [draftText, setDraftText] = useState('Approve 20% discount for Customer Y')
  const [monetaryVal, setMonetaryVal] = useState(24.0)
  const [tenureYears, setTenureYears] = useState(3.0)
  const [discountPct, setDiscountPct] = useState(20.0)
  const [loading, setLoading] = useState(false)
  const [evaluation, setEvaluation] = useState(null)

  const presets = [
    {
      label: 'Policy Violation: 20% Discount for Customer Y',
      text: 'Approve 20% discount for Customer Y on commercial contract',
      discount: 20.0,
      tenure: 3.0,
      value: 24.0,
    },
    {
      label: 'Critical Dead End: Select Supplier C for Q3',
      text: 'Select Supplier C for Q3 high-temp resin components',
      discount: 0,
      tenure: 5.0,
      value: 48.0,
    },
    {
      label: 'Cross-Department Conflict: 800 Units Bulk Order',
      text: 'Approve sales order of 800 units for client delivery within 7 days',
      discount: 10.0,
      tenure: 4.0,
      value: 65.0,
    },
    {
      label: 'Satisfied Policy: Supplier B Approval',
      text: 'Approve Supplier B for Q3 Monsoon Critical Components within ₹60L budget',
      discount: 0,
      tenure: 5.0,
      value: 48.0,
    },
  ]

  const handleRunCheck = async (textToTest = draftText) => {
    setLoading(true)
    try {
      const res = await decisionAPI.checkGuardrails({
        decision_draft: textToTest,
        department_id: 'Procurement',
        monetary_value: parseFloat(monetaryVal) || 0,
        customer_tenure_years: parseFloat(tenureYears) || 3.0,
        discount_percentage: parseFloat(discountPct) || null,
      })
      setEvaluation(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-6 rounded-xl shadow-md">
        <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
          <span>🛡️ Feature 5 & 4</span>
          <span>•</span>
          <span>Proactive Prevention & Neuro-Symbolic Logic</span>
        </div>
        <h2 className="text-2xl font-bold">Real-Time Decision Guardrails</h2>
        <p className="text-rose-100 text-sm mt-1 max-w-3xl">
          Intervenes before mistakes happen — not after. Checks proposed decisions against deterministic policy bounds, organizational dead ends, and cross-department capacity limits.
        </p>
      </div>

      {/* Preset Quick Tests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Quick Preset Scenarios (Click to test):
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDraftText(p.text)
                setDiscountPct(p.discount)
                setTenureYears(p.tenure)
                setMonetaryVal(p.value)
                handleRunCheck(p.text)
              }}
              className="text-left p-3 rounded-lg border border-gray-200 hover:border-rose-400 hover:bg-rose-50/50 transition text-xs flex flex-col justify-between"
            >
              <span className="font-semibold text-gray-900 mb-1">{p.label}</span>
              <span className="text-gray-500 line-clamp-2 italic">"{p.text}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Playground */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Live Guardrail Inspector</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Draft Decision Statement or Action:
            </label>
            <textarea
              rows={3}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="e.g. Approve 20% discount for Customer Y..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Monetary Value (₹ Lakhs):</label>
              <input
                type="number"
                value={monetaryVal}
                onChange={(e) => setMonetaryVal(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Customer Tenure (Years):</label>
              <input
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Discount Requested (%):</label>
              <input
                type="number"
                value={discountPct}
                onChange={(e) => setDiscountPct(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            onClick={() => handleRunCheck()}
            disabled={loading}
            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow transition"
          >
            {loading ? 'Evaluating Policy Rules...' : 'Run Real-Time Guardrail Inspection 🛡️'}
          </button>
        </div>
      </div>

      {/* Guardrail Output Results */}
      {evaluation && (
        <div className="space-y-4">
          {/* Status Alert Banner */}
          <div
            className={`p-5 rounded-xl border flex items-start space-x-4 ${
              evaluation.status === 'BLOCKED'
                ? 'bg-red-50 border-red-300 text-red-950'
                : evaluation.status === 'INTERVENTION_REQUIRED'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}
          >
            <span className="text-3xl">
              {evaluation.status === 'BLOCKED' ? '🚫' : evaluation.status === 'INTERVENTION_REQUIRED' ? '⚠️' : '✅'}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold">
                  {evaluation.status === 'BLOCKED'
                    ? 'GUARDRAIL INTERVENTION: Decision Blocked'
                    : evaluation.status === 'INTERVENTION_REQUIRED'
                    ? 'GUARDRAIL WARNING: Intervention Required'
                    : 'GUARDRAIL PASSED: All Policies Cleared'}
                </h4>
                <span
                  className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded ${
                    evaluation.status === 'BLOCKED'
                      ? 'bg-red-200 text-red-800'
                      : evaluation.status === 'INTERVENTION_REQUIRED'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-emerald-200 text-emerald-900'
                  }`}
                >
                  {evaluation.status}
                </span>
              </div>
              <p className="text-sm mt-1">{evaluation.recommendation}</p>
            </div>
          </div>

          {/* Violations & Counter-offers */}
          {evaluation.violations?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-5 space-y-3">
              <h4 className="text-sm font-bold text-red-900 flex items-center">
                <span className="mr-2">🚨</span> Specific Policy Violations Detected:
              </h4>
              {evaluation.violations.map((v, idx) => (
                <div key={idx} className="bg-red-50/70 border-l-4 border-red-500 p-3.5 rounded-r-lg space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-red-950 text-sm">{v.message}</span>
                    <span className="font-mono text-red-700 bg-red-100 px-2 py-0.5 rounded">{v.rule_id}</span>
                  </div>
                  <p className="text-gray-700"><strong>Evidence:</strong> {v.evidence}</p>
                  {v.counter_offer && (
                    <div className="bg-white p-2 rounded border border-emerald-300 text-emerald-900 font-semibold">
                      💡 Suggested Counter-Offer: {v.counter_offer}
                    </div>
                  )}
                  {v.escalation_path && (
                    <div className="text-purple-800 font-medium">
                      ↗️ Escalation Required: {v.escalation_path}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Dead Ends Collision Warnings */}
          {evaluation.dead_end_warnings?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-red-300 p-5 space-y-3">
              <h4 className="text-sm font-bold text-red-900 flex items-center">
                <span className="mr-2">🛑</span> Dead Ends Anti-Pattern Triggered:
              </h4>
              {evaluation.dead_end_warnings.map((de, idx) => (
                <div key={idx} className="bg-red-900 text-white p-4 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-red-800 pb-2">
                    <span className="font-bold text-base text-red-100">{de.attempted_solution}</span>
                    <span className="bg-red-950 text-red-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase border border-red-700">
                      Do NOT Retry
                    </span>
                  </div>
                  <p><strong>Root Cause:</strong> {de.root_cause_of_failure}</p>
                  <p><strong>Cost of Past Failure:</strong> {de.cost_of_failure}</p>
                  <p className="text-amber-300 font-semibold"><strong>Retry Condition:</strong> {de.retry_conditions}</p>
                </div>
              ))}
            </div>
          )}

          {/* Cross-Department Resource Conflicts */}
          {evaluation.cross_department_conflicts?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-5 space-y-3">
              <h4 className="text-sm font-bold text-blue-900 flex items-center">
                <span className="mr-2">🔗</span> Cross-Department Dependency Conflicts:
              </h4>
              {evaluation.cross_department_conflicts.map((cd, idx) => (
                <div key={idx} className="bg-blue-50 border-l-4 border-blue-600 p-3.5 rounded-r-lg text-xs space-y-1 text-blue-950">
                  <div className="font-bold text-sm text-blue-900">
                    {cd.source} ➔ {cd.target}: {cd.title}
                  </div>
                  <p><strong>Constraint:</strong> {cd.current_metric} vs {cd.commitment_requested}</p>
                  <p className="text-red-700 font-semibold">{cd.shortfall}</p>
                  <p className="text-gray-700 mt-1"><strong>Action:</strong> {cd.recommendation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Neuro-Symbolic Proof Tree */}
          {evaluation.logic_proof_tree?.length > 0 && (
            <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center">
                <span className="mr-2">🧠</span> Neuro-Symbolic Deterministic Proof Tree (Zero Hallucination)
              </h4>
              <div className="space-y-1.5 font-mono text-xs text-gray-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                {evaluation.logic_proof_tree.map((step, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-indigo-400 font-bold">[{idx + 1}]</span> {step}
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
