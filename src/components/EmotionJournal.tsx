import React, { useState } from 'react';
import { EmotionEntry } from '../types';
import { getJournalEntries, saveJournalEntry, deleteJournalEntry } from '../utils/storage';
import { BookOpen, Plus, Trash2, Calendar, Smile, Frown, Meh, Heart, Sparkles, TrendingUp, AlertTriangle, X } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const EmotionJournal: React.FC = () => {
  const [entries, setEntries] = useState<EmotionEntry[]>(getJournalEntries());
  const [isAdding, setIsAdding] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  // Form State
  const [moodScore, setMoodScore] = useState<number>(3);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [triggersInput, setTriggersInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [gratitudeInput, setGratitudeInput] = useState('');
  const [copingInput, setCopingInput] = useState('');

  const moodLabels = [
    { score: 1, label: 'Важко / Криза', icon: <Frown className="w-5 h-5 text-rose-500" />, color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200' },
    { score: 2, label: 'Тривожно / Сумно', icon: <Frown className="w-5 h-5 text-amber-500" />, color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200' },
    { score: 3, label: 'Нейтрально / Нормально', icon: <Meh className="w-5 h-5 text-sky-500" />, color: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200' },
    { score: 4, label: 'Спокійно / Затишно', icon: <Smile className="w-5 h-5 text-teal-500" />, color: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200' },
    { score: 5, label: 'Чудово / Натхненно', icon: <Smile className="w-5 h-5 text-emerald-500" />, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' }
  ];

  const availableEmotions = [
    'Тривога', 'Спокій', 'Втома', 'Надія', 'Сум', 'Роздратування', 'Вдячність', 'Страх',
    'Затишок', 'Самотність', 'Радість', 'Гордість', 'Безсилля', 'Провину', 'Апатія'
  ];

  const toggleEmotion = (emo: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emo) ? prev.filter(e => e !== emo) : [...prev, emo]
    );
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: EmotionEntry = {
      id: `entry_${Date.now()}`,
      date: new Date().toISOString(),
      moodScore,
      emotions: selectedEmotions,
      triggers: triggersInput ? triggersInput.split(',').map(s => s.trim()) : [],
      notes: notesInput.trim(),
      gratitude: gratitudeInput.trim(),
      copingStrategyUsed: copingInput.trim()
    };

    const updated = saveJournalEntry(newEntry);
    setEntries(updated);

    // Reset Form
    setIsAdding(false);
    setSelectedEmotions([]);
    setTriggersInput('');
    setNotesInput('');
    setGratitudeInput('');
    setCopingInput('');
  };

  const confirmDeleteEntry = () => {
    if (!deletingEntryId) return;
    const updated = deleteJournalEntry(deletingEntryId);
    setEntries(updated);
    setDeletingEntryId(null);
  };

  // Recharts Data Prep
  const chartData = [...entries].reverse().map(e => ({
    date: new Date(e.date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' }),
    mood: e.moodScore
  }));

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Локальний рефлексивний щоденник</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Щоденник емоцій та самопочуття
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Фіксуйте свій щоденний стан, тригери та моменти вдячності без збереження на сторонніх серверах.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(prev => !prev)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center space-x-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Закрити форму' : 'Додати новий запис'}</span>
        </button>
      </div>

      {/* Add Entry Form Modal/Section */}
      {isAdding && (
        <form onSubmit={handleSaveEntry} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-xl space-y-6 animate-fade-in">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span>Як ви почуваєтеся прямо зараз?</span>
          </h3>

          {/* Mood Scale Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Оцініть загальний рівень самопочуття (1 - Важко, 5 - Чудово):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {moodLabels.map(m => {
                const isSelected = moodScore === m.score;
                return (
                  <button
                    type="button"
                    key={m.score}
                    onClick={() => setMoodScore(m.score)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-bold shadow-xs ring-2 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {m.icon}
                    <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emotion Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Які емоції ви зараз відчуваєте (виберіть кілька):
            </label>
            <div className="flex flex-wrap gap-2">
              {availableEmotions.map(emo => {
                const isSelected = selectedEmotions.includes(emo);
                return (
                  <button
                    type="button"
                    key={emo}
                    onClick={() => toggleEmotion(emo)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {emo}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Можливі тригери або причини напруги (через кому):
              </label>
              <input
                type="text"
                value={triggersInput}
                onChange={e => setTriggersInput(e.target.value)}
                placeholder="наприклад: тривожні новини, втома від роботи"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Застосовані інструменти самодопомоги:
              </label>
              <input
                type="text"
                value={copingInput}
                onChange={e => setCopingInput(e.target.value)}
                placeholder="наприклад: Квадратне дихання, прогулянка"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Особисті думки та відчуття (Нотатка):
            </label>
            <textarea
              rows={2}
              value={notesInput}
              onChange={e => setNotesInput(e.target.value)}
              placeholder="Опишіть детальніше свої думки та тілесні відчуття..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Момент вдячності сьогодні:</span>
            </label>
            <input
              type="text"
              value={gratitudeInput}
              onChange={e => setGratitudeInput(e.target.value)}
              placeholder="За що ви можете подякувати собі або світу сьогодні?"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
            >
              Зберегти в щоденнику
            </button>
          </div>
        </form>
      )}

      {/* Recharts Analytics Chart */}
      {entries.length > 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Динаміка самопочуття за останні дні
            </h3>
          </div>

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[1, 5]} ticks={[1,2,3,4,5]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(value) => [`Бал самопочуття: ${value} / 5`]}
                />
                <Area type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Journal Entries List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">
          Збережені записи ({entries.length})
        </h3>

        {entries.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-6 italic text-center">
            Щоденник порожній. Натисніть кнопку «Додати новий запис» вище, щоб зробити перший відмітку.
          </p>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => {
              const moodInfo = moodLabels.find(m => m.score === entry.moodScore) || moodLabels[2];
              return (
                <div
                  key={entry.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 ${moodInfo.color}`}>
                        {moodInfo.icon}
                        <span>{moodInfo.label}</span>
                      </span>

                      <span className="text-xs text-slate-500 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(entry.date).toLocaleDateString('uk-UA')} о {new Date(entry.date).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeletingEntryId(entry.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Видалити запис"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Emotions list */}
                  {entry.emotions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {entry.emotions.map((emo, idx) => (
                        <span key={idx} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                          {emo}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {entry.notes && (
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {entry.notes}
                    </p>
                  )}

                  {/* Gratitude & Coping */}
                  {(entry.gratitude || entry.copingStrategyUsed) && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                      {entry.gratitude && (
                        <p className="text-emerald-800 dark:text-emerald-300 font-medium">
                          <strong>Вдячність:</strong> {entry.gratitude}
                        </p>
                      )}
                      {entry.copingStrategyUsed && (
                        <p className="text-slate-600 dark:text-slate-400">
                          <strong>Самодопомога:</strong> {entry.copingStrategyUsed}
                        </p>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deletingEntryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Видалити запис зі щоденника?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Цей запис буде вилучено з вашого локального сховища без можливості відновлення.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeletingEntryId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeletingEntryId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={confirmDeleteEntry}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Так, видалити
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
