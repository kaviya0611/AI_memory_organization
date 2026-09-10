import React, { useState } from 'react'
import { Header } from './components/Header'
import { Container } from './components/Container'
import { Tabs } from './components/Tabs'
import { DecisionForm } from './components/DecisionForm'
import { DecisionList } from './components/DecisionList'
import { MemoryScore } from './components/MemoryScore'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'
import { ReportsPanel } from './components/ReportsPanel'
import './index.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleDecisionSuccess = () => {
    setActiveTab('list')
    setRefreshKey((k) => k + 1)
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'analytics', label: '📈 Analytics' },
    { id: 'reports', label: '📋 Reports' },
    { id: 'new', label: '+ New Decision' },
    { id: 'list', label: 'View Decisions' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Container>
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="px-6 py-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">
                    Organizational Memory Dashboard
                  </h2>
                  <MemoryScore />
                </div>
              </div>
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

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Capture</h3>
            <p className="text-sm text-blue-700">
              Record decisions from emails, meetings, and reports
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">🤖 Extract</h3>
            <p className="text-sm text-green-700">
              AI automatically extracts key information and gets recommendations
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">📚 Learn</h3>
            <p className="text-sm text-purple-700">
              Track outcomes and find similar past decisions to avoid mistakes
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default App
