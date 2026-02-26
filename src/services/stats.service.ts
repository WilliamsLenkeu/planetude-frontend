import { api } from './api';
import type { GlobalStats } from '../types';

/** /api/stats n'est pas monté. Utilise /progress/summary uniquement. */
export const statsService = {
  getGlobalStats: async (): Promise<GlobalStats> => {
    const summaryRes = await api.get<any>('/progress/summary');
    const summary = summaryRes?.data ?? summaryRes;

    if (!summary) {
      throw new Error('Résumé de progression introuvable');
    }

    const totalStudyTime = summary.totalStudyTime ?? 0;

    return {
      xp: summary.totalXP ?? 0,
      level: summary.level ?? 1,
      streakDays: summary.streak ?? 0,
      totalStudyTime,
      masteryRadar: [],
      averageSessionDuration: summary.averageSessionDuration ?? 0,
      mostStudiedSubject: 'Aucune',
      completionRate: summary.completionRate ?? 0
    };
  },
  /** Non disponible : /api/stats non monté */
  getStatsBySubject: async () => {
    return [];
  },
  /** Non disponible : /api/stats non monté */
  getHeatmapData: async () => {
    return [];
  }
};
