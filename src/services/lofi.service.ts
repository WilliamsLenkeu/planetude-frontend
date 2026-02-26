import { api } from './api';
import type { LoFiTrack } from '../types';

function toTrack(raw: any): LoFiTrack {
  return {
    _id: raw._id ?? raw.id,
    title: raw.title,
    artist: raw.artist,
    url: raw.url ?? raw.audioUrl,
    thumbnail: raw.thumbnail,
    category: raw.category,
  };
}

export const lofiService = {
  getAll: async (category?: string): Promise<LoFiTrack[]> => {
    const res = await api.get<any>('/lofi', { params: category ? { category } : undefined });
    const data = res?.data ?? res;
    const arr = Array.isArray(data) ? data : [];
    return arr.map(toTrack);
  },
  getCategories: async (): Promise<string[]> => {
    const res = await api.get<any>('/lofi/categories');
    const data = res?.data ?? res;
    return Array.isArray(data) ? data : [];
  },
  addTrack: async (trackData: Partial<LoFiTrack>) => {
    return api.post<any>('/lofi', trackData);
  },
};
