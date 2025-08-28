import { apiClient } from "../../../../shared/infrastructure/http/api-client";

export interface CreateAnalyzedCostResultRequest {
  analysisId: number;
  costName: string;
  receivedValue: string;
  estimatedRange: string;
  evaluation: string;
  comment: string;
}

export interface AnalyzedCostResultResponse {
  resultadoCostoId: number;
  analisisId: number;
  nombreCosto: string;
  valorRecibido: string;
  rangoEstimado: string;
  evaluacion: string;
  comentario: string;
}

export class AnalyzedCostResultRepositoryApi {
  private static readonly BASE_URL = '/analyzed-costs';

  /**
   * Crea un resultado de análisis de costo
   */
  static async createAnalyzedCostResult(data: CreateAnalyzedCostResultRequest): Promise<AnalyzedCostResultResponse> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: AnalyzedCostResultResponse;
      }>(this.BASE_URL, data);

      return response.data;
    } catch (error) {
      throw new Error('Error al crear el resultado de análisis de costo');
    }
  }

  /**
   * Crea múltiples resultados de análisis de costos
   */
  static async createMultipleAnalyzedCostResults(data: CreateAnalyzedCostResultRequest[]): Promise<AnalyzedCostResultResponse[]> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: AnalyzedCostResultResponse[];
      }>(`${this.BASE_URL}/multiple`, { results: data });

      return response.data;
    } catch (error) {
      throw new Error('Error al crear los resultados de análisis de costos');
    }
  }

  /**
   * Obtiene todos los resultados de análisis de costos
   */
  static async getAllAnalyzedCostResults(): Promise<AnalyzedCostResultResponse[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: AnalyzedCostResultResponse[];
      }>(this.BASE_URL);

      return response.data;
    } catch (error) {
      throw new Error('Error al obtener los resultados de análisis de costos');
    }
  }

  /**
   * Obtiene resultados de análisis de costos por ID de análisis
   */
  static async getAnalyzedCostResultsByAnalysisId(analysisId: number): Promise<AnalyzedCostResultResponse[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: AnalyzedCostResultResponse[];
      }>(`${this.BASE_URL}/analysis/${analysisId}`);

      return response.data;
    } catch (error) {
      throw new Error('Error al obtener los resultados de análisis de costos');
    }
  }

  /**
   * Obtiene un resultado de análisis de costo por ID
   */
  static async getAnalyzedCostResultById(id: number): Promise<AnalyzedCostResultResponse> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: AnalyzedCostResultResponse;
      }>(`${this.BASE_URL}/${id}`);

      return response.data;
    } catch (error) {
      throw new Error('Error al obtener el resultado de análisis de costo');
    }
  }
}
