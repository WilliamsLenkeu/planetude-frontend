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
    const response = await api.get<any>('/progress/summary');
    // Le backend peut renvoyer directement les données ou les wrapper dans .data
    const d = response?.data || response;
    
    if (!d) {
      throw new Error('Données de progression introuvables');
    }

    return {
      totalXP: d.totalXP,
      level: d.level,
      xpToNextLevel: d.xpToNextLevel,
      rank: d.rank,
      streak: d.streak
    };
  }
};
