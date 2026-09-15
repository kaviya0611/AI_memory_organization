import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';

// Platform Implementation Components
import { Header } from './components/Header';
import { Container } from './components/Container';
import { Tabs } from './components/Tabs';
import { PriyaStoryTour } from './components/PriyaStoryTour';
import { GuardrailsModal } from './components/GuardrailsModal';
import { VirtualCouncilModal } from './components/VirtualCouncilModal';
import { DeadEndsPanel } from './components/DeadEndsPanel';
import { DreamModeDashboard } from './components/DreamModeDashboard';
import { CrossDepartmentGraph } from './components/CrossDepartmentGraph';
import { DecisionForm } from './components/DecisionForm';
import { DecisionList } from './components/DecisionList';
import { MemoryScore } from './components/MemoryScore';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ReportsPanel } from './components/ReportsPanel';

// Pitch Presentation Components & Pages
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PresentationControls from './components/layout/PresentationControls';
import Home from './pages/Home';
import Problem from './pages/Problem';
import Solution from './pages/Solution';
import LiveDemo from './pages/LiveDemo';
import Architecture from './pages/Architecture';
import WhyUs from './pages/WhyUs';
import FeasibilityImpact from './pages/FeasibilityImpact';
import Roadmap from './pages/Roadmap';
import Team from './pages/Team';

// Helper component to scroll to top on page change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Page transition wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

// Main Platform Implementation Workspace
function PlatformWorkspace() {
  const navigate = useNavigate();
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
    { id: 'story', label: "🌟 Priya's Journey", badge: 'Live Demo' },
    { id: 'dashboard', label: '📊 Dashboard & Memory' },
    { id: 'new', label: '➕ Record Decision', badge: 'AI Extraction' },
    { id: 'list', label: '📂 Memory Explorer', badge: 'Replays' },
    { id: 'guardrails', label: '🛡️ Real-Time Guardrails', badge: 'Policy' },
    { id: 'council', label: '🤖 Virtual Expert Council', badge: 'Multi-Agent' },
    { id: 'deadends', label: '🚫 Dead Ends Repository' },
    { id: 'crossdept', label: '🔗 Cross-Dept Graph' },
    { id: 'dream', label: '🌙 Dream Mode' },
    { id: 'analytics', label: '📈 Analytics' },
    { id: 'reports', label: '📋 Reports' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col font-sans text-[#071A45]">
      {/* Top Header with live status and Seed trigger */}
      <Header 
        onSeedSuccess={handleSeedSuccess}
        onSwitchToPitch={() => navigate('/pitch')}
        isPitchMode={false}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl shadow-soft-xl border border-slate-200/90 overflow-hidden">
          
          {/* Navigation Tabs Bar */}
          <div className="px-4 sm:px-6 bg-slate-50 border-b border-slate-200">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Tab Content Canvas */}
          <div className="p-4 sm:p-8">
            {activeTab === 'story' && (
              <PriyaStoryTour onNavigateToTab={setActiveTab} />
            )}

            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <MemoryScore key={`score-${refreshKey}`} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h2 className="text-lg font-display font-extrabold text-[#071A45]">
                        Decision Intelligence Engine
                      </h2>
                      <span className="text-xs font-bold text-[#1C52C2] bg-blue-50 px-2 py-0.5 rounded">
                        12 Modules Active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveTab('guardrails')}
                        className="p-3.5 bg-rose-50 text-rose-800 rounded-xl hover:bg-rose-100 text-left border border-rose-200 transition text-xs font-bold shadow-sm"
                      >
                        🛡️ Test Guardrail Check
                      </button>
                      <button
                        onClick={() => setActiveTab('council')}
                        className="p-3.5 bg-purple-50 text-purple-800 rounded-xl hover:bg-purple-100 text-left border border-purple-200 transition text-xs font-bold shadow-sm"
                      >
                        🤖 Multi-Agent Council
                      </button>
                      <button
                        onClick={() => setActiveTab('deadends')}
                        className="p-3.5 bg-amber-50 text-amber-800 rounded-xl hover:bg-amber-100 text-left border border-amber-200 transition text-xs font-bold shadow-sm"
                      >
                        🚫 Dead Ends Catalog
                      </button>
                      <button
                        onClick={() => setActiveTab('crossdept')}
                        className="p-3.5 bg-cyan-50 text-cyan-800 rounded-xl hover:bg-cyan-100 text-left border border-cyan-200 transition text-xs font-bold shadow-sm"
                      >
                        🔗 Cross-Dept Graph
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h2 className="text-lg font-display font-extrabold text-[#071A45]">
                          Record Strategic Decision
                        </h2>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          AI NLP Ready
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Capture full decision context: triggers, constraints, rejected alternatives, and assumptions with automatic LLM extraction from meeting notes.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('new')}
                      className="w-full py-3.5 bg-[#1C52C2] hover:bg-[#071A45] text-white rounded-xl font-bold transition text-sm shadow-md flex items-center justify-center space-x-2"
                    >
                      <span>➕ Open Decision Capture &amp; AI Studio</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <AnalyticsDashboard />
                </div>
              </div>
            )}

            {activeTab === 'new' && (
              <DecisionForm onSuccess={handleDecisionSuccess} />
            )}

            {activeTab === 'list' && (
              <DecisionList key={refreshKey} onSelectDecision={() => {}} />
            )}

            {activeTab === 'guardrails' && <GuardrailsModal />}
            {activeTab === 'council' && <VirtualCouncilModal />}
            {activeTab === 'deadends' && <DeadEndsPanel />}
            {activeTab === 'dream' && <DreamModeDashboard />}
            {activeTab === 'crossdept' && <CrossDepartmentGraph />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'reports' && <ReportsPanel />}
          </div>

        </div>
      </main>
    </div>
  );
}

// Pitch Presentation Layout Wrapper
function PitchPresentationLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FB] text-[#071A45]">
      {/* Pitch Header Navbar */}
      <Navbar onOpenConsole={() => navigate('/')} />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/problem" element={<PageTransition><Problem /></PageTransition>} />
            <Route path="/solution" element={<PageTransition><Solution /></PageTransition>} />
            <Route path="/demo" element={<PageTransition><LiveDemo /></PageTransition>} />
            <Route path="/architecture" element={<PageTransition><Architecture /></PageTransition>} />
            <Route path="/why-us" element={<PageTransition><WhyUs /></PageTransition>} />
            <Route path="/impact" element={<PageTransition><FeasibilityImpact /></PageTransition>} />
            <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} />
            <Route path="/team" element={<PageTransition><Team /></PageTransition>} />
            <Route path="*" element={<Navigate to="/pitch" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Floating Presentation Stepper for Slides */}
      <PresentationControls />

      {/* Pitch Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Main Application: Live Platform Implementation */}
        <Route path="/" element={<PlatformWorkspace />} />
        
        {/* Presentation Pitch Deck */}
        <Route path="/pitch/*" element={<PitchPresentationLayout />} />

        {/* Catch-all redirect to live platform */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
