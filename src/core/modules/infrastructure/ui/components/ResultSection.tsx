import { FaChartLine, FaCheckCircle, FaSpinner, FaArrowRight } from "react-icons/fa";
import type { ModuleContent } from "../../../domain/entities/ModuleContent";
import { FinalAnalysisResultDisplay } from "./FinalAnalysisResultDisplay";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiAnalysisService, type BusinessInfo, type CostRecord } from "../../adapters/AiAnalysisService";
import { BusinessProgressRepositoryApi } from "../../adapters/BusinessProgressRepositoryApi";

interface ResultsSectionProps {
    moduleContent: ModuleContent;
}

// Hook personalizado para obtener información del negocio
const useBusinessInfo = (businessId: string | undefined) => {
    const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!businessId) {
            setIsLoading(false);
            return;
        }

        const fetchBusinessInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/negocios/${businessId}`);
                if (!response.ok) {
                    throw new Error('Error al obtener información del negocio');
                }
                const data = await response.json();
                                 console.log('🏢 [RESULTS] Datos del negocio recibidos:', data);
                 setBusinessInfo({
                     tipoNegocio: data.tipoNegocio || 'No especificado',
                     tamano: data.tamano || 'No especificado',
                     ubicacion: data.ubicacion || 'No especificado'
                 });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBusinessInfo();
    }, [businessId]);

    return { businessInfo, isLoading, error };
};

// Hook personalizado para obtener registros financieros
const useFinancialRecords = (businessId: string | undefined, moduleId: string | undefined) => {
    const [records, setRecords] = useState<CostRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!businessId || !moduleId) {
            console.log('⚠️ [RESULTS] BusinessId o ModuleId no disponibles:', { businessId, moduleId });
            setIsLoading(false);
            return;
        }

        const fetchRecords = async () => {
            try {
                console.log('🔍 [RESULTS] Buscando registros para:', { businessId, moduleId });
                const response = await fetch(`http://localhost:3000/api/v1/financial-records/business/${businessId}/module/${moduleId}`);
                
                console.log('📊 [RESULTS] Response status:', response.status);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        console.log('⚠️ [RESULTS] No se encontraron registros (404)');
                        setRecords([]);
                        setError(null);
                    } else {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
                } else {
                    const data = await response.json();
                    console.log('📊 [RESULTS] Datos recibidos:', data);
                    console.log('📊 [RESULTS] Tipo de datos:', typeof data);
                    console.log('📊 [RESULTS] Es array:', Array.isArray(data));
                    
                    if (Array.isArray(data) && data.length > 0) {
                        console.log('📊 [RESULTS] Primer registro:', data[0]);
                        console.log('📊 [RESULTS] Campos del primer registro:', Object.keys(data[0]));
                    }
                    
                    const costRecords: CostRecord[] = data.map((record: any) => {
                        console.log('🔍 [RESULTS] Procesando registro:', record);
                        return {
                            name: record.name,
                            amount: record.amount.toString()
                        };
                    });
                    
                    console.log('📊 [RESULTS] Records procesados:', costRecords);
                    setRecords(costRecords);
                    setError(null);
                }
            } catch (err) {
                console.error('❌ [RESULTS] Error al obtener registros:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
                setRecords([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecords();
    }, [businessId, moduleId]);

    return { records, isLoading, error };
};

// Función para generar datos mock del análisis
const generateMockAnalysisResult = (records: CostRecord[], businessInfo: BusinessInfo) => {
    // Crear análisis de costos basado en los registros reales
    const analisisCostos: any = {};
    records.forEach(record => {
        const valor = parseInt(record.amount);
        analisisCostos[record.name] = {
            valor_recibido: `$${record.amount}`,
            rango_estimado_zona_especifica: `$${Math.max(0, valor - 20)}-$${valor + 30}`,
            evaluacion: valor < 50 ? "✅ Dentro del rango" : "⚠️ Fuera del rango",
            analisis: `El costo de ${record.name} de $${record.amount} mensuales es ${valor < 50 ? 'favorable' : 'elevado'} para un ${businessInfo?.tipoNegocio || 'negocio'} en ${businessInfo?.ubicacion || 'la zona'}.`
        };
    });

    return {
        success: true,
        data: {
            validacion_de_costos: {
                costos_omitidos: [],
                puntuacion_global: 85,
                puede_proceder: true,
                razones_no_proceder: []
            },
            analisis_costos: analisisCostos,
            riesgos_identificados: [
                {
                    nombre: "Costos Operativos Elevados",
                    causa: "Algunos costos están por encima del promedio del mercado",
                    probabilidad: "Media",
                    impacto: "Reducción del margen operativo",
                    consecuencias: "Pérdida de rentabilidad estimada de $100-$200 mensuales"
                },
                {
                    nombre: "Falta de Optimización de Servicios",
                    causa: "Posibles oportunidades de ahorro en contratación de servicios",
                    probabilidad: "Alta",
                    impacto: "Costos innecesarios",
                    consecuencias: "Ahorro potencial de $50-$150 mensuales"
                }
            ],
            plan_accion: {
                "Optimización Inmediata": [
                    {
                        descripcion: "Revisar y renegociar contratos de servicios",
                        prioridad: "Alta",
                        plazo: "1-2 meses",
                        inversion: "$0",
                        impacto: "Ahorro potencial de $50-$100 mensuales"
                    }
                ],
                "Análisis de Mercado": [
                    {
                        descripcion: "Comparar precios con otros proveedores",
                        prioridad: "Media",
                        plazo: "2-3 meses",
                        inversion: "$0-$100",
                        impacto: "Reducción de costos operativos"
                    }
                ]
            }
        },
        timestamp: new Date().toISOString(),
        duration: "mock_analysis"
    };
};

// Componente para la sección de Resultados
export function ResultsSection({ moduleContent: _moduleContent }: ResultsSectionProps) {
    const { businessId, moduleId } = useParams<{ businessId: string; moduleId: string }>();
    const navigate = useNavigate();
    const { businessInfo, isLoading: isLoadingBusiness } = useBusinessInfo(businessId);
    const { records, isLoading: isLoadingRecords } = useFinancialRecords(businessId, moduleId);
    
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usingMockData, setUsingMockData] = useState(false);
    const [hasExecutedAnalysis, setHasExecutedAnalysis] = useState(false);
    const [isCompletingModule, setIsCompletingModule] = useState(false);
    const [moduleCompleted, setModuleCompleted] = useState(false);

    // Ejecutar análisis cuando se carguen los datos
    useEffect(() => {
        if (businessInfo && records.length > 0 && !hasExecutedAnalysis && !isLoadingAnalysis) {
            const executeAnalysis = async () => {
                try {
                    setIsLoadingAnalysis(true);
                    setError(null);
                    
                    console.log('🚀 [RESULTS] Ejecutando análisis completo...');
                    console.log('📊 [RESULTS] Records:', records);
                    console.log('📊 [RESULTS] Records JSON:', JSON.stringify(records, null, 2));
                    console.log('🏢 [RESULTS] Business Info:', businessInfo);
                                         console.log('🏢 [RESULTS] Business Info JSON:', JSON.stringify(businessInfo, null, 2));
                     console.log('🏢 [RESULTS] Business Info campos:', businessInfo ? Object.keys(businessInfo) : 'No disponible');
                    
                                         // Validar que businessInfo tenga todos los campos requeridos
                     if (!businessInfo.tipoNegocio || !businessInfo.tamano || !businessInfo.ubicacion) {
                         console.log('⚠️ [RESULTS] BusinessInfo incompleto, usando datos mock');
                         const mockResult = generateMockAnalysisResult(records, businessInfo);
                         setAnalysisResult(mockResult);
                         setUsingMockData(true);
                         return;
                     }
                     
                     // Intentar análisis real primero
                     try {
                         const aiService = new AiAnalysisService();
                         const result = await aiService.completeAnalysis(records, businessInfo);
                        
                        if (result.success) {
                            console.log('✅ [RESULTS] Análisis completado exitosamente');
                            setAnalysisResult(result);
                            setUsingMockData(false);
                        } else {
                            console.log('❌ [RESULTS] Análisis falló:', result);
                            setError((result as any).error || "Error en el análisis");
                        }
                                         } catch (apiError: any) {
                         console.log('⚠️ [RESULTS] Error en API, usando datos mock:', apiError.message);
                         
                         // Usar datos mock para cualquier error de API
                         const mockResult = generateMockAnalysisResult(records, businessInfo);
                         setAnalysisResult(mockResult);
                         setUsingMockData(true);
                     }
                } catch (err: any) {
                    console.error('💥 [RESULTS] Error en análisis:', err);
                    setError(err.message || "Ocurrió un error al procesar el análisis");
                } finally {
                    setIsLoadingAnalysis(false);
                    setHasExecutedAnalysis(true);
                }
            };

            executeAnalysis();
        }
    }, [businessInfo, records, hasExecutedAnalysis]); // Agregada hasExecutedAnalysis para control

    // Debug logs - Solo cuando cambien los valores importantes
    useEffect(() => {
        console.log('🔍 [RESULTS] Estado actual:', {
            businessId,
            moduleId,
            businessInfo: businessInfo ? 'Cargado' : 'No cargado',
            records: records.length,
            isLoadingBusiness,
            isLoadingRecords,
            analysisResult: analysisResult ? 'Disponible' : 'No disponible',
            isLoadingAnalysis,
            error,
            usingMockData,
            hasExecutedAnalysis
        });
    }, [businessId, moduleId, businessInfo, records.length, isLoadingBusiness, isLoadingRecords, analysisResult, isLoadingAnalysis, error, usingMockData, hasExecutedAnalysis]);

    // Función para marcar módulo como completado
    const handleCompleteModule = async () => {
        if (!businessId || !moduleId) {
            console.error('❌ [RESULTS] BusinessId o ModuleId no disponibles');
            return;
        }

        try {
            setIsCompletingModule(true);
            console.log('🎯 [RESULTS] Marcando módulo como completado...');
            
            const progressRepository = new BusinessProgressRepositoryApi();
            const result = await progressRepository.completeModule(
                parseInt(businessId),
                parseInt(moduleId)
            );
            
            console.log('✅ [RESULTS] Módulo marcado como completado:', result);
            setModuleCompleted(true);
            
            // Mostrar mensaje de éxito
            alert('¡Módulo completado exitosamente! Serás redirigido al Learning Path.');
            
            // Redirigir al Learning Path
            navigate(`/learning-path/${businessId}`);
            
        } catch (error) {
            console.error('💥 [RESULTS] Error al completar módulo:', error);
            alert('Error al marcar el módulo como completado. Inténtalo de nuevo.');
        } finally {
            setIsCompletingModule(false);
        }
    };

    // Estados de carga
    if (isLoadingBusiness || isLoadingRecords) {
        return (
            <div className="text-center p-8">
                <FaSpinner className="text-4xl text-blue-600 mx-auto mb-4 animate-spin" />
                <p className="text-lg text-gray-600">Cargando datos del análisis...</p>
                <p className="text-sm text-gray-500 mt-2">
                    {isLoadingBusiness ? 'Cargando información del negocio...' : 'Cargando registros financieros...'}
                </p>
            </div>
        );
    }

    // Error en carga de datos
    if (error) {
        return (
            <div className="text-center p-8">
                <div className="text-red-500 mb-4">
                    <p className="text-xl font-bold">Error al Cargar Datos</p>
                    <p className="text-sm">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    // Sin datos para analizar
    if (!businessInfo || records.length === 0) {
        return (
            <div className="text-center p-8">
                <div className="text-gray-500 mb-4">
                    <p className="text-xl font-bold">No Hay Datos para Analizar</p>
                    <p className="text-sm mb-4">Completa la simulación primero para ver los resultados</p>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-left">
                        <h4 className="font-bold text-blue-800 mb-2">🔍 Información de Debug:</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                            <p><strong>Business ID:</strong> {businessId || 'No disponible'}</p>
                            <p><strong>Module ID:</strong> {moduleId || 'No disponible'}</p>
                            <p><strong>Business Info:</strong> {businessInfo ? 'Cargado' : 'No cargado'}</p>
                            <p><strong>Records:</strong> {records.length} registros encontrados</p>
                            <p><strong>Error:</strong> {error || 'Ninguno'}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4 space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Recargar Página
                        </button>
                        
                        <button
                            onClick={() => {
                                const mockResult = generateMockAnalysisResult([], businessInfo || { tipoNegocio: 'Test', tamano: 'Test', ubicacion: 'Test' });
                                setAnalysisResult(mockResult);
                                setUsingMockData(true);
                                setHasExecutedAnalysis(true);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Usar Datos Mock (Prueba)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <h3 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center gap-3">
                <FaChartLine className="text-blue-600" />
                <span>Resultados del Análisis</span>
            </h3>

            {/* Aviso de datos mock */}
            {usingMockData && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-600">⚠️</span>
                        <div>
                            <h4 className="font-bold text-yellow-800">Datos de Demostración</h4>
                            <p className="text-yellow-700 text-sm">
                                Se están mostrando datos de ejemplo porque la cuota de la API de Gemini se ha excedido. 
                                Para ver análisis reales, actualiza tu plan o espera hasta mañana.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Estado de carga del análisis */}
            {isLoadingAnalysis && (
                <div className="text-center p-8 bg-blue-50 rounded-lg border border-blue-200">
                    <FaSpinner className="text-4xl text-blue-600 mx-auto mb-4 animate-spin" />
                    <p className="text-lg text-blue-700">Ejecutando análisis completo...</p>
                    <p className="text-sm text-blue-600 mt-2">Esto puede tomar unos segundos</p>
                </div>
            )}

            {/* Error en el análisis */}
            {error && !isLoadingAnalysis && (
                <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-red-500 mb-4">
                        <p className="text-xl font-bold">Error en el Análisis</p>
                        <p className="text-sm">{error}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {/* Resultados del análisis */}
            {analysisResult && !isLoadingAnalysis && (
                <div className="bg-green-50 rounded-lg border border-green-200 p-6 mb-6">
                    <div className="text-center mb-6">
                        <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
                        <h4 className="text-2xl font-bold text-green-800">¡Análisis Completo Finalizado!</h4>
                        <p className="text-green-700 mt-2">Tus datos han sido validados y analizados completamente.</p>
                        
                        {usingMockData && (
                            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                                <p className="text-yellow-800 text-sm">
                                    ⚠️ <strong>Nota:</strong> Se están mostrando datos de ejemplo debido a limitaciones temporales de la API. 
                                    Los resultados reales estarán disponibles cuando se resuelva el problema de cuota.
                                </p>
                            </div>
                        )}
                    </div>
                    
                                         <FinalAnalysisResultDisplay data={analysisResult} />
                     
                     {/* Botón Continuar */}
                     <div className="text-center mt-8">
                         <button
                             onClick={handleCompleteModule}
                             disabled={isCompletingModule || moduleCompleted}
                             className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-2 mx-auto ${
                                 isCompletingModule || moduleCompleted
                                     ? 'bg-gray-400 cursor-not-allowed'
                                     : 'bg-green-600 hover:bg-green-700 hover:scale-105 shadow-lg'
                             }`}
                         >
                             {isCompletingModule ? (
                                 <>
                                     <FaSpinner className="animate-spin" />
                                     Completando Módulo...
                                 </>
                             ) : moduleCompleted ? (
                                 <>
                                     <FaCheckCircle />
                                     Módulo Completado
                                 </>
                             ) : (
                                 <>
                                     <FaArrowRight />
                                     Continuar al Siguiente Módulo
                                 </>
                             )}
                         </button>
                         
                         {moduleCompleted && (
                             <p className="text-green-700 text-sm mt-2">
                                 ¡Módulo completado exitosamente! Serás redirigido al Learning Path.
                             </p>
                         )}
                     </div>
                 </div>
             )}

            {/* Información del negocio */}
            {businessInfo && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-blue-800 mb-2">📋 Información del Negocio</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <strong>Tipo:</strong> {businessInfo.tipoNegocio}
                        </div>
                        <div>
                            <strong>Tamaño:</strong> {businessInfo.tamano}
                        </div>
                        <div>
                            <strong>Ubicación:</strong> {businessInfo.ubicacion}
                        </div>
                    </div>
                </div>
            )}

            {/* Resumen de costos analizados */}
            {records.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-800 mb-2">💰 Costos Analizados</h4>
                    <p className="text-yellow-700 text-sm">
                        Se analizaron {records.length} costos financieros para este módulo.
                    </p>
                </div>
            )}
        </div>
    );
}
