

// Fichero: src/core/learning-path/ui/components/ModuleCard.tsx
import React from 'react';
import type { Module } from "../../entities/Module";
import { ModuleStatus } from "../../entities/ModuleStatus";
import { useNavigate } from 'react-router-dom';


interface Props {
  module: Module;
  businessId: string; // ID del negocio para la navegación
}

/**
 * Componente de tarjeta de módulo.
 * Ahora usa `module.name` en lugar de `module.title` para mostrar el nombre.
 */
export const ModuleCard: React.FC<Props> = ({ module, 
  businessId
   }) => {
  const navigate = useNavigate();
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

  // Configuración por defecto para casos donde el status no coincida
  const defaultConfig = {
    bgColor: 'bg-gray-400',
    content: <div className="text-4xl mb-2">❓</div>
  };

  // Selecciona la configuración correcta basada en el estado del módulo
  const { bgColor, content } = statusConfig[module.status as keyof typeof statusConfig] || defaultConfig;

  // 4. Crear la función que maneja el clic
  const handleCardClick = () => {
    // Si el módulo está bloqueado, no hacemos nada.
    if (module.status === ModuleStatus.Locked) {
      return;
    }
    // Navegamos a la nueva ruta con los IDs necesarios
    navigate(`/businesses/${businessId}/learning-path/${module.id}`);
  };


  return (
    <div 
    onClick={handleCardClick}
    
    className={`flex flex-col items-center justify-center w-36 h-36 rounded-xl shadow-md p-4 ${bgColor} text-white transition-transform transform hover:scale-105`}>
      
      {/* Renderiza el div correspondiente al estado del módulo */}
      {content}
      
      {/* Muestra el nombre del módulo */}
      <h3 className="font-semibold text-lg text-center">{module.title}</h3>
    </div>
  );


  
};