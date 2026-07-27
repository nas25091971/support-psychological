import { EmotionEntry, TestResultEntry, PersonalSafetyPlan } from '../types';

const STORAGE_KEYS = {
  JOURNAL: 'opora_journal_entries',
  TEST_RESULTS: 'opora_test_results',
  SAFETY_PLAN: 'opora_safety_plan',
  BOOKMARKS: 'opora_bookmarked_articles',
  THEME: 'opora_theme'
};

// Default empty Safety Plan template
export const DEFAULT_SAFETY_PLAN: PersonalSafetyPlan = {
  warningSigns: [
    'Раптове прискорення серцебиття та дратівливість',
    'Відчуття важкості в грудях чи браку повітря',
    'Бажання ізолюватися від усіх та вимкнути телефон'
  ],
  copingStrategies: [
    'Дихальна вправа «Квадратне дихання 4-4-4-4» (3 хвилини)',
    'Покрокове заземлення 5-4-3-2-1',
    'Прогулянка на свіжому повітрі або вмивання холодною водою'
  ],
  trustedContacts: [
    { name: 'Близька людина / Друг', phone: '', relation: 'Підтримка та вислуховування' }
  ],
  professionalContacts: [
    { name: 'Lifeline Ukraine', phone: '7333', note: 'Цілодобова гаряча лінія' },
    { name: 'Національна психологічна асоціація', phone: '0 800 100 102', note: 'Безкоштовно з 10:00 до 20:00' }
  ],
  safeEnvironmentSteps: [
    'Прибрати небезпечні предмети з досяжності',
    'Увімкнути спокійну приємну музику або спів солов’я',
    'Відкрити вікно для доступу свіжого повітря'
  ],
  reasonsToLive: [
    'Турбота про рідних та домашніх улюбленців',
    'Мрії про відновлення України та майбутні подорожі',
    'Бажання побачити нові світанки та обійняти близьких'
  ],
  lastUpdated: new Date().toISOString()
};

// Emotion Journal
export const getJournalEntries = (): EmotionEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveJournalEntry = (entry: EmotionEntry): EmotionEntry[] => {
  const current = getJournalEntries();
  const existingIdx = current.findIndex(e => e.id === entry.id);
  let updated: EmotionEntry[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = entry;
  } else {
    updated = [entry, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(updated));
  return updated;
};

export const deleteJournalEntry = (id: string): EmotionEntry[] => {
  const current = getJournalEntries();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(updated));
  return updated;
};

// Test Results History
export const getTestResults = (): TestResultEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveTestResult = (result: Omit<TestResultEntry, 'id'>): TestResultEntry[] => {
  const current = getTestResults();
  const newEntry: TestResultEntry = {
    ...result,
    id: `result_${Date.now()}`
  };
  const updated = [newEntry, ...current];
  localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(updated));
  return updated;
};

export const clearTestResults = (): TestResultEntry[] => {
  localStorage.removeItem(STORAGE_KEYS.TEST_RESULTS);
  return [];
};

export const deleteTestResult = (id: string): TestResultEntry[] => {
  const current = getTestResults();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(updated));
  return updated;
};

// Safety Plan
export const getSafetyPlan = (): PersonalSafetyPlan => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAFETY_PLAN);
    return data ? JSON.parse(data) : DEFAULT_SAFETY_PLAN;
  } catch {
    return DEFAULT_SAFETY_PLAN;
  }
};

export const saveSafetyPlan = (plan: PersonalSafetyPlan): PersonalSafetyPlan => {
  const updated = {
    ...plan,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.SAFETY_PLAN, JSON.stringify(updated));
  return updated;
};

// Article Bookmarks
export const getBookmarkedArticleIds = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleBookmarkArticle = (articleId: string): string[] => {
  const current = getBookmarkedArticleIds();
  const exists = current.includes(articleId);
  const updated = exists ? current.filter(id => id !== articleId) : [...current, articleId];
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  return updated;
};
