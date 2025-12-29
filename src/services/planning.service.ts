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
    const response = await api.post<any>('/planning', data);
    // On normalise la réponse pour toujours renvoyer l'objet planning
    if (response && response.planning) return response.planning;
    if (response && response.data && response.data.planning) return response.data.planning;
    return response;
  },
  delete: async (id: string) => {
    return api.delete(`/planning/${id}`);
  }
};
