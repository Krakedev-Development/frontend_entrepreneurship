// Fichero: src/core/learning-path/ui/components/LearningPathGrid.tsx
import React from 'react';

import { ModuleCard } from './ModuleCard';
import type { Module } from '../../../domain/entities/Module';

interface Props {
  modules: Module[];
}

/**
 * Componente que renderiza la grilla de módulos.
 * Se encarga del layout y de mapear los datos a los componentes ModuleCard.
 */
export const LearningPathGrid: React.FC<Props> = ({ modules }) => {
  return (
    <div className="grid grid-cols-3 gap-8">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </div>
  );
};