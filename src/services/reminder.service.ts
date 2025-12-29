import { api } from './api';

export interface Reminder {
  id: string;
  title: string;
  time: string;
}

export const reminderService = {
  getAll: async () => {
    return api.get<Reminder[]>('/reminders');
  },
  create: async (data: any) => {
    return api.post<Reminder>('/reminders', data);
  }
};
