import React, { useState } from 'react'
import { decisionAPI } from '../api'

export function VirtualCouncilModal() {
  const [question, setQuestion] = useState('Should we switch to a single supplier to save 15%?')
  const [loading, setLoading] = useState(false)
  const [simulation, setSimulation] = useState(null)

  const sampleQuestions = [
    'Should we switch to a single supplier to save 15%?',
    'Should we approve 20% volume discount for Customer Y?',
    'Should we fast-track automated fulfillment without an isolated pilot?',
  ]

  const handleSimulate = async (q = question) => {
    setLoading(true)
    try {
      const res = await decisionAPI.simulateCouncil(q)
      setSimulation(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-900 text-white p-6 rounded-xl shadow-md">
        <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
          <span>🤖 Feature 7</span>
          <span>•</span>
          <span>Virtual Expert Council & Digital Twins</span>
        </div>
        <h2 className="text-2xl font-bold">Multi-Agent Simulation (Virtual Expert Council)</h2>
        <p className="text-purple-100 text-sm mt-1 max-w-3xl">
          Creates digital twins of key decision-makers based on 100+ historical decisions. When seniors are unavailable or departed, virtual experts debate new proposals to reveal blind spots and consensus.
        </p>
      </div>

      {/* Question Input */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-bold text-gray-900 mb-2">Convene Virtual Council</h3>
        <p className="text-xs text-gray-500 mb-4">
          Pose any business dilemma to simulate perspectives from Supply Chain, Finance, and Operations:
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="e.g. Should we switch to a single supplier..."
          />
          <button
            onClick={() => handleSimulate()}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow transition"
          >
            {loading ? 'Simulating Council Debate...' : 'Run Multi-Agent Simulation 👥'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-gray-500 font-medium py-1">Try Samples:</span>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                setQuestion(sq)
                handleSimulate(sq)
              }}
              className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-2.5 py-1 rounded-md transition font-medium"
            >
              "{sq}"
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Result */}
      {simulation && (
        <div className="space-y-6">
          {/* Council Consensus Banner */}
          <div className="bg-white rounded-xl shadow-sm border border-indigo-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Council Outcome</span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                  {simulation.consensus_status}
                </h3>
              </div>
              <div className="flex items-center space-x-3 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl">
                <div>
                  <span className="text-xs text-indigo-700 font-medium block">Council Consensus</span>
                  <span className="text-2xl font-black text-indigo-900">{simulation.consensus_score}%</span>
                </div>
              </div>
            </div>

            {/* Synthesized Recommendation */}
            <div className="bg-indigo-50/80 border-l-4 border-indigo-600 p-4 rounded-r-lg mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1">
                Council Synthesis & Directive:
              </h4>
              <p className="text-sm font-semibold text-indigo-950 leading-relaxed">
                {simulation.synthesized_recommendation}
              </p>
            </div>

            {/* Key Disagreements */}
            {simulation.key_disagreements?.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs mb-4">
                <span className="font-bold text-amber-900 block mb-1">⚡ Core Divergence & Friction Points:</span>
                <ul className="list-disc list-inside space-y-1 text-amber-950">
                  {simulation.key_disagreements.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conditions to Proceed */}
            {simulation.conditions_to_proceed?.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs">
                <span className="font-bold text-emerald-900 block mb-1">✅ Mandated Conditions to Proceed:</span>
                <ul className="list-disc list-inside space-y-1 text-emerald-950">
                  {simulation.conditions_to_proceed.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Expert Digital Twin Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(simulation.simulated_experts || []).map((exp, idx) => {
              const isSupport = exp.stance === 'SUPPORTIVE'
              const isOppose = exp.stance === 'OPPOSED'
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col justify-between ${
                    isOppose
                      ? 'border-red-300'
                      : isSupport
                      ? 'border-emerald-300'
                      : 'border-amber-300'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{exp.expert_name}</h4>
                        <p className="text-[11px] text-gray-500 font-medium">{exp.role}</p>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          isOppose
                            ? 'bg-red-100 text-red-800'
                            : isSupport
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {exp.stance}
                      </span>
                    </div>

                    {/* Arguments */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                        Perspective & Stance:
                      </span>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        {(exp.arguments || []).map((arg, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="text-gray-400 font-bold">•</span>
                            <span>{arg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Risk */}
                    <div className="bg-slate-50 p-2.5 rounded border border-gray-200 text-xs mb-3">
                      <span className="font-bold text-red-700 block">Primary Risk Flag:</span>
                      <span className="text-gray-700">{exp.key_risk}</span>
                    </div>
                  </div>

                  {/* Mandated Condition */}
                  <div className="pt-2 border-t border-gray-100 text-xs text-indigo-700 font-medium">
                    <strong>Condition:</strong> {exp.recommended_condition}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
