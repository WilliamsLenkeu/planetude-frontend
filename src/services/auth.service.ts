import { api } from './api';

const unwrapAuthResponse = (res: any) => {
  const data = res?.data ?? res;
  return {
    token: data?.token ?? res?.token,
    refreshToken: data?.refreshToken ?? res?.refreshToken,
    user: data?.user ?? res?.user
  };
};

export const authService = {
  login: async (credentials: any) => {
    const res = await api.post<any>('/auth/login', credentials);
    return unwrapAuthResponse(res);
  },
  register: async (userData: { name: string; email: string; password: string; gender?: 'M' | 'F' }) => {
    const res = await api.post<any>('/auth/register', {
      ...userData,
      gender: userData.gender ?? 'M'
    });
    return unwrapAuthResponse(res);
  },
  googleLogin: async (idToken: string) => {
    const res = await api.post<any>('/auth/google', { idToken });
    return unwrapAuthResponse(res);
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
