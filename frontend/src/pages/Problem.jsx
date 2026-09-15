import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserMinus, 
  UserCheck, 
  FileQuestion, 
  Repeat, 
  AlertOctagon, 
  ArrowRight, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Building2 
} from 'lucide-react';

export default function Problem() {
  const steps = [
    {
      icon: UserMinus,
      title: "Employees Leave",
      desc: "Key project leads and senior operators depart, taking tacit context with them.",
      color: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-400"
    },
    {
      icon: UserCheck,
      title: "Managers Change",
      desc: "New leadership steps in without historical visibility into prior discussions.",
      color: "from-amber-500/20 to-amber-600/10",
      iconColor: "text-amber-400"
    },
    {
      icon: FileQuestion,
      title: "Decision History is Lost",
      desc: "Reasoning stays buried in private email threads, Slack DMs, and expired links.",
      color: "from-red-500/20 to-red-600/10",
      iconColor: "text-red-400"
    },
    {
      icon: Repeat,
      title: "Teams Repeat Mistakes",
      desc: "The organization incurs repeated vendor churn, failed pilots, and lost capital.",
      color: "from-rose-500/20 to-rose-600/10",
      iconColor: "text-rose-400"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F4F6FB] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header section */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#071A45]/5 text-[#1C52C2] text-xs font-bold uppercase tracking-wider border border-[#1C52C2]/20"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>The Core Dilemma</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-[#071A45] tracking-tight leading-tight"
          >
            Institutional Amnesia: The Silent Cost of Lost Decisions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal"
          >
            Organizations make hundreds of decisions every day — <strong>HR, Finance, Procurement, Operations, Sales, IT</strong> — scattered across emails, meetings, chats, and reports.
          </motion.p>
        </div>

        {/* The 4-Step Illustrated Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 relative group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                  <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>
                <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-[#1C52C2] transition-colors">
                  0{idx + 1}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-[#071A45] mb-2">
                {step.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {step.desc}
              </p>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#071A45] text-white flex items-center justify-center text-xs shadow-md">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Callout Stat Block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#071A45] to-[#0E2969] rounded-2xl p-8 sm:p-10 text-white shadow-soft-xl border border-[#14388D] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 w-64 h-64 bg-[#1C52C2]/30 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-[#FFC000] font-bold text-sm uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#FFC000] animate-ping" />
              <span>Critical Organizational Reality</span>
            </span>
            <blockquote className="text-2xl sm:text-3xl font-display font-extrabold leading-snug">
              "Organizations re-solve the same problems repeatedly because no one remembers what was tried before."
            </blockquote>
            <p className="text-slate-300 text-sm sm:text-base">
              Without a centralized institutional memory engine, companies pay the "experience tax" over and over again on identical dilemmas.
            </p>
          </div>
        </motion.div>

        {/* Real-World Concrete Example: Supplier A -> Supplier B */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-soft-xl space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                Case in Point: Real Enterprise Failure Scenario
              </span>
              <h3 className="text-2xl font-display font-black text-[#071A45] mt-2">
                The Recurring Supplier Switch Disaster
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Timeline: 2024 → 2027</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Year 2024 */}
            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-100 text-[#071A45] font-bold text-sm rounded-lg font-mono">
                  YEAR 2024
                </span>
                <span className="text-xs font-semibold text-slate-500">Procurement Team</span>
              </div>
              <p className="text-slate-800 font-semibold">
                In 2024, a company switched from <strong>Supplier A → Supplier B</strong> to cut costs by 3%.
              </p>
              <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-100 space-y-1.5 text-xs text-rose-800">
                <div className="font-bold flex items-center space-x-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>The Unintended Outcome:</span>
                </div>
                <p>Six months later, delivery delays jumped by +15% and customer complaints surged. The small cost savings were wiped out by logistics penalties.</p>
              </div>
            </div>

            {/* Year 2027 */}
            <div className="bg-red-50/60 rounded-2xl p-6 border border-red-200/80 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-red-600 text-white font-bold text-sm rounded-lg font-mono shadow-sm">
                  YEAR 2027
                </span>
                <span className="text-xs font-bold text-red-600 flex items-center space-x-1">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>History Repeats</span>
                </span>
              </div>
              <p className="text-slate-800 font-semibold">
                In 2027, a new procurement manager takes over, completely unaware of the 2024 outcome.
              </p>
              <div className="p-3.5 bg-red-100/70 rounded-xl border border-red-200 space-y-1.5 text-xs text-red-900">
                <div className="font-bold">Resulting Blunder:</div>
                <p>Looking only at the lowest bid sheet, they make the <strong>exact same switch again</strong>, triggering another costly supply chain crisis.</p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-600">
              How would an AI Organizational Brain prevent this?
            </p>
            <Link
              to="/pitch/solution"
              className="inline-flex items-center space-x-2 text-sm font-bold text-[#1C52C2] hover:text-[#071A45] transition-colors"
            >
              <span>Explore Our Solution</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
