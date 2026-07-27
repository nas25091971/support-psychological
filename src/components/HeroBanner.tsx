import React from 'react';
import { TabType } from '../types';
import { HeartPulse, Wind, FileText, ShieldAlert, Sparkles, PhoneCall, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onSelectTab: (tab: TabType) => void;
  onOpenPanicSOS: () => void;
  onOpenCrisisModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectTab,
  onOpenPanicSOS,
  onOpenCrisisModal
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
      
      {/* Decorative ambient background blur shapes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        
        {/* Soft Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>Простір вашого психологічного відновлення</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Відчуйте ОПОРУ та спокій <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent">
            у кожному моменті
          </span>
        </h1>

        <p className="text-slate-200/90 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
          Надійні стандартизовані самотести (PHQ-9, GAD-7), інтерактивні техніки заземлення при паніці, анімоване дихання та щоденник емоцій. Усе працює прямо у браузері без реєстрації.
        </p>

        {/* Quick Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          
          <button
            onClick={() => onSelectTab('tools')}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all cursor-pointer"
          >
            <Wind className="w-4 h-4 text-slate-950" />
            <span>Дихальні вправи та заземлення</span>
          </button>

          <button
            onClick={() => onSelectTab('tests')}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-md flex items-center space-x-2 active:scale-98 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>Пройти самотест (PHQ-9 / GAD-7)</span>
          </button>

          <button
            onClick={onOpenPanicSOS}
            className="px-4 py-3 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-rose-600/30 active:scale-98 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Миттєва допомога при паніці</span>
          </button>

        </div>

        {/* Reassuring Pillars */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 border-t border-white/10 mt-6">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% анонімно та локально</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Доказові клінічні методики</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Гарячі лінії підтримки 24/7</span>
          </div>
        </div>

      </div>
    </div>
  );
};
