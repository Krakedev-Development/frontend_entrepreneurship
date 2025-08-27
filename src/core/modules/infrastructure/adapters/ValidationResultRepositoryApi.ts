import { apiClient } from "../../../../shared/infrastructure/http/api-client";

export interface SaveValidationResultRequest {
  negocioId: number;
  moduloId: number;
  costosValidados?: any[];
  costosFaltantes?: any[];
  resumenValidacion?: any;
  puntuacionGlobal?: number;
  puedeProseguirAnalisis: boolean;
}

export interface ValidationResultResponse {
  validacionId: number;
  negocioId: number;
  moduloId: number;
  fechaValidacion?: string;
  costosValidados?: any[];
  costosFaltantes?: any[];
  resumenValidacion?: any;
  puntuacionGlobal?: number;
  puedeProseguirAnalisis: boolean;
}

export class ValidationResultRepositoryApi {
  private static readonly BASE_URL = '/validation-results';

  /**
   * Guarda el resultado de validación en la base de datos
   */
  static async saveValidationResult(data: SaveValidationResultRequest): Promise<ValidationResultResponse> {
    console.log('💾 [FRONTEND-VALIDATION] Guardando resultado de validación:', data);

    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: ValidationResultResponse;
      }>(this.BASE_URL, data);

      console.log('✅ [FRONTEND-VALIDATION] Resultado guardado exitosamente:', response);
      return response.data;
    } catch (error) {
      console.error('❌ [FRONTEND-VALIDATION] Error al guardar resultado:', error);
      throw new Error('Error al guardar el resultado de validación');
    }
  }

  /**
   * Obtiene el resultado de validación por negocio y módulo
   */
  static async getValidationResultByBusinessAndModule(
    negocioId: number,
    moduloId: number
  ): Promise<ValidationResultResponse | null> {
    console.log(`🔍 [FRONTEND-VALIDATION] Buscando validación para negocio ${negocioId} y módulo ${moduloId}`);

    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: ValidationResultResponse | null;
      }>(`${this.BASE_URL}/business/${negocioId}/module/${moduloId}`);

      console.log('✅ [FRONTEND-VALIDATION] Validación encontrada:', response);
      return response.data;
    } catch (error) {
      console.error('❌ [FRONTEND-VALIDATION] Error al obtener validación:', error);
      return null;
    }
  }

  /**
   * Obtiene todos los resultados de validación de un negocio
   */
  static async getValidationResultsByBusiness(negocioId: number): Promise<ValidationResultResponse[]> {
    console.log(`🔍 [FRONTEND-VALIDATION] Buscando todas las validaciones del negocio ${negocioId}`);

    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: ValidationResultResponse[];
      }>(`${this.BASE_URL}/business/${negocioId}`);

      console.log(`✅ [FRONTEND-VALIDATION] Encontradas ${response.data.length} validaciones`);
      return response.data;
    } catch (error) {
      console.error('❌ [FRONTEND-VALIDATION] Error al obtener validaciones:', error);
      return [];
    }
  }
}
