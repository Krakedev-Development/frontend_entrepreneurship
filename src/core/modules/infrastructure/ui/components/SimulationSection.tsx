import { useState, useEffect } from "react";
import { FaRobot, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import type { ModuleContent } from "../../../domain/entities/ModuleContent";
import type { FinancialRecord } from "../../adapters/FinancialRecordRepositoryApi";
import type {  ValidationResult } from "../../../domain/entities/ValidationResult";
import { ValidationModal } from "./ValidationModal";
import {  ValidationResultDisplay } from './ValidationResultDisplay';
import { useParams } from "react-router-dom";
import { apiClient } from "../../../../../shared/infrastructure/http/api-client";
import { AiAnalysisService, type BusinessInfo, type CostRecord } from "../../adapters/AiAnalysisService";
import { ValidationResultRepositoryApi } from "../../adapters/ValidationResultRepositoryApi";
import { ModuleRepositoryApi } from "../../adapters/ModuleRepositoryApi";
import { FinancialRecordRepositoryApi } from "../../adapters/FinancialRecordRepositoryApi";

// Interface para la respuesta del negocio desde el backend
interface BusinessApiResponse {
  negocioId: number;
  usuarioId: number;
  tipoNegocio: string;
  nombreNegocio: string;
  ubicacion: string;
  idTamano: number;
  tamano: string; // Nombre del tamaño del negocio
  fechaCreacion: string;
}

// Hook personalizado para obtener información del negocio
const useBusinessInfo = (businessId: string | undefined) => {
  const [businessInfo, setBusinessInfo] = useState<{ tipoNegocio: string; ubicacion: string; tamano: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      if (!businessId) {
        setError("No se ha especificado un ID de negocio.");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`🏢 [FRONTEND] Obteniendo información del negocio ${businessId}...`);
        const response = await apiClient.get<BusinessApiResponse>(`/negocios/${businessId}`);
        
        console.log(`✅ [FRONTEND] Información del negocio obtenida:`, response);
        
        setBusinessInfo({
          tipoNegocio: response.tipoNegocio,
          ubicacion: response.ubicacion,
          tamano: response.tamano || "No especificado"
        });
      } catch (err) {
        console.error('Error al obtener información del negocio:', err);
        setError("No se pudo obtener la información del negocio.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [businessId]);

  return { businessInfo, isLoading, error };
};

// ============================================================================
// 1. Componente de UI "Tonto" para el Formulario de Registros Financieros
// ============================================================================
interface FinancialRecordFormProps {
  records: FinancialRecord[];
  total: number;
  onAddRecord: () => void;
  onRemoveRecord: (id: number) => void;
  onUpdateRecord: (id: number, field: 'name' | 'amount', value: string) => void;
}

function FinancialRecordForm({
  records,
  total,
  onAddRecord,
  onRemoveRecord,
  onUpdateRecord
}: FinancialRecordFormProps) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onAddRecord}
        className="bg-secondary-600 hover:bg-secondary-700 text-white font-bold py-2 px-4 rounded-brand mb-4 shadow-sm inline-flex items-center"
      >
        <i className="fas fa-plus mr-2"></i>Añadir Costo
      </button>

      {records.length > 0 && (
        <div className="space-y-4 overflow-y-auto max-h-96 pr-2 bg-secondary-50">
          {records.map((record) => (
            <div key={record.id} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Nombre del costo (ej: Alquiler)"
                  value={record.name}
                  onChange={(e) => onUpdateRecord(record.id || 0, 'name', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  placeholder="Monto"
                  value={record.amount}
                  onChange={(e) => onUpdateRecord(record.id || 0, 'amount', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                />
              </div>
              <div className="flex items-center pt-3">
                <button
                  type="button"
                  onClick={() => onRemoveRecord(record.id || 0)}
                  aria-label="Eliminar registro"
                  className="p-2 text-red-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="space-y-8">
        <div className="bg-accent-50 border-l-4 border-accent-500 p-4 mt-5 rounded-r-lg">
          <h4 className="text-xl font-bold text-accent-700 mb-2">Total</h4>
          <div className="text-4xl font-bold text-accent-800">
            $ <span>{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. Componente Contenedor "Inteligente" que maneja la Lógica y el Estado
// ============================================================================
interface SimulationSectionProps {
  moduleContent: ModuleContent;
  onSimulationComplete: (records: FinancialRecord[], total: number) => void;
}

export function SimulationSection({ moduleContent, onSimulationComplete }: SimulationSectionProps) {
  // Obtener los parámetros de la URL
  const { businessId, moduleId } = useParams<{ businessId: string; moduleId: string }>();
  
  // Obtener información del negocio usando el hook personalizado
  const { businessInfo, isLoading: isLoadingBusiness, error: businessError } = useBusinessInfo(businessId);
  
 // --- Estados del Formulario y UI ---
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  // const [isSavingRecords, setIsSavingRecords] = useState(false); // Variable no utilizada
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [simulationCompleted, setSimulationCompleted] = useState(false);

  // Cargar registros guardados al montar el componente
  useEffect(() => {
    const loadSavedRecords = async () => {
      if (!businessId || !moduleId) {
        console.log('⚠️ [FRONTEND] No se pueden cargar registros: faltan businessId o moduleId');
        setIsLoadingRecords(false);
        return;
      }

      try {
        console.log(`🔄 [FRONTEND] Verificando registros existentes para negocio ${businessId} y módulo ${moduleId}...`);
        setIsLoadingRecords(true);
        
        const moduleRepository = new ModuleRepositoryApi();
        const savedRecords = await moduleRepository.getAllFinancialRecords(
          parseInt(businessId || '0'), 
          parseInt(moduleId || '0')
        );
        
        console.log(`📥 [FRONTEND] Registros encontrados en BD:`, savedRecords);
        
        if (savedRecords && savedRecords.length > 0) {
          // ✅ EXISTEN REGISTROS: Se cargan automáticamente
          console.log(`✅ [FRONTEND] Se encontraron ${savedRecords.length} registros guardados - CARGANDO AUTOMÁTICAMENTE`);
          setRecords(savedRecords);
        } else {
          // ❌ NO EXISTEN REGISTROS: El usuario debe agregar costos manualmente
          console.log(`ℹ️ [FRONTEND] NO se encontraron registros guardados - EL USUARIO DEBE AGREGAR COSTOS MANUALMENTE`);
          setRecords([createNewRecord()]);
        }
      } catch (error) {
        console.error('❌ [FRONTEND] Error al verificar registros guardados:', error);
        console.log(`ℹ️ [FRONTEND] Error en verificación - EL USUARIO DEBE AGREGAR COSTOS MANUALMENTE`);
        setRecords([createNewRecord()]);
      } finally {
        setIsLoadingRecords(false);
      }
    };

    loadSavedRecords();
  }, [businessId, moduleId]);

  // --- Lógica del Formulario ---
  function createNewRecord(): FinancialRecord {
    return {
      id: Date.now() + Math.random(),
      name: "",
      amount: "",
      businessId: businessId ? parseInt(businessId) : 1,
      moduleId: moduleContent.id,
      createdAt: new Date().toISOString(),
    };
  }

  const total = records.reduce((sum, record) => sum + (parseFloat(record.amount) || 0), 0);

  // Notificar que la simulación está completa cuando se guarden los registros
  useEffect(() => {
    if (simulationCompleted && !isLoading && !error) {
      // Notificar al componente padre que la simulación está completa
      onSimulationComplete?.(records, total);
    }
  }, [simulationCompleted, isLoading, error, onSimulationComplete, records, total]);

  // Función para guardar registros cuando la validación sea correcta
  const saveRecordsOnValidationSuccess = async (recordsToSave: FinancialRecord[]) => {
    if (!businessId || !moduleId) return;

    try {
      console.log('💾 [FRONTEND] Guardando registros después de validación exitosa...');
      
      // Filtrar registros que tienen datos
      const validRecords = recordsToSave.filter(r => r.name.trim() && r.amount.trim());
      
      if (validRecords.length > 0) {
        const savedRecords = await FinancialRecordRepositoryApi.saveRecords(validRecords);
        console.log('✅ [FRONTEND] Registros guardados después de validación:', savedRecords.length);
        
        // Los registros se guardan como nuevos, no necesitamos actualizar IDs
        console.log('✅ [FRONTEND] Registros financieros guardados exitosamente en la BD');
      }
    } catch (error) {
      console.error('❌ [FRONTEND] Error al guardar registros después de validación:', error);
    }
  };

  const addRecord = () => {
    const newRecords = [...records, createNewRecord()];
    setRecords(newRecords);
    // No guardar automáticamente - solo cuando la validación sea exitosa
  };

  const removeRecord = async (id: number) => {
    const newRecords = records.length > 1 ? records.filter(r => r.id !== id) : records;
    setRecords(newRecords);
    
    // Si el registro tenía ID, eliminarlo de la BD
    if (id && id > 0) {
      try {
        await FinancialRecordRepositoryApi.deleteRecord(id);
        console.log('✅ [FRONTEND] Registro eliminado de la BD:', id);
      } catch (error) {
        console.error('❌ [FRONTEND] Error al eliminar registro de la BD:', error);
      }
    }
    
    // No guardar automáticamente - solo cuando la validación sea exitosa
  };

  const updateRecord = (id: number, field: 'name' | 'amount', value: string) => {
    const newRecords = records.map(r => r.id === id ? { ...r, [field]: value } : r);
    setRecords(newRecords);
    
    // No guardar automáticamente - solo cuando la validación sea exitosa
  };
  
    // --- Lógica del Flujo de Análisis Optimizado ---
  const aiAnalysisService = new AiAnalysisService();

  const executeValidation = async () => {
    // Verificar que tengamos la información del negocio
    if (!businessInfo) {
      setError("No se pudo obtener la información del negocio. Por favor, recarga la página.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    try {
      console.log('🚀 [FRONTEND] Iniciando flujo optimizado de análisis...');
      
      // Convertir records a formato esperado por el servicio
      const costs: CostRecord[] = records
        .filter(r => r.name && r.amount)
        .map(r => ({
          name: r.name.trim(),
          amount: String(r.amount)
        }));

      const businessInfoForAnalysis: BusinessInfo = {
        tipoNegocio: businessInfo.tipoNegocio,
        tamano: businessInfo.tamano,
        ubicacion: businessInfo.ubicacion
      };

      console.log('📊 [FRONTEND] Costos a enviar:', costs);
      console.log('🏢 [FRONTEND] Información del negocio a enviar:', businessInfoForAnalysis);
      console.log(`🏢 [FRONTEND] Usando información del negocio: ${businessInfo.tipoNegocio} (${businessInfo.tamano}) en ${businessInfo.ubicacion}`);

      // Usar el nuevo servicio optimizado
      const result = await aiAnalysisService.completeAnalysis(costs, businessInfoForAnalysis);
      
      if (result.success && 'validation' in result) {
        console.log('✅ [FRONTEND] Análisis completado exitosamente:', result);
        
        // Usar el resultado de validación para el modal
        if (result.validation?.data) {
          setValidationResult(result.validation.data);
          
          // Guardar el resultado de validación en la base de datos
          try {
            if (businessId && moduleId) {
              console.log('💾 [FRONTEND] Guardando resultado de validación en BD...');
              
              const validationData = {
                negocioId: parseInt(businessId),
                moduloId: parseInt(moduleId),
                costosValidados: result.validation.data.validacion_de_costos || [],
                costosFaltantes: result.validation.data.costos_obligatorios_faltantes || [],
                resumenValidacion: result.validation.data.resumen_validacion || {},
                puntuacionGlobal: parseInt(result.validation.data.resumen_validacion?.puntuacion_global) || 0,
                puedeProseguirAnalisis: result.validation.data.resumen_validacion?.puede_proseguir_analisis || false
              };
              
              await ValidationResultRepositoryApi.saveValidationResult(validationData);
              console.log('✅ [FRONTEND] Resultado de validación guardado exitosamente');
              
              // Los registros financieros se guardarán cuando se presione "Continuar al Análisis"
            }
          } catch (saveError) {
            console.error('❌ [FRONTEND] Error al guardar resultado de validación:', saveError);
            // No bloqueamos el flujo si falla el guardado
          }
        }
        
        // Análisis completado exitosamente
        console.log('✅ [FRONTEND] Análisis completado exitosamente');
      } else {
        console.log('❌ [FRONTEND] Análisis falló:', result);
        setError((result as any).error || "Error en el análisis");
      }
      
    } catch (err: any) {
      console.error('💥 [FRONTEND] Error en análisis optimizado:', err);
      setError(err.message || "Ocurrió un error al procesar el análisis.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- MANEJADORES DEL MODAL ---
  const handleExecuteValidation = () => {
    setIsModalOpen(true);
    executeValidation();
  };
  
  const handleProceedToAnalysis = async () => {
    // Guardar los registros financieros cuando se presione "Continuar al Análisis"
    try {
      console.log("💾 [FRONTEND] Guardando registros financieros antes de continuar al análisis...");
      await saveRecordsOnValidationSuccess(records);
      console.log("✅ [FRONTEND] Registros financieros guardados exitosamente");
    } catch (error) {
      console.error("❌ [FRONTEND] Error al guardar registros financieros:", error);
      // Continuar con el flujo aunque falle el guardado
    }
    
    // Cerrar modal y proceder a la vista de resultados
    console.log("Procediendo a la vista de resultados...");
    setIsModalOpen(false);
    setSimulationCompleted(true);
  };

  const handleCloseAndCorrect = () => {
    setIsModalOpen(false);
  };
  
  if (simulationCompleted) {
    return (
      <div className="text-center p-8 bg-green-100 rounded-brand border border-green-300">
        <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800">¡Simulación Completada!</h3>
        <p className="text-neutral-600 mt-2 mb-6">Tus registros financieros han sido guardados exitosamente.</p>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <h4 className="font-bold text-blue-800 mb-2">📊 Próximos Pasos</h4>
          <p className="text-blue-700 text-sm">
            Ve a la pestaña "Resultados" para ver el análisis completo de tus costos financieros.
          </p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-bold text-yellow-800 mb-2">💡 Información</h4>
          <p className="text-yellow-700 text-sm">
            Se analizaron {records.filter(r => r.name && r.amount).length} costos financieros.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center gap-3">
        <FaRobot className="text-green-600" />
        <span>Simulación Práctica - {moduleContent.title}</span>
      </h3>

      <div className="bg-secondary-50 rounded-brand p-8 mb-6">
        {/* Indicador de carga de información del negocio */}
        {isLoadingBusiness && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Cargando información del negocio...</span>
            </div>
          </div>
        )}

        {/* Indicador de carga de registros guardados */}
        {isLoadingRecords && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
              <span className="text-sm">Cargando registros guardados...</span>
            </div>
          </div>
        )}


        
                 {/* Mostrar información del negocio cuando esté disponible */}
         {businessInfo && (
           <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
             <div className="flex items-center gap-2 text-green-700">
               <span className="text-sm font-medium">Negocio:</span>
               <span className="text-sm">{businessInfo.tipoNegocio} ({businessInfo.tamano}) en {businessInfo.ubicacion}</span>
             </div>
           </div>
         )}
        
        <FinancialRecordForm
          records={records}
          total={total}
          onAddRecord={addRecord}
          onRemoveRecord={removeRecord}
          onUpdateRecord={updateRecord}
        />
        <div className="border-t border-neutral-200 mt-6 text-right">
          <button
            onClick={handleExecuteValidation}
            disabled={isLoadingBusiness || !businessInfo || isLoadingRecords}
            className={`font-bold py-3 px-6 rounded-brand shadow-lg transition-colors ${
              isLoadingBusiness || !businessInfo || isLoadingRecords
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isLoadingBusiness || isLoadingRecords ? 'Cargando...' : 'Ejecutar Análisis'}
          </button>
          {businessError && (
            <p className="text-red-500 text-sm mt-2 text-right">
              Error al cargar información del negocio
            </p>
          )}
        </div>
      </div>

      <ValidationModal
        isOpen={isModalOpen}
        variant={validationResult?.resumen_validacion.puede_proseguir_analisis ? 'confirmation' : 'warning'}
        title={
          isLoading ? "Auditando Datos..." : 
          error ? "Error de Auditoría" : "Reporte de Auditoría"
        }
        icon={
          isLoading ? <FaRobot className="animate-spin" /> : 
          error ? <FaExclamationTriangle className="text-red-500" /> : 
          <FaCheckCircle className="text-blue-500" />
        }
        onClose={handleCloseAndCorrect}
        onConfirm={handleProceedToAnalysis}
        showFooter={!isLoading}
      >
        {isLoading && (
          <div className="text-center p-8">
            <FaRobot className="text-4xl text-primary-600 mx-auto animate-pulse" />
            <p className="mt-4 text-lg">Realizando analisis...</p>
          </div>
        )}
        {error && (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-neutral-600">{error}</p>
          </div>
        )}
        {validationResult && (
          <ValidationResultDisplay data={validationResult} />
        )}
      </ValidationModal>
    </div>
  );
}