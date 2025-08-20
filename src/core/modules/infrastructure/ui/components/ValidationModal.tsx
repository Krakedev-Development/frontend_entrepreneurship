import React from 'react';

interface ValidationModalProps {
  isOpen: boolean;
  // La 'variant' determinará qué botones se muestran
  variant: 'warning' | 'confirmation';
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  // onConfirm ahora es opcional, ya que no se usa en la variante 'warning'
  onConfirm?: () => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  variant,
  title,
  icon,
  children,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-brand shadow-brand-lg w-full max-w-lg transform transition-all">
        {/* Encabezado */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-bold text-neutral-800 flex items-center gap-3">
              {icon}
              <span>{title}</span>
            </h4>
            <button onClick={onClose} aria-label="Cerrar modal" className="text-neutral-500 hover:text-red-700 hover:bg-red-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
              <span className="text-2xl font-sans">×</span>
            </button>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="p-6">
          <div className="text-neutral-700 text-base">{children}</div>
        </div>

        {/* Pie de página con lógica de botones */}
        <div className="flex justify-end gap-3 bg-neutral-50 p-4 rounded-b-brand">
          {variant === 'warning' ? (
            // --- Si es una advertencia, SÓLO mostramos un botón para cerrar ---
            <button
              onClick={onClose}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-brand"
            >
              Entendido
            </button>
          ) : (
            // --- Si es una confirmación, mostramos ambos botones ---
            <>
              <button
                onClick={onClose}
                className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold py-2 px-4 rounded-brand"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-brand"
              >
                Confirmar Análisis
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};