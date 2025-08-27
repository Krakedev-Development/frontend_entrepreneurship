import { apiClient } from '../../../../shared/infrastructure/http/api-client';

export interface CompleteModuleResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    negocio_id: number;
    modulo_id: number;
    estado: string;
    fecha_completado: string;
    modulo_nombre: string;
    negocio_nombre: string;
  };
}

export class BusinessProgressRepositoryApi {
  /**
   * Marcar un módulo como completado
   */
  async completeModule(negocioId: number, moduloId: number): Promise<CompleteModuleResponse> {
    try {
      console.log('🎯 [FRONTEND] Marcando módulo como completado:', { negocioId, moduloId });
      
      const response = await apiClient.put<CompleteModuleResponse>(
        `/business-progress/${negocioId}/module/${moduloId}/complete`
      );
      
      console.log('✅ [FRONTEND] Módulo marcado como completado:', response);
      return response;
    } catch (error) {
      console.error('💥 [FRONTEND] Error al marcar módulo como completado:', error);
      throw new Error('Error al marcar módulo como completado');
    }
  }
}
