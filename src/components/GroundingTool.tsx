import React, { useState } from 'react';
import { Eye, Hand, Volume2, Flame, Utensils, CheckCircle, RotateCcw, Sparkles, HeartHandshake } from 'lucide-react';

export const GroundingTool: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(5);
  const [completedItems, setCompletedItems] = useState<Record<number, string[]>>({
    5: [],
    4: [],
    3: [],
    2: [],
    1: []
  });

  const steps = [
    {
      step: 5,
      title: '5 Предметів, які ви БАЧИТЕ',
      subtitle: 'Озирніться навколо і помітьте 5 речей (наприклад: годинник, пляшка води, книга, вікно, картина)',
      icon: <Eye className="w-6 h-6 text-sky-500" />,
      color: 'sky',
      placeholder: 'Наприклад: синя чашка на столі...'
    },
    {
      step: 4,
      title: '4 Текстури, які ви ВІДЧУВАЄТЕ',
      subtitle: 'Торкніться 4 речей навколо (наприклад: тканина одягу, прохолодний стіл, власні долоні, підлога під ногами)',
      icon: <Hand className="w-6 h-6 text-teal-500" />,
      color: 'teal',
      placeholder: 'Наприклад: м’який светр...'
    },
    {
      step: 3,
      title: '3 Звуки, які ви ЧУЄТЕ',
      subtitle: 'Прислухайтесь до довкілля (наприклад: цокання годинника, шум машини за вікном, власне дихання)',
      icon: <Volume2 className="w-6 h-6 text-indigo-500" />,
      color: 'indigo',
      placeholder: 'Наприклад: спів пташок за вікном...'
    },
    {
      step: 2,
      title: '2 Запахи, які ви ВІДЧУВАЄТЕ',
      subtitle: 'Вдихніть повітря (наприклад: аромат кави, свіжість повітря з вікна, запах мила)',
      icon: <Flame className="w-6 h-6 text-amber-500" />,
      color: 'amber',
      placeholder: 'Наприклад: запах духів або кави...'
    },
    {
      step: 1,
      title: '1 Смак, який ви ВІДЧУВАЄТЕ',
      subtitle: 'Зробіть ковток води, відчуйте смак м’яти або просто зверніть увагу на смакові відчуття у роті',
      icon: <Utensils className="w-6 h-6 text-rose-500" />,
      color: 'rose',
      placeholder: 'Наприклад: ковток прохолодної води...'
    }
  ];

  const currentStepInfo = steps.find(s => s.step === activeStep) || steps[0];
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentList = completedItems[activeStep] || [];
    if (currentList.length >= activeStep) return;

    setCompletedItems(prev => ({
      ...prev,
      [activeStep]: [...currentList, inputValue.trim()]
    }));
    setInputValue('');
  };

  const handleRemoveItem = (stepNum: number, index: number) => {
    setCompletedItems(prev => ({
      ...prev,
      [stepNum]: prev[stepNum].filter((_, i) => i !== index)
    }));
  };

  const isStepDone = (completedItems[activeStep]?.length || 0) >= activeStep;
  const isAllDone = Object.keys(completedItems).every(key => {
    const k = Number(key);
    return (completedItems[k]?.length || 0) >= k;
  });

  const handleReset = () => {
    setActiveStep(5);
    setCompletedItems({ 5: [], 4: [], 3: [], 2: [], 1: [] });
    setInputValue('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-teal-500" />
            <span>Інтерактивна техніка заземлення 5-4-3-2-1</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Повертає свідомість у реальний часовий простір та вимикає каскад паніки
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Почати спочатку</span>
        </button>
      </div>

      {/* Step Progress Pills */}
      <div className="py-6 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {steps.map(s => {
          const isCurrent = activeStep === s.step;
          const count = completedItems[s.step]?.length || 0;
          const isComplete = count >= s.step;

          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`flex-1 min-w-[100px] p-3 rounded-2xl border text-center transition-all ${
                isCurrent
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 shadow-sm'
                  : isComplete
                  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 mb-1">
                {isComplete ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{s.step}</span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                {s.step === 5 ? 'Бачу' : s.step === 4 ? 'Торкаюсь' : s.step === 3 ? 'Чую' : s.step === 2 ? 'Запах' : 'Смак'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {count}/{s.step}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Step Content */}
      {isAllDone ? (
        <div className="p-8 my-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200">
            Чудова робота! Ви повністю заземлені.
          </h3>
          <p className="text-sm text-emerald-800 dark:text-emerald-300 max-w-lg mx-auto">
            Ви успішно пройшли всі 5 кроків сенсорного зв’язку з реальністю. Ваша нервова система повернулася до нормального ритму.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all"
          >
            Пройти ще раз
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700">
              {currentStepInfo.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentStepInfo.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                {currentStepInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Form to enter items */}
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={currentStepInfo.placeholder}
              disabled={isStepDone}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isStepDone || !inputValue.trim()}
              className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm disabled:opacity-50 transition-all shrink-0"
            >
              Додати
            </button>
          </form>

          {/* Items Listed */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Додано ({completedItems[activeStep]?.length || 0} із {activeStep}):
            </p>

            <div className="flex flex-wrap gap-2">
              {completedItems[activeStep]?.map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs font-medium flex items-center space-x-2 shadow-2xs"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => handleRemoveItem(activeStep, idx)}
                    className="text-teal-600 hover:text-teal-800 dark:text-teal-400 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}

              {(completedItems[activeStep]?.length || 0) === 0 && (
                <p className="text-xs text-slate-400 italic">Ще нічого не додано. Впишіть першу річ вище.</p>
              )}
            </div>
          </div>

          {/* Next Step Button */}
          {isStepDone && activeStep > 1 && (
            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Перейти до кроку {activeStep - 1} →
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
