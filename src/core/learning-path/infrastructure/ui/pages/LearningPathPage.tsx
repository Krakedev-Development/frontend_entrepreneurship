// Fichero: src/core/learning-path/ui/pages/LearningPathPage.tsx
import React, { useEffect, useState } from 'react';
import type { Module } from '../../../domain/entities/Module';
import { LearningPathRepositoryMock } from '../../adapters/LearningPathRepositoryMock';
import { GetLearningPath } from '../../../application/useCase/GetLearningPath';
import { LearningPathGrid } from '../components/LearningPathGrid';
import { StatusLegend } from '../components/StatusLegend';
import { ModuleHeader } from '../../../../../shared/infrastructure/components/Header';


/**
 * Componente de Página Principal.
 * Instancia las dependencias y ejecuta el caso de uso para mostrar los datos.
 */
export const LearningPathPage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // --- Inyección de Dependencias ---
    const learningPathRepository = new LearningPathRepositoryMock();
    const getLearningPathUseCase = new GetLearningPath(learningPathRepository);

    const fetchModules = async () => {
      try {
        setIsLoading(true);
        // Ahora llamamos al caso de uso con un ID de ejemplo.
        // En una app real, este ID vendría de la URL, del estado global, etc.
        const learningPathId = 1;
        const fetchedModules = await getLearningPathUseCase.execute(learningPathId);
        setModules(fetchedModules);
      } catch (error) {
        console.error('Error al obtener el camino de aprendizaje:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  return (
<>
   <ModuleHeader title="Módulo de Educación Financiera" userName="Usuario de Prueba" />
     <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10">


      <main className="flex flex-col items-center">
        <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Camino de Aprendizaje</h2>
            <a href="#" className="text-blue-600 hover:underline">
            &larr; Volver a Negocios
            </a>
        </div>

        {isLoading ? (
            <p>Cargando módulos...</p>
        ) : (
            <>
            <LearningPathGrid modules={modules} />
            <StatusLegend />
            </>
        )}
      </main>
    </div>

</>
    
   
  );
};