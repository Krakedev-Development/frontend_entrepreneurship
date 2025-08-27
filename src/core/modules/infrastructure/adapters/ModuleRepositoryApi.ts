import { apiClient } from "../../../../shared/infrastructure/http/api-client";
import type { ModuleContent } from "../../domain/entities/ModuleContent";
import type { FinancialRecord } from "../../domain/entities/FinancialRecord";
import type { IModuleRepository } from "../../domain/repositories/IModuleRepository";

// Interfaces para mapear entre frontend y backend
interface ModuloApiResponse {
  idModulo: number;
  idAprendizaje: number;
  ordenModulo?: number;
  nombreModulo: string;
  tituloContenido?: string;
  concepto: string;
  recursoInteractivo?: string;
}

// Mapper para convertir entre entidades del frontend y backend
const mapApiToModuleContent = (apiModulo: ModuloApiResponse): ModuleContent => {
  console.log(`🔄 [FRONTEND-MAPPER] Mapeando módulo:`, apiModulo);
  
  // Usar una URL de video que permita embedding
  const defaultVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Rick Roll como ejemplo
  
  const mappedContent = {
    id: apiModulo.idModulo,
    title: apiModulo.nombreModulo,
    concept: apiModulo.concepto,
    resourceUrl: apiModulo.recursoInteractivo || defaultVideoUrl,
  };
  
  console.log(`✅ [FRONTEND-MAPPER] Contenido mapeado:`, mappedContent);
  return mappedContent;
};

export class ModuleRepositoryApi implements IModuleRepository {
  async getModuleContentById(id: number): Promise<ModuleContent> {
    try {
      console.log(`📚 [FRONTEND] Solicitando contenido del módulo ${id}...`);
      
      const response = await apiClient.get<ModuloApiResponse>(`/modulos/${id}`);
      
      console.log(`📥 [FRONTEND] Respuesta del backend para módulo ${id}:`, response);
      console.log(`📥 [FRONTEND] Tipo de respuesta:`, typeof response);
      console.log(`📥 [FRONTEND] Propiedades de respuesta:`, Object.keys(response));
      
      const mappedModuleContent = mapApiToModuleContent(response);
      console.log(`✅ [FRONTEND] Contenido del módulo mapeado:`, mappedModuleContent);
      
      return mappedModuleContent;
    } catch (error) {
      console.error(`💥 [FRONTEND] Error en ModuleRepositoryApi.getModuleContentById para módulo ${id}:`, error);
      throw new Error('No se pudo cargar el contenido del módulo. Inténtalo de nuevo.');
    }
  }

  async getAllFinancialRecords(businessId: number, moduleId: number): Promise<FinancialRecord[]> {
    try {
      console.log(`💰 [FRONTEND] Solicitando registros financieros del negocio ${businessId} y módulo ${moduleId}...`);
      
      const response = await apiClient.get<FinancialRecord[]>(`/financial-records/business/${businessId}/module/${moduleId}`);
      
      console.log(`📥 [FRONTEND] Respuesta del backend para registros financieros:`, response);
      
      return response;
    } catch (error) {
      console.error(`💥 [FRONTEND] Error en ModuleRepositoryApi.getAllFinancialRecords:`, error);
      // Por ahora, retornar un array vacío si no hay registros
      return [];
    }
  }
}
