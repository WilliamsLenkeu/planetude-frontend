import { api } from './api';
import type { GlobalStats, SubjectStats } from '../types';

export const statsService = {
  getGlobalStats: async () => {
    return api.get<GlobalStats>('/stats');
  },
  getStatsBySubject: async () => {
    return api.get<SubjectStats[]>('/stats/subjects');
  }
};
