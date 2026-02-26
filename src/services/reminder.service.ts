import { api } from './api';

export interface Reminder {
  _id: string;
  title: string;
  date: string;
  planningId?: string;
}

/** /api/reminders n'existe pas (module non implémenté côté backend). */
export const reminderService = {
  getAll: async (): Promise<Reminder[]> => {
    try {
      const response = await api.get<any>('/reminders');
      return response?.data ?? response ?? [];
    } catch {
      return [];
    }
  },
  create: async (_data: Partial<Reminder>) => {
    throw new Error('Module rappels non implémenté côté API');
  },
  update: async (_id: string, _data: Partial<Reminder>) => {
    throw new Error('Module rappels non implémenté côté API');
  },
  delete: async (_id: string) => {
    throw new Error('Module rappels non implémenté côté API');
  }
};
