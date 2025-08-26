// Fichero: src/core/learning-path/ui/components/ModuleCard.tsx
import React from "react";
import type { Module } from "../../entities/Module";
import { ModuleStatus } from "../../entities/ModuleStatus";
import { useNavigate } from "react-router-dom";

interface Props {
  module: Module;
  businessId: string; // ID del negocio para la navegación
}

/**
 * Componente de tarjeta de módulo.
 * Ahora usa `module.name` en lugar de `module.title` para mostrar el nombre.
 */
export const ModuleCard: React.FC<Props> = ({ module, businessId }) => {
  const navigate = useNavigate();
  // Objeto de configuración para definir el estilo y el contenido según el estado
  const statusConfig = {
    [ModuleStatus.InProgress]: {
      lineClass: "path-v",
      pathClass: "path-current",
      bgColor: "bg-blue-500",
      cursor: "pointer",
      content: <div className="text-4xl mb-2">🎯</div>, // Div para estado "En Progreso"
    },
    [ModuleStatus.Locked]: {
      lineClass: "path-v",
      pathClass: "path-locked",
      bgColor: "bg-gray-400",
      cursor: "not-allowed",
      content: <div className="text-4xl mb-2">🔒</div>, // Div para estado "Bloqueado"
    },
    [ModuleStatus.Completed]: {
      lineClass: "path-v",
      pathClass: "path-completed",
      bgColor: "bg-green-500",
      cursor: "pointer",
      content: <div className="text-4xl mb-2">✅</div>, // Div para estado "Completado"
    },
  };

  const getLineClass = (module: Module, columns: number) => {
    if (module.order === 9) {
      return "";
    }
    if (module.order % columns === 0) {
      return "path-v";
    }
    let row = 1;
    for (let i = 1; i <= columns; i++) {
      if (module.order % (columns * i) === module.order) {
        row = i;
        break;
      }
    }
    if (row % 2 === 0) {
      return "path-h-bw";
    }
    return "path-h-fw";
  };

  // Configuración por defecto para casos donde el status no coincida
  const defaultConfig = {
    bgColor: "bg-gray-400",
    content: <div className="text-4xl mb-2">❓</div>,
  };

  // Selecciona la configuración correcta basada en el estado del módulo
  const { bgColor, content, pathClass, cursor } =
    statusConfig[module.status as keyof typeof statusConfig] || defaultConfig;

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
    <div className="flex flex-col items-center justify-center relative">
      <div className={`path-line ${getLineClass(module, 3)} ${pathClass}`}></div>
      <div
        onClick={handleCardClick}
        className={`flex flex-col items-center justify-center z-20 w-36 h-36 rounded-xl shadow-md p-4 ${bgColor} text-white transition-transform transform hover:scale-105 cursor-${cursor}`}
      >
        {/* Renderiza el div correspondiente al estado del módulo */}
        {content}

        {/* Muestra el nombre del módulo */}
        <h3 className="font-semibold text-lg text-center">{module.title}</h3>
      </div>
    </div>
  );
};
