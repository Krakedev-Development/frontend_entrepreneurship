import { FaChartLine, FaCheckCircle } from "react-icons/fa";
import type { ModuleContent } from "../../../domain/entities/ModuleContent";
// import { useState } from "react";

interface ResultsSectionProps {
    moduleContent: ModuleContent
}

// Componente para la sección de Resultados
export function ResultsSection({ moduleContent }: ResultsSectionProps) {
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
                            <span className="text-blue-700">Puntuación obtenida</span>
                            <span className="font-bold text-blue-800">85/100</span>
                        </div>
                    </div>
                </div>

                {/* Puntos clave */}
                <div className="bg-yellow-50 rounded-brand p-6">
                    <h4 className="font-bold text-yellow-800 mb-4">💡 Puntos Clave</h4>
                    <ul className="space-y-2 text-yellow-700">
                        <li>• Has dominado los conceptos básicos</li>
                        <li>• Área de mejora: cálculos avanzados</li>
                        <li>• Recomendación: revisar ejemplos prácticos</li>
                    </ul>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-brand p-6 text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h4 className="text-xl font-bold mb-2">¡Módulo Completado!</h4>
                <p className="opacity-90">
                    Has terminado exitosamente el módulo de {moduleContent.title}
                </p>
            </div>
        </div>
    );
};
