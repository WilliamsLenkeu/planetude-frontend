import { api } from './api';
import type { User } from '../types/index';

export const userService = {
  getProfile: async () => {
    return api.get<User>('/users/profile');
  },
  updateProfile: async (data: Partial<User>) => {
    return api.put<User>('/users/profile', data);
  },
  changePassword: async (data: any) => {
    return api.put<{ success: boolean; message: string }>('/users/change-password', data);
  }
};
