import { useState } from "react";
import { FaRobot, FaCheckCircle,FaExclamationTriangle  } from "react-icons/fa";
import type { ModuleContent } from "../../../domain/entities/ModuleContent";
import type { FinancialRecord } from "../../../domain/entities/FinancialRecord";
import { ValidationModal } from "./ValidationModal";

// ============================================================================
// 1. The Financial Record Form (as a "Dumb" Presentation Component)
// ============================================================================
// It receives all data and functions via props from its parent.

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
      {/* "Añadir" button, calls the function passed via props */}
      <button
        type="button"
        onClick={onAddRecord}
        className="bg-secondary-600 hover:bg-secondary-700 text-white font-bold py-2 px-4 rounded-brand mb-4 shadow-sm inline-flex items-center"
      >
        <i className="fas fa-plus mr-2"></i>Añadir Costo
      </button>

      {/* Renders the list of records it receives via props */}
      {records.length > 0 && (
        <div className="space-y-4 overflow-y-auto max-h-96 pr-2 bg-secondary-50">
          {records.map((record) => (
            <div key={record.id} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  id={`record-name-${record.id}`}
                  placeholder="Nombre del costo (ej: Alquiler)"
                  value={record.name}
                  onChange={(e) => onUpdateRecord(record.id, 'name', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  id={`record-amount-${record.id}`}
                  placeholder="Monto"
                  // NOTE: The `value` of an input is always a string.
                  value={record.amount}
                  onChange={(e) => onUpdateRecord(record.id, 'amount', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                />
              </div>
              <div className="flex items-center pt-3">
                <button
                  type="button"
                  onClick={() => onRemoveRecord(record.id)}
                  aria-label="Remove record"
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

        <div
          className="bg-accent-50 border-l-4 border-accent-500 p-4 mt-5 rounded-r-lg"
        >
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
// 2. The Main Simulation Section Component (The "Smart" Container)
// ============================================================================
// It holds the state and logic, and passes them down to the form component.

interface SimulationSectionProps {
  moduleContent: ModuleContent;
  onSimulationComplete: (records: FinancialRecord[], total: number) => void;
};

export function SimulationSection({ moduleContent, onSimulationComplete }: SimulationSectionProps) {
  const [simulationCompleted, setSimulationCompleted] = useState(false);
  // --- ESTADO (NUEVO) ---
  // Guardaremos si los datos son válidos para configurar el modal
  const [isValid, setIsValid] = useState(false);
    // --- ESTADO DEL MODAL (NUEVO) ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper para crear un nuevo registro. Esto evita la repetición de código.
  const createNewRecord = (): FinancialRecord => ({
    id: Date.now() + Math.random(), // Añadimos random para mayor unicidad en caso de llamadas rápidas
    name: "",
    amount: "",
    businessId: 1,
    moduleId: moduleContent.id,
    createdAt: new Date().toISOString(),
  });

  // --- State and Logic Lifted from the Form ---
  const [records, setRecords] = useState<FinancialRecord[]>(() => [createNewRecord()]);

  // The total is derived from the state on each render.
  const total = records.reduce((sum, record) => {
    // Parse the amount string to a number for calculation.
    const amount = parseFloat(record.amount) || 0;
    return sum + amount;
  }, 0);

  const addRecord = () => {
    setRecords(prevRecords => [...prevRecords, createNewRecord()]);
  };

  const removeRecord = (recordId: number) => {
    setRecords(prevRecords => {
      // Si solo queda un elemento, no permitimos la eliminación.
      if (prevRecords.length <= 1) {
        return prevRecords; // Devolvemos el array sin cambios.
      }
      // Si hay más de un elemento, filtramos como antes.
      return prevRecords.filter(record => record.id !== recordId);
    });
  };

  // This function now correctly handles updating fields with string values.
  const updateRecord = (recordId: number, field: 'name' | 'amount', value: string) => {
    setRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === recordId
          ? { ...record, [field]: value }
          : record
      )
    );
  };
  // --- End of Lifted State and Logic ---

 // --- LÓGICA DE COMPLETACIÓN (SEPARADA) ---
 const proceedWithCompletion = () => {
    console.log("Simulación finalizada...", { records, total });
    setSimulationCompleted(true);
    onSimulationComplete(records, total);
  };

  const handleAnalyzeClick = () => {
    const emptyRecords = records.filter(
      (record) => record.name.trim() === "" || record.amount.trim() === ""
    );
    setIsValid(emptyRecords.length === 0);
    setIsModalOpen(true);
  };

  const handleConfirmAnalysis = () => {
    setIsModalOpen(false);
    proceedWithCompletion();
  };


  if (simulationCompleted) {
    return (
      <div className="text-center p-8 bg-green-100 rounded-brand border border-green-300">
        <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800">Analisis Completado!</h3>
        <p className="text-neutral-600 mt-2">Has registrado un total de ${total.toFixed(2)} en costos.</p>
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
        {/* We render the form component and pass down all the state and handlers */}
        <FinancialRecordForm
          records={records}
          total={total}
          onAddRecord={addRecord}
          onRemoveRecord={removeRecord}
          onUpdateRecord={updateRecord}
        />

        <div className="border-t border-neutral-200 mt-6 text-right">
          <button
            onClick={handleAnalyzeClick}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-brand shadow-lg"
          >
            Ejecutar Analisis
          </button>
        </div>

      </div>

       {/* RENDERIZADO DEL MODAL (NUEVO) */}
    {/* RENDERIZADO DEL MODAL (AHORA MÁS LIMPIO) */}
      <ValidationModal
        isOpen={isModalOpen}
        variant={isValid ? 'confirmation' : 'warning'}
        title={isValid ? "Confirmar Análisis" : "Datos Incompletos"}
        icon={
          isValid 
            ? <FaCheckCircle className="text-green-600" /> 
            : <FaExclamationTriangle className="text-yellow-500" />
        }
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAnalysis}
      >
        {isValid ? (
          <div>
            <p>Todos los datos están listos para ser analizados.</p>
            <p className="mt-2">Se analizarán <strong>{records.length}</strong> costos por un total de <strong>${total.toFixed(2)}</strong>.</p>
          </div>
        ) : (
          <div>
            <p className="font-bold mb-3">Se encontraron campos vacíos.</p>
            <p>Por favor, cierra esta ventana y asegúrate de que todos los costos tengan un nombre y un monto asignado.</p>
          </div>
        )}
      </ValidationModal>
    </div>
  );
};