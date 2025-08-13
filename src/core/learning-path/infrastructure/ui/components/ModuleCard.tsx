

// Fichero: src/core/learning-path/ui/components/ModuleCard.tsx
import React from 'react';
import { FaLock, FaClock } from 'react-icons/fa';
import type { Module } from "../../../domain/entities/Module";
import { ModuleStatus } from "../../../domain/entities/ModuleStatus";


interface Props {
  module: Module;
}

/**
 * Componente de tarjeta de módulo.
 * Ahora usa `module.name` en lugar de `module.title` para mostrar el nombre.
 */
export const ModuleCard: React.FC<Props> = ({ module }) => {
   // Objeto de configuración para definir el estilo y el contenido según el estado
  const statusConfig = {
    [ModuleStatus.InProgress]: {
      bgColor: 'bg-blue-500',
      content: <div className="text-4xl mb-2">🎯</div> // Div para estado "En Progreso"
    },
    [ModuleStatus.Locked]: {
      bgColor: 'bg-gray-400',
      content: <div className="text-4xl mb-2">🔒</div> // Div para estado "Bloqueado"
    },
    [ModuleStatus.Completed]: {
      bgColor: 'bg-green-500',
      content: <div className="text-4xl mb-2">✅</div> // Div para estado "Completado"
    },
  };

  // Selecciona la configuración correcta basada en el estado del módulo
  const { bgColor, content } = statusConfig[module.status];

  return (
    <div className={`flex flex-col items-center justify-center w-36 h-36 rounded-xl shadow-md p-4 ${bgColor} text-white transition-transform transform hover:scale-105`}>
      
      {/* Renderiza el div correspondiente al estado del módulo */}
      {content}
      
      {/* Muestra el nombre del módulo */}
      <h3 className="font-semibold text-lg text-center">{module.name}</h3>
    </div>
  );


  
};