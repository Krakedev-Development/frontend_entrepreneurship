import { useState, useEffect } from "react";
import { FaRobot, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import type { ModuleContent } from "../../../domain/entities/ModuleContent";
import type { FinancialRecord } from "../../../domain/entities/FinancialRecord";
import type {  ValidationResult } from "../../../domain/entities/ValidationResult";
import { ValidationModal } from "./ValidationModal";
import {  ValidationResultDisplay } from './ValidationResultDisplay';
import { FinalAnalysisResultDisplay } from "./FinalAnalysisResultDisplay";
import type { FinalAnalysisResult } from "../../../domain/entities/FinalAnalysisResult";

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
                  onChange={(e) => onUpdateRecord(record.id, 'name', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  placeholder="Monto"
                  value={record.amount}
                  onChange={(e) => onUpdateRecord(record.id, 'amount', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                />
              </div>
              <div className="flex items-center pt-3">
                <button
                  type="button"
                  onClick={() => onRemoveRecord(record.id)}
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
 // --- Estados del Formulario y UI ---
  const [records, setRecords] = useState<FinancialRecord[]>(() => [createNewRecord()]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [finalAnalysisResult, setFinalAnalysisResult] = useState<FinalAnalysisResult | null>(null);
  const [simulationCompleted, setSimulationCompleted] = useState(false);

  useEffect(() => {
  if (simulationCompleted) {
    ValidationGeneral();
  }
}, [simulationCompleted]);
  // --- Lógica del Formulario ---
  function createNewRecord(): FinancialRecord {
    return {
      id: Date.now() + Math.random(),
      name: "",
      amount: "",
      businessId: 1, // Debes obtener este ID dinámicamente
      moduleId: moduleContent.id,
      createdAt: new Date().toISOString(),
    };
  }

  const total = records.reduce((sum, record) => sum + (parseFloat(record.amount) || 0), 0);

  const addRecord = () => setRecords(prev => [...prev, createNewRecord()]);
  const removeRecord = (id: number) => setRecords(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);
  const updateRecord = (id: number, field: 'name' | 'amount', value: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };
  
  // --- Lógica del Flujo de Análisis (API y Modal) ---
  // --- Lógica de la API (Ahora para Validación) ---
  const executeValidation = async () => {
    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    const listaCostos = records
      .map(r => r.name && r.amount ? `${r.name.trim()}: $${r.amount}` : null)
      .filter(Boolean)
      .join('\n');

    // TODO: Obtener la ubicación dinámicamente si es necesario
    const ubicacion = "Quito, La Carolina";
    const tipoNegocio="Cafeteria"
    
    // El prompt completo para la IA
 const prompt = `Rol: Actúa como un auditor de datos financieros y analista de riesgos. Tu especialización es asegurar la calidad y precisión de la información financiera de entrada para emprendimientos en Quito, Ecuador, antes de que sea utilizada en un análisis estratégico.

Contexto: Soy un emprendedor con un negocio pequeño de tipo ${tipoNegocio} ubicado en ${ubicacion} y necesito tu ayuda para depurar mi lista de costos mensuales antes de que tu colega, el asesor financiero de élite, realice el diagnóstico completo. Un análisis profundo basado en datos incorrectos, agrupados o mal categorizados sería inútil y me llevaría a tomar decisiones erróneas. Tu misión es auditar mi lista y darme el visto bueno para proceder, o indicarme exactamente qué debo corregir.

Reglas de Validación:
1.  **Exclusividad de Costos Fijos:** La lista solo debe contener costos fijos, es decir, aquellos que no varían significativamente con el volumen de ventas mes a mes. Costos como 'materia prima', 'compra de inventario', 'insumos' o 'packaging' son costos variables y deben ser marcados como inválidos.
2.  **Costos Desagregados:** Cada ítem debe representar un único costo. No se aceptan costos agrupados como 'Servicios básicos e internet' o 'Marketing y permisos'. Deben ser listados por separado para un análisis preciso.
3.  **Especificidad:** No se aceptan costos ambiguos o genéricos como 'Varios', 'Otros gastos' o 'Gastos administrativos'. Cada costo debe ser claramente identificable.
4. **Exclusión Explícita de Costos obligatorios:** Cualquier costo relacionado con compensación humana debe ser omitido, descartado y/o no incluido obligatorios en los para este análisis específico. Esto incluye pero no se limita a:

Sueldos y salarios: Pagos fijos mensuales a empleados
Honorarios profesionales: Pagos a consultores, asesores o profesionales independientes
Nómina: Cualquier concepto incluido en la planilla de pagos
Beneficios sociales: Décimo tercero, décimo cuarto, vacaciones, utilidades
Aportes patronales: IESS, fondos de reserva, contribuciones obligatorias
Bonificaciones: Incentivos, comisiones fijas, bonos de productividad
Contratistas de servicios personales: Pagos a personas naturales por servicios específicos
Capacitación de personal: Cursos, entrenamientos, desarrollo profesional
Uniformes y equipos de trabajo: Vestimenta, herramientas personales, EPP

**NO DEBES INCLUIR EN LOS COSTOS OBLIGATORIOS Cualquier costo relacionado con 'sueldos', 'honorarios', 'salarios' o 'nómina' INCLUSO SI SON ESCENCIALES**
**NO DEBES INCLUIR EN LOS COSTOS OBLIGATORIOS Cualquier costo relacionado con 'contabilidad' INCLUSO SI SON ESCENCIALES**

Justificación: Este análisis se enfoca exclusivamente en costos operativos mensuales no relacionados con personal para proporcionar una base de costos fijos que permita evaluar la viabilidad operativa independiente de las decisiones de contratación. Los costos de personal serán analizados en una fase posterior del proceso de planificación financiera.

5.  **Verificación de Costos obligatorios faltantes:** Basado en el ${tipoNegocio} proporcionado, debes inferir los costos fijos críticos (Requeridos por ley o que causan cierre del negocio si faltan) que fueron omitidos y mencionarlos en el resumen (en caso de haber alguno). En caso de existir costos obligatorios faltantes no se podrá proseguir con el analisis por lo que debes ser muy cauteloso al agregar alguno, recuerda que es un negocio pequeño y a lo mejor no es imperativo tener en cuenta estos costos, NO ESTAS OBLIGADO A INCLUIR COSTOS OBLIGATORIOS, SI CONSIDERAS QUE SE A PROPORCIONADO UNA LISTA ACEPTABLE DE COSTOS FIJOS DEJA LA SECCION DE COSTOS OBLIGATORIOS VACIA Y CENTRATE EN VALIDAR SUS VALORES. en tal caso puedes ponerlos en la seccion de recomendados, que no impiden que se prosiga con el analisis.
6.  **Verificación de Costos recomendados faltantes:** Basado en el ${tipoNegocio} proporcionado, debes inferir los costos fijos no tan importantes (Mejoran eficiencia/rentabilidad pero no son críticos) que fueron omitidos y mencionarlos en el resumen (en caso de haber alguno). Estos costos son meramente informativos para el conocimiento del emprendedor por lo tanto no impiden que se prosiga con el analisis en caso de no ser incluidos.
7.  **Verificación de costos realistas:** Parte crucial de tu trabajo es identificar los valores ilógicos o fuera del rango aceptable para la ubicacion mencionada. Para conseguir esto debes Comparar con rangos de mercado típicos para la ubicación, Considerar el tamaño/escala del negocio, Verificar coherencia entre costos relacionados. En caso de no cumplir con esta regla el costo debe ser marcado com invalido.

Información a Validar:
Tipo de Negocio: ${tipoNegocio}
Ubicacion: ${ubicacion}
Lista de Costos Proporcionada:
${listaCostos}

Tarea:
Analiza cada costo en la lista proporcionada según las reglas de validación. Luego, determina si faltan costos obligatorios para el tipo de negocio. Evita incluir costos redundantes aparentemente obligatorios y adhierete firmemente a las reglas de validacion, en caso de que la lista de costos provista sea suficientemente robusta puedes no incluir la seccion de costos_obligatorios_faltantes. Finalmente, genera un veredicto que indique si puedo proceder con el análisis principal. Tu respuesta debe ser únicamente un objeto JSON que siga estrictamente la siguiente estructura. No incluyas ningún texto introductorio o explicaciones fuera del formato JSON.


Formato de Respuesta:

{
  "validacion_de_costos": [
    {
      "costo_recibido": "Costo1",
      "valor_recibido": "$Valor1",
      "es_valido": true,
      "justificacion": "Válido. Es un costo fijo, específico y fundamental para el análisis."
    },
    {
      "costo_recibido": "Costo2",
      "valor_recibido": "$Valor2",
      "es_valido": false,
      "justificacion": "Inválido. Este costo es variable, no fijo. Su valor depende directamente de las ventas y la producción."
    },
    {
      "costo_recibido": "Costo3",
      "valor_recibido": "$Valor3",
      "es_valido": false,
      "justificacion": "Inválido. El término es ambiguo y agrupa múltiples costos. Se debe desglosar en ítems específicos."
    },
    {
      "costo_recibido": "Costo4",
      "valor_recibido": "$Valor4",
      "es_valido": false,
      "justificacion": "Inválido. Según las instrucciones, este tipo de costo debe ser excluido del análisis."
    }
  ],
  "costos_obligatorios_faltantes": [
    {
      "nombre": "Costo Obligatorio 1",
      "descripcion": "Descripción del costo obligatorio que debe incluirse por ley o necesidad operativa.",
      "motivo_critico": "Razón por la cual este costo es crítico y obligatorio para el funcionamiento del negocio."
    },
    {
      "nombre": "Costo Obligatorio 2",
      "descripcion": "Descripción del segundo costo obligatorio necesario para la operación.",
      "motivo_critico": "Explicación de por qué es indispensable incluir este costo en el análisis."
    }
  ],
  "costos_recomendados_faltantes": [
    {
      "nombre": "Costo Recomendado 1",
      "descripcion": "Descripción del costo recomendado que mejora la operación del negocio.",
      "beneficio": "Beneficio específico que aporta este costo al crecimiento y eficiencia del negocio."
    },
    {
      "nombre": "Costo Recomendado 2",
      "descripcion": "Descripción del segundo costo recomendado para optimizar operaciones.",
      "beneficio": "Ventaja competitiva o mejora operativa que proporciona este costo al negocio."
    }
  ],
  "resumen_validacion": {
    "mensaje_general": "Se han detectado errores en la lista proporcionada. Por favor, corrígela siguiendo las justificaciones para cada ítem inválido. Adicionalmente, para este tipo de negocio, es crítico que no olvides incluir los costos obligatorios y recomendados listados. Estos son vitales para la protección y el crecimiento sostenible del negocio.",
    "puede_proseguir_analisis": false
  }
}

Nota: ste formato tiene funciones exclusivamente informativas para el correcto formato de la respuesta. Por ningún motivo debe ser la respuesta recibida. Los textos genéricos deben ser reemplazados con contenido específico.

  `;

      try {
      const res = await fetch("https://backend-costos.onrender.com/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
      
      const data = await res.json();
      const content = data.respuesta as string;
      const parsedContent: ValidationResult = JSON.parse(content.match(/```(?:json)?([\s\S]*?)```/)?.[1] || content);
      
      setValidationResult(parsedContent);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al procesar la validación.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- MANEJADORES DEL MODAL ---
  const handleExecuteValidation = () => {
    setIsModalOpen(true);
    executeValidation();
  };
  
  const handleProceedToAnalysis = () => {
    // Aquí es donde llamarías al SIGUIENTE paso (el análisis con el prompt anterior)
    // Por ahora, simplemente cerramos el modal y completamos la simulación.
    console.log("Procediendo al análisis principal con datos validados...");
    setIsModalOpen(false);
    onSimulationComplete(records, total);
     setSimulationCompleted(true); // Descomentar si tienes una pantalla de éxito
  };
  const ValidationGeneral = async () => {
    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    const listaCostos = records
      .map(r => r.name && r.amount ? `${r.name.trim()}: $${r.amount}` : null)
      .filter(Boolean)
      .join('\n');

    // TODO: Obtener la ubicación dinámicamente si es necesario
    const ubicacion = "Quito, La Carolina";
    const tipoNegocio="Cafeteria"
    
    // El prompt completo para la IA
    const prompt = `Rol: Actúa como un asesor financiero de élite y analista de riesgos, especializado en la rentabilidad y optimización de costos para ${tipoNegocio} en Quito, Ecuador. Tu análisis debe ser preciso, práctico y basado en datos del mercado local.
Contexto: Soy un emprendedor con un ${tipoNegocio} en Quito y necesito un diagnóstico financiero experto. Te proporcionaré la ubicación exacta y mi lista de costos fijos mensuales. Tu misión es auditar estos números, identificar puntos ciegos en mi presupuesto y alertarme sobre los riesgos operativos y financieros que estoy corriendo.
No tomes los salarios como un costo fijos. Vamos ignorar todo lo que tenga que ver con salarios
Información del Negocio:
Ubicación (Zona/Barrio en Quito):${ubicacion}
Costos Fijos Mensuales Identificados:
${listaCostos}
Tarea:
Basado en los costos y la ubicación proporcionada, realiza el siguiente diagnóstico en cuatro pasos:
Análisis Comparativo de Costos: Evalúa cada costo que te proporcioné. Compáralo con los rangos de mercado específicos para la zona de Quito indicada. Para el campo evaluacion, tu respuesta debe ser estrictamente "Dentro del rango" o "Fuera del rango". Toda la justificación, el análisis cualitativo y el porqué de la evaluación deben ir exclusivamente en el campo comentario_evaluacion.
Identificación de Costos Fijos Omitidos: Determina qué costos fijos críticos no están en la lista. Para cada uno, describe su importancia estratégica para la sostenibilidad del negocio.
Análisis de Riesgos por Omisión: Con base en los costos que faltan, detalla los riesgos específicos que la cafetería está corriendo. Para cada riesgo, indica su causa directa (el costo omitido) y el impacto potencial en la operación o finanzas del negocio.
Plan de Acción y Recomendaciones: Proporciona tres recomendaciones accionables y priorizadas. Cada recomendación debe ser una acción clara para mitigar un riesgo detectado o para optimizar un costo que evaluaste como "Fuera del rango".
Formato de Respuesta:
Tu respuesta debe ser únicamente un objeto JSON que siga estrictamente la siguiente estructura. No incluyas ningún texto introductorio, explicaciones o conclusiones fuera del formato JSON.

[
  "analisis_costos_recibidos": [
    "alquiler": {
      "valor_recibido": "$800",
      "rango_estimado_zona_especifica": "$900 - $1800 (para La Carolina)",
      "evaluacion": "Fuera del rango",
      "comentario_evaluacion": "El valor está por debajo del rango de mercado para La Carolina. Esto representa una ventaja competitiva significativa, pero es crucial asegurar que el contrato de arrendamiento sea estable a largo plazo."
    },
    "sueldos_personal": {
      "valor_recibido": "$1100",
      "rango_estimado_zona_especifica": "$1100 - $1800 (para 2 empleados)",
      "evaluacion": "Dentro del rango",
      "comentario_evaluacion": "El valor se encuentra en el límite inferior del rango para dos empleados, cumpliendo con los requisitos legales básicos. La eficiencia y la retención del personal son factores clave a monitorear con este presupuesto."
    },
    "servicios_basicos": {
      "valor_recibido": "$700",
      "rango_estimado_zona_especifica": "$250 - $500",
      "evaluacion": "Fuera del rango",
      "comentario_evaluacion": "El costo excede significativamente el límite superior del rango esperado. Esto es una señal de alerta máxima que apunta a una fuga de capital, probablemente por equipos muy ineficientes, una fuga de agua no detectada o una tarifa eléctrica incorrecta."
    }
    "internet": {
      "valor_recibido": "$50",
      "rango_estimado_zona_especifica": "$30 - $60",
      "evaluacion": "Dentro del rango",
      "comentario_evaluacion": "El costo está dentro del rango esperado para un plan básico de internet, lo cual es adecuado para las operaciones diarias."
    }
  ],
  "plan_de_accion_recomendado": [
    {
      "titulo": "Auditoría de Emergencia de Servicios Básicos",
      "descripcion": "Acción Inmediata: Realizar una revisión exhaustiva del consumo de electricidad y agua ya que su costo está 'Fuera del rango'. Contactar a la Empresa Eléctrica para verificar tarifas y al proveedor de internet para optimizar el plan. Es prioritario encontrar la causa del alto gasto para detener la fuga de dinero.",
      "prioridad": "Crítica"
    },
    {
      "titulo": "Implementar un Sistema de Control y Prevención",
      "descripcion": "Contratar un software de punto de venta (POS) para mitigar el riesgo de descontrol financiero. Asignar un 1.5% de las ventas a un fondo para mantenimiento preventivo y así reducir el riesgo de parada operativa.",
      "prioridad": "Alta"
    },
    {
      "titulo": "Aprovechar la Ventaja Competitiva del Alquiler",
      "descripcion": "Dado que el alquiler está 'Fuera del rango' (a su favor), intente negociar una extensión del contrato a largo plazo para asegurar esta ventaja. El ahorro mensual obtenido aquí puede ser redirigido para cubrir los costos omitidos, como el marketing o el seguro del negocio.",
      "prioridad": "Media"
    }
  ]
    ]`;

      try {
      const res = await fetch("https://backend-costos.onrender.com/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
      
      const data = await res.json();
      const content = data.respuesta as string;
      const parsedContent: FinalAnalysisResult = JSON.parse(content.match(/```(?:json)?([\s\S]*?)```/)?.[1] || content);
      
      setFinalAnalysisResult(parsedContent);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al procesar la validación.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseAndCorrect = () => {
    setIsModalOpen(false);
  };
  
  if (simulationCompleted) {
    return (
      <div className="text-center p-8 bg-green-100 rounded-brand border border-green-300">
        {isLoading ? (
        <>
          <span className="text-6xl animate-pulse">⏳</span>
          <p className="mt-4 text-xl text-neutral-700">Procesando el análisis, por favor espera...</p>
        </>
      ) : finalAnalysisResult ? (
        <>
          <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800">¡Proceso Completado!</h3>
          <p className="text-neutral-600 mt-2">Tus datos han sido validados y el análisis ha finalizado.</p>
          <FinalAnalysisResultDisplay data={finalAnalysisResult} />
        </>
      ) : (
        <p className="text-red-500">Ocurrió un error al obtener los resultados.</p>
      )}
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
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-brand shadow-lg"
          >
            Ejecutar Analisis
          </button>
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