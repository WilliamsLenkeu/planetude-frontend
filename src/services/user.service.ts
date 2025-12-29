import { api } from './api';
import type { Stats, Badge, User } from '../types/index';

export const userService = {
  getStats: async () => {
    return api.get<Stats>('/stats');
  },
  getBadges: async () => {
    return api.get<Badge[]>('/badges');
  },
  getProfile: async () => {
    return api.get<User>('/user/profile');
  },
  updateProgress: async (data: any) => {
    return api.post<Stats>('/progress', data);
  }
};
