import { api } from './api';
import type { User } from '../types/index';

export const userService = {
  getProfile: async () => {
    const res = await api.get<any>('/auth/profile');
    return (res?.data ?? res) as User;
  },
  updateProfile: async (data: { name?: string; preferences?: Record<string, unknown> }) => {
    const res = await api.put<any>('/auth/profile', data);
    return (res?.data ?? res) as User;
  },
  /** Non disponible dans l'API modulaire actuelle */
  changePassword: async (_data: { currentPassword: string; newPassword: string }) => {
    throw new Error('Changement de mot de passe non implémenté côté API');
  }
};
