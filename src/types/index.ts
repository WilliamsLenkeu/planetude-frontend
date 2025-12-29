export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  gender?: string;
  preferences?: {
    themes: string[];
    matieres: string[];
  };
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

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
