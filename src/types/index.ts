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
    matieres?: string[];
    hasCompletedSetup?: boolean;
  };
  themeConfig?: {
    primary?: string;
    font?: string;
  };
}

export interface GlobalStats {
  totalStudyTime: number;
  masteryRadar: Array<{ subject: string; score: number }>;
  level: number;
  xp: number;
  recentXP?: Array<{ date: string; xp: number }>;
  // Optionnels pour compatibilité UI
  averageSessionDuration?: number;
  mostStudiedSubject?: string;
  streakDays?: number;
  completionRate?: number;
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
  titre: string;
  periode: 'jour' | 'semaine' | 'mois' | 'semestre';
  nombre: number;
  dateDebut: string;
  generatedBy?: 'AI' | 'LOCAL';
  sessions: Session[];
  sessionsCount?: number;
  createdAt?: string;
  userId?: string;
}

export interface Session {
  _id?: string;
  matiere: string;
  debut: string;
  fin: string;
  type?: string;
  method?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  statut: 'planifie' | 'en_cours' | 'termine' | 'rate';
  notes?: string;
  // Champs legacy pour compatibilité UI si nécessaire pendant la transition
  subjectId?: string;
  id?: string;
}

export interface Subject {
  _id: string;
  name: string;
  color: string;
}

export interface LoFiTrack {
  _id?: string;
  title: string;
  artist: string;
  audioUrl?: string; // API field
  url: string; // Used in frontend
  thumbnail?: string;
  category?: string;
}

export interface ProgressSession {
  matiere?: string;
  subjectId?: string;
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
  streak: number;
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
  description?: string;
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
