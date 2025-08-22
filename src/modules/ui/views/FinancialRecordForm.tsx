
import { type FinancialRecord } from "../../entities/FinancialRecord"
import { FaPlus, FaTrash } from "react-icons/fa";

// REFACTOR: Renamed to be more generic, as it handles "records" which could be costs, assets, etc.
interface FinancialRecordFormProps {
  records: FinancialRecord[];
  total: number;
  onAddRecord: () => void;
  onRemoveRecord: (id: number) => void;
  onUpdateRecord: (id: number, field: 'name' | 'amount', value: string) => void;
}
export function FinancialRecordForm({
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
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-brand mb-4 shadow-sm inline-flex items-center"
      >
        <FaPlus className="mr-2" />Añadir Costo
      </button>

      {records.length > 0 && (
        <div className="space-y-4 overflow-y-auto max-h-48 pr-2 bg-secondary-50">
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
                  <FaTrash />
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