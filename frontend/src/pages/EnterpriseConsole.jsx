import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Container } from '../components/Container';
import { Tabs } from '../components/Tabs';
import { PriyaStoryTour } from '../components/PriyaStoryTour';
import { GuardrailsModal } from '../components/GuardrailsModal';
import { VirtualCouncilModal } from '../components/VirtualCouncilModal';
import { DeadEndsPanel } from '../components/DeadEndsPanel';
import { DreamModeDashboard } from '../components/DreamModeDashboard';
import { CrossDepartmentGraph } from '../components/CrossDepartmentGraph';
import { DecisionForm } from '../components/DecisionForm';
import { DecisionList } from '../components/DecisionList';
import { MemoryScore } from '../components/MemoryScore';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { ReportsPanel } from '../components/ReportsPanel';
import { ArrowLeft, Sparkles, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EnterpriseConsole() {
  const [activeTab, setActiveTab] = useState('story');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDecisionSuccess = () => {
    setActiveTab('list');
    setRefreshKey((k) => k + 1);
  };

  const handleSeedSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

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
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Banner indicating this is the underlying backend console */}
      <div className="bg-[#071A45] text-white px-4 py-2 text-xs flex items-center justify-between border-b border-[#14388D]">
        <div className="flex items-center space-x-2">
          <Database className="w-3.5 h-3.5 text-[#FFC000]" />
          <span className="font-bold text-[#FFC000]">Underlying Backend Console:</span>
          <span>Live SQLite / FastAPI Database &amp; Council Engine</span>
        </div>
        <Link
          to="/"
          className="text-xs font-bold text-blue-200 hover:text-white flex items-center space-x-1 underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Pitch Presentation</span>
        </Link>
      </div>

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
              <div className="space-y-8">
                <MemoryScore key={`score-${refreshKey}`} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Decision Intelligence Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveTab('guardrails')}
                        className="p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-left border border-red-200 transition text-sm font-semibold"
                      >
                        🛡️ Test Guardrail
                      </button>
                      <button
                        onClick={() => setActiveTab('council')}
                        className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-left border border-purple-200 transition text-sm font-semibold"
                      >
                        🤖 Expert Council
                      </button>
                      <button
                        onClick={() => setActiveTab('deadends')}
                        className="p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 text-left border border-orange-200 transition text-sm font-semibold"
                      >
                        🚫 Dead Ends
                      </button>
                      <button
                        onClick={() => setActiveTab('crossdept')}
                        className="p-3 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 text-left border border-cyan-200 transition text-sm font-semibold"
                      >
                        🔗 Cross-Dept Graph
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Quick Record
                    </h2>
                    <button
                      onClick={() => setActiveTab('new')}
                      className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-bold transition text-sm shadow"
                    >
                      ➕ Record New Strategic Decision
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guardrails' && <GuardrailsModal />}
            {activeTab === 'council' && <VirtualCouncilModal />}
            {activeTab === 'deadends' && <DeadEndsPanel />}
            {activeTab === 'dream' && <DreamModeDashboard />}
            {activeTab === 'crossdept' && <CrossDepartmentGraph />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'reports' && <ReportsPanel />}

            {activeTab === 'list' && (
              <DecisionList key={refreshKey} onSelectDecision={() => {}} />
            )}

            {activeTab === 'new' && (
              <DecisionForm onSuccess={handleDecisionSuccess} />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
