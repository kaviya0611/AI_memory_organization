import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Brain, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Layers
} from 'lucide-react';

export default function WhyUs() {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const competitors = [
    {
      name: 'Microsoft 365 Copilot',
      what: 'Summarizes meetings, chats, and office documents',
      limitation: "Doesn't capture the reason behind a decision or learn from its outcome.",
      reasoning: false,
      outcomes: false,
      orgMemory: false,
      experienceRecs: false,
      graph: false
    },
    {
      name: 'Notion AI',
      what: 'Organizes and summarizes team notes & wiki docs',
      limitation: "Doesn't connect related decisions or build organizational memory.",
      reasoning: false,
      outcomes: false,
      orgMemory: false,
      experienceRecs: false,
      graph: false
    },
    {
      name: 'Atlassian Confluence',
      what: 'Stores organizational documentation & knowledge bases',
      limitation: "Manual knowledge management, passive static files, no AI reasoning.",
      reasoning: false,
      outcomes: false,
      orgMemory: false,
      experienceRecs: false,
      graph: false
    },
    {
      name: 'Jira',
      what: 'Tracks sprint tickets, bugs, projects, and execution tasks',
      limitation: "Doesn't capture the strategic reasoning behind a decision or long-term impacts.",
      reasoning: false,
      outcomes: false,
      orgMemory: false,
      experienceRecs: false,
      graph: false
    },
    {
      name: 'Google NotebookLM',
      what: 'Answers user questions from manually uploaded source documents',
      limitation: "Doesn't continuously learn or build a self-updating knowledge graph.",
      reasoning: false,
      outcomes: false,
      orgMemory: false,
      experienceRecs: false,
      graph: false
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F4F6FB] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1C52C2]/10 text-[#1C52C2] text-xs font-bold uppercase tracking-wider border border-[#1C52C2]/20"
          >
            <Award className="w-3.5 h-3.5 text-[#FFC000]" />
            <span>Competitive Matrix &amp; Differentiation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-[#071A45] tracking-tight leading-tight"
          >
            Why Existing Enterprise Tools Fall Short
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-normal"
          >
            General productivity tools search text. Our platform remembers strategic rationale, tracks outcomes, and provides experience-driven guidance.
          </motion.p>
        </div>

        {/* One-Line Differentiator Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#071A45] via-[#0E2969] to-[#071A45] text-white p-7 sm:p-9 rounded-3xl shadow-soft-xl border border-[#14388D] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#FFC000]/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FFC000] block">
              The Unfair Advantage
            </span>
            <blockquote className="text-xl sm:text-2xl font-display font-bold leading-relaxed text-slate-100">
              "Unlike existing options, our solution doesn't just store documents — it remembers <span className="text-[#FFC000] font-black">why decisions were made</span>, tracks <span className="text-[#FFC000] font-black">what happened</span>, and recommends smarter choices based on our own organizational experience."
            </blockquote>
          </div>
        </motion.div>

        {/* Matrix View Toggle & Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-xl font-display font-black text-[#071A45]">
                Capability Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Direct side-by-side evaluation against market incumbents
              </p>
            </div>
            
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-white text-[#071A45] shadow-sm' : 'text-slate-600'
                }`}
              >
                Comparison Matrix
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  viewMode === 'cards' ? 'bg-white text-[#071A45] shadow-sm' : 'text-slate-600'
                }`}
              >
                Limitation Deep-Dive
              </button>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-3 text-center">Captures Reasoning</th>
                    <th className="py-3 px-3 text-center">Tracks Outcomes</th>
                    <th className="py-3 px-3 text-center">Builds Org Memory</th>
                    <th className="py-3 px-3 text-center">Experience Recs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Our Platform Highlighted Row */}
                  <tr className="bg-blue-50/80 font-bold border-2 border-[#1C52C2]">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-[#1C52C2]" />
                        <span className="font-display font-extrabold text-[#071A45] text-base">
                          Our Platform (DecisionBrain)
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#FFC000] text-[#071A45] font-extrabold uppercase">
                          Winner
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-normal mt-0.5">
                        Autonomous decision intelligence brain
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </td>
                  </tr>

                  {/* Competitor Rows */}
                  {competitors.map((item) => (
                    <tr key={item.name} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        <div>{item.name}</div>
                        <div className="text-xs text-slate-500 font-normal">{item.what}</div>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <div className="w-6 h-6 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <div className="w-6 h-6 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <div className="w-6 h-6 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <div className="w-6 h-6 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competitors.map((c) => (
                <div key={c.name} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-base text-[#071A45]">{c.name}</h4>
                    <span className="text-[10px] font-bold text-slate-500 uppercase bg-white px-2 py-0.5 rounded border border-slate-200">
                      Standard Tool
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">What it does:</span>
                    <p className="text-xs text-slate-700 font-medium">{c.what}</p>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800">
                    <span className="font-bold block mb-0.5 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Key Limitation:</span>
                    </span>
                    <p>{c.limitation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
