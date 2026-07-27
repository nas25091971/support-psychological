import React from 'react';
import { TabType } from '../types';
import { HeartPulse, PhoneCall, Sparkles, BookOpen, FileSpreadsheet, ShieldAlert, Sun, Moon, Volume2, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenCrisisModal: () => void;
  onOpenPanicSOS: () => void;
  onOpenAmbientPlayer: () => void;
  isAmbientActive: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCrisisModal,
  onOpenPanicSOS,
  onOpenAmbientPlayer,
  isAmbientActive,
  isDarkMode,
  setIsDarkMode
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Головна', icon: <HeartPulse className="w-4 h-4" /> },
    { id: 'tools', label: 'Інструменти', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'tests', label: 'Тести', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'journal', label: 'Щоденник емоцій', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'articles', label: 'База знань', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'safety-plan', label: 'План безпеки', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <span className="font-bold text-xl tracking-tight">О</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">ОПОРА</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Самодопомога
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Психоемоційна підтримка 24/7
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Ambient sound, Theme toggle, Crisis SOS */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Ambient Sound Toggle */}
            <button
              id="ambient-sound-btn"
              onClick={onOpenAmbientPlayer}
              title="Фонова релаксуюча аудіо-атмосфера"
              className={`p-2 rounded-lg border transition-all flex items-center space-x-1 text-xs font-medium ${
                isAmbientActive
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Звуки релаксу</span>
            </button>

            {/* Dark/Light mode */}
            <button
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(prev => !prev)}
              title="Переключити тему"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Panic SOS Emergency Button */}
            <button
              id="panic-sos-btn"
              onClick={onOpenPanicSOS}
              className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shadow-rose-600/20 active:scale-98 transition-all animate-pulse"
              title="Швидкий розвантажувальний режим при паніці"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden xs:inline">SOS Паніка</span>
            </button>

            {/* Crisis Hotline Button */}
            <button
              id="crisis-hotlines-btn"
              onClick={onOpenCrisisModal}
              className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shadow-teal-600/20 active:scale-98 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span className="hidden sm:inline">Гарячі лінії 24/7</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar space-x-2">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
