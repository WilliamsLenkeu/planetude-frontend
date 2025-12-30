import { api } from './api';
import type { ProgressSession, ProgressSummary } from '../types';

export const progressService = {
  getAll: async () => {
    return api.get<ProgressSession[]>('/progress');
  },
  recordSession: async (data: { subjectId: string; durationMinutes: number; notes?: string }) => {
    return api.post<{ success: boolean; message: string; data: { xpGained: number; newTotalXP: number } }>('/progress', data);
  },
  getSummary: async (): Promise<ProgressSummary> => {
    // L'endpoint /progress/summary renvoie une erreur 500 sur le serveur.
    // On récupère les infos depuis le profil utilisateur qui contient les mêmes données de gamification.
    const response = await api.get<any>('/users/profile');
    const userData = response.data || response;
    const g = userData.gamification || {};
    
    // Calcul du rang basé sur le niveau
    const getRank = (level: number) => {
      if (level >= 10) return "Maîtresse des Études 👑";
      if (level >= 5) return "Étoile Brillante ✨";
      if (level >= 2) return "Apprentie Studieuse 🎀";
      return "Débutante Adorable 🍭";
    };

    return {
      totalXP: g.totalXP || 0,
      level: g.level || 1,
      xpToNextLevel: (g.level || 1) * 100 - (g.xp || 0),
      rank: getRank(g.level || 1)
    };
  }
};
