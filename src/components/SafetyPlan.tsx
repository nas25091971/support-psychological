import React, { useState, useEffect } from 'react';
import { PersonalSafetyPlan } from '../types';
import { getSafetyPlan, saveSafetyPlan } from '../utils/storage';
import { ShieldCheck, Plus, Trash2, Save, Printer, Phone, Heart, AlertTriangle, Sparkles, Download, Copy, Check, Lock } from 'lucide-react';

export const SafetyPlan: React.FC = () => {
  const [plan, setPlan] = useState<PersonalSafetyPlan>(getSafetyPlan());
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-save plan to localStorage on change
  useEffect(() => {
    saveSafetyPlan(plan);
  }, [plan]);

  // Helper adding items
  const [newWarning, setNewWarning] = useState('');
  const [newCoping, setNewCoping] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const handleSave = () => {
    const updated = saveSafetyPlan(plan);
    setPlan(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const addWarning = () => {
    if (!newWarning.trim()) return;
    setPlan(prev => ({ ...prev, warningSigns: [...prev.warningSigns, newWarning.trim()] }));
    setNewWarning('');
  };

  const removeWarning = (idx: number) => {
    setPlan(prev => ({ ...prev, warningSigns: prev.warningSigns.filter((_, i) => i !== idx) }));
  };

  const addCoping = () => {
    if (!newCoping.trim()) return;
    setPlan(prev => ({ ...prev, copingStrategies: [...prev.copingStrategies, newCoping.trim()] }));
    setNewCoping('');
  };

  const removeCoping = (idx: number) => {
    setPlan(prev => ({ ...prev, copingStrategies: prev.copingStrategies.filter((_, i) => i !== idx) }));
  };

  const addReason = () => {
    if (!newReason.trim()) return;
    setPlan(prev => ({ ...prev, reasonsToLive: [...prev.reasonsToLive, newReason.trim()] }));
    setNewReason('');
  };

  const removeReason = (idx: number) => {
    setPlan(prev => ({ ...prev, reasonsToLive: prev.reasonsToLive.filter((_, i) => i !== idx) }));
  };

  const addContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    setPlan(prev => ({
      ...prev,
      trustedContacts: [...prev.trustedContacts, { name: newContactName.trim(), phone: newContactPhone.trim(), relation: 'Контакт підтримки' }]
    }));
    setNewContactName('');
    setNewContactPhone('');
  };

  const removeContact = (idx: number) => {
    setPlan(prev => ({ ...prev, trustedContacts: prev.trustedContacts.filter((_, i) => i !== idx) }));
  };

  const generatePlanText = () => {
    const dateStr = new Date().toLocaleDateString('uk-UA');
    return `=== ОПОРА: Особистий план безпеки та підтримки ===
Дата створення/оновлення: ${dateStr}

1. ОЗНАКИ ПОГІРШЕННЯ СТАНУ (ТРИГЕРИ):
${plan.warningSigns.length > 0 ? plan.warningSigns.map(item => `- ${item}`).join('\n') : '- (Не вказано)'}

2. ОСОБИСТІ ІНСТРУМЕНТИ ЗАСПОКОЄННЯ:
${plan.copingStrategies.length > 0 ? plan.copingStrategies.map(item => `- ${item}`).join('\n') : '- (Не вказано)'}

3. ДОВІРЕНІ ЛЮДИ ТА КОНТАКТИ ПІДТРИМКИ:
${plan.trustedContacts.length > 0 ? plan.trustedContacts.map(c => `- ${c.name}: ${c.phone} (${c.relation || 'Контакт'})`).join('\n') : '- (Не вказано)'}

4. МОЇ СЕНСИ ТА ЦІННОСТІ (ЗА ЩО ТРИМАТИСЯ):
${plan.reasonsToLive.length > 0 ? plan.reasonsToLive.map(item => `- ${item}`).join('\n') : '- (Не вказано)'}

5. ЕКСТРЕНІ ГАРЯЧІ ЛІНІЇ ДИСПОЗИЦІЙНОЇ ПІДТРИМКИ 24/7:
- 1547: Урядова гаряча лінія запобігання насильству
- 7333: Лінія запобігання самогубствам та підтримки ветеранів (Lifeline Ukraine)
- 0 800 501 212: Телефон довіри НПА (Національна психологічна асоціація)

Збережено локально на пристрої • Платформа «ОПОРА»
    `.trim();
  };

  const handlePrint = () => {
    try {
      // Try opening printable popup window for cleanest rendering
      const printWin = window.open('', '_blank', 'width=800,height=900');
      if (printWin) {
        const dateStr = new Date().toLocaleDateString('uk-UA');
        printWin.document.write(`
          <!DOCTYPE html>
          <html lang="uk">
          <head>
            <meta charset="UTF-8">
            <title>Особистий план безпеки — ОПОРА</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #0f172a; line-height: 1.5; }
              h1 { font-size: 22px; color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 8px; margin-bottom: 4px; }
              .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
              .box { margin-bottom: 16px; padding: 14px 18px; border: 1px solid #cbd5e1; border-radius: 12px; background: #f8fafc; }
              .box-title { font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 8px; }
              ul { margin: 0; padding-left: 18px; font-size: 13px; }
              li { margin-bottom: 4px; }
              .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
            </style>
          </head>
          <body>
            <h1>ОПОРА — Особистий план безпеки та підтримки</h1>
            <div class="meta">Дата роздруківки: ${dateStr} • Збережено локально на пристрої</div>

            <div class="box">
              <div class="box-title">1. Ознаки погіршення стану (тригери):</div>
              <ul>
                ${plan.warningSigns.length > 0 ? plan.warningSigns.map(s => `<li>${s}</li>`).join('') : '<li><i>Не вказано</i></li>'}
              </ul>
            </div>

            <div class="box">
              <div class="box-title">2. Особисті інструменти заспокоєння:</div>
              <ul>
                ${plan.copingStrategies.length > 0 ? plan.copingStrategies.map(s => `<li>${s}</li>`).join('') : '<li><i>Не вказано</i></li>'}
              </ul>
            </div>

            <div class="box">
              <div class="box-title">3. Довірені люди та контакти підтримки:</div>
              <ul>
                ${plan.trustedContacts.length > 0 ? plan.trustedContacts.map(c => `<li><strong>${c.name}</strong>: ${c.phone}</li>`).join('') : '<li><i>Не вказано</i></li>'}
              </ul>
            </div>

            <div class="box">
              <div class="box-title">4. Мої сенси та цінності (за що триматися):</div>
              <ul>
                ${plan.reasonsToLive.length > 0 ? plan.reasonsToLive.map(s => `<li>${s}</li>`).join('') : '<li><i>Не вказано</i></li>'}
              </ul>
            </div>

            <div class="box">
              <div class="box-title">5. Цілодобові безкоштовні гарячі лінії підтримки:</div>
              <ul>
                <li><strong>7333</strong> — Лінія запобігання самогубствам та підтримки ветеранів</li>
                <li><strong>1547</strong> — Урядова гаряча лінія з протидії насильству</li>
                <li><strong>0 800 501 212</strong> — Телефон довіри НПА</li>
              </ul>
            </div>

            <div class="footer">
              Конфіденційний документ • Платформа психологічної самодопомоги «ОПОРА»
            </div>

            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
          </html>
        `);
        printWin.document.close();
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  };

  const handleDownloadTxt = () => {
    const text = generatePlanText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `План_безпеки_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyPlan = () => {
    const text = generatePlanText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Intro */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 print:shadow-none print:border-none print:p-0">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold print:hidden">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Особистий антикризовий орієнтир</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Особистий план безпеки та підтримки
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Створіть свій покроковий алгоритм дій на випадок гострої емоційної кризи. План зберігається суворо локально.
          </p>
          <div className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 print:hidden">
            <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Зберігається приватними даними на цьому пристрої (без серверів).</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 print:hidden shrink-0">
          <button
            onClick={handlePrint}
            title="Друк плану або збереження в PDF"
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Друк / PDF</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            title="Завантажити текстовий файл плану"
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Завантажити .txt</span>
          </button>

          <button
            onClick={handleCopyPlan}
            title="Скопіювати план у буфер обміну"
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Скопійовано!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Скопіювати</span>
              </>
            )}
          </button>

          <button
            onClick={handleSave}
            title="Зберегти план у локальне сховище вашого браузера"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Збережено локально!' : 'Зберегти план'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Step 1: Warning Signs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 print:border-slate-300 print:shadow-none">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>1. Ознаки погіршення стану (тригери)</span>
          </h3>

          <div className="space-y-2">
            {plan.warningSigns.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>{item}</span>
                <button onClick={() => removeWarning(idx)} className="text-rose-500 hover:text-rose-700 print:hidden cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1 print:hidden">
            <input
              type="text"
              value={newWarning}
              onChange={e => setNewWarning(e.target.value)}
              placeholder="Додати маркер погіршення стану..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button onClick={addWarning} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step 2: Internal Coping */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 print:border-slate-300 print:shadow-none">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-teal-500 shrink-0" />
            <span>2. Особисті інструменти заспокоєння</span>
          </h3>

          <div className="space-y-2">
            {plan.copingStrategies.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>{item}</span>
                <button onClick={() => removeCoping(idx)} className="text-rose-500 hover:text-rose-700 print:hidden cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1 print:hidden">
            <input
              type="text"
              value={newCoping}
              onChange={e => setNewCoping(e.target.value)}
              placeholder="Додати техніку заспокоєння..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button onClick={addCoping} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step 3: Trusted Contacts */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 print:border-slate-300 print:shadow-none">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
            <Phone className="w-5 h-5 text-sky-500 shrink-0" />
            <span>3. Довірені люди та контакти підтримки</span>
          </h3>

          <div className="space-y-2">
            {plan.trustedContacts.map((contact, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{contact.name}</p>
                  <a href={`tel:${contact.phone}`} className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">{contact.phone}</a>
                </div>
                <button onClick={() => removeContact(idx)} className="text-rose-500 hover:text-rose-700 print:hidden cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 print:hidden">
            <input
              type="text"
              value={newContactName}
              onChange={e => setNewContactName(e.target.value)}
              placeholder="Ім’я людини..."
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newContactPhone}
                onChange={e => setNewContactPhone(e.target.value)}
                placeholder="Номер телефону..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              <button onClick={addContact} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Step 4: Reasons to Live */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 print:border-slate-300 print:shadow-none">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />
            <span>4. Мої сенси та цінності (за що триматися)</span>
          </h3>

          <div className="space-y-2">
            {plan.reasonsToLive.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 text-xs font-medium text-rose-900 dark:text-rose-200 flex items-center justify-between">
                <span>{item}</span>
                <button onClick={() => removeReason(idx)} className="text-rose-500 hover:text-rose-700 print:hidden cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1 print:hidden">
            <input
              type="text"
              value={newReason}
              onChange={e => setNewReason(e.target.value)}
              placeholder="Що надає вам сил та натхнення жити..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button onClick={addReason} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

