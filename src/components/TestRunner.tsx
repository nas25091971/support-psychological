import React, { useState } from 'react';
import { SelfTest, TestResultEntry } from '../types';
import { CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, RotateCcw, Printer, ShieldCheck, PhoneCall, Download, Copy, Check } from 'lucide-react';
import { saveTestResult } from '../utils/storage';

interface TestRunnerProps {
  test: SelfTest;
  onBack: () => void;
  onOpenCrisisModal: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({ test, onBack, onOpenCrisisModal }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedResult, setSavedResult] = useState<TestResultEntry | null>(null);
  const [copied, setCopied] = useState(false);

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / test.questions.length) * 100);

  const handleSelectOption = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const calculateScore = (): number => {
    return (Object.values(answers) as number[]).reduce((sum: number, val: number) => sum + val, 0);
  };

  const getResultBracket = (score: number) => {
    return (
      test.brackets.find(b => score >= b.minScore && score <= b.maxScore) ||
      test.brackets[test.brackets.length - 1]
    );
  };

  const handleSubmit = () => {
    if (answeredCount < test.questions.length) return;
    const score = calculateScore();
    const bracket = getResultBracket(score);

    const result = saveTestResult({
      testId: test.id,
      testTitle: test.title,
      score,
      maxScore: test.questions.length * 3,
      level: bracket.level,
      date: new Date().toISOString()
    })[0];

    setSavedResult(result);
    setIsSubmitted(true);
  };

  const generateReportText = () => {
    const score = calculateScore();
    const maxScore = test.questions.length * 3;
    const bracket = getResultBracket(score);
    const dateStr = new Date().toLocaleDateString('uk-UA');

    return `=== ОПОРА: Результат тестування ===
Тест: ${test.title}
Дата: ${dateStr}
Результат: ${score} із ${maxScore} балів
Рівень: ${bracket.level}

Опис стану:
${bracket.description}

Рекомендовані кроки та поради:
${bracket.recommendations.map(r => `- ${r}`).join('\n')}

Застереження:
Результати тестування мають виключно ознайомчий та освітній характер і не є клінічним діагнозом.
    `.trim();
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      handleDownloadReport();
    }
  };

  const handleDownloadReport = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Результат_тесту_${test.id}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyResult = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (isSubmitted) {
    const score = calculateScore();
    const maxScore = test.questions.length * 3;
    const bracket = getResultBracket(score);

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in print:shadow-none print:border-none">
        
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 print:hidden">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад до списку тестів</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              title="Друк результатів або збереження у PDF"
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Друк / PDF</span>
            </button>

            <button
              onClick={handleDownloadReport}
              title="Завантажити текстовий файл результату"
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Завантажити .txt</span>
            </button>

            <button
              onClick={handleCopyResult}
              title="Скопіювати текст результату"
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Скопійовано!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Скопіювати</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Card */}
        <div className={`p-6 rounded-2xl border ${bracket.bgClass} space-y-4`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Результат тестування ({test.title})
            </span>
            <span className="text-xs text-slate-500">
              {new Date().toLocaleDateString('uk-UA')}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold ${bracket.colorClass}`}>
                {bracket.level}
              </h2>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
                {bracket.description}
              </p>
            </div>

            <div className="text-center sm:text-right shrink-0 p-3 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {score}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                із {maxScore} балів
              </span>
            </div>
          </div>
        </div>

        {/* Professional Help Notice if needed */}
        {bracket.requiresProfessionalHelp && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm">Рекомендовано звернутися за підтримкою фахівця</p>
              <p className="text-xs leading-relaxed">
                Ваші бали вказують на помірний або виражений стан. Ви можете безкоштовно та анонімно проконсультуватися з психологом на гарячій лінії НПА (0 800 100 102) або Lifeline (7333).
              </p>
              <button
                onClick={onOpenCrisisModal}
                className="mt-2 text-xs font-bold underline text-rose-700 dark:text-rose-300 flex items-center space-x-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Відкрити номери гарячих ліній</span>
              </button>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Дбайливі поради та подальші кроки:</span>
          </h3>

          <ul className="space-y-2">
            {bracket.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-slate-800">
          <strong>Клінічна примітка:</strong> Результати даного самотестування мають виключно ознайомчий та освітній характер. Опитувальник не є клінічним діагнозом та не замінює очного обстеження лікаря-психіатра або кваліфікованого психотерапевта.
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-between print:hidden">
          <button
            onClick={() => {
              setIsSubmitted(false);
              setAnswers({});
              setCurrentQuestionIndex(0);
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Пройти тест заново</span>
          </button>

          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
          >
            Завершити
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Скасувати</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Питання {currentQuestionIndex + 1} з {test.questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-emerald-500 h-2 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="space-y-4 py-2">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
          {currentQuestion.text}
        </h3>

        <div className="space-y-2.5 pt-2">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = answers[currentQuestion.id] === opt.score;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(currentQuestion.id, opt.score)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-sm">{opt.label}</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-40"
        >
          ← Попереднє
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={answeredCount < test.questions.length}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md disabled:opacity-50 transition-all"
          >
            Отримати результат
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
            disabled={answers[currentQuestion.id] === undefined}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md disabled:opacity-50 flex items-center space-x-1"
          >
            <span>Наступне</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
