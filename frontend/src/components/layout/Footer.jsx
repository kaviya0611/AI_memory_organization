import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, Sparkles, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { NAV_LINKS } from './Navbar';

export default function Footer() {
  return (
    <footer className="bg-[#071A45] text-white border-t border-[#14388D]/70 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Platform & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1C52C2] to-[#FFC000] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#071A45] rounded-[9px] flex items-center justify-center">
                  <Brain className="w-5 h-5 text-[#FFC000]" />
                </div>
              </div>
              <span className="font-display font-black text-xl text-white">
                Decision<span className="text-[#FFC000]">Brain</span>
              </span>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              An AI-powered Enterprise Brain that remembers organizational decisions, learns from their outcomes, and provides intelligent recommendations for future decision-making.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1C52C2]/30 text-blue-300 border border-[#1C52C2]/50">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#FFC000]" />
                SDG 9: Industry, Innovation &amp; Infrastructure
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-500/40">
                <Cpu className="w-3.5 h-3.5 mr-1" />
                Neuro-Symbolic AI
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FFC000] mb-4">
              Pitch Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.slice(0, 5).map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className="text-slate-300 hover:text-white transition flex items-center space-x-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Sections & Demo */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FFC000] mb-4">
              Platform Deep-Dive
            </h4>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.slice(5).map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className="text-slate-300 hover:text-white transition flex items-center space-x-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/demo"
                  className="text-[#FFC000] font-semibold hover:underline flex items-center space-x-1"
                >
                  <span>Launch Live Mock Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#14388D]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © 2026 AI Organizational Memory &amp; Decision Intelligence Platform. Built for Hackathon Pitch.
          </p>
          <div className="flex items-center space-x-2">
            <span>Powered by</span>
            <span className="font-semibold text-slate-200">React • FastAPI • Neo4j • LangGraph</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
