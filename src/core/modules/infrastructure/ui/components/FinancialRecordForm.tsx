import { useState } from "react";
import { type FinancialRecord } from "../../../domain/entities/FinancialRecord"
import { FaTrash } from "react-icons/fa";

// REFACTOR: Renamed to be more generic, as it handles "records" which could be costs, assets, etc.
export function FinancialRecordForma() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);

  const total = records.reduce((sum, record) => {
    const amount = parseFloat(record.amount) || 0;
    return sum + amount;
  }, 0);

  const addRecord = () => {
    const newRecord = {
      id: Date.now(), // Unique ID based on timestamp
      name: "",
      amount: "",
      businessId: 1, 
      moduleId: 1,
      createdAt: new Date().toISOString(),
    };
    
    // Using the updater function ensures we have the latest state
    setRecords(prevRecords => [...prevRecords, newRecord]);
  };

  const removeRecord = (recordId: number) => {
    setRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
  };

  const updateRecord = (recordId: number, fieldName: string, value: number) => {
    setRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === recordId 
          ? { ...record, [fieldName]: value }
          : record
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* STYLE: Changed text for consistency with the new naming */}
      <button
        type="button"
        onClick={addRecord}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
      >
        Agregar Registro
      </button>

      {/* REFACTOR: Use conditional rendering for the entire container. 
          This is slightly cleaner than rendering a div with a 'hidden' class. */}
      {records.length > 0 && (
        <div id="records-container" className="space-y-3">
          {records.map((record) => (
            // BEST PRACTICE: Using the stable `record.id` as the key is perfect.
            <div key={record.id} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  // BEST PRACTICE: Use a more stable and accessible ID
                  id={`record-name-${record.id}`} 
                  placeholder="Nombre del registro (ej: Alquiler)"
                  value={record.name}
                  onChange={(e) => updateRecord(record.id, 'name', parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  // BEST PRACTICE: Use a more stable and accessible ID
                  id={`record-amount-${record.id}`}
                  placeholder="Monto"
                  value={record.amount}
                  onChange={(e) => updateRecord(record.id, 'amount', parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                />
              </div>
              <div className="flex items-center pt-3">
                <button 
                  type="button" 
                  onClick={() => removeRecord(record.id)}
                  // STYLE: Added an aria-label for better accessibility
                  aria-label="Remove record"
                  className="p-2 text-red-500 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 hover:cursor-pointer"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* The total is now displayed whenever there are records */}
      {records.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-700">
            {/* The `total` variable is always up-to-date */}
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}