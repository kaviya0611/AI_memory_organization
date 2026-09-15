import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Sparkles, ChevronRight, Menu, X, Database, PlayCircle } from 'lucide-react';

export const NAV_LINKS = [
  { path: '/pitch', label: 'Home' },
  { path: '/pitch/problem', label: 'Problem' },
  { path: '/pitch/solution', label: 'Solution' },
  { path: '/pitch/demo', label: 'Pitch Demo', isBadge: true },
  { path: '/pitch/architecture', label: 'Architecture' },
  { path: '/pitch/why-us', label: 'Why Us' },
  { path: '/pitch/impact', label: 'Feasibility & Impact' },
  { path: '/pitch/roadmap', label: 'Roadmap' },
  { path: '/pitch/team', label: 'Team' },
];

export default function Navbar({ onOpenConsole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#071A45]/95 backdrop-blur-md border-b border-[#14388D]/60 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group focus:outline-none"
            aria-label="Organizational Memory Home"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1C52C2] to-[#FFC000] p-0.5 shadow-glow-blue flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#071A45] rounded-[10px] flex items-center justify-center">
                <Brain className="w-6 h-6 text-[#FFC000] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  Decision<span className="text-[#FFC000]">Brain</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-[#1C52C2]/50 text-blue-200 rounded border border-[#1C52C2]">
                  Pitch
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
                AI Organizational Memory Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {NAV_LINKS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-white font-semibold bg-[#1C52C2]/40 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {item.isBadge && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#FFC000] text-[#071A45]">
                      LIVE
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#FFC000] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/"
              className="px-4 py-2 text-xs font-bold text-white bg-[#1C52C2] hover:bg-[#2563eb] rounded-xl shadow transition flex items-center space-x-1.5 border border-blue-400/30"
            >
              <Database className="w-3.5 h-3.5 text-[#FFC000]" />
              <span>Launch Live Platform</span>
            </Link>

            <Link
              to="/pitch/demo"
              className="px-4 py-2 text-sm font-bold text-[#071A45] bg-[#FFC000] hover:bg-[#ffcd33] rounded-xl shadow-glow-gold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center space-x-1.5"
            >
              <PlayCircle className="w-4 h-4 fill-[#071A45] text-[#FFC000]" />
              <span>Pitch Demo</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden items-center space-x-2">
            <Link
              to="/demo"
              className="px-3 py-1.5 text-xs font-bold text-[#071A45] bg-[#FFC000] rounded-lg"
            >
              Demo
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drop-down */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#071A45] border-b border-[#14388D] px-4 pt-3 pb-5 space-y-1">
          {NAV_LINKS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-[#1C52C2] text-white font-semibold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.isBadge && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-[#FFC000] text-[#071A45] rounded-full">
                    MOCK DEMO
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-700/50">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsole();
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white flex items-center space-x-2"
            >
              <Database className="w-4 h-4 text-blue-400" />
              <span>Open Enterprise DB Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
