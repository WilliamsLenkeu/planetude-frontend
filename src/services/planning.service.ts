import { api } from './api';
import type { Planning } from '../types/index';

export const planningService = {
  getAll: async (params?: { page?: number; limit?: number; periode?: string }): Promise<Planning[]> => {
    const response = await api.get<any>('/planning', { params });
    
    // Spec: { success: true, data: [ ... ], pagination: { ... } }
    if (response && response.success && Array.isArray(response.data)) {
      return response.data.map((p: any) => ({
        ...p,
        _id: p._id || p.id
      }));
    }
    
    // Fallback pour la robustesse (au cas où l'API change ou renvoie directement un tableau)
    let plannings: any[] = [];
    if (Array.isArray(response)) {
      plannings = response;
    } else if (response?.data && Array.isArray(response.data)) {
      plannings = response.data;
    } else if (response?.data?.plannings && Array.isArray(response.data.plannings)) {
      plannings = response.data.plannings;
    }

    return plannings.map((p: any) => ({
      ...p,
      _id: p._id || p.id
    }));
  },

  getById: async (id: string): Promise<Planning> => {
    // Si l'endpoint /planning/:id n'existe pas, on filtre localement
    try {
      const response = await api.get<any>(`/planning/${id}`);
      if (response && response.success && response.data) {
        return { ...response.data, _id: response.data._id || response.data.id };
      }
      if (response && response._id) return response;
    } catch (e) {
      console.warn('Endpoint /planning/:id non trouvé, repli sur le filtrage local');
    }

    const allPlannings = await planningService.getAll();
    const planning = allPlannings.find((p: Planning) => p._id === id);
    if (!planning) throw new Error('Planning non trouvé');
    return planning;
  },

  create: async (data: { 
    titre: string;
    periode: string; 
    nombre: number; 
    dateDebut: string; 
    generatedBy: 'AI' | 'LOCAL'; 
    sessions: any[] 
  }): Promise<Planning> => {
    const response = await api.post<any>('/planning', data);
    
    // Spec: { success: true, data: { ...planning } }
    let planning: any = response?.data || response;

    return {
      ...planning,
      _id: planning?._id || planning?.id
    };
  },

  generate: async (data: { 
    titre?: string;
    periode: string; 
    nombre?: number; 
    dateDebut: string;
    matiereIds?: string[];
  }): Promise<{ sessions?: any[]; generatedBy: 'AI' | 'LOCAL'; planningId?: string }> => {
    const response = await api.post<any>('/planning/generate', data);
    
    // Spec: { success: true, generatedBy: "AI", data: [sessions...] ou planningId }
    if (response && response.success) {
      return { 
        sessions: Array.isArray(response.data) ? response.data : undefined,
        planningId: response.planningId || response.data?.planningId,
        generatedBy: response.generatedBy || 'LOCAL' 
      };
    }
    
    throw new Error(response?.message || 'Erreur lors de la génération du planning');
  },

  updateSession: async (planningId: string, sessionId: string, data: { statut: string; notes?: string }) => {
    return api.put(`/planning/${planningId}/sessions/${sessionId}`, data);
  },

  delete: async (id: string) => {
    return api.delete(`/planning/${id}`);
  },

  exportICal: async (id: string) => {
    return api.getBlob(`/planning/${id}/export.ical`);
  },

  /** Export PDF non disponible dans l'API actuelle */
  exportPDF: async (_id: string) => {
    throw new Error('Export PDF non implémenté côté API');
  }
};
