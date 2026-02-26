import { api } from './api';

export const authService = {
  login: async (credentials: any) => {
    return api.post<{ token: string; refreshToken: string; user: any }>('/auth/login', credentials);
  },
  register: async (userData: { name: string; email: string; password: string; gender?: 'M' | 'F' }) => {
    return api.post<{ token: string; refreshToken: string; user: any }>('/auth/register', {
      ...userData,
      gender: userData.gender ?? 'M'
    });
  },
  googleLogin: async (idToken: string) => {
    return api.post<{ token: string; refreshToken: string; user: any }>('/auth/google', { idToken });
  },
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post<{ success: boolean; token: string; data?: { token: string } }>('/auth/refresh', {
      token: refreshToken
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};
