import { api } from './api';
import type { Planning } from '../types/index';

export const planningService = {
  getAll: async () => {
    const response = await api.get<any>('/planning');
    // Le backend peut renvoyer { plannings: [] } ou directement []
    if (response && response.plannings) return response.plannings;
    return Array.isArray(response) ? response : [];
  },
  getById: async (id: string) => {
    return api.get<Planning>(`/planning/${id}`);
  },
  create: async (data: any) => {
    return api.post<Planning>('/planning', data);
  },
  delete: async (id: string) => {
    return api.delete(`/planning/${id}`);
  }
};
