import { api } from './api';
import type { LoFiTrack } from '../types';

export const lofiService = {
  getAll: async () => {
    return api.get<LoFiTrack[]>('/lofi');
  },
  getByCategory: async (category: string) => {
    const res = await api.get<any>('/lofi', { params: { category } });
    const data = res?.data ?? res;
    return Array.isArray(data) ? data : [];
  },
  addTrack: async (trackData: Partial<LoFiTrack>) => {
    return api.post<{ success: boolean; message: string }>('/lofi', trackData);
  }
};
