import { api } from './api';

export const chatService = {
  sendMessage: async (message: string) => {
    return api.post<{ response: string }>('/chat', { message });
  },
  getHistory: async () => {
    return api.get<any[]>('/chat/history');
  },
  getMetrics: async () => {
    return api.get<{ success: boolean; data: { totalMessages: number; lastInteraction: string } }>('/chat/metrics');
  }
};
