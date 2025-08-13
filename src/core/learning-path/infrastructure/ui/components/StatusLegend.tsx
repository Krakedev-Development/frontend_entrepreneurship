// Fichero: src/core/learning-path/ui/components/StatusLegend.tsx
import React from 'react';

/**
 * Componente para la leyenda de estados en la parte inferior.
 */
export const StatusLegend: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-6 mt-12">
      <div className="flex items-center">
        <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
        <span>Completado</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
        <span>En progreso</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div>
        <span>Bloqueado</span>
      </div>
    </div>
  );
};