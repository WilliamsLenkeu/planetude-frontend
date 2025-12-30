import { api } from './api';
import type { Badge, User } from '../types/index';

export const userService = {
  getProfile: async () => {
    return api.get<User>('/users/profile');
  },
  updateProfile: async (data: Partial<User>) => {
    return api.put<User>('/users/profile', data);
  },
  changePassword: async (data: any) => {
    return api.put<{ success: boolean; message: string }>('/users/change-password', data);
  },
  // Ces méthodes sont conservées pour compatibilité mais devraient utiliser progressService/statsService
  getStats: async () => {
    return api.get<any>('/stats');
  },
  getBadges: async () => {
    return api.get<Badge[]>('/badges');
  }
};
