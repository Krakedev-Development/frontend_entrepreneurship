// Archivo: ValidationResultDisplay.tsx (NUEVO ARCHIVO)

import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';
import type { ValidationResult } from '../../../domain/entities/ValidationResult';

interface ValidationResultDisplayProps {
  data: ValidationResult;
}

export const ValidationResultDisplay: React.FC<ValidationResultDisplayProps> = ({ data }) => {
  return (
    <div className="space-y-6 text-left max-h-[70vh] overflow-y-auto p-1">
  

      {/* 2. Validación de Costos Recibidos */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-3">📊 Costos Auditados</h3>
        <div className="space-y-3">
          {data.validacion_de_costos.map((item) => (
            <div key={item.costo_recibido} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-blue-800">{item.costo_recibido} ({item.valor_recibido})</h4>
                {item.es_valido ? (
                  <span className="flex items-center gap-1 text-sm font-bold text-green-600">
                    <FaCheckCircle /> Válido
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm font-bold text-red-600">
                    <FaTimesCircle /> Inválido
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-sm mt-1">{item.justificacion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Costos Obligatorios Faltantes */}
      {data.costos_obligatorios_faltantes?.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-3">🚨 Costos Obligatorios Faltantes</h3>
          <ul className="space-y-3">
            {data.costos_obligatorios_faltantes.map((costo) => (
              <li key={costo.nombre} className="bg-red-50 border-l-4 border-red-500 p-4">
                <p><strong>{costo.nombre}:</strong> {costo.descripcion}</p>
                <div className="mt-2 text-sm text-red-700">
                  <strong className="flex items-center gap-1"><FaExclamationTriangle /> Crítico:</strong> {costo.motivo_critico}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 4. Costos Recomendados Faltantes */}
      {data.costos_recomendados_faltantes?.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-3">💡 Costos Recomendados</h3>
          <ul className="space-y-3">
            {data.costos_recomendados_faltantes.map((costo) => (
              <li key={costo.nombre} className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p><strong>{costo.nombre}:</strong> {costo.descripcion}</p>
                <div className="mt-2 text-sm text-blue-700">
                  <strong className="flex items-center gap-1"><FaLightbulb /> Beneficio:</strong> {costo.beneficio}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

    {/* 1. Resumen de Validación */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-2">📋 Resumen de la Auditoría</h3>
        <div className={`p-4 rounded-lg border-l-4 ${
          data.resumen_validacion.puede_proseguir_analisis 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
        }`}>
          <p>{data.resumen_validacion.mensaje_general}</p>
        </div>
      </section>

    </div>
  );
};