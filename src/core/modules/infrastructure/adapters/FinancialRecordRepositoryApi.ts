import { apiClient } from "../../../../shared/infrastructure/http/api-client";

export interface FinancialRecord {
  id?: number;
  name: string;
  amount: string;
  businessId: number;
  moduleId: number;
  createdAt?: string;
}

export interface CreateFinancialRecordRequest {
  businessId: number;
  moduleId: number;
  name: string;
  amount: number;
}

export interface UpdateFinancialRecordRequest {
  id: number;
  businessId: number;
  moduleId: number;
  name: string;
  amount: string;
}

export class FinancialRecordRepositoryApi {
  private static readonly BASE_URL = '/financial-records';

  // Crear un nuevo registro financiero
  static async createRecord(data: CreateFinancialRecordRequest): Promise<FinancialRecord> {
    console.log('💾 [FRONTEND-FINANCIAL] Creando registro financiero:', data);

    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: FinancialRecord;
      }>(this.BASE_URL, data);

      console.log('✅ [FRONTEND-FINANCIAL] Registro creado exitosamente:', response);
      return response.data;
    } catch (error) {
      console.error('❌ [FRONTEND-FINANCIAL] Error al crear registro:', error);
      throw new Error('Error al crear el registro financiero');
    }
  }

  // Actualizar un registro financiero existente
  static async updateRecord(data: UpdateFinancialRecordRequest): Promise<FinancialRecord> {
    console.log('💾 [FRONTEND-FINANCIAL] Actualizando registro financiero:', data);

    try {
      const response = await apiClient.put<{
        success: boolean;
        message: string;
        data: FinancialRecord;
      }>(`${this.BASE_URL}/${data.id}`, data);

      console.log('✅ [FRONTEND-FINANCIAL] Registro actualizado exitosamente:', response);
      return response.data;
    } catch (error) {
      console.error('❌ [FRONTEND-FINANCIAL] Error al actualizar registro:', error);
      throw new Error('Error al actualizar el registro financiero');
    }
  }

  // Eliminar un registro financiero
  static async deleteRecord(id: number): Promise<void> {
    console.log('🗑️ [FRONTEND-FINANCIAL] Eliminando registro financiero:', id);

    try {
      await apiClient.delete(`${this.BASE_URL}/${id}`);
      console.log('✅ [FRONTEND-FINANCIAL] Registro eliminado exitosamente');
    } catch (error) {
      console.error('❌ [FRONTEND-FINANCIAL] Error al eliminar registro:', error);
      throw new Error('Error al eliminar el registro financiero');
    }
  }

  // Guardar múltiples registros (siempre crear nuevos)
  static async saveRecords(records: FinancialRecord[]): Promise<FinancialRecord[]> {
    console.log('💾 [FRONTEND-FINANCIAL] Guardando múltiples registros:', records.length);

    const savedRecords: FinancialRecord[] = [];

    for (const record of records) {
      try {
        // Siempre crear nuevo registro (no actualizar)
        const newRecord = await this.createRecord({
          businessId: record.businessId,
          moduleId: record.moduleId,
          name: record.name,
          amount: parseFloat(record.amount) || 0
        });
        savedRecords.push(newRecord);
        console.log(`✅ [FRONTEND-FINANCIAL] Registro creado: ${record.name} - $${record.amount}`);
      } catch (error) {
        console.error('❌ [FRONTEND-FINANCIAL] Error al guardar registro:', record, error);
        // Continuar con el siguiente registro
      }
    }

    console.log(`✅ [FRONTEND-FINANCIAL] ${savedRecords.length} registros guardados exitosamente`);
    return savedRecords;
  }
}
