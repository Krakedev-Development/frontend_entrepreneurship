import { useState, useEffect } from "react";
import { FaChartLine, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import type { ModuleContent } from "../../entities/ModuleContent";
import type { FinancialRecord } from "../../entities/FinancialRecord";
import { ModuleService } from "../../ModuleService";
import { GetAllFinancialRecords } from "../../useCases/GetAllFinancialRecords";

interface ResultsSectionProps {
    moduleContent: ModuleContent;
}

// Componente para la sección de Resultados
export function ResultsSection({ moduleContent }: ResultsSectionProps) {
    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRecords = async () => {
            try {
                setIsLoading(true);
                const moduleService = ModuleService.getInstance();
                const getAllFinancialRecordsUseCase = new GetAllFinancialRecords(moduleService);
                const existingRecords = await getAllFinancialRecordsUseCase.execute(moduleContent.id);
                setRecords(existingRecords);
            } catch (error) {
                console.error('Error loading records:', error);
                setError('Error al cargar los registros financieros');
            } finally {
                setIsLoading(false);
            }
        };

        loadRecords();
    }, [moduleContent.id]);

    const total = records.reduce((sum, record) => {
        const amount = typeof record.amount === 'number' ? record.amount : parseFloat(record.amount) || 0;
        return sum + amount;
    }, 0);

    const validRecords = records.filter(record => record.name && record.amount > 0);
    const invalidRecords = records.filter(record => !record.name || record.amount <= 0);

    if (isLoading) {
        return (
            <div className="text-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-neutral-600">Cargando resultados...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-red-50 rounded-lg">
                <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <h3 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center gap-3">
                <FaChartLine className="text-blue-600" />
                <span>Resultados y Análisis</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Resumen de progreso */}
                <div className="bg-blue-50 rounded-brand p-6">
                    <h4 className="font-bold text-blue-800 mb-4">📊 Tu Progreso</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700">Video completado</span>
                            <FaCheckCircle className="text-green-500" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700">Simulación realizada</span>
                            <FaCheckCircle className="text-green-500" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700">Registros válidos</span>
                            <span className="font-bold text-blue-800">{validRecords.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700">Total de costos</span>
                            <span className="font-bold text-blue-800">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Puntos clave */}
                <div className="bg-yellow-50 rounded-brand p-6">
                    <h4 className="font-bold text-yellow-800 mb-4">💡 Puntos Clave</h4>
                    <ul className="space-y-2 text-yellow-700">
                        <li>• Has registrado {validRecords.length} costos válidos</li>
                        <li>• Total de costos fijos: ${total.toFixed(2)}</li>
                        {invalidRecords.length > 0 && (
                            <li>• {invalidRecords.length} registros incompletos</li>
                        )}
                        <li>• Recomendación: revisar costos faltantes</li>
                    </ul>
                </div>
            </div>

            {/* Lista de registros */}
            {validRecords.length > 0 && (
                <div className="bg-white rounded-brand p-6 mb-6 border border-gray-200">
                    <h4 className="font-bold text-neutral-800 mb-4">📋 Registros Financieros</h4>
                    <div className="space-y-2">
                        {validRecords.map((record) => (
                            <div key={record.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                <span className="text-neutral-700">{record.name}</span>
                                <span className="font-semibold text-neutral-800">${record.amount.toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center py-2 border-t-2 border-blue-200 font-bold text-blue-800">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-brand p-6 text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h4 className="text-xl font-bold mb-2">¡Módulo Completado!</h4>
                <p className="opacity-90">
                    Has terminado exitosamente el módulo de {moduleContent.title}
                </p>
                {validRecords.length > 0 && (
                    <p className="opacity-90 mt-2">
                        Con un total de {validRecords.length} costos registrados por ${total.toFixed(2)}
                    </p>
                )}
            </div>
        </div>
    );
}
