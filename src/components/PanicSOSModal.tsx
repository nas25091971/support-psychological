import React, { useState, useEffect } from 'react';
import { ShieldAlert, HeartHandshake, PhoneCall, Sparkles, X, RotateCcw } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface PanicSOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchGrounding: () => void;
}

export const PanicSOSModal: React.FC<PanicSOSModalProps> = ({
  isOpen,
  onClose,
  onLaunchGrounding
}) => {
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);

  useEffect(() => {
    if (!isOpen) return;

    audioSynth.playBreathingTone('inhale');

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev > 1) return prev - 1;

        // Advance phase
        setBreathPhase(curr => {
          if (curr === 'inhale') {
            audioSynth.playBreathingTone('hold');
            return 'hold1';
          }
          if (curr === 'hold1') {
            audioSynth.playBreathingTone('exhale');
            return 'exhale';
          }
          if (curr === 'exhale') {
            audioSynth.playBreathingTone('hold');
            return 'hold2';
          }
          audioSynth.playBreathingTone('inhale');
          return 'inhale';
        });

        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const phaseDetails = {
    inhale: { title: 'Повільний ВДИХ', color: 'text-teal-400', bg: 'bg-teal-500/20 border-teal-500/40', scale: 'scale-125' },
    hold1: { title: 'ЗАУВАЖ ТА ЗАШУКАНЬ (Затримання)', color: 'text-amber-300', bg: 'bg-amber-500/20 border-amber-500/40', scale: 'scale-125' },
    exhale: { title: 'М’який ВИДИХ', color: 'text-sky-300', bg: 'bg-sky-500/20 border-sky-500/40', scale: 'scale-90' },
    hold2: { title: 'Спокійне ЗАУВАЖЕННЯ', color: 'text-emerald-300', bg: 'bg-emerald-500/20 border-emerald-500/40', scale: 'scale-90' }
  };

  const currPhase = phaseDetails[breathPhase];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in text-white">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Reassuring Header */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
          <ShieldAlert className="w-4 h-4" />
          <span>Режим допомоги при панічній атаці</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Ти зараз у безпеці. Це мине.
        </h2>
        <p className="text-slate-300 text-sm max-w-md mb-6 leading-relaxed">
          Панічна атака — це тимчасова реакція тіла на сплеск адреналіну. Вона безпечна і скоро закінчиться. Зосередься на колі нижче:
        </p>

        {/* Breathing Animation Circle */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Animated pulsing outer aura */}
          <div className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-emerald-500/30 flex items-center justify-center transition-all duration-1000 ${currPhase.scale} ${currPhase.bg}`}>
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-slate-800/80 border border-slate-700/80 flex flex-col items-center justify-center p-4 shadow-inner">
              <span className={`text-xs font-bold uppercase tracking-widest ${currPhase.color}`}>
                {currPhase.title}
              </span>
              <span className="text-4xl sm:text-5xl font-black text-white mt-1">
                {secondsLeft}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">сек</span>
            </div>
          </div>
        </div>

        {/* Quick Grounding & Hotline Call Buttons */}
        <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => {
              onClose();
              onLaunchGrounding();
            }}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-teal-600/30 transition-all active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Запустити заземлення 5-4-3-2-1</span>
          </button>

          <a
            href="tel:7333"
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition-all active:scale-98"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Подзвонити на 7333 (Lifeline)</span>
          </a>
        </div>

        {/* Calm Note */}
        <div className="mt-5 text-xs text-slate-400 flex items-center space-x-1.5">
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          <span>Зроби ще 3 повільні видихи. Твоє тіло вже розслабляється.</span>
        </div>

      </div>
    </div>
  );
};
