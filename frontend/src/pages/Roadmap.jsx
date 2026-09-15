import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Milestone, 
  Compass, 
  Flag 
} from 'lucide-react';

export default function Roadmap() {
  const phases = [
    {
      phase: "Phase 1",
      title: "Schema & Ontology",
      tagline: "Define decision schema & knowledge graph structure",
      status: "Completed",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      iconColor: "text-emerald-500",
      deliverables: [
        "Neuro-symbolic decision schema (triggers, constraints, dead ends)",
        "Temporal validity decay rules & confidence models",
        "Entity relationship graph taxonomy for cross-department nodes"
      ]
    },
    {
      phase: "Phase 2",
      title: "Backend Core",
      tagline: "Set up LLM APIs, Neo4j, FastAPI backend",
      status: "Completed",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      iconColor: "text-emerald-500",
      deliverables: [
        "FastAPI high-speed async server with auto-seeding engine",
        "Neo4j Knowledge Graph connector with local SQLite fallback",
        "Llama 3 / OpenAI multi-agent virtual council simulation endpoint"
      ]
    },
    {
      phase: "Phase 3",
      title: "Capture & Search",
      tagline: "Build decision capture, knowledge graph & search",
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-800 border-blue-300 animate-pulse",
      iconColor: "text-blue-600",
      deliverables: [
        "Interactive decision query UI & real-time guardrails preview",
        "5-layer explainability card renderer with citation confidence",
        "Dead ends repository and nightly Dream Mode memory synthesis"
      ]
    },
    {
      phase: "Phase 4",
      title: "Pilot & Feedback",
      tagline: "Pilot with real meeting transcripts & gather feedback",
      status: "Upcoming",
      statusColor: "bg-slate-100 text-slate-600 border-slate-300",
      iconColor: "text-slate-400",
      deliverables: [
        "Integration pilots with Zoom / Google Meet / Slack transcription",
        "Human-in-the-loop audit verification for low-confidence decisions",
        "Enterprise benchmark reporting on repeated mistake avoidance"
      ]
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
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1C52C2]/10 text-[#1C52C2] text-xs font-bold uppercase tracking-wider border border-[#1C52C2]/20"
          >
            <Milestone className="w-3.5 h-3.5" />
            <span>Strategic Milestones</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-[#071A45] tracking-tight leading-tight"
          >
            Execution Roadmap &amp; Horizons
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-normal"
          >
            From conceptual graph ontology to enterprise production deployment.
          </motion.p>
        </div>

        {/* Horizontal Timeline / Stepper */}
        <div className="relative">
          {/* Connecting Track Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {phases.map((item, idx) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft-lg hover:shadow-soft-xl hover:border-[#1C52C2] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-extrabold text-[#1C52C2] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                      {item.phase}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl text-[#071A45] mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold text-slate-700 mb-4 leading-relaxed">
                    {item.tagline}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Key Deliverables:
                    </span>
                    {item.deliverables.map((d, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1C52C2] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Milestone 0{idx + 1}</span>
                  <span>{item.status === 'Completed' ? '100% Done' : item.status === 'In Progress' ? '70% Complete' : 'Planned'}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Future Vision Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#071A45] rounded-3xl p-8 sm:p-10 text-white shadow-soft-xl border border-[#14388D] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFC000]">
              The Long-Term Vision
            </span>
            <h3 className="text-2xl font-display font-bold">
              Autonomous Institutional Memory for Every Global Enterprise
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Transforming every company from a fragile collection of transient individuals into an enduring, compounding intelligent organism.
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#FFC000]" />
              <span>Next: Enterprise Pilot</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
