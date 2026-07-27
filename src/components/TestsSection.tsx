import React, { useState } from 'react';
import { SELF_TESTS } from '../data/tests';
import { SelfTest, TestResultEntry } from '../types';
import { TestRunner } from './TestRunner';
import { FileText, Clock, History, Trash2, ArrowRight, ShieldCheck, Sparkles, AlertTriangle, X } from 'lucide-react';
import { getTestResults, clearTestResults, deleteTestResult } from '../utils/storage';

interface TestsSectionProps {
  onOpenCrisisModal: () => void;
}

export const TestsSection: React.FC<TestsSectionProps> = ({ onOpenCrisisModal }) => {
  const [activeTest, setActiveTest] = useState<SelfTest | null>(null);
  const [testHistory, setTestHistory] = useState<TestResultEntry[]>(getTestResults());
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  const handleConfirmClearAll = () => {
    const updated = clearTestResults();
    setTestHistory(updated);
    setShowClearConfirmModal(false);
  };

  const handleDeleteSingleEntry = (id: string) => {
    const updated = deleteTestResult(id);
    setTestHistory(updated);
  };

  if (activeTest) {
    return (
      <TestRunner
        test={activeTest}
        onBack={() => {
          setActiveTest(null);
          setTestHistory(getTestResults());
        }}
        onOpenCrisisModal={onOpenCrisisModal}
      />
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Клінічне самотестування</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Інтерактивна діагностика психоемоційного стану
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Стандартизовані міжнародні скринінгові шкали для оцінки симптоматики депресії, генералізованої тривожності та рівнів вигорання. Результати розраховуються миттєво та залишаються 100% анонімними на вашому пристрої.
        </p>
      </div>

      {/* Available Tests Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SELF_TESTS.map(test => (
          <div
            key={test.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200/80 dark:border-teal-800">
                  <FileText className="w-5 h-5" />
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{test.timeEstimate}</span>
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {test.title}
                </h3>
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {test.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {test.description}
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setActiveTest(test)}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
              >
                <span>Розпочати тест</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Test History Log */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Історія проходження тестів ({testHistory.length})
            </h3>
          </div>

          {testHistory.length > 0 && (
            <button
              onClick={() => setShowClearConfirmModal(true)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center space-x-1 px-3 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Очистити історію</span>
            </button>
          )}
        </div>

        {testHistory.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-4 italic">
            Ви ще не проходили тести. Ваші результати показуватимуться тут локально.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {testHistory.map(item => (
              <div key={item.id} className="py-3.5 first:pt-0 flex items-center justify-between text-xs sm:text-sm gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {item.testTitle}
                  </h4>
                  <p className="text-slate-500 text-xs">
                    {new Date(item.date).toLocaleDateString('uk-UA')} о {new Date(item.date).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 block">
                      {item.level}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.score} / {item.maxScore} балів
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteSingleEntry(item.id)}
                    title="Видалити цей результат"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clearing All Test History */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Очистити історію тестів?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Це дія видалить усі ваші збережені результати опитувальників з локального сховища.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Скасувати
              </button>
              <button
                onClick={handleConfirmClearAll}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Так, видалити історію
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
