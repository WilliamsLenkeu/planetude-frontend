import { api } from './api';
import type { LoFiTrack } from '../types';

export const lofiService = {
  getAll: async () => {
    return api.get<LoFiTrack[]>('/lofi');
  },
  getByCategory: async (category: string) => {
    return api.get<LoFiTrack[]>(`/lofi/category/${category}`);
  },
  addTrack: async (trackData: Partial<LoFiTrack>) => {
    return api.post<{ success: boolean; message: string }>('/lofi', trackData);
  }
};
