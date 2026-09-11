import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  ArrowRight, 
  PlayCircle, 
  Sparkles, 
  ShieldCheck, 
  Network, 
  History, 
  GitBranch, 
  AlertTriangle,
  Layers,
  Database,
  Users
} from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#071A45] via-[#0E2969] to-[#071A45] text-white overflow-hidden flex flex-col justify-between">
      
      {/* Subtle Animated Node/Graph Network Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1C52C2" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFC000" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFC000" stopOpacity="1" />
              <stop offset="100%" stopColor="#1C52C2" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Connected Edges */}
          <line x1="15%" y1="20%" x2="35%" y2="38%" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="6,4" />
          <line x1="35%" y1="38%" x2="65%" y2="28%" stroke="url(#lineGrad)" strokeWidth="1.5" />
          <line x1="65%" y1="28%" x2="85%" y2="45%" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4,4" />
          <line x1="35%" y1="38%" x2="45%" y2="70%" stroke="url(#lineGrad)" strokeWidth="1.5" />
          <line x1="45%" y1="70%" x2="75%" y2="78%" stroke="url(#lineGrad)" strokeWidth="1.5" />
          <line x1="65%" y1="28%" x2="75%" y2="78%" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="8,6" />
          <line x1="15%" y1="65%" x2="45%" y2="70%" stroke="url(#lineGrad)" strokeWidth="1.5" />

          {/* Floating Nodes */}
          <circle cx="15%" cy="20%" r="9" fill="#1C52C2" className="animate-pulse" />
          <circle cx="35%" cy="38%" r="14" fill="#FFC000" opacity="0.9" />
          <circle cx="65%" cy="28%" r="10" fill="#2A68E6" />
          <circle cx="85%" cy="45%" r="16" fill="#1C52C2" opacity="0.7" />
          <circle cx="45%" cy="70%" r="12" fill="#FFC000" opacity="0.8" className="animate-pulse" />
          <circle cx="75%" cy="78%" r="14" fill="#1C52C2" />
          <circle cx="15%" cy="65%" r="8" fill="#2A68E6" />
        </svg>
      </div>

      {/* Floating Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1C52C2]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FFC000]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 flex flex-col items-center text-center my-auto">
        
        {/* Hackathon Pitch Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs sm:text-sm font-semibold mb-8 shadow-inner"
        >
          <Sparkles className="w-4 h-4 text-[#FFC000]" />
          <span>Hackathon Pitch Demo • Decision Intelligence System</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC000]" />
          <span className="text-white">SDG 9</span>
        </motion.div>

        {/* Big Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white max-w-5xl leading-[1.1] mb-6"
        >
          An AI-powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-[#FFC000] to-yellow-200">Enterprise Brain</span> for your organization's decisions.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-2xl text-slate-200 max-w-3xl font-normal leading-relaxed mb-10"
        >
          Remembers every key decision, learns from its outcome, and recommends smarter choices next time.
        </motion.p>

        {/* Primary & Secondary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-16"
        >
          <Link
            to="/problem"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base transition-all duration-200 flex items-center justify-center space-x-2 group hover:shadow-lg"
          >
            <span>See the Problem</span>
            <ArrowRight className="w-5 h-5 text-blue-300 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/demo"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FFC000] hover:bg-[#ffcd33] text-[#071A45] font-extrabold text-base shadow-glow-gold hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
          >
            <PlayCircle className="w-5 h-5 fill-[#071A45] text-[#FFC000]" />
            <span>Try the Live Demo</span>
          </Link>
        </motion.div>

        {/* Feature Snapshot Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#1C52C2] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1C52C2]/40 flex items-center justify-center mb-3">
              <Network className="w-5 h-5 text-[#FFC000]" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-1">Knowledge, Not Files</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Transforms unstructured emails, chats, and meetings into a queryable Decision Knowledge Graph.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#1C52C2] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1C52C2]/40 flex items-center justify-center mb-3">
              <History className="w-5 h-5 text-blue-300" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-1">Outcome-Driven Feedback</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Connects past results to present decisions so organizations never repeat expensive mistakes.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#1C52C2] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1C52C2]/40 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-1">Explainable Recommendations</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Delivers transparent reasoning trees and evidence cards with high confidence scores for leaders.
            </p>
          </div>
        </motion.div>

      </div>

      {/* Bottom Ticker */}
      <div className="relative z-10 bg-[#030D23]/70 border-t border-[#14388D]/40 py-3.5 px-4 text-center text-xs sm:text-sm text-slate-300 font-medium">
        <span className="text-[#FFC000] font-bold mr-2">ENTERPRISE MEMORY:</span>
        Zero institutional amnesia • Cross-department synergy • Neuro-symbolic guardrails
      </div>
    </div>
  );
}
