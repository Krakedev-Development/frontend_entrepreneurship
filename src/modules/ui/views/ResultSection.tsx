import { useState, useEffect } from "react";
import {
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import type { ModuleContent } from "../../entities/ModuleContent";
import type { FinancialRecord } from "../../entities/FinancialRecord";
import { ModuleService } from "../../ModuleService";
import { GetAllFinancialRecords } from "../../useCases/GetAllFinancialRecords";
import { FinalAnalysisResultDisplay } from "../components/FinalAnalysisResultDisplay";
import type { FinalAnalysisResult } from "../../entities/FinalAnalysisResult";
import type { BusinessDTO } from "../../../businesses/dto/BusinessDTO";
import { useParams } from "react-router-dom";
import { BusinessService } from "../../../businesses/BusinessService";

interface ResultsSectionProps {
  moduleContent: ModuleContent;
  onResultsComplete: () => void;
}

// Componente para la sección de Resultados
export function ResultsSection({
  moduleContent,
  onResultsComplete,
}: ResultsSectionProps) {
  const { businessId } = useParams();
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finalAnalysisResult, setFinalAnalysisResult] =
    useState<FinalAnalysisResult | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessDTO | null>(null);

  // Declarar la función antes del useEffect
  const executeFinalAnalysis = async () => {    
    setIsLoading(true);
    setError(null);

    const listaCostos = records
      .map((r) =>
        r.name && r.amount ? `${r.name.trim()}: ${r.amount}` : null
      )
      .filter(Boolean)
      .join("\n");

    if (!listaCostos.trim()) {
      console.error("Lista de costos está vacía");
      setError("No hay costos válidos para analizar");
      setIsLoading(false);
      return;
    }

    // Obtener la información del negocio dinámicamente
    const ubicacion = businessInfo?.location || "Ubicación no especificada";
    const tipoNegocio =
      businessInfo?.businessType || "Tipo de negocio no especificado";

    // TODO: Reemplazar valores hardcodeados por los valores dinámicos
    let size = "";
    switch (businessInfo?.sizeId) {
      case 1:
        size = "Pequeño";
        break;
      case 2:
        size = "Mediano";
        break;
      case 3:
        size = "Grande";
        break;
      default:
        size = "Pequeño";
    }

    // El prompt completo para la IA
    const prompt = `# Rol
Actúa como un asesor financiero de élite y analista de riesgos, especializado en la rentabilidad y optimización de costos para ${tipoNegocio} en ${ubicacion}. Tu análisis debe ser preciso, práctico y basado en datos del mercado local ecuatoriano.

## Contexto
Soy un emprendedor con un negocio ${size} de tipo ${tipoNegocio} ubicado en ${ubicacion} y necesito un diagnóstico financiero experto. He pasado por un proceso de auditoría previa con tu colega auditor de datos financieros donde:

- Se confirmó que mis costos son efectivamente costos fijos mensuales
- Se identificaron y corrigieron costos inválidos (variables, agrupados o ambiguos)
- Se detectaron costos obligatorios y recomendados faltantes específicos para mi tipo de negocio
- Se verificó que los valores sean realistas para el mercado

Ahora tengo una lista depurada y técnicamente correcta de costos fijos. Tu misión es realizar el análisis estratégico profundo: auditar estos números validados contra el mercado local de ${ubicacion}, identificar riesgos operativos y proporcionar oportunidades de optimización financiera.

**Nota importante:** Los costos relacionados con compensación humana (sueldos, salarios, honorarios, nómina, contabilidad) han sido deliberadamente excluidos de este análisis según las reglas de validación establecidas en la fase previa.

## Información del Negocio
- **Tipo de Negocio:** ${tipoNegocio}
- **Ubicación:** ${ubicacion}
- **Costos Fijos Mensuales Validados:** ${listaCostos}

## Tarea
Basado en los costos ya validados técnicamente por el auditor y la ubicación específica proporcionada, realiza el siguiente diagnóstico estratégico en tres fases:

### 1. Análisis Comparativo de Mercado Local
Evalúa cada costo validado comparándolo con los rangos de mercado específicos para ${ubicacion}, considerando:
- Precios promedio del mercado local ecuatoriano
- Variaciones por zona geográfica dentro de la ubicación
- Tendencias actuales de costos para el tipo de negocio específico

Para el campo 'evaluacion', tu respuesta debe ser estrictamente **"Dentro del rango"** o **"Fuera del rango"**. Todo el análisis cualitativo, justificación y contexto deben ir exclusivamente en el campo 'comentario_evaluacion'.

### 2. Análisis de Riesgos Operativos
Identifica riesgos específicos basados en:
- Costos que están "Fuera del rango" del mercado local (muy altos o muy bajos)
- Patrones preocupantes en la estructura general de costos
- Vulnerabilidades operativas específicas para el tipo de negocio en Ecuador
- Dependencias críticas o concentración excesiva de costos

Para cada riesgo identificado, determina su impacto potencial y probabilidad de ocurrencia en el contexto del mercado ecuatoriano.

### 3. Plan de Acción y Optimización Estratégica
Proporciona exactamente tres recomendaciones accionables y priorizadas. Cada recomendación debe estar enfocada en:
- Mitigar un riesgo operativo específico detectado
- Optimizar un costo que está "Fuera del rango" del mercado
- Aprovechar ventajas competitivas o oportunidades de eficiencia identificadas

Las recomendaciones deben ser específicas para el contexto ecuatoriano y el tipo de negocio analizado.

## Formato de Respuesta
Tu respuesta debe ser únicamente un objeto JSON que siga estrictamente la siguiente estructura. No incluyas ningún texto introductorio, explicaciones adicionales o conclusiones fuera del formato JSON.

json
{
  "analisis_costos_recibidos": {
    "nombre_costo_1": {
      "valor_recibido": "$valor",
      "evaluacion": "Dentro del rango" | "Fuera del rango",
      "comentario_evaluacion": "Análisis detallado del costo comparado con el mercado local de [ubicación específica], incluyendo contexto del mercado ecuatoriano, ventajas/desventajas competitivas, y observaciones específicas para el tipo de negocio"
    },
    "nombre_costo_2": {
      "valor_recibido": "$valor",
      "evaluacion": "Dentro del rango" | "Fuera del rango", 
      "comentario_evaluacion": "Análisis detallado correspondiente..."
    }
  },
  "analisis_riesgos_operativos": [
    {
      "riesgo": "Descripción específica del riesgo operativo identificado",
      "causa": "Costo específico o patrón en la estructura de costos que genera este riesgo",
      "impacto_potencial": "Descripción detallada del impacto en la operación, flujo de caja y rentabilidad",
      "probabilidad": "Alta" | "Media" | "Baja",
      "consecuencias_economicas": "Estimación cuantificada de pérdidas potenciales o costos adicionales en USD"
    }
  ],
  "plan_de_accion_recomendado": [
    {
      "titulo": "Título claro y específico de la recomendación estratégica",
      "descripcion": "Descripción detallada de la acción específica a tomar, incluyendo pasos concretos, proveedores sugeridos si aplica, y consideraciones para el mercado ecuatoriano",
      "prioridad": "Crítica" | "Alta" | "Media",
      "impacto_estimado": "Descripción específica del beneficio económico esperado con estimaciones cuantificadas",
      "inversion_requerida": "$valor estimado en USD si aplica, o 'Sin inversión adicional'",
      "plazo_implementacion": "Inmediato" | "1-3 meses" | "3-6 meses"
    }
  ]
}


## Restricciones del Análisis
- **Enfócate exclusivamente** en el análisis de mercado y optimización estratégica de los costos ya validados
- **NO realices** validaciones técnicas adicionales (formato, especificidad, etc.) - esto fue resuelto en la fase de auditoría previa
- **NO identifiques** costos faltantes - el auditor ya completó esta tarea
- **NO incluyas** recomendaciones sobre costos de personal - estos fueron deliberadamente excluidos del análisis
- **Concentra** tu expertise en la evaluación de precios de mercado, riesgos operativos y optimización financiera`;

    try {
      const res = await fetch("https://backend-costos.onrender.com/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error del servidor:", errorText);
        throw new Error(`Error del servidor: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      const content = data.respuesta as string;

      if (!content) {
        throw new Error("No se recibió contenido en la respuesta");
      }

      // Intentar parsear el JSON
      let parsedContent: FinalAnalysisResult;
      try {
        // Primero intentar extraer JSON de código markdown
        const jsonMatch = content.match(/```(?:json)?([\s\S]*?)```/);
        const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();
        
        parsedContent = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Error parseando JSON:", parseError);
        throw new Error(`Error parseando la respuesta: ${parseError}`);
      }

      setFinalAnalysisResult(parsedContent);
      onResultsComplete();
    } catch (err: any) {
      console.error("Error completo:", err);
      setError(`Error detallado: ${err.message || "Ocurrió un error desconocido"}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadRecords = async () => {
      try {
        setIsLoading(true);
        const moduleService = ModuleService.getInstance();
        const getAllFinancialRecordsUseCase = new GetAllFinancialRecords(
          moduleService
        );
        const existingRecords = await getAllFinancialRecordsUseCase.execute(
          moduleContent.id
        );
        setRecords(existingRecords);
      } catch (error) {
        console.error("Error loading records:", error);
        setError("Error al cargar los registros financieros");
      } finally {
        setIsLoading(false);
      }
    };
    
    const loadBusinessInfo = async () => {
      if (businessId) {
        try {
          const businessService = BusinessService.getInstance();
          const businessIdNumber = parseInt(businessId, 10);
          const business = await businessService.getBusinessById(
            businessIdNumber
          );
          if (business) {
            
            setBusinessInfo({
              id: business.id,
              userId: business.userId,
              name: business.name,
              businessType: business.businessType,
              location: business.location,
              sizeId: business.sizeId,
              createdAt: business.createdAt,
              icon: business.icon,
              color: business.color,
              progress: business.progress,
              totalModules: business.totalModules,
              completedModules: business.completedModules,
            });

          }
          
        } catch (error) {
          console.error("Error loading business info:", error);
        }
      }
    };

    // Cargar datos primero, luego ejecutar análisis
    const initializeData = async () => {
      await loadBusinessInfo();
      await loadRecords();
      // Solo ejecutar el análisis después de cargar los datos
      if (records.length > 0 && businessInfo) {
        executeFinalAnalysis();
      }
    };

    initializeData();
  }, [moduleContent.id]);

  // useEffect separado para ejecutar análisis cuando los datos estén listos
  useEffect(() => {    
    if (records.length > 0 && businessInfo && !finalAnalysisResult && !isLoading) {      
      executeFinalAnalysis();
    }
  }, [records, businessInfo, finalAnalysisResult]);

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

  if (finalAnalysisResult) {
    return (
      <div className="text-center p-8 bg-green-100 rounded-brand border border-green-300">
        <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800">
          ¡Proceso Completado!
        </h3>
        <p className="text-neutral-600 mt-2">
          Tus datos han sido validados y el análisis ha finalizado.
        </p>
        <FinalAnalysisResultDisplay data={finalAnalysisResult} />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center gap-3">
        <FaChartLine className="text-blue-600" />
        <span>Resultados y Análisis</span>
      </h3>

      {isLoading ? (
        <>
          <span className="text-6xl animate-pulse">⏳</span>
          <p className="mt-4 text-xl text-neutral-700">
            Procesando el análisis, por favor espera...
          </p>
        </>
      ) : finalAnalysisResult ? (
        <>
          <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800">
            ¡Proceso Completado!
          </h3>
          <p className="text-neutral-600 mt-2">
            Tus datos han sido validados y el análisis ha finalizado.
          </p>
          <FinalAnalysisResultDisplay data={finalAnalysisResult} />
        </>
      ) : (
        <p className="text-red-500">
          Ocurrió un error al obtener los resultados.
        </p>
      )}

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-brand p-6 text-center">
        <div className="text-4xl mb-3">🏆</div>
        <h4 className="text-xl font-bold mb-2">¡Módulo Completado!</h4>
        <p className="opacity-90">
          Has terminado exitosamente el módulo de {moduleContent.title}
        </p>
      </div>
    </div>
  );
}