import React, { useState } from 'react'
import { Header } from './components/Header'
import { Container } from './components/Container'
import { Tabs } from './components/Tabs'
import { PriyaStoryTour } from './components/PriyaStoryTour'
import { GuardrailsModal } from './components/GuardrailsModal'
import { VirtualCouncilModal } from './components/VirtualCouncilModal'
import { DeadEndsPanel } from './components/DeadEndsPanel'
import { DreamModeDashboard } from './components/DreamModeDashboard'
import { CrossDepartmentGraph } from './components/CrossDepartmentGraph'
import { DecisionForm } from './components/DecisionForm'
import { DecisionList } from './components/DecisionList'
import { MemoryScore } from './components/MemoryScore'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'
import { ReportsPanel } from './components/ReportsPanel'
import './index.css'

function App() {
  const [activeTab, setActiveTab] = useState('story')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleDecisionSuccess = () => {
    setActiveTab('list')
    setRefreshKey((k) => k + 1)
  }

  const handleSeedSuccess = () => {
    setRefreshKey((k) => k + 1)
  }

  const tabs = [
    { id: 'story', label: "🌟 Priya's Journey (Demo)" },
    { id: 'dashboard', label: '📊 Dashboard & Memory' },
    { id: 'guardrails', label: '🛡️ Real-Time Guardrails' },
    { id: 'council', label: '🤖 Virtual Expert Council' },
    { id: 'deadends', label: '🚫 Dead Ends Repository' },
    { id: 'dream', label: '🌙 Dream Mode' },
    { id: 'crossdept', label: '🔗 Cross-Dept Graph' },
    { id: 'analytics', label: '📈 Analytics' },
    { id: 'reports', label: '📋 Reports' },
    { id: 'list', label: '📂 View Decisions' },
    { id: 'new', label: '➕ Record Decision' },
  ]

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header onSeedSuccess={handleSeedSuccess} />

      <Container>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/80 my-6">
          <div className="px-6 bg-slate-50 border-b border-gray-200">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'story' && (
              <PriyaStoryTour onNavigateToTab={setActiveTab} />
            )}

            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-900">
                    Organizational Memory Dashboard & Health Index
                  </h2>
                  <MemoryScore key={refreshKey} />
                </div>
              </div>
            )}

            {activeTab === 'guardrails' && (
              <GuardrailsModal />
            )}

            {activeTab === 'council' && (
              <VirtualCouncilModal />
            )}

            {activeTab === 'deadends' && (
              <DeadEndsPanel />
            )}

            {activeTab === 'dream' && (
              <DreamModeDashboard />
            )}

            {activeTab === 'crossdept' && (
              <CrossDepartmentGraph />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsDashboard />
            )}

            {activeTab === 'reports' && (
              <ReportsPanel />
            )}

            {activeTab === 'new' && (
              <DecisionForm onSuccess={handleDecisionSuccess} />
            )}

            {activeTab === 'list' && (
              <DecisionList key={refreshKey} />
            )}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
            <span className="text-xl mb-1 block">🧠</span>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wide">Decision Memory</h4>
            <p className="text-xs text-gray-600 mt-1">
              Stores entire journeys (triggers, constraints, rejected options, assumptions).
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-red-100 shadow-sm">
            <span className="text-xl mb-1 block">🚫</span>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wide">Dead Ends Repository</h4>
            <p className="text-xs text-gray-600 mt-1">
              Documents past failures and "Do NOT retry" guardrails so costly mistakes never repeat.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm">
            <span className="text-xl mb-1 block">🤖</span>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wide">Virtual Expert Council</h4>
            <p className="text-xs text-gray-600 mt-1">
              Simulates digital twins of senior leaders to debate risks and synthesize consensus.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
            <span className="text-xl mb-1 block">🌙</span>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wide">Dream Mode</h4>
            <p className="text-xs text-gray-600 mt-1">
              Nightly background consolidation that prunes stale knowledge and surfaces blind spots.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default App
