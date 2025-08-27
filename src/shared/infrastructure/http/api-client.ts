import { config } from '../../../config/environment';

const API_BASE_URL = config.api.baseURL;

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Log de la petición saliente
    console.log('🚀 [FRONTEND] Petición saliente:', {
      method: options.method || 'GET',
      url,
      headers: config.headers,
      body: options.body ? JSON.parse(options.body as string) : undefined,
    });

    try {
      const response = await fetch(url, config);
      
      // Log de la respuesta recibida
      console.log('📥 [FRONTEND] Respuesta recibida:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        console.error('❌ [FRONTEND] Error HTTP:', {
          status: response.status,
          statusText: response.statusText,
          url,
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Log de los datos recibidos
      console.log('✅ [FRONTEND] Datos recibidos:', {
        endpoint,
        data,
        timestamp: new Date().toISOString(),
      });
      
      return data;
    } catch (error) {
      console.error('💥 [FRONTEND] Error en petición API:', {
        endpoint,
        error: error instanceof Error ? error.message : error,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();
