import { api } from './api';

export const authService = {
  login: async (credentials: any) => {
    return api.post<{ token: string; user: any }>('/auth/login', credentials);
  },
  register: async (userData: any) => {
    return api.post<{ token: string; user: any }>('/auth/register', userData);
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};
