import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Presentation, Maximize2 } from 'lucide-react';
import { NAV_LINKS } from './Navbar';

export default function PresentationControls() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = NAV_LINKS.findIndex((item) => item.path === location.pathname);
  const currentStep = currentIndex !== -1 ? currentIndex : 0;

  const goToPrev = () => {
    if (currentStep > 0) {
      navigate(NAV_LINKS[currentStep - 1].path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNext = () => {
    if (currentStep < NAV_LINKS.length - 1) {
      navigate(NAV_LINKS[currentStep + 1].path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard navigation for live pitch
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  return (
    <aside 
      aria-label="Pitch Navigation Stepper"
      className="fixed bottom-6 right-6 z-40 bg-[#071A45]/90 backdrop-blur-md border border-[#14388D] rounded-full p-1.5 shadow-2xl flex items-center space-x-2 text-white"
    >
      <button
        onClick={goToPrev}
        disabled={currentStep === 0}
        aria-label="Previous Page"
        className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition text-slate-200 hover:text-white"
        title="Previous section (Left Arrow)"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center px-2 space-x-1">
        {NAV_LINKS.map((link, idx) => (
          <button
            key={link.path}
            onClick={() => {
              navigate(link.path);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title={`${link.label} (${idx + 1}/${NAV_LINKS.length})`}
            className={`transition-all duration-300 rounded-full ${
              idx === currentStep
                ? 'w-6 h-2 bg-[#FFC000]'
                : 'w-2 h-2 bg-slate-500 hover:bg-slate-300'
            }`}
          />
        ))}
      </div>

      <button
        onClick={goToNext}
        disabled={currentStep === NAV_LINKS.length - 1}
        aria-label="Next Page"
        className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition text-slate-200 hover:text-white"
        title="Next section (Right Arrow)"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="border-l border-slate-700/80 pl-2 pr-2 hidden sm:flex items-center text-[11px] font-mono font-medium text-slate-300">
        <span>{currentStep + 1}</span>
        <span className="text-slate-500 mx-1">/</span>
        <span>{NAV_LINKS.length}</span>
      </div>
    </aside>
  );
}
