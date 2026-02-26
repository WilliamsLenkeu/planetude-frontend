import { api } from './api';

export const themeService = {
  getAll: async () => {
    const res = await api.get<any>('/themes');
    const data = res?.data ?? res;
    return Array.isArray(data) ? data : [];
  },
  /** Débloque un thème via le profil utilisateur */
  unlock: async (themeKey: string) => {
    return api.post<{ success: boolean; message: string }>('/auth/unlock-theme', { themeKey });
  },
  /** Définition du thème courant : non disponible dans le module themes actuel */
  set: async (_key: string) => {
    throw new Error('Changement de thème non implémenté côté API');
  },
  updateCustom: async (themeConfig: { primary: string; font: string }) => {
    return api.put<{ success: boolean; message: string; data: any }>('/auth/profile', {
      preferences: { themeConfig }
    });
  }
};
