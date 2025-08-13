

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
  const config = {
    [ModuleStatus.InProgress]: { bgColor: 'bg-blue-500', textColor: 'text-white', icon: <FaClock size={24} /> },
    [ModuleStatus.Locked]: { bgColor: 'bg-gray-400', textColor: 'text-gray-800', icon: <FaLock size={24} /> },
    [ModuleStatus.Completed]: { bgColor: 'bg-green-500', textColor: 'text-white', icon: null },
  };

  const { bgColor, textColor, icon } = config[module.status];

  return (
    <div className={`flex flex-col items-center justify-center w-36 h-36 rounded-lg shadow-md p-4 ${bgColor} ${textColor} transition-transform transform hover:scale-105`}>
      <div className="mb-2 h-6">{icon}</div>
      <span className="font-semibold text-center">{module.name}</span>
    </div>
  );
};