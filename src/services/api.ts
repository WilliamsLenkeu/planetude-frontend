const API_URL = import.meta.env.VITE_API_URL || 'https://plan-etude.koyeb.app/api';

class ApiService {
  private get headers(): HeadersInit {
    // On récupère le token au moment de la requête
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async get<T>(path: string, options?: { params?: Record<string, any> }): Promise<T> {
    let fullPath = path;
    if (options?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        fullPath += (fullPath.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request<T>(fullPath, { method: 'GET' });
  }

  async getBlob(path: string): Promise<Blob> {
    const response = await this.requestRaw(path, { method: 'GET' });
    return response.blob();
  }

  async post<T>(path: string, body: any): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(path: string, body: any): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(path: string, body: any): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const response = await this.requestRaw(path, options);
    return response.json();
  }

  private async requestRaw(path: string, options: RequestInit): Promise<Response> {
    const url = `${API_URL}${path}`;
    const requestOptions = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    // Logging pour vConsole
    if (localStorage.getItem('dev_mode') === 'true') {
      console.log(`[API Request] ${options.method || 'GET'} ${path}`, options.body ? JSON.parse(options.body as string) : '');
    }

    let response = await fetch(url, requestOptions);

    if (response.status === 401 && !path.includes('/auth/refresh')) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const token = refreshData.token || refreshData.accessToken;
            localStorage.setItem('token', token);

            requestOptions.headers = {
              ...requestOptions.headers,
              'Authorization': `Bearer ${token}`
            };
            response = await fetch(url, requestOptions);
          }
        } catch (error) {
          console.error('Erreur refresh token:', error);
        }
      }
    }

    // Logging de la réponse pour vConsole
    if (localStorage.getItem('dev_mode') === 'true') {
      const clonedResponse = response.clone();
      clonedResponse.json().then(data => {
        console.log(`[API Response] ${response.status} ${path}`, data);
      }).catch(async () => {
        const text = await clonedResponse.text();
        console.log(`[API Response] ${response.status} ${path} (Non-JSON)`, text.substring(0, 200));
      });
    }

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      if (localStorage.getItem('dev_mode') === 'true') {
        console.error(`[API Error] ${response.status} ${path}`, data);
      }
      throw {
        status: response.status,
        message: data?.message || 'Une erreur est survenue',
        data: data
      };
    }

    return response;
  }
}

export const api = new ApiService();
