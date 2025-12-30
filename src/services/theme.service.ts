import { api } from './api';
import type { Theme } from '../types';

export const themeService = {
  getAll: async () => {
    return api.get<Theme[]>('/themes');
  },
  unlock: async (key: string) => {
    return api.post<{ success: boolean; message: string }>(`/themes/unlock/${key}`, {});
  },
  set: async (key: string) => {
    return api.put<{ success: boolean; message: string; data: any }>(`/themes/set/${key}`, {});
  }
};
