import { api } from './api';
import type { Subject } from '../types/index';

export const subjectService = {
  getAll: async (): Promise<Subject[]> => {
    const response = await api.get<any>('/subjects');
    const subjects = response?.data || response || [];
    return subjects.map((s: any) => ({
      ...s,
      _id: s._id || s.id
    }));
  },
  create: async (data: Partial<Subject>): Promise<Subject> => {
    const response = await api.post<any>('/subjects', data);
    const subject = response?.data || response;
    return {
      ...subject,
      _id: subject._id || subject.id
    };
  },
  update: async (id: string, data: Partial<Subject>): Promise<Subject> => {
    const response = await api.put<any>(`/subjects/${id}`, data);
    const subject = response?.data || response;
    return {
      ...subject,
      _id: subject._id || subject.id
    };
  },
  delete: async (id: string) => {
    return api.delete(`/subjects/${id}`);
  }
};
