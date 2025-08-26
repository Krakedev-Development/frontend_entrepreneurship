import { useState, useEffect } from "react";
import { FaRobot, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import type { ModuleContent } from "../../entities/ModuleContent";
import type { FinancialRecord } from "../../entities/FinancialRecord";
import type { ValidationResult } from "../../entities/ValidationResult";
import { ValidationModal } from "../components/ValidationModal";
import { ValidationResultDisplay } from "./ValidationResultDisplay";
import { ModuleService } from "../../ModuleService";
import { GetAllFinancialRecords } from "../../useCases/GetAllFinancialRecords";
import { BusinessService } from "../../../businesses/BusinessService";
import { FinancialRecordForm } from "./FinancialRecordForm";
import type { BusinessDTO } from "../../../businesses/dto/BusinessDTO";

interface SimulationSectionProps {
  moduleContent: ModuleContent;
  onSimulationComplete: (records: FinancialRecord[], total: number) => void;
}

export function SimulationSection({
  moduleContent,
  onSimulationComplete,
}: SimulationSectionProps) {
  const { businessId } = useParams();
  // --- Estados del Formulario y UI ---
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessDTO | null>(null);

  // --- Cargar información del negocio ---
  useEffect(() => {
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

    loadBusinessInfo();
  }, [businessId]);

  // --- Cargar registros existentes ---
  useEffect(() => {
    const loadRecords = async () => {
      try {
        setIsLoadingRecords(true);
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
        setError("Error al cargar los registros existentes");
      } finally {
        setIsLoadingRecords(false);
      }
    };

    loadRecords();
  }, [moduleContent.id]);

  // --- Lógica del Formulario ---
  function createNewRecord(): FinancialRecord {
    return {
      id: Date.now() + Math.random(),
      name: "",
      amount: 0,
      moduleId: moduleContent.id,
    };
  }

  const total = records.reduce((sum, record) => {
    const amount =
      typeof record.amount === "number"
        ? record.amount
        : parseFloat(record.amount) || 0;
    return sum + amount;
  }, 0);

  const addRecord = async () => {
    try {
      const moduleService = ModuleService.getInstance();
      const newRecord = createNewRecord();
      const savedRecord = await moduleService.addFinancialRecord({
        moduleId: newRecord.moduleId,
        name: newRecord.name,
        amount: newRecord.amount,
      });
      setRecords((prev) => [...prev, savedRecord]);
    } catch (error) {
      console.error("Error adding record:", error);
      setError("Error al agregar el registro");
    }
  };

  const removeRecord = async (id: number) => {
    if (records.length <= 1) {
      return;
    }
    try {
      const moduleService = ModuleService.getInstance();
      const success = await moduleService.deleteFinancialRecord(id);
      if (success) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error("Error removing record:", error);
      setError("Error al eliminar el registro");
    }
  };

  const updateRecord = async (
    id: number,
    field: "name" | "amount",
    value: string
  ) => {
    try {
      const moduleService = ModuleService.getInstance();
      const updates: Partial<FinancialRecord> = {
        [field]: field === "amount" ? parseFloat(value) || 0 : value,
      };
      const updatedRecord = await moduleService.updateFinancialRecord(
        id,
        updates
      );
      if (updatedRecord) {
        setRecords((prev) =>
          prev.map((r) => (r.id === id ? updatedRecord : r))
        );
      }
    } catch (error) {
      console.error("Error updating record:", error);
      setError("Error al actualizar el registro");
    }
  };

  // --- Lógica del Flujo de Análisis (API y Modal) ---
  const executeValidation = async () => {
    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    const listaCostos = records
      .map((r) =>
        r.name && r.amount ? `${r.name.trim()}: $${r.amount}` : null
      )
      .filter(Boolean)
      .join("\n");

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
    const prompt = `Rol: Actúa como un auditor de datos financieros y analista de riesgos. Tu especialización es asegurar la calidad y precisión de la información financiera de entrada para emprendimientos en Ecuador, ${ubicacion}, antes de que sea utilizada en un análisis estratégico.

Contexto: Soy un emprendedor con un negocio ${size} de tipo ${tipoNegocio} ubicado en ${ubicacion} y necesito tu ayuda para depurar mi lista de costos mensuales antes de que tu colega, el asesor financiero de élite, realice el diagnóstico completo. Un análisis profundo basado en datos incorrectos, agrupados o mal categorizados sería inútil y me llevaría a tomar decisiones erróneas. Tu misión es auditar mi lista y darme el visto bueno para proceder, o indicarme exactamente qué debo corregir.

Reglas de Validación:
1.  **Exclusividad de Costos Fijos:** La lista solo debe contener costos fijos, es decir, aquellos que no varían significativamente con el volumen de ventas mes a mes. Costos como 'materia prima', 'compra de inventario', 'insumos' o 'packaging' son costos variables y deben ser marcados como inválidos.
2.  **Costos Desagregados:** Cada ítem debe representar un único costo. No se aceptan costos agrupados como 'Servicios básicos e internet' o 'Marketing y permisos'. Deben ser listados por separado para un análisis preciso.
3.  **Especificidad:** No se aceptan costos ambiguos o genéricos como 'Varios', 'Otros gastos' o 'Gastos administrativos'. Cada costo debe ser claramente identificable.
4.  **Exclusión Explícita de Costos obligatorios:** Cualquier costo relacionado con compensación humana debe ser omitido, descartado y/o no incluido en los costos obligatorios para este análisis específico. Esto incluye pero no se limita a:

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

5.  **Verificación de Costos obligatorios faltantes:** Basado en el ${tipoNegocio} proporcionado, debes inferir los costos fijos críticos que fueron omitidos y mencionarlos en el resumen (en caso de haber alguno). En caso de existir costos obligatorios faltantes no se podrá proseguir con el analisis por lo que debes ser muy cauteloso al agregar alguno, recuerda que es un negocio pequeño y a lo mejor no es imperativo tener en cuenta estos costos, NO ESTAS OBLIGADO A INCLUIR COSTOS OBLIGATORIOS, SI CONSIDERAS QUE SE A PROPORCIONADO UNA LISTA ACEPTABLE DE COSTOS FIJOS DEJA LA SECCION DE COSTOS OBLIGATORIOS VACIA Y CENTRATE EN VALIDAR SUS VALORES. en tal caso puedes ponerlos en la seccion de recomendados, que no impiden que se prosiga con el analisis.
6.  **Verificación de Costos recomendados faltantes:** Basado en el ${tipoNegocio} proporcionado, debes inferir los costos fijos no tan importantes (Mejoran eficiencia/rentabilidad pero no son críticos) que fueron omitidos y mencionarlos en el resumen (en caso de haber alguno). Estos costos son meramente informativos para el conocimiento del emprendedor por lo tanto no impiden que se prosiga con el analisis en caso de no ser incluidos.
7.  **Verificación de costos realistas:** Parte crucial de tu trabajo es identificar los valores ilógicos (valores extremadamente altos o bajos). En caso de no cumplir con esta regla el costo debe ser marcado como invalido.

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
      "descripcion": "Descripción del costo obligatorio que debe incluirse por necesidad operativa.",
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

Nota: Este formato tiene funciones exclusivamente informativas para el correcto formato de la respuesta. Por ningún motivo debe ser la respuesta recibida. Los textos genéricos deben ser reemplazados con contenido específico.

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
      const parsedContent: ValidationResult = JSON.parse(
        content.match(/```(?:json)?([\s\S]*?)```/)?.[1] || content
      );

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
    console.log("Procediendo al análisis principal con datos validados...");
    setIsModalOpen(false);
    onSimulationComplete(records, total);
    
  };

  const handleCloseAndCorrect = () => {
    setIsModalOpen(false);
  };

  if (isLoadingRecords) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4 text-neutral-600">
          Cargando registros financieros...
        </p>
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
        variant={
          validationResult?.resumen_validacion.puede_proseguir_analisis
            ? "confirmation"
            : "warning"
        }
        title={
          isLoading
            ? "Auditando Datos..."
            : error
            ? "Error de Auditoría"
            : "Reporte de Auditoría"
        }
        icon={
          isLoading ? (
            <FaRobot className="animate-spin" />
          ) : error ? (
            <FaExclamationTriangle className="text-red-500" />
          ) : (
            <FaCheckCircle className="text-blue-500" />
          )
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
