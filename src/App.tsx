import React, { useState, useEffect } from 'react';
import { TabType } from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { BreathingExercise } from './components/BreathingExercise';
import { GroundingTool } from './components/GroundingTool';
import { TestsSection } from './components/TestsSection';
import { EmotionJournal } from './components/EmotionJournal';
import { KnowledgeBase } from './components/KnowledgeBase';
import { SafetyPlan } from './components/SafetyPlan';
import { CrisisModal } from './components/CrisisModal';
import { PanicSOSModal } from './components/PanicSOSModal';
import { AmbientSoundPlayer } from './components/AmbientSoundPlayer';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isPanicSOSOpen, setIsPanicSOSOpen] = useState(false);
  const [isAmbientPlayerOpen, setIsAmbientPlayerOpen] = useState(false);
  const [isAmbientActive, setIsAmbientActive] = useState(false);

  // Dark mode state with document element class toggling
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('opora_theme');
      return saved === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('opora_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('opora_theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCrisisModal={() => setIsCrisisModalOpen(true)}
        onOpenPanicSOS={() => setIsPanicSOSOpen(true)}
        onOpenAmbientPlayer={() => setIsAmbientPlayerOpen(true)}
        isAmbientActive={isAmbientActive}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Tab: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-10 animate-fade-in">
            <HeroBanner
              onSelectTab={setActiveTab}
              onOpenPanicSOS={() => setIsPanicSOSOpen(true)}
              onOpenCrisisModal={() => setIsCrisisModalOpen(true)}
            />

            {/* Quick Interactive Tools Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Інтерактивні інструменти миттєвого заспокоєння
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    Оберіть дихальну вправу або покрокове заземлення для зняття тривоги
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BreathingExercise />
                <GroundingTool />
              </div>
            </div>

            {/* Clinical Tests Shortcut */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-900 to-emerald-950 text-white space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    Клінічний скринінг
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold mt-1">
                    Перевірте свій рівень тривоги та депресії (PHQ-9, GAD-7)
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
                    Анонімні стандартизовані самотести з розлогими бережними рекомендаціями та збереженням результатів.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('tests')}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  Пройти тестування
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: TOOLS */}
        {activeTab === 'tools' && (
          <div className="space-y-8 animate-fade-in">
            <BreathingExercise />
            <GroundingTool />
          </div>
        )}

        {/* Tab: TESTS */}
        {activeTab === 'tests' && (
          <div className="animate-fade-in">
            <TestsSection onOpenCrisisModal={() => setIsCrisisModalOpen(true)} />
          </div>
        )}

        {/* Tab: JOURNAL */}
        {activeTab === 'journal' && (
          <div className="animate-fade-in">
            <EmotionJournal />
          </div>
        )}

        {/* Tab: KNOWLEDGE BASE */}
        {activeTab === 'articles' && (
          <div className="animate-fade-in">
            <KnowledgeBase />
          </div>
        )}

        {/* Tab: SAFETY PLAN */}
        {activeTab === 'safety-plan' && (
          <div className="animate-fade-in">
            <SafetyPlan />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer onOpenCrisisModal={() => setIsCrisisModalOpen(true)} />

      {/* Modals */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />

      <PanicSOSModal
        isOpen={isPanicSOSOpen}
        onClose={() => setIsPanicSOSOpen(false)}
        onLaunchGrounding={() => setActiveTab('tools')}
      />

      <AmbientSoundPlayer
        isOpen={isAmbientPlayerOpen}
        onClose={() => setIsAmbientPlayerOpen(false)}
        onAmbientStateChange={setIsAmbientActive}
      />

    </div>
  );
}
