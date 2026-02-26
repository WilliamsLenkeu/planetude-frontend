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

function extractArray(res: any, dataKey = 'data'): any[] {
  if (!res) return [];
  const arr = res[dataKey] ?? res.data ?? res;
  return Array.isArray(arr) ? arr : arr?.tracks ? arr.tracks : [];
}

export const lofiService = {
  getAll: async (category?: string): Promise<LoFiTrack[]> => {
    const res = await api.get<any>('/lofi', { params: category ? { category } : undefined });
    const arr = extractArray(res);
    return arr.map(toTrack);
  },
  getCategories: async (): Promise<string[]> => {
    const res = await api.get<any>('/lofi/categories');
    const arr = res?.data ?? res;
    return Array.isArray(arr) ? arr : [];
  },
  addTrack: async (trackData: Partial<LoFiTrack>) => {
    return api.post<any>('/lofi', trackData);
  },
};
