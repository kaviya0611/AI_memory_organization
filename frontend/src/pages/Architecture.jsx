import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Cpu, 
  Database, 
  Network, 
  Sparkles, 
  Search, 
  UserCheck, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Layers,
  Code
} from 'lucide-react';

export default function Architecture() {
  const pipelineStages = [
    {
      step: '01',
      title: 'Data Ingestion',
      subtitle: 'Meetings / Emails / Reports / SOPs / Chat',
      desc: 'Connects to enterprise communication feeds & docs without manual tagging.',
      icon: FileText,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200'
    },
    {
      step: '02',
      title: 'AI Decision Extraction',
      subtitle: 'LLM + NLP Structured Extraction',
      desc: 'Isolates decisions, strategic reasons, stakeholders, and risks from raw text.',
      icon: Cpu,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200'
    },
    {
      step: '03',
      title: 'Organizational Memory Engine',
      subtitle: 'Temporal Validity & Decay Rules',
      desc: 'Scores freshness, deprecates expired policies, and catalogs dead ends.',
      icon: Database,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200'
    },
    {
      step: '04',
      title: 'Decision Knowledge Graph',
      subtitle: 'Neo4j Graph Topology',
      desc: 'Builds semantic edges linking decisions → projects → departments → outcomes.',
      icon: Network,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
    },
    {
      step: '05',
      title: 'AI Recommendation Engine',
      subtitle: 'Multi-Agent Consensus & Guardrails',
      desc: 'Simulates executive councils & checks proactive policy guardrails.',
      icon: Sparkles,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200'
    },
    {
      step: '06',
      title: 'Explainable AI & Search',
      subtitle: '5-Layer Proof Trees & Citations',
      desc: 'Provides transparent reasoning, evidence citations, and confidence scores.',
      icon: Search,
      color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200'
    },
    {
      step: '07',
      title: 'Manager / Employee',
      subtitle: 'Informed Execution in Real-Time',
      desc: 'Frontline leadership makes confident, historical-informed choices.',
      icon: UserCheck,
      color: 'bg-[#071A45]/10 text-[#071A45] border-slate-300'
    }
  ];

  const techStack = [
    { name: 'React.js', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'FastAPI', category: 'Backend API' },
    { name: 'PostgreSQL', category: 'Relational DB' },
    { name: 'Neo4j', category: 'Knowledge Graph' },
    { name: 'Llama 3 / GPT', category: 'LLM Reasoning' },
    { name: 'LangGraph', category: 'Agent Orchestration' },
    { name: 'Sentence Transformers', category: 'Embeddings' },
    { name: 'spaCy', category: 'Entity Extraction' },
    { name: 'Cytoscape.js', category: 'Graph Rendering' },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F4F6FB] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1C52C2]/10 text-[#1C52C2] text-xs font-bold uppercase tracking-wider border border-[#1C52C2]/20"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Enterprise System Design</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-[#071A45] tracking-tight leading-tight"
          >
            End-to-End System Architecture
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-normal"
          >
            How raw organizational conversations transform into actionable, self-improving institutional memory.
          </motion.p>
        </div>

        {/* The Sequential Architecture Pipeline */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 relative">
            {pipelineStages.map((stage, idx) => (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.45 }}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft-lg flex flex-col justify-between hover:border-[#1C52C2] hover:shadow-soft-xl transition-all relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      STAGE {stage.step}
                    </span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${stage.color}`}>
                      <stage.icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-sm text-[#071A45] leading-tight mb-1">
                    {stage.title}
                  </h3>
                  <div className="text-[11px] font-semibold text-[#1C52C2] leading-tight mb-2">
                    {stage.subtitle}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {stage.desc}
                  </p>
                </div>

                {idx < pipelineStages.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-[#1C52C2] text-white items-center justify-center text-[9px] shadow-sm">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Continuous Feedback Loop Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-900 to-[#071A45] text-white p-5 rounded-2xl border border-emerald-500/40 shadow-soft-lg flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 flex-shrink-0">
                <RotateCcw className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-white">
                  Continuous Outcome Feedback Loop
                </h4>
                <p className="text-xs text-emerald-200">
                  Manager/Employee outcomes route back to the Organizational Memory Engine: "Outcome feedback — the system learns over time."
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#FFC000] bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 whitespace-nowrap">
              Nightly Dream Mode Tuning
            </span>
          </motion.div>
        </div>

        {/* Tech Stack Chips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-soft-xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-display font-black text-[#071A45]">
                Modern, Enterprise-Grade Technology Stack
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Engineered with high-throughput backend services and reactive graph databases
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#1C52C2] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
              10 Core Technologies
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="bg-slate-50 hover:bg-white p-4 rounded-xl border border-slate-200 hover:border-[#1C52C2] hover:shadow-md transition-all group"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#1C52C2] transition-colors">
                  {tech.category}
                </div>
                <div className="font-display font-extrabold text-sm sm:text-base text-[#071A45] mt-1">
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
