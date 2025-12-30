import { api } from './api';

export const authService = {
  login: async (credentials: any) => {
    return api.post<{ token: string; refreshToken: string; user: any }>('/auth/login', credentials);
  },
  register: async (userData: any) => {
    return api.post<{ token: string; refreshToken: string; user: any }>('/auth/register', userData);
  },
  googleLogin: async (idToken: string) => {
    return api.post<{ token: string; refreshToken: string; user: any }>('/auth/google', { idToken });
  },
  refreshToken: async () => {
    return api.post<{ success: boolean; accessToken: string }>('/auth/refresh', {});
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};
