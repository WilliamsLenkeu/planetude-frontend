import { api } from './api';

export const planningService = {
  getAll: async () => {
    const response = await api.get<any>('/planning');
    // Le backend peut renvoyer { plannings: [] } ou directement []
    if (response && response.plannings) return response.plannings;
    return Array.isArray(response) ? response : [];
  },
  getById: async (id: string) => {
    // L'endpoint /planning/{id} ne semble pas exister sur le backend (404).
    // On simule getById en récupérant tous les plannings et en filtrant.
    const allPlannings = await planningService.getAll();
    const planning = allPlannings.find((p: any) => (p._id || p.id) === id);
    if (!planning) throw new Error('Planning non trouvé');
    return planning;
  },
  create: async (data: any) => {
    const response = await api.post<any>('/planning', data);
    // On normalise la réponse pour toujours renvoyer l'objet planning
    if (response && response.planning) return response.planning;
    if (response && response.data && response.data.planning) return response.data.planning;
    return response;
  },
  update: async (id: string, data: any) => {
    return api.put<{ success: boolean; message: string }>(`/planning/${id}`, data);
  },
  delete: async (id: string) => {
    return api.delete(`/planning/${id}`);
  },
  exportICal: async (id: string) => {
    return api.getBlob(`/planning/${id}/export.ical`);
  },
  exportPDF: async (id: string) => {
    return api.getBlob(`/planning/${id}/export.pdf`);
  }
};
