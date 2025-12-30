import { api } from './api';

export interface Reminder {
  _id: string;
  title: string;
  date: string;
  planningId?: string;
}

export const reminderService = {
  getAll: async () => {
    const response = await api.get<any>('/reminders');
    return response?.data || response || [];
  },
  create: async (data: Partial<Reminder>) => {
    const response = await api.post<any>('/reminders', data);
    return response?.data || response;
  },
  update: async (id: string, data: Partial<Reminder>) => {
    return api.put<{ success: boolean; message: string }>(`/reminders/${id}`, data);
  },
  delete: async (id: string) => {
    return api.delete(`/reminders/${id}`);
  }
};
