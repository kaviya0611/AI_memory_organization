import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Brain, 
  Network, 
  ArrowRight, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  Share2, 
  Filter, 
  Search, 
  Info,
  Check
} from 'lucide-react';

export default function Solution() {
  // Interactive graph node selection state
  const [selectedNode, setSelectedNode] = useState('decision_2024');

  const nodes = {
    decision_2024: {
      id: 'decision_2024',
      title: 'Decision #104: Switch Supplier A → B',
      type: 'Decision Node',
      year: '2024',
      dept: 'Procurement & Logistics',
      reason: 'Achieve 3% unit cost reduction on raw materials',
      stakeholders: 'Priya Sharma (VP Ops), Marcus Vance (Procurement)',
      risks: 'Lead time variability, cross-border tariff exposure',
      outcome: 'Cost reduced 3%, delivery delays increased +15%, complaints surged',
      lesson: 'Never switch primary supplier without SLA buffer and penalty clauses'
    },
    project_supply: {
      id: 'project_supply',
      title: 'Project: Global Supply Optimization',
      type: 'Project Entity',
      dept: 'Operations',
      reason: 'Streamline procurement across APAC & EMEA vendors',
      outcome: 'Ongoing monitoring',
      lesson: 'Unified multi-vendor sourcing framework established'
    },
    outcome_delay: {
      id: 'outcome_delay',
      title: 'Outcome: +15% Lead Time Failure',
      type: 'Outcome / Dead End',
      dept: 'Quality & Fulfillment',
      reason: 'Supplier B factory capacity bottleneck',
      outcome: '3 major shipping milestones missed',
      lesson: 'Logged in Dead Ends Repository (Do-Not-Repeat Flag active)'
    },
    dept_procure: {
      id: 'dept_procure',
      title: 'Department: Global Procurement',
      type: 'Department Silo Bridge',
      dept: 'Procurement',
      reason: 'Cross-functional dependency with Customer Success',
      outcome: 'Synced in real-time memory'
    },
    guardrail_rule: {
      id: 'guardrail_rule',
      title: 'Guardrail: Supplier Switch Protocol',
      type: 'Proactive Rule',
      dept: 'Enterprise Risk',
      reason: 'Prevents unilateral vendor change without 12-month delivery audit',
      outcome: 'Active in production memory'
    }
  };

  const activeData = nodes[selectedNode] || nodes.decision_2024;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F4F6FB] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1C52C2]/10 text-[#1C52C2] text-xs font-bold uppercase tracking-wider border border-[#1C52C2]/20"
          >
            <Brain className="w-3.5 h-3.5 text-[#1C52C2]" />
            <span>The Breakthrough Concept</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-[#071A45] tracking-tight leading-tight"
          >
            A Living Decision Knowledge Graph
          </motion.h1>

          {/* One-Line Pitch Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#071A45] text-white p-6 sm:p-7 rounded-2xl shadow-soft-xl border border-[#14388D] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFC000]/15 rounded-full blur-3xl" />
            <p className="text-xl sm:text-2xl font-display font-bold text-center tracking-wide leading-relaxed">
              "Instead of storing <span className="text-blue-300">documents</span>, we store <span className="text-[#FFC000] underline decoration-wavy decoration-[#FFC000]/50 underline-offset-8">knowledge</span>. <br className="hidden sm:inline" />
              Instead of searching <span className="text-blue-300">files</span>, we search <span className="text-[#FFC000] underline decoration-wavy decoration-[#FFC000]/50 underline-offset-8">experience</span>."
            </p>
          </motion.div>
        </div>

        {/* 6 Extraction Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
          {[
            { label: 'Decision', desc: 'What was approved', color: 'border-blue-300 bg-blue-50/70 text-blue-900' },
            { label: 'Reason', desc: 'Why it was made', color: 'border-purple-300 bg-purple-50/70 text-purple-900' },
            { label: 'People', desc: 'Who decided', color: 'border-emerald-300 bg-emerald-50/70 text-emerald-900' },
            { label: 'Risks', desc: 'What was flagged', color: 'border-amber-300 bg-amber-50/70 text-amber-900' },
            { label: 'Outcome', desc: 'What happened', color: 'border-rose-300 bg-rose-50/70 text-rose-900' },
            { label: 'Lessons', desc: 'What we learned', color: 'border-cyan-300 bg-cyan-50/70 text-cyan-900' },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`p-4 rounded-xl border ${item.color} shadow-sm text-center`}
            >
              <div className="text-base font-display font-extrabold">{item.label}</div>
              <div className="text-[11px] font-medium text-slate-600 mt-1">{item.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Knowledge Graph & Node Inspector */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-soft-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C52C2] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Interactive Graph Model
              </span>
              <h3 className="text-2xl font-display font-black text-[#071A45] mt-1.5">
                Click Nodes to Explore Connected Organizational Reasoning
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Click any node in the interactive diagram below:
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* SVG Visual Graph (Left 7 Cols) */}
            <div className="lg:col-span-7 bg-[#071A45] rounded-2xl p-6 relative h-[380px] flex items-center justify-center overflow-hidden border border-[#14388D] shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 500 340">
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                  </filter>
                </defs>

                {/* Connecting Edges */}
                <line x1="250" y1="170" x2="110" y2="90" stroke="#1C52C2" strokeWidth="2.5" strokeDasharray="5,4" />
                <line x1="250" y1="170" x2="390" y2="80" stroke="#FFC000" strokeWidth="2.5" />
                <line x1="250" y1="170" x2="110" y2="250" stroke="#1C52C2" strokeWidth="2" />
                <line x1="250" y1="170" x2="390" y2="260" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="4,4" />
                <line x1="390" y1="80" x2="390" y2="260" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2,2" />

                {/* Center Main Decision Node */}
                <g 
                  onClick={() => setSelectedNode('decision_2024')}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <circle 
                    cx="250" cy="170" r="42" 
                    fill={selectedNode === 'decision_2024' ? '#FFC000' : '#1C52C2'} 
                    filter="url(#glow)"
                    className="transition-colors duration-300"
                  />
                  <circle cx="250" cy="170" r="46" fill="none" stroke="#FFC000" strokeWidth="2" strokeDasharray="6,4" className="animate-spin-slow" />
                  <text x="250" y="165" fill={selectedNode === 'decision_2024' ? '#071A45' : '#FFFFFF'} fontSize="11" fontWeight="bold" textAnchor="middle">
                    Supplier Switch
                  </text>
                  <text x="250" y="180" fill={selectedNode === 'decision_2024' ? '#071A45' : '#94A3B8'} fontSize="9" textAnchor="middle">
                    (2024 Decision)
                  </text>
                </g>

                {/* Top-Left: Project Node */}
                <g 
                  onClick={() => setSelectedNode('project_supply')}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <circle 
                    cx="110" cy="90" r="30" 
                    fill={selectedNode === 'project_supply' ? '#FFC000' : '#0E2969'} 
                    stroke="#1C52C2" strokeWidth="2"
                  />
                  <text x="110" y="88" fill={selectedNode === 'project_supply' ? '#071A45' : '#FFFFFF'} fontSize="9" fontWeight="bold" textAnchor="middle">
                    Global Supply
                  </text>
                  <text x="110" y="100" fill={selectedNode === 'project_supply' ? '#071A45' : '#94A3B8'} fontSize="7" textAnchor="middle">
                    Project
                  </text>
                </g>

                {/* Top-Right: Guardrail Rule Node */}
                <g 
                  onClick={() => setSelectedNode('guardrail_rule')}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <circle 
                    cx="390" cy="80" r="32" 
                    fill={selectedNode === 'guardrail_rule' ? '#FFC000' : '#0E2969'} 
                    stroke="#FFC000" strokeWidth="2"
                  />
                  <text x="390" y="78" fill={selectedNode === 'guardrail_rule' ? '#071A45' : '#FFFFFF'} fontSize="9" fontWeight="bold" textAnchor="middle">
                    Guardrail
                  </text>
                  <text x="390" y="90" fill={selectedNode === 'guardrail_rule' ? '#071A45' : '#94A3B8'} fontSize="7" textAnchor="middle">
                    Rule
                  </text>
                </g>

                {/* Bottom-Left: Dept Node */}
                <g 
                  onClick={() => setSelectedNode('dept_procure')}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <circle 
                    cx="110" cy="250" r="30" 
                    fill={selectedNode === 'dept_procure' ? '#FFC000' : '#0E2969'} 
                    stroke="#1C52C2" strokeWidth="2"
                  />
                  <text x="110" y="248" fill={selectedNode === 'dept_procure' ? '#071A45' : '#FFFFFF'} fontSize="9" fontWeight="bold" textAnchor="middle">
                    Procurement
                  </text>
                  <text x="110" y="260" fill={selectedNode === 'dept_procure' ? '#071A45' : '#94A3B8'} fontSize="7" textAnchor="middle">
                    Dept
                  </text>
                </g>

                {/* Bottom-Right: Outcome Failure / Dead End */}
                <g 
                  onClick={() => setSelectedNode('outcome_delay')}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <circle 
                    cx="390" cy="260" r="34" 
                    fill={selectedNode === 'outcome_delay' ? '#FFC000' : '#7F1D1D'} 
                    stroke="#EF4444" strokeWidth="2"
                  />
                  <text x="390" y="257" fill={selectedNode === 'outcome_delay' ? '#071A45' : '#FFFFFF'} fontSize="9" fontWeight="bold" textAnchor="middle">
                    Dead End
                  </text>
                  <text x="390" y="269" fill={selectedNode === 'outcome_delay' ? '#071A45' : '#FECACA'} fontSize="7" textAnchor="middle">
                    +15% Delays
                  </text>
                </g>
              </svg>
            </div>

            {/* Node Inspector Panel (Right 5 Cols) */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C52C2] bg-blue-100 px-2 py-0.5 rounded">
                    {activeData.type}
                  </span>
                  <h4 className="text-lg font-display font-extrabold text-[#071A45] mt-1">
                    {activeData.title}
                  </h4>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Primary Reason &amp; Objective:</span>
                  <p className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800">{activeData.reason}</p>
                </div>

                {activeData.stakeholders && (
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">People Involved:</span>
                    <p className="text-slate-600">{activeData.stakeholders}</p>
                  </div>
                )}

                {activeData.outcome && (
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Measured Outcome:</span>
                    <p className="bg-rose-50 text-rose-900 p-2.5 rounded-lg border border-rose-200 font-medium">
                      {activeData.outcome}
                    </p>
                  </div>
                )}

                {activeData.lesson && (
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Institutional Lesson:</span>
                    <p className="bg-amber-50 text-amber-900 p-2.5 rounded-lg border border-amber-200 font-medium">
                      {activeData.lesson}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Ready to see this in action live?
            </span>
            <Link
              to="/demo"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#1C52C2] hover:bg-[#071A45] text-white font-bold text-sm shadow-md transition-all"
            >
              <span>Test The Live Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
