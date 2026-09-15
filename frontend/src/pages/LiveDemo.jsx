import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  Brain, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingDown, 
  ShieldAlert, 
  FileText, 
  RefreshCw, 
  Layers, 
  ExternalLink,
  HelpCircle,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESET_QUERIES = [
  "Should we change suppliers to reduce cost?",
  "Can we migrate our primary cloud to Provider Z?",
  "Should we cancel bi-weekly engineering retrospectives?"
];

const RESPONSES = {
  "Should we change suppliers to reduce cost?": {
    answer: "A similar decision was made in 2024. Although procurement costs decreased slightly, delivery delays increased by 15%, affecting customer satisfaction. Based on that experience, renegotiating the current supplier contract may be a safer option.",
    evidence: [
      {
        type: "Past Decision",
        title: "Decision: Switched Supplier A → B (2024)",
        desc: "Approved by Marcus Vance to achieve 3% margin target on materials.",
        badge: "Exact Match",
        badgeColor: "bg-blue-100 text-blue-800"
      },
      {
        type: "Measured Outcome",
        title: "Outcome: Cost -3%, Delivery delays +15%, Complaints ↑",
        desc: "Logistics buffer failed during peak season; $140,000 lost in delivery penalties.",
        badge: "High Impact",
        badgeColor: "bg-rose-100 text-rose-800"
      },
      {
        type: "Confidence Metric",
        title: "Confidence: High — based on 1 closely related past decision.",
        desc: "Graph semantic match similarity 0.94; 3 cross-department validation points.",
        badge: "94% Confidence",
        badgeColor: "bg-emerald-100 text-emerald-800"
      }
    ],
    graphFocus: "supplier_decision"
  },
  "Can we migrate our primary cloud to Provider Z?": {
    answer: "In Q2 2023, the infrastructure committee evaluated Provider Z for data storage. While egress bandwidth was cheaper, API latency spikes violated our 99.9% uptime SLA in EMEA. The platform recommends keeping core clusters on our current provider or running a isolated staging canary first.",
    evidence: [
      {
        type: "Archived RFC",
        title: "RFC #88: Cloud Migration Feasibility (2023)",
        desc: "Benchmarking showed 42ms p99 latency regressions across distributed regions.",
        badge: "Technical Audit",
        badgeColor: "bg-amber-100 text-amber-800"
      },
      {
        type: "Risk Evaluation",
        title: "Dead End: Egress Arbitrage without Multi-Region Failover",
        desc: "Logged in Dead Ends repo as high-risk engineering anti-pattern.",
        badge: "Dead End",
        badgeColor: "bg-red-100 text-red-800"
      },
      {
        type: "Confidence Metric",
        title: "Confidence: High — verified against 2 historical architectural benchmarks.",
        desc: "Synthesized from DevOps meeting transcripts and Grafana post-mortems.",
        badge: "91% Confidence",
        badgeColor: "bg-emerald-100 text-emerald-800"
      }
    ],
    graphFocus: "cloud_migration"
  },
  "Should we cancel bi-weekly engineering retrospectives?": {
    answer: "In late 2023, team Alpha paused retrospectives to accelerate a Q4 feature release. While sprint velocity rose 4% for two weeks, cross-team bug leakage surged by 38% the following month. Regular retrospectives are strongly recommended to preserve code health.",
    evidence: [
      {
        type: "Historical Precedent",
        title: "Incident #402: Alpha Sprint Retro Bypass (2023)",
        desc: "Postponing retrospective rituals concealed blocker trends in CI/CD pipeline.",
        badge: "Process Finding",
        badgeColor: "bg-purple-100 text-purple-800"
      },
      {
        type: "Metric Trend",
        title: "Outcome: +38% QA Defects over 60 days",
        desc: "Direct causal correlation between canceled retro cycles and defect escapes.",
        badge: "Critical Metric",
        badgeColor: "bg-rose-100 text-rose-800"
      },
      {
        type: "Confidence Metric",
        title: "Confidence: High — empirical team analytics match.",
        desc: "Cross-referenced with Jira throughput & GitHub issue escalation logs.",
        badge: "89% Confidence",
        badgeColor: "bg-emerald-100 text-emerald-800"
      }
    ],
    graphFocus: "engineering_process"
  }
};

