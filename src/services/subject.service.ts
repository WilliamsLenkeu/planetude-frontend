import { api } from './api';
import type { Subject } from '../types';

export const subjectService = {
  getAll: async () => {
    const response = await api.get<any>('/subjects');
    return response?.data || response || [];
  },
  create: async (data: Partial<Subject>) => {
    const response = await api.post<any>('/subjects', data);
    return response?.data || response;
  },
  update: async (id: string, data: Partial<Subject>) => {
    const response = await api.put<any>(`/subjects/${id}`, data);
    return response?.data || response;
  },
  delete: async (id: string) => {
    return api.delete(`/subjects/${id}`);
  }
};
