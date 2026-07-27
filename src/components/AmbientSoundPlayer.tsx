import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Waves, Bird, Wind, X } from 'lucide-react';
import { audioSynth, AmbientSoundType } from '../utils/audioSynth';

interface AmbientSoundPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  onAmbientStateChange: (active: boolean) => void;
}

export const AmbientSoundPlayer: React.FC<AmbientSoundPlayerProps> = ({
  isOpen,
  onClose,
  onAmbientStateChange
}) => {
  const [currentSound, setCurrentSound] = useState<AmbientSoundType>('none');
  const [volume, setVolume] = useState<number>(0.3);

  if (!isOpen) return null;

  const handleSelectSound = (type: AmbientSoundType) => {
    if (currentSound === type) {
      audioSynth.stopAmbient();
      setCurrentSound('none');
      onAmbientStateChange(false);
    } else {
      audioSynth.setAmbientSound(type, volume);
      setCurrentSound(type);
      onAmbientStateChange(type !== 'none');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    audioSynth.setVolume(newVol);
  };

  const sounds: { id: AmbientSoundType; label: string; icon: React.ReactNode }[] = [
    { id: 'nightingale', label: 'Спів солов’я та тихий ліс', icon: <Bird className="w-5 h-5 text-amber-500" /> },
    { id: 'flute', label: 'Бамбукова флейта для медитації (432 Гц)', icon: <Wind className="w-5 h-5 text-emerald-500" /> },
    { id: 'rain', label: 'Теплий літній дощ', icon: <CloudRain className="w-5 h-5 text-sky-500" /> },
    { id: 'waves', label: 'Морський прибій', icon: <Waves className="w-5 h-5 text-teal-500" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Аудіо-атмосфера релаксу
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Синтезується наживо у вашому браузері за допомогою Web Audio API. Працює 100% офлайн без завантаження зовнішніх файлів.
        </p>

        {/* Sound Selection Grid */}
        <div className="space-y-2">
          {sounds.map(s => {
            const isSelected = currentSound === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectSound(s.id as any)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs">
                    {s.icon}
                  </div>
                  <span className="text-xs sm:text-sm text-slate-900 dark:text-white">{s.label}</span>
                </div>

                {isSelected && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                    Грає...
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Volume Slider */}
        {currentSound !== 'none' && (
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Гучність:</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={() => handleSelectSound('none')}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center justify-center space-x-1 mx-auto"
          >
            <VolumeX className="w-4 h-4" />
            <span>Вимкнути аудіо повністю</span>
          </button>
        </div>

      </div>
    </div>
  );
};
