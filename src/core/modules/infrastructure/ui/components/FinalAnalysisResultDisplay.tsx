import React from "react";
import type { FinalAnalysisResult, ActionPlan, DetailedCostAnalysis } from "../../../domain/entities/FinalAnalysisResult";

interface Props {
  data: FinalAnalysisResult;
}

export const FinalAnalysisResultDisplay: React.FC<Props> = ({ data }) => {
  const analisis = data.analisis_costos_recibidos;
  const acciones = data.plan_de_accion_recomendado;

  return (
    <div className="space-y-8">
      {/* ===================== */}
      {/* 1. Análisis Comparativo */}
      {/* ===================== */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          📊 Análisis Comparativo de Costos
        </h2>
        <div className="grid gap-4">
          {Object.entries(analisis).map(([nombre, detalle]) => (
            <div
              key={nombre}
              className="bg-white p-4 rounded-lg shadow border"
            >
              <h3 className="font-semibold text-blue-800">{nombre}</h3>
              <p>
                <strong>Valor recibido:</strong> {detalle.valor_recibido}
              </p>
              <p>
                <strong>Rango estimado:</strong>{" "}
                {detalle.rango_estimado_zona_especifica}
              </p>
              <p>
                <strong>Evaluación:</strong>{" "}
                <span
                  className={
                    detalle.evaluacion === "Dentro del rango"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {detalle.evaluacion}
                </span>
              </p>
              <p className="text-gray-700 text-sm mt-1">
                <strong>Comentario:</strong> {detalle.comentario_evaluacion}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== */}
      {/* 2. Plan de Acción */}
      {/* ===================== */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          ✅ Plan de Acción Recomendado
        </h2>
        <div className="grid gap-4">
          {acciones.map((a, idx) => (
            <div
              key={idx}
              className="bg-green-50 border border-green-200 p-4 rounded-lg shadow"
            >
              <h3 className="font-semibold text-green-800">
                📌 {a.titulo}
              </h3>
              <p>{a.descripcion}</p>
              <div className="mt-2 text-sm text-gray-600">
                <strong>Prioridad:</strong> {a.prioridad}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
