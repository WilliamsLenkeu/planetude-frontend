const API_URL = 'https://plan-etude.koyeb.app/api';

class ApiService {
  private get headers(): HeadersInit {
    // On récupère le token au moment de la requête
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'GET',
      headers: this.headers,
    });
    return this.handleResponse<T>(response);
  }

  async getBlob(path: string): Promise<Blob> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'GET',
      headers: this.headers,
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw {
        status: response.status,
        message: data?.message || 'Erreur lors du téléchargement',
        data
      };
    }
    return response.blob();
  }

  async post<T>(path: string, body: any): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, body: any): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: this.headers,
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const error = {
        status: response.status,
        message: data?.message || 'Une erreur est survenue',
        data
      };
      throw error;
    }
    return data;
  }
}

export const api = new ApiService();
