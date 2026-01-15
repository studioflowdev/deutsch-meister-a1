
import React from 'react';
import { ExamSection } from '../types';

interface ExamHeaderProps {
  currentSection: ExamSection;
  onExit: () => void;
  onNavigate: (section: ExamSection) => void;
  timer?: number;
  guidanceEnabled: boolean;
  onToggleGuidance: () => void;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({
  currentSection,
  onExit,
  onNavigate,
  timer,
  guidanceEnabled,
  onToggleGuidance
}) => {
  const sections = [
    { key: ExamSection.HOEREN, label: 'Hören', icon: 'fa-headphones' },
    { key: ExamSection.LESEN, label: 'Lesen', icon: 'fa-book-open' },
    { key: ExamSection.SCHREIBEN, label: 'Schreiben', icon: 'fa-pen-nib' },
    { key: ExamSection.SPRECHEN, label: 'Sprechen', icon: 'fa-comments' },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isNavigationAllowed = currentSection !== ExamSection.HOME && currentSection !== ExamSection.RESULTS;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4">
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button onClick={onExit} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Startseite">
            <i className="fa-solid fa-house"></i>
          </button>
          <div className="hidden md:block h-6 w-px bg-slate-200"></div>
          <div className="flex items-center space-x-2">
            <div className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">A1</div>
            <span className="font-bold text-slate-800 hidden sm:inline">Deutsch-Prüfung</span>
          </div>
        </div>

        <nav className="flex-1 flex items-center justify-center space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar">
          {sections.map((s) => (
            <button
              key={s.key}
              disabled={!isNavigationAllowed}
              onClick={() => onNavigate(s.key)}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${currentSection === s.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : isNavigationAllowed
                    ? 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    : 'text-slate-200 cursor-not-allowed'
                }`}
            >
              <i className={`fa-solid ${s.icon}`}></i>
              <span className="hidden md:inline">{s.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {timer !== undefined && isNavigationAllowed && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-lg font-mono font-bold text-slate-600">
              <i className="fa-regular fa-clock text-slate-400"></i>
              <span>{formatTime(timer)}</span>
            </div>
          )}

          {isNavigationAllowed && (
            <button
              onClick={onToggleGuidance}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${guidanceEnabled
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                }`}
            >
              <i className="fa-solid fa-lightbulb"></i>
              <span className="hidden sm:inline">Hilfe</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ExamHeader;
