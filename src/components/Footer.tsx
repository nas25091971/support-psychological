import React from 'react';
import { PhoneCall, Heart, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenCrisisModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCrisisModal }) => {
  return (
    <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors py-10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg">
                О
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                ОПОРА
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Платформа психологічної самодопомоги та самодіагностики
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCrisisModal}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Гарячі лінії допомоги 24/7 (7333)</span>
            </button>
          </div>

        </div>

        {/* Clinical Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300">Важливе застереження:</p>
            <p>
              Веб-ресурс «ОПОРА» розроблено як інструмент психоінформаційної самодопомоги, самодіагностики та психоосвіти. Матеріали сайту не замінюють професійної медичної або психіатричної допомоги. Якщо ви або ваші близькі перебуваєте у гострому кризовому стані, будь ласка, скористайтеся безкоштовною лінією <strong>7333</strong> або викличте швидку медичну допомогу за номером <strong>103</strong>.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex items-center space-x-1">
            <span>Зроблено з любов’ю та турботою про Україну</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
          <span>© {new Date().getFullYear()} ОПОРА • Працює 100% автономно у браузері</span>
        </div>

      </div>
    </footer>
  );
};
