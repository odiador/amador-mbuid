/// <reference types="vite/client" />
import axios from 'axios';
import { ModeloFormulario, UIResponse, ApiError } from '../types';

// Vite env types are provided by default via vite/client, so no need to redeclare them here.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export class ApiService {
  /**
   * Genera una interfaz de usuario a partir de un modelo de formulario
   */
  static async generarUI(modelo: ModeloFormulario): Promise<UIResponse> {
    try {
      const response = await api.post<UIResponse>('/generar-ui', {
        modelo,
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError: ApiError = error.response.data;
        throw new Error(apiError.error || 'Error al generar la interfaz');
      }
      throw new Error('Error de conexión con el servidor');
    }
  }

  /**
   * Verifica el estado del backend
   */
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend no disponible');
    }
  }

  /**
   * Obtiene la documentación OpenAPI
   */
  static async getOpenAPISpec(): Promise<any> {
    try {
      const response = await api.get('/openapi.json');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la especificación OpenAPI');
    }
  }
}

export default ApiService;
