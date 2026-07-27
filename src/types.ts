export type TabType = 'home' | 'tools' | 'tests' | 'journal' | 'articles' | 'safety-plan';

export interface Hotline {
  id: string;
  title: string;
  phone: string;
  displayPhone: string;
  description: string;
  hours: string;
  organization: string;
  category: 'general' | 'veterans' | 'women' | 'youth' | 'government';
  recommendedFor: string[];
}

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    score: number;
  }[];
}

export interface ResultBracket {
  minScore: number;
  maxScore: number;
  level: string;
  colorClass: string;
  bgClass: string;
  description: string;
  recommendations: string[];
  requiresProfessionalHelp?: boolean;
}

export interface SelfTest {
  id: 'phq-9' | 'gad-7' | 'burnout';
  title: string;
  subtitle: string;
  timeEstimate: string;
  description: string;
  clinicalPurpose: string;
  questions: Question[];
  brackets: ResultBracket[];
}

export interface TestResultEntry {
  id: string;
  testId: 'phq-9' | 'gad-7' | 'burnout';
  testTitle: string;
  score: number;
  maxScore: number;
  level: string;
  date: string;
  notes?: string;
}

export interface EmotionEntry {
  id: string;
  date: string; // ISO string
  moodScore: number; // 1 to 5 (1: Дуже важко, 2: Тривожно/Сумно, 3: Нейтрально, 4: Спокійно, 5: Чудово/Натхненно)
  emotions: string[];
  triggers: string[];
  notes: string;
  gratitude: string;
  copingStrategyUsed?: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'anxiety' | 'ptsd' | 'burnout' | 'sleep' | 'support' | 'techniques';
  categoryLabel: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  content: {
    heading?: string;
    text: string;
    bulletPoints?: string[];
  }[];
}

export interface PersonalSafetyPlan {
  warningSigns: string[];
  copingStrategies: string[];
  trustedContacts: { name: string; phone: string; relation: string }[];
  professionalContacts: { name: string; phone: string; note: string }[];
  safeEnvironmentSteps: string[];
  reasonsToLive: string[];
  lastUpdated: string;
}
