import React, { useState } from 'react';
import { HOTLINES } from '../data/hotlines';
import { Phone, Copy, Check, X, ShieldAlert, Heart, Info, Clock } from 'lucide-react';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen) return null;

  const handleCopy = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { id: 'all', label: 'Усі гарячі лінії' },
    { id: 'general', label: 'Загальна допомога (7333, НПА)' },
    { id: 'veterans', label: 'Ветеранам та воїнам' },
    { id: 'women', label: 'Жінкам (Ла Страда)' },
    { id: 'youth', label: 'Дітям та молоді' }
  ];

  const filteredHotlines = filterCategory === 'all'
    ? HOTLINES
    : HOTLINES.filter(h => h.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-teal-700 to-emerald-800 text-white flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
              <ShieldAlert className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Гарячі лінії кризової допомоги 24/7</h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Безкоштовно та абсолютно конфіденційно по всій території України
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Call-Out Banner */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900 flex items-center justify-between text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Якщо існує безпосередня загроза життю чи здоров’ю, телефонуйте на екстрений номер <strong>103</strong> або <strong>112</strong>!</span>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Hotline List */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredHotlines.map(hotline => (
            <div key={hotline.id} className="pt-3.5 first:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {hotline.title}
                    </h3>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <Clock className="w-3 h-3" />
                      <span>{hotline.hours}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {hotline.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hotline.recommendedFor.map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Call & Copy Buttons */}
                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href={`tel:${hotline.phone}`}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{hotline.displayPhone}</span>
                  </a>

                  <button
                    onClick={() => handleCopy(hotline.phone, hotline.id)}
                    title="Скопіювати номер"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {copiedId === hotline.id ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Усі дзвінки з мобільних та стаціонарних телефонів України безкоштовні</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            Закрити
          </button>
        </div>

      </div>
    </div>
  );
};
