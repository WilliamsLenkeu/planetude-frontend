import { api } from './api';
import type { GlobalStats } from '../types';

export const statsService = {
  getGlobalStats: async (): Promise<GlobalStats> => {
    const [summaryRes, subjectsRes] = await Promise.all([
      api.get<any>('/progress/summary'),
      api.get<any>('/stats/subjects')
    ]);

    const summary = summaryRes?.data || summaryRes;
    const subjects = subjectsRes?.data || subjectsRes || [];

    if (!summary) {
      throw new Error('Résumé de progression introuvable');
    }

    // Calculer le temps total à partir des matières
    const totalStudyTime = Array.isArray(subjects) 
      ? subjects.reduce((acc, curr) => acc + (curr.totalMinutes || 0), 0)
      : 0;

    return {
      xp: summary.totalXP,
      level: summary.level,
      streakDays: summary.streak,
      totalStudyTime,
      masteryRadar: Array.isArray(subjects) 
        ? subjects.map(s => ({
            subject: s.subject || s.name,
            score: s.percentage || 0
          }))
        : [],
      averageSessionDuration: totalStudyTime / (Array.isArray(subjects) && subjects.length > 0 ? subjects.length : 1),
      mostStudiedSubject: Array.isArray(subjects) && subjects.length > 0 
        ? [...subjects].sort((a, b) => (b.totalMinutes || 0) - (a.totalMinutes || 0))[0]?.subject || 'Aucune'
        : 'Aucune',
      completionRate: 100 
    };
  },
  getStatsBySubject: async () => {
    const res = await api.get<{ success: boolean; data: any[] }>('/stats/subjects');
    return res.data;
  },
  getHeatmapData: async () => {
    const res = await api.get<{ success: boolean; data: any[] }>('/stats/heatmap');
    return res.data;
  }
};