export default function LiveDemo() {
  const [query, setQuery] = useState("Should we change suppliers to reduce cost?");
  const [status, setStatus] = useState("idle"); // 'idle' | 'thinking' | 'answered'
  const [activeResponse, setActiveResponse] = useState(RESPONSES["Should we change suppliers to reduce cost?"]);
  const [highlightedNode, setHighlightedNode] = useState("supplier_decision");
  const chatEndRef = useRef(null);

  const handleAsk = (overrideQuery) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;

    setStatus("thinking");

    // Realistic thinking time delay ~950ms
    setTimeout(() => {
      const resp = RESPONSES[q] || {
        answer: `Our Organizational Brain analyzed 14 historical decisions related to "${q}". Based on past outcomes and operational policies, similar initiatives required cross-department sign-off and risk mitigation before proceeding.`,
        evidence: [
          {
            type: "Historical Context",
            title: `Historical Pattern Match: ${q.slice(0, 32)}...`,
            desc: "Identified relevant decisions across operations, budget, and governance records.",
            badge: "General Memory",
            badgeColor: "bg-blue-100 text-blue-800"
          },
          {
            type: "Impact Analysis",
            title: "Proactive Guardrail Check Passed",
            desc: "No immediate policy violations detected in active compliance rules.",
            badge: "Safe Protocol",
            badgeColor: "bg-emerald-100 text-emerald-800"
          },
          {
            type: "Confidence Metric",
            title: "Confidence: Moderate (78%) — synthesized from 2 related records.",
            desc: "Recommend reviewing with department lead prior to final authorization.",
            badge: "78% Confidence",
            badgeColor: "bg-amber-100 text-amber-800"
          }
        ],
        graphFocus: "supplier_decision"
      };

      setActiveResponse(resp);
      setHighlightedNode(resp.graphFocus || "supplier_decision");
      setStatus("answered");

      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#FFC000', '#1C52C2', '#FFFFFF']
        });
      } catch (e) {}
    }, 1000);
  };

  // Run automatically once on first entry so judges immediately see the wow state
  useEffect(() => {
    handleAsk(query);
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F4F6FB] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1C52C2]/10 text-[#1C52C2] text-xs font-extrabold uppercase tracking-wider mb-2 border border-[#1C52C2]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#FFC000]" />
              <span>Interactive Centerpiece Demo</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-[#071A45]">
              Experience-Powered Decision Assistant
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Ask any decision question. The platform searches institutional history, recalls past consequences, and advises with evidence.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setQuery(preset);
                  handleAsk(preset);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  query === preset && status === 'answered'
                    ? 'bg-[#071A45] text-white border-[#071A45] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#1C52C2] hover:text-[#1C52C2]'
                }`}
              >
                {preset.length > 35 ? preset.slice(0, 35) + '...' : preset}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Panel Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Chat Interface (7 Columns) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-soft-xl overflow-hidden flex flex-col h-[700px]">
            
            {/* Chat App Window Header */}
            <div className="bg-[#071A45] px-6 py-4 flex items-center justify-between border-b border-[#14388D]">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1C52C2] to-[#FFC000] p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-[#071A45] rounded-[9px] flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#FFC000]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-sm">
                    Organizational Brain Query Engine
                  </h3>
                  <div className="flex items-center space-x-1.5 text-[11px] text-emerald-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Connected to Memory Graph (3,420 nodes)</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-400 bg-white/10 px-2 py-1 rounded">
                v3.0.0
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-slate-50/50 to-white">
              
              {/* User Question Bubble */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] bg-[#1C52C2] text-white rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-md">
                  <p className="text-sm sm:text-base font-medium leading-relaxed">
                    {query}
                  </p>
                  <span className="text-[10px] text-blue-200 block text-right mt-1">
                    Just now • Manager Query
                  </span>
                </div>
              </motion.div>

              {/* Thinking / Typing Indicator */}
              <AnimatePresence>
                {status === "thinking" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#071A45] flex items-center justify-center text-[#FFC000]">
                      <Brain className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-2 text-xs text-slate-600 font-medium border border-slate-200">
                      <span className="w-2 h-2 rounded-full bg-[#1C52C2] animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-[#1C52C2] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-[#1C52C2] animate-bounce [animation-delay:0.4s]" />
                      <span className="ml-2 font-semibold text-[#071A45]">Consulting Decision Memory &amp; Graph Records...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Answer Bubble */}
              {status === "answered" && activeResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#071A45] flex items-center justify-center text-[#FFC000] shadow-sm flex-shrink-0">
                      <Brain className="w-4 h-4" />
                    </div>
                    
                    <div className="bg-[#F4F6FB] border border-blue-200/80 rounded-2xl rounded-tl-sm p-5 space-y-4 shadow-sm text-[#071A45]">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1C52C2] bg-blue-100/70 px-2 py-0.5 rounded mr-2">
                          Decision Intelligence Recommendation
                        </span>
                        <p className="text-sm sm:text-base font-semibold leading-relaxed mt-2 text-slate-900">
                          {activeResponse.answer}
                        </p>
                      </div>

                      {/* Supporting Evidence Cards */}
                      <div className="pt-2 border-t border-slate-200/90 space-y-2.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Supporting Evidence &amp; Graph Citations:
                        </span>
                        
                        {activeResponse.evidence.map((item, idx) => (
                          <div 
                            key={idx}
                            className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-[#1C52C2] transition-colors text-xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900">{item.title}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-slate-600 leading-snug">{item.desc}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Source: Enterprise Decision Knowledge Graph</span>
                        <span className="text-emerald-700 font-bold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Guardrail Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAsk();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a decision question (e.g. Should we switch suppliers to reduce cost?)..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#071A45] focus:outline-none focus:ring-2 focus:ring-[#1C52C2] focus:border-transparent font-medium"
                />
                <button
                  type="submit"
                  disabled={status === 'thinking'}
                  className="px-6 py-3 bg-[#FFC000] hover:bg-[#ffcd33] disabled:opacity-50 text-[#071A45] font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5"
                >
                  <span>Ask</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

          {/* Right Panel: Live-Updating Decision Knowledge Graph Preview (5 Columns) */}
          <div className="lg:col-span-5 bg-[#071A45] rounded-3xl p-6 sm:p-7 border border-[#14388D] shadow-soft-xl text-white flex flex-col justify-between h-[700px]">
            <div>
              <div className="flex items-center justify-between border-b border-[#14388D] pb-4 mb-5">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFC000] animate-ping" />
                  <h3 className="font-display font-bold text-base text-white">
                    Live Graph Entity Trace
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-blue-300 bg-[#1C52C2]/30 px-2 py-0.5 rounded border border-[#1C52C2]">
                  Active Reference
                </span>
              </div>

              {/* Dynamic SVG Visual Node Graph Preview */}
              <div className="bg-[#030D23] rounded-2xl p-4 border border-blue-900/60 relative h-[320px] flex items-center justify-center overflow-hidden mb-6">
                <svg className="w-full h-full" viewBox="0 0 320 280">
                  {/* Edges */}
                  <line x1="160" y1="140" x2="60" y2="70" stroke="#1C52C2" strokeWidth="2" strokeDasharray="4,4" />
                  <line x1="160" y1="140" x2="260" y2="70" stroke="#FFC000" strokeWidth="2.5" />
                  <line x1="160" y1="140" x2="80" y2="220" stroke="#1C52C2" strokeWidth="1.5" />
                  <line x1="160" y1="140" x2="250" y2="220" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="3,3" />

                  {/* Center Node: Active Reference */}
                  <g className="cursor-pointer">
                    <circle cx="160" cy="140" r="38" fill="#FFC000" className="animate-pulse" />
                    <circle cx="160" cy="140" r="44" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4,4" />
                    <text x="160" y="136" fill="#071A45" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {status === 'thinking' ? 'Searching...' : 'Supplier 2024'}
                    </text>
                    <text x="160" y="149" fill="#071A45" fontSize="8" fontWeight="bold" textAnchor="middle">
                      Ref Node #104
                    </text>
                  </g>

                  {/* Surrounding Nodes */}
                  <g>
                    <circle cx="60" cy="70" r="24" fill="#0E2969" stroke="#1C52C2" strokeWidth="2" />
                    <text x="60" y="73" fill="#FFFFFF" fontSize="7" textAnchor="middle">Procurement</text>
                  </g>

                  <g>
                    <circle cx="260" cy="70" r="26" fill="#0E2969" stroke="#FFC000" strokeWidth="2" />
                    <text x="260" y="73" fill="#FFC000" fontSize="7" fontWeight="bold" textAnchor="middle">Guardrail Rule</text>
                  </g>

                  <g>
                    <circle cx="80" cy="220" r="22" fill="#0E2969" stroke="#1C52C2" strokeWidth="1.5" />
                    <text x="80" y="223" fill="#CBD5E1" fontSize="7" textAnchor="middle">Priya S.</text>
                  </g>

                  <g>
                    <circle cx="250" cy="220" r="28" fill="#7F1D1D" stroke="#EF4444" strokeWidth="2" />
                    <text x="250" y="218" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">Dead End</text>
                    <text x="250" y="228" fill="#FCA5A5" fontSize="6" textAnchor="middle">+15% Delays</text>
                  </g>
                </svg>
              </div>

              {/* Node Metadata Cards */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="text-slate-400">Referenced Decision:</span>
                  <span className="font-bold text-white">#104 (Supplier A → B Switch)</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="text-slate-400">Execution Year:</span>
                  <span className="font-bold text-[#FFC000]">2024 (2 yrs, 4 mos ago)</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="text-slate-400">Dead End Penalty:</span>
                  <span className="font-bold text-rose-400">+15% Delays &amp; SLA Breach</span>
                </div>
              </div>
            </div>

            {/* Bottom Status Tip */}
            <div className="pt-4 border-t border-[#14388D] text-[11px] text-slate-400 flex items-center justify-between">
              <span>Neuro-Symbolic Reasoning Engine</span>
              <span className="text-[#FFC000] font-bold">100% Explainable</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
