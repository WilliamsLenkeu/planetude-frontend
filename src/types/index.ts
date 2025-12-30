export interface ThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  gender?: string;
  preferences?: {
    themes?: string[];
    matieres?: string[];
    currentTheme?: string;
    unlockedThemes?: string[];
  };
  themeConfig?: ThemeConfig;
}

export interface Stats {
  gamification: {
    xp: number;
    level: number;
    streak: number;
    totalStudyTime: number;
  };
  completionRate: number;
  timeBySubject: Array<{ _id: string; totalMinutes: number }>;
  progressHistory: Array<{ date: string; sessionsCompletees: number; tempsEtudie: number }>;
}

export interface Planning {
  _id: string;
  periode: string;
  dateDebut?: string;
  sessions: Session[];
  createdAt: string;
  title?: string; // Gardé pour compatibilité UI
}

export interface Session {
  _id?: string;
  matiere: string;
  debut: string;
  fin: string;
  statut: 'en_attente' | 'termine' | 'annule';
  // Champs UI mappés
  id?: string;
  title?: string;
  subject?: string;
  duration?: number;
}

export interface Badge {
  _id: string;
  key: string;
  name: string;
  description: string;
  awardedAt?: string;
  icon?: string; // Gardé pour compatibilité UI
}

export interface LoFiTrack {
  _id: string;
  title: string;
  url: string;
  category: string;
  thumbnail?: string;
}

export interface Subject {
  _id: string;
  name: string;
  color: string;
  icon?: string;
  totalStudyTime?: number;
}

export interface ProgressSession {
  subjectId: string;
  durationMinutes: number;
  notes?: string;
  date?: string;
  xpGained?: number;
}

export interface ProgressSummary {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  rank: string;
}

export interface GlobalStats {
  totalStudyTime: number;
  averageSessionDuration: number;
  mostStudiedSubject: string;
  streakDays: number;
  completionRate?: number;
}

export interface SubjectStats {
  subject: string;
  minutes: number;
  color: string;
}

export interface Theme {
  _id?: string;
  key: string;
  name: string;
  priceXP?: number;
  price?: number; // Compatibilité
  previewUrl?: string;
  config?: {
    primaryColor: string;
    secondaryColor?: string;
    backgroundColor: string;
    fontFamily: string;
  };
  colors?: { // Compatibilité
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
