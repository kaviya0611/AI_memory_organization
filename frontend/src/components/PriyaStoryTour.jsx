import React, { useState } from 'react'
import { decisionAPI } from '../api'

export function PriyaStoryTour({ onNavigateToTab }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [stepData, setStepData] = useState(null)
  const [queryText, setQueryText] = useState('Why not choose Supplier A instead?')
  const [nlResponse, setNlResponse] = useState(null)

  const steps = [
    {
      step: 1,
      title: 'Priya Joins as New Procurement Manager',
      feature: 'Organizational Memory Dashboard',
      description: 'Priya opens the platform on Day 1. Instead of combing through scattered email chains and old spreadsheets, pending vendor evaluations are already synthesized with collective company memory.',
      badge: 'Step 1 of 10'
    },
    {
      step: 2,
      title: 'AI Smart Recommendation',
      feature: 'Recommendation Engine & Explanation-First',
      description: 'The platform analyzes Q3 monsoon component requirements and recommends Supplier B with 92% calibrated confidence, backed by 47 historical procurement precedents.',
      badge: 'Step 2 of 10'
    },
    {
      step: 3,
      title: 'Natural Language Query',
      feature: 'Neuro-Symbolic Conversational Query',
      description: 'Priya asks in plain English: "Why not Supplier A? They offered a lower price bid."',
      badge: 'Step 3 of 10'
    },
    {
      step: 4,
      title: 'Decision Memory & Dead Ends Synthesis',
      feature: 'Decision Memory + Dead Ends Repository',
      description: 'System surfaces full context: Supplier A suffered 3 delivery halts during monsoon (INC-2020-09, INC-2021-08, INC-2023-07), and Supplier C is a recorded Dead End (40% defect rate in 2021, ₹25 Lakh failure cost).',
      badge: 'Step 4 of 10'
    },
    {
      step: 5,
      title: 'Post-Mortem Decision Replay',
      feature: 'Decision Replay (Time-Travel Post-Mortem)',
      description: 'Priya clicks "Show Replay" to inspect past failures: Day 0 assumptions vs reality timeline, revealing why previous managers suffered downtime when skipping validation.',
      badge: 'Step 5 of 10'
    },
    {
      step: 6,
      title: 'Temporal Validity Warning',
      feature: 'Temporal Validity & Knowledge Decay',
      description: 'System warns Priya: "Supplier A was chosen 50 times before 2021. However, this knowledge expired 2 years ago due to quality disruptions since 2022."',
      badge: 'Step 6 of 10'
    },
    {
      step: 7,
      title: 'Formally Capturing Decision Memory',
      feature: 'Decision Capture & Full Context Preservation',
      description: 'Priya approves Supplier B. The system records not just the outcome, but the triggers, constraints, rejected alternatives, assumptions, and evidence links.',
      badge: 'Step 7 of 10'
    },
    {
      step: 8,
      title: 'Nightly Self-Improvement (Dream Mode)',
      feature: 'Dream Mode (Memory Consolidation)',
      description: 'Overnight, Dream Mode reviews recent actions: consolidates Supplier B into an organizational pattern, prunes expired guidelines, and flags gaps without human effort.',
      badge: 'Step 8 of 10'
    },
    {
      step: 9,
      title: 'Adaptive Learning from Real Outcomes',
      feature: 'Adaptive Learning (Feedback Reinforcement)',
      description: 'Six months later, delivery outcome is logged: 100% on-time, zero defects. Supplier B pattern confidence automatically boosts from 82% to 94%!',
      badge: 'Step 9 of 10'
    },
    {
      step: 10,
      title: 'Continuous Institutional Knowledge Preservation',
      feature: 'Collective Organizational Judgment',
      description: 'When Priya or her successor faces a similar supplier decision years later, the organization never forgets. Decision quality improves forever.',
      badge: 'Step 10 of 10'
    },
  ]

  const handleRunStepAction = async (stepNumber) => {
    setLoading(true)
    try {
      if (stepNumber === 2) {
        const res = await decisionAPI.getRecommendations('Approve Supplier for Q3 Critical Components')
        setStepData(res.data)
      } else if (stepNumber === 3 || stepNumber === 4) {
        const res = await decisionAPI.checkGuardrails({
          decision_draft: 'Should we choose Supplier A instead of Supplier B for Q3 Monsoon components?',
          proposed_options: ['Supplier A', 'Supplier C'],
          monetary_value: 45.0
        })
        setNlResponse(res.data)
      } else if (stepNumber === 5) {
        const res = await decisionAPI.getDecisionReplay('phoenix')
        setStepData(res.data)
      } else if (stepNumber === 8) {
        const res = await decisionAPI.runDreamMode()
        setStepData(res.data)
      } else if (stepNumber === 9) {
        // Record simulated outcome
        const listRes = await decisionAPI.listDecisions()
        const target = listRes.data.find((d) => d.title.toLowerCase().includes('supplier b')) || listRes.data[0]
        if (target) {
          const res = await decisionAPI.recordOutcome(target.id, 'Delivered 100% on time with zero defects during monsoon season.')
          setStepData(res.data)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const active = steps[currentStep - 1]

  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-900/60 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 border border-indigo-500/40 mb-2">
              <span>🎯 Live Interactive Scenario</span>
              <span>•</span>
              <span>10-Step Story</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Priya's Journey: From New Manager to Preserved Institutional Brain
            </h2>
            <p className="text-indigo-100 text-sm mt-1 max-w-3xl">
              Experience how all 12 platform capabilities orchestrate seamlessly in a realistic procurement decision.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setCurrentStep(1)
                setStepData(null)
                setNlResponse(null)
              }}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition"
            >
              Restart Tour ↺
            </button>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center space-x-1.5 mt-6 overflow-x-auto pb-2 scrollbar-thin">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStep(s.step)
                setStepData(null)
                handleRunStepAction(s.step)
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                currentStep === s.step
                  ? 'bg-white text-indigo-900 shadow-md font-bold'
                  : currentStep > s.step
                  ? 'bg-indigo-900/60 text-indigo-200 hover:bg-indigo-900'
                  : 'bg-indigo-950/40 text-indigo-400 hover:bg-indigo-900/40'
              }`}
            >
              {s.step}. {s.title.split(':')[0].substring(0, 18)}...
            </button>
          ))}
        </div>
      </div>

      {/* Main Step Content */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Context & Narrative */}
          <div className="lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-6 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                {active.badge}
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-2">{active.title}</h3>
              <p className="text-xs font-semibold text-purple-700 mt-0.5">
                Feature: {active.feature}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
              {active.description}
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleRunStepAction(currentStep)}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm shadow transition flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Processing...' : `Execute Step ${currentStep} in Brain ⚡`}</span>
              </button>

              <div className="flex space-x-2 pt-2">
                <button
                  disabled={currentStep === 1}
                  onClick={() => {
                    setCurrentStep((s) => Math.max(1, s - 1))
                    setStepData(null)
                  }}
                  className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  ← Previous
                </button>
                <button
                  disabled={currentStep === 10}
                  onClick={() => {
                    const next = Math.min(10, currentStep + 1)
                    setCurrentStep(next)
                    setStepData(null)
                    handleRunStepAction(next)
                  }}
                  className="flex-1 py-2 px-3 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-medium disabled:opacity-40"
                >
                  Next Step →
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Simulated Response & UI */}
          <div className="lg:col-span-2 space-y-4">
            {/* Step 1: Priya joins as Procurement Manager */}
            {currentStep === 1 && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900">Procurement Operations Overview</h4>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Active Session: Priya Sharma
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-white p-3.5 rounded-lg border border-indigo-100 shadow-sm">
                    <span className="text-xs text-gray-500">Pending Decision</span>
                    <p className="font-bold text-gray-900 text-sm mt-1">Q3 Component Sourcing</p>
                    <span className="text-[11px] text-amber-600 font-medium">Monsoon Window Approaching</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-indigo-100 shadow-sm">
                    <span className="text-xs text-gray-500">Candidate Options</span>
                    <p className="font-bold text-gray-900 text-sm mt-1">Supplier A, B, C</p>
                    <span className="text-[11px] text-blue-600 font-medium">₹48L - ₹60L Budget</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-indigo-100 shadow-sm">
                    <span className="text-xs text-gray-500">Institutional Memory</span>
                    <p className="font-bold text-indigo-700 text-sm mt-1">47 Past Decisions</p>
                    <span className="text-[11px] text-emerald-600 font-medium">Ready for recall</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  💡 Priya doesn't need to ask senior colleagues who may have left the company. The platform actively recalls prior contract journeys, quality logs, and anti-patterns.
                </p>
              </div>
            )}

            {/* Step 2: System recommends Supplier B */}
            {currentStep === 2 && (
              <div className="bg-white border border-indigo-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🤖</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">Smart AI Recommendation</h4>
                      <p className="text-xs text-gray-500">Based on multi-year vendor performance data</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                    92% Confidence
                  </span>
                </div>
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg mb-4">
                  <p className="text-sm font-semibold text-emerald-900">
                    Recommended: Award Q3 Contract to Supplier B
                  </p>
                  <p className="text-xs text-emerald-800 mt-1">
                    "Supplier B provides 98.4% on-time monsoon SLA and operates dual regional hubs. Although priced at a 12% premium over Supplier A, avoiding plant downtime (₹35L/day) heavily justifies the investment."
                  </p>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• <strong>Attribution:</strong> Ratified by Sarah Chen (Supply Chain) and 12 departmental managers.</p>
                  <p>• <strong>Counterfactual:</strong> Would switch to Supplier A only if delivery deadline is moved past September.</p>
                </div>
              </div>
            )}

            {/* Step 3 & 4: NL Query: Why not Supplier A? */}
            {(currentStep === 3 || currentStep === 4) && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Priya asks the platform in Natural Language:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleRunStepAction(3)}
                      className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Ask AI 💬
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm mb-2">
                    <span>⚠️</span>
                    <span>System Neuro-Symbolic & Memory Explanation:</span>
                  </div>
                  <div className="space-y-3 text-xs text-amber-950 leading-relaxed">
                    <div className="bg-white/80 p-3 rounded-lg border border-amber-200">
                      <strong className="text-red-700 block mb-1">1. Supplier A Risk (Monsoon Vulnerability):</strong>
                      Supplier A experienced 3 severe delivery failures in the past 5 years during monsoon months (INC-2020-09, INC-2021-08, INC-2023-07). Lower initial price was negated by ₹1.2 Cr in delayed production costs.
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-200">
                      <strong className="text-red-700 block mb-1">2. Supplier C Warning (Organizational Dead End):</strong>
                      Supplier C is catalogued in the Dead Ends Repository. Tried in 2021; failed with a 40% defect rate costing ₹25 Lakhs. <strong>Guardrail Status: DO NOT RETRY unless ISO 9001 certified.</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Post-Mortem Decision Replay */}
            {currentStep === 5 && (
              <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">⏪</span>
                    <h4 className="font-bold text-sm">Post-Mortem Decision Replay: Project Phoenix & Supplier C</h4>
                  </div>
                  <span className="bg-red-950 text-red-400 border border-red-800 text-[11px] font-bold px-2 py-0.5 rounded">
                    Divergence: 100% (Failure)
                  </span>
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="p-2.5 bg-slate-800/80 rounded border-l-2 border-blue-400">
                    <span className="text-blue-300 font-bold">DAY 0:</span> Fast-tracked unvetted supplier to beat Q4 competitor deadline. Assumed vendor could scale without custom firmware.
                  </div>
                  <div className="p-2.5 bg-slate-800/80 rounded border-l-2 border-amber-400">
                    <span className="text-amber-300 font-bold">DAY 30:</span> Uncalibrated tooling resulted in 40% defect rate. Hardware controllers stalled.
                  </div>
                  <div className="p-2.5 bg-slate-800/80 rounded border-l-2 border-red-500">
                    <span className="text-red-300 font-bold">DAY 90:</span> Total failure. ₹25L direct write-off + 3 weeks manufacturing halt.
                  </div>
                </div>
                <div className="mt-4 p-3 bg-indigo-950/70 border border-indigo-700/50 rounded text-xs text-indigo-200">
                  <strong>💡 Extracted Institutional Lesson:</strong> Never bypass 60-day isolated pilot testing or choose uncertified vendors solely for per-unit cost discounts.
                </div>
              </div>
            )}

            {/* Step 6: Temporal Validity Warning */}
            {currentStep === 6 && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <h4 className="text-base font-bold text-yellow-950">Temporal Knowledge Expiration</h4>
                    <p className="text-xs text-yellow-800">Knowledge has a shelf-life — prevent outdated data from misleading employees</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                    <span className="text-gray-500">Historical Record:</span>
                    <span className="font-mono text-gray-700 font-semibold">DEC-2018-0098 (Supplier A Approval)</span>
                  </div>
                  <div className="text-xs text-gray-700 leading-relaxed">
                    <p className="font-semibold text-gray-900 mb-1">Traditional Wiki / Chatbot would say:</p>
                    <p className="italic text-gray-600 bg-gray-50 p-2 rounded mb-2">
                      "Yes, choose Supplier A! They were chosen 50 times historically with positive feedback."
                    </p>
                    <p className="font-semibold text-red-700 mb-1">Our Decision Brain warns Priya:</p>
                    <div className="bg-red-50 border-l-4 border-red-500 p-2.5 rounded text-red-900 text-xs">
                      ⚠️ <strong>Knowledge Expired:</strong> Supplier A was reliable until 2021. Since 2022, they have suffered multiple quality disruptions. This knowledge expired 2 years ago and has decayed by 65%.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Priya Approves Supplier B */}
            {currentStep === 7 && (
              <div className="bg-white border border-emerald-300 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold mb-3">
                  <span className="text-xl">✅</span>
                  <h4 className="text-base">Decision Formalization & Memory Capture</h4>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg text-xs space-y-2 text-emerald-950">
                  <p><strong>Approved:</strong> Supplier B for Q3 Critical Components</p>
                  <p><strong>Decision Maker:</strong> Priya Sharma (Procurement Manager)</p>
                  <p><strong>Full Reasoning Preserved:</strong> Chosen due to 98.4% monsoon SLA, dual regional hubs, and rejection of Supplier A (monsoon issues) & Supplier C (known dead end).</p>
                  <p><strong>Constraints Documented:</strong> Budget cap ₹60L, deadline July 15.</p>
                  <p><strong>Governance Gate:</strong> Tier-3 Human Confirmed (Medium Stake - ₹48L).</p>
                </div>
              </div>
            )}

            {/* Step 8: Dream Mode overnight */}
            {currentStep === 8 && (
              <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-purple-800 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🌙</span>
                    <h4 className="font-bold text-sm">Dream Mode: Overnight Memory Consolidation</h4>
                  </div>
                  <span className="bg-purple-800/80 text-purple-200 text-xs px-2.5 py-0.5 rounded-full">
                    Auto-Run: 02:00 AM
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="bg-purple-950/60 border border-purple-800 p-2.5 rounded">
                    <span className="text-purple-300">✅ Consolidated:</span>
                    <p className="font-bold text-white mt-0.5">Supplier B Q3 Heuristic Pattern</p>
                  </div>
                  <div className="bg-purple-950/60 border border-purple-800 p-2.5 rounded">
                    <span className="text-amber-300">⚠️ Contradiction:</span>
                    <p className="font-bold text-white mt-0.5">DEC-2024-001 vs DEC-2024-045</p>
                  </div>
                  <div className="bg-purple-950/60 border border-purple-800 p-2.5 rounded">
                    <span className="text-red-300">🗑️ Pruned:</span>
                    <p className="font-bold text-white mt-0.5">2018 Supplier A Stale Knowledge</p>
                  </div>
                  <div className="bg-purple-950/60 border border-purple-800 p-2.5 rounded">
                    <span className="text-blue-300">💡 Strategic Insight:</span>
                    <p className="font-bold text-white mt-0.5">Friday decisions have 20% lower success</p>
                  </div>
                </div>
                <p className="text-xs text-purple-200">
                  No manual curation needed. The organizational brain cleans and improves itself while the company sleeps.
                </p>
              </div>
            )}

            {/* Step 9: Adaptive Learning (Outcome Tracking) */}
            {currentStep === 9 && (
              <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-2 text-blue-900 font-bold mb-3">
                  <span className="text-xl">📈</span>
                  <h4 className="text-base">Adaptive Learning Loop: 6 Months Later</h4>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-xs text-blue-950 space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Logged Outcome:</span>
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">100% On-Time</span>
                  </div>
                  <p className="text-gray-700">
                    Supplier B delivered all components ahead of schedule during peak monsoon with 0% defect rate.
                  </p>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 border rounded-lg">
                  <div>
                    <span className="text-xs text-gray-500">Pattern Confidence Shift:</span>
                    <div className="font-bold text-gray-900 text-sm">
                      Supplier B High-Reliability Pattern
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="line-through text-gray-400 text-xs">82%</span>
                    <span className="text-emerald-600 font-extrabold text-base ml-2">94% Confidence</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 10: Permanent Institutional Knowledge */}
            {currentStep === 10 && (
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🏛️</span>
                  <h4 className="text-lg font-bold">Collective Judgment Made Permanent</h4>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed mb-4">
                  Two years later, Priya moves to a new role. A fresh college graduate or new manager takes over procurement.
                  When they search for monsoon suppliers, the platform immediately provides Sarah's historical context, Priya's validated outcome, and the active Dead Ends warnings.
                </p>
                <div className="bg-white/10 p-3 rounded-lg border border-white/20 text-xs font-semibold">
                  Result: Zero repeated mistakes. Institutional memory preserved forever.
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-500/50 flex gap-2">
                  <button
                    onClick={() => onNavigateToTab && onNavigateToTab('guardrails')}
                    className="bg-white text-emerald-900 font-bold px-4 py-2 rounded-lg text-xs shadow hover:bg-emerald-50"
                  >
                    Try Real-Time Guardrails →
                  </button>
                  <button
                    onClick={() => onNavigateToTab && onNavigateToTab('council')}
                    className="bg-emerald-800 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-emerald-900"
                  >
                    Test Virtual Expert Council →
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Output Inspector */}
            {stepData && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs">
                <div className="font-bold text-gray-700 mb-1">Live Backend Response Payload:</div>
                <pre className="text-[11px] text-gray-600 overflow-x-auto max-h-32">
                  {JSON.stringify(stepData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
