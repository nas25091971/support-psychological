import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Info, ShieldCheck } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

export const BreathingExercise: React.FC = () => {
  const [exerciseType, setExerciseType] = useState<'box' | '478'>('box');
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Phase state: 'inhale' | 'hold1' | 'exhale' | 'hold2'
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timing definitions
  const timing = exerciseType === 'box'
    ? { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }
    : { inhale: 4, hold1: 7, exhale: 8, hold2: 0 };

  useEffect(() => {
    // Reset when exercise type changes
    setIsActive(false);
    setPhase('inhale');
    setSecondsRemaining(timing.inhale);
    setCompletedCycles(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [exerciseType]);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (!isMuted) {
      if (phase === 'inhale') audioSynth.playBreathingTone('inhale');
      else if (phase === 'hold1' || phase === 'hold2') audioSynth.playBreathingTone('hold');
      else if (phase === 'exhale') audioSynth.playBreathingTone('exhale');
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev > 1) return prev - 1;

        // Transition phase
        if (phase === 'inhale') {
          setPhase('hold1');
          return timing.hold1;
        } else if (phase === 'hold1') {
          setPhase('exhale');
          return timing.exhale;
        } else if (phase === 'exhale') {
          if (timing.hold2 > 0) {
            setPhase('hold2');
            return timing.hold2;
          } else {
            setCompletedCycles(c => c + 1);
            setPhase('inhale');
            return timing.inhale;
          }
        } else if (phase === 'hold2') {
          setCompletedCycles(c => c + 1);
          setPhase('inhale');
          return timing.inhale;
        }
        return timing.inhale;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, exerciseType, isMuted]);

  const handleTogglePlay = () => {
    setIsActive(prev => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setSecondsRemaining(timing.inhale);
    setCompletedCycles(0);
  };

  const phaseConfig = {
    inhale: {
      title: 'ВДИХ',
      instruction: 'Повільно вдихайте через ніс, заповнюючи легені',
      color: 'text-teal-600 dark:text-teal-300',
      bgRing: 'border-teal-500/50 bg-teal-500/10 scale-125',
      accentBg: 'bg-teal-500'
    },
    hold1: {
      title: 'ЗАТРИМКА ДИХАННЯ',
      instruction: 'Затримайте дихання без напруження в м’язах',
      color: 'text-amber-600 dark:text-amber-300',
      bgRing: 'border-amber-500/50 bg-amber-500/10 scale-125',
      accentBg: 'bg-amber-500'
    },
    exhale: {
      title: 'ВИДИХ',
      instruction: 'Плавний м’який видих через вуста',
      color: 'text-sky-600 dark:text-sky-300',
      bgRing: 'border-sky-500/50 bg-sky-500/10 scale-90',
      accentBg: 'bg-sky-500'
    },
    hold2: {
      title: 'ПАУЗА',
      instruction: 'Затримайте подих перед наступним вдихом',
      color: 'text-emerald-600 dark:text-emerald-300',
      bgRing: 'border-emerald-500/50 bg-emerald-500/10 scale-90',
      accentBg: 'bg-emerald-500'
    }
  };

  const currentPhaseInfo = phaseConfig[phase];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
      
      {/* Exercise Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-emerald-500" />
            <span>Інтерактивні дихальні тренажери</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Зменшують частоту серцевих скорочень та знімають гострий стрес
          </p>
        </div>

        <div className="flex items-center space-x-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <button
            onClick={() => setExerciseType('box')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              exerciseType === 'box'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Квадратне (4-4-4-4)
          </button>
          <button
            onClick={() => setExerciseType('478')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              exerciseType === '478'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Релакс (4-7-8)
          </button>
        </div>
      </div>

      {/* Main Breathing Visualizer Stage */}
      <div className="py-8 flex flex-col items-center justify-center">
        
        {/* Animated Circle Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4">
          
          {/* Animated pulsing ring */}
          <div
            className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ease-in-out ${currentPhaseInfo.bgRing}`}
          />

          {/* Inner Display Box */}
          <div className="z-10 w-48 h-48 sm:w-52 sm:h-52 rounded-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 shadow-xl text-center">
            
            <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${currentPhaseInfo.color}`}>
              {currentPhaseInfo.title}
            </span>

            <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight my-1">
              {secondsRemaining}
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              секунд
            </span>

            {/* Cycle Count */}
            <div className="mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
              Цикл: {completedCycles}
            </div>

          </div>
        </div>

        {/* Phase Instruction Banner */}
        <div className="max-w-md text-center mt-2 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {currentPhaseInfo.instruction}
          </p>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center space-x-3">
          
          <button
            onClick={handleTogglePlay}
            className={`px-6 py-3 rounded-2xl font-bold text-sm sm:text-base flex items-center space-x-2 shadow-lg transition-all active:scale-95 ${
              isActive
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Пауза</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Розпочати дихання</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            title="Скинути"
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsMuted(prev => !prev)}
            title={isMuted ? 'Увімкнути звукові підказки' : 'Вимкнути звукові підказки'}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          </button>

        </div>

      </div>

      {/* Guide Note */}
      <div className="mt-4 p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200 flex items-start space-x-3">
        <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            {exerciseType === 'box' ? 'Як працює Квадратне дихання (4-4-4-4):' : 'Як працює техніка 4-7-8 (Релаксація для сну):'}
          </p>
          <p className="leading-relaxed">
            {exerciseType === 'box'
              ? 'Використовується бійцями спецоперацій та психотерапевтами для миттєвої стабілізації пульсу та повернення чіткості мислення під час тривоги.'
              : 'Сповільнює серцевий ритм, насичує кров киснем та готує нервову систему до глибокого здорового сну.'}
          </p>
        </div>
      </div>

    </div>
  );
};
