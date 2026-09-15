import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  Cpu, 
  Users, 
  CheckCircle2, 
  Layers, 
  Award, 
  Globe2,
  Lock,
  Calendar
} from 'lucide-react';

export default function FeasibilityImpact() {
  const risksAndMitigations = [
    {
      risk: "Decisions are often implicit or ambiguous in natural conversation.",
      mitigation: "LLM-based extraction with a human-in-the-loop review step for low-confidence cases.",
      icon: Cpu,
      color: "border-blue-200 bg-blue-50/60"
    },
    {
      risk: "Employees may hesitate to have decisions recorded and analyzed.",
      mitigation: "Transparency, role-based access control, and opt-in review before permanent storage.",
      icon: Lock,
      color: "border-purple-200 bg-purple-50/60"
    },
    {
      risk: "Outcome tracking needs a long time horizon to manifest.",
      mitigation: "Start with short-cycle decisions (weeks, not years) to demonstrate immediate value.",
      icon: Calendar,
      color: "border-amber-200 bg-amber-50/60"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F4F6FB] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-500/20"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Viability &amp; Social Value</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-[#071A45] tracking-tight leading-tight"
          >
            Feasibility, Risk Management &amp; Impact
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-normal"
          >
            A pragmatic execution roadmap backed by verifiable enterprise metrics and United Nations Sustainable Development Goals.
          </motion.p>
        </div>

        {/* Big Impact Numbers & SDG 9 Badge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-soft-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#1C52C2] flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-display font-black text-[#071A45]">
                ~3–4 hrs
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#1C52C2] mt-1">
                Saved / Employee / Week
              </div>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Eliminates hours spent hunting through old emails, archived Slack threads, and departed colleagues' documents.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-4 pt-3 border-t border-slate-100">
              *Estimated time recovery based on pilot surveys
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-soft-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-display font-black text-[#071A45]">
                ~30–40%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mt-1">
                Fewer Repeated Mistakes
              </div>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Proactive guardrails and Dead Ends warnings stop duplicate vendor blunders and recurring process failures before sign-off.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-4 pt-3 border-t border-slate-100">
              *Projected organizational risk reduction
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#071A45] to-[#14388D] rounded-3xl p-8 text-white shadow-soft-lg flex flex-col justify-between border border-[#1C52C2]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFC000] text-[#071A45] flex items-center justify-center mb-4 font-black text-xl">
                9
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#FFC000]">
                United Nations SDG Alignment
              </div>
              <div className="text-2xl font-display font-black mt-1">
                SDG 9: Industry, Innovation &amp; Infrastructure
              </div>
              <p className="text-sm text-blue-200 mt-3 leading-relaxed">
                Modernizes organizational knowledge management, fostering resilient institutional memory and transparent governance for sustainable enterprises.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-yellow-200/80 mt-4 pt-3 border-t border-white/10 font-medium">
              <Globe2 className="w-4 h-4 text-[#FFC000]" />
              <span>Global Standard Compliance</span>
            </div>
          </motion.div>

        </div>

        {/* 3-Column Layout: Tech & Materials / Skills / Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Col 1: Technology & Materials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-soft-lg space-y-4"
          >
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1C52C2] flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#071A45]">
                Technology &amp; Materials
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 font-bold mb-0.5">Foundational LLMs:</strong>
                Open-source Llama 3 &amp; GPT-4o for nuanced entity extraction &amp; multi-agent council debates.
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 font-bold mb-0.5">Graph Topology Engine:</strong>
                Neo4j Enterprise Graph &amp; Cypher query language with local SQLite memory fallback.
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 font-bold mb-0.5">Application Frameworks:</strong>
                FastAPI high-speed asynchronous backend, React 18 frontend, and Vite build tooling.
              </li>
            </ul>
          </motion.div>

          {/* Col 2: Skills We Have vs Need */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-soft-lg space-y-4"
          >
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#071A45]">
                Skills We Have vs Need
              </h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] block">
                  Core Skills We Have:
                </span>
                <p className="text-emerald-950 font-medium">
                  • Full-stack Python &amp; React architecture<br />
                  • Graph database schemas &amp; Cypher indexing<br />
                  • Prompt engineering &amp; semantic retrieval
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                <span className="font-bold text-blue-800 uppercase tracking-wider text-[10px] block">
                  Target Domain Expansion:
                </span>
                <p className="text-blue-950 font-medium">
                  • Real-time enterprise Slack/Teams connectors<br />
                  • Enterprise SOC2/GDPR compliance auditing<br />
                  • Domain-specific organizational ontologies
                </p>
              </div>
            </div>
          </motion.div>

          {/* Col 3: Risks & Mitigations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-soft-lg space-y-4"
          >
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#071A45]">
                Risks &amp; Mitigations
              </h3>
            </div>
            <div className="space-y-2.5">
              {risksAndMitigations.map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${item.color} text-xs space-y-1`}>
                  <div className="font-bold text-slate-900">
                    <span className="text-red-600 font-extrabold mr-1">Risk {idx + 1}:</span>
                    {item.risk}
                  </div>
                  <div className="text-slate-700 font-medium">
                    <span className="text-emerald-700 font-bold mr-1">Mitigation:</span>
                    {item.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
