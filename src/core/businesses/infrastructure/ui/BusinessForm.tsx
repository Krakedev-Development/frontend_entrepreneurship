import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle, FaSave, FaTimes } from "react-icons/fa";
import type { CreateBusinessData } from "../../domain/repositories/IBusinessRepository";
import { CreateBusiness } from "../../application/useCase/CreateBusiness";
import { BusinessRepositoryMock } from "../adapters/BusinessRepositoryMock";
import { VisualSelector } from "../../../../shared/infrastructure/components/VisualSelector";

// Opciones para el selector de iconos con la estructura correcta
const iconOptions = [
  {
    value: "fas fa-utensils",
    display: <i className="fas fa-utensils text-2xl text-neutral-600"></i>,
  },
  {
    value: "fas fa-store",
    display: <i className="fas fa-store text-2xl text-neutral-600"></i>,
  },
  {
    value: "fas fa-coffee",
    display: <i className="fas fa-coffee text-2xl text-neutral-600"></i>,
  },
  {
    value: "fas fa-concierge-bell",
    display: (
      <i className="fas fa-concierge-bell text-2xl text-neutral-600"></i>
    ),
  },
  {
    value: "fas fa-heartbeat",
    display: <i className="fas fa-heartbeat text-2xl text-neutral-600"></i>,
  },
  {
    value: "fas fa-tools",
    display: <i className="fas fa-tools text-2xl text-neutral-600"></i>,
  },
  {
    value: "fas fa-briefcase",
    display: <i className="fas fa-briefcase text-2xl text-neutral-600"></i>,
  },
];

// Opciones para el selector de color con la estructura correcta
const colorOptions = [
  {
    value: "primary-500",
    display: <div className="w-full h-8 rounded-md bg-primary-500"></div>,
  },
  {
    value: "green-500",
    display: <div className="w-full h-8 rounded-md bg-green-500"></div>,
  },
  {
    value: "yellow-500",
    display: <div className="w-full h-8 rounded-md bg-yellow-500"></div>,
  },
  {
    value: "orange-500",
    display: <div className="w-full h-8 rounded-md bg-orange-500"></div>,
  },
  {
    value: "red-500",
    display: <div className="w-full h-8 rounded-md bg-red-500"></div>,
  },
  {
    value: "neutral-700",
    display: <div className="w-full h-8 rounded-md bg-neutral-700"></div>,
  },
  {
    value: "amber-900",
    display: <div className="w-full h-8 rounded-md bg-amber-900"></div>,
  },
];

export function BusinessForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<CreateBusinessData, "userId">>({
    name: "",
    businessType: "",
    location: "",
    sizeId: 1,
    icon: iconOptions[0].value,
    color: colorOptions[0].value,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisualSelectorChange = (
    name: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const businessRepository = new BusinessRepositoryMock();
      const createBusinessUseCase = new CreateBusiness(businessRepository);

      // En una app real, el userId vendría del estado de autenticación global
      const dataToSave: CreateBusinessData = { ...formData, userId: 1 };

      await createBusinessUseCase.execute(dataToSave);

      // Si todo va bien, volvemos a la lista de negocios
      navigate("/businesses");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    navigate("/businesses"); // Volver a la página anterior
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-neutral-100">
      <div className="bg-white rounded-brand shadow-brand-lg p-6 sm:p-8 w-full max-w-2xl">
        <header className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-800 flex items-center justify-center gap-3">
            <FaInfoCircle className="text-primary-500" />
            <span>Información del Negocio</span>
          </h2>
          <p className="text-neutral-500 mt-2">
            Completa los datos para registrar tu nuevo negocio.
          </p>
        </header>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre del Negocio */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Nombre del Negocio
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-brand focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Tipo de Negocio (Caja de Texto) */}
            <div>
              <label
                htmlFor="businessType"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Tipo de Negocio
              </label>
              <input
                type="text"
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                placeholder="Ej: Restaurante, Tienda, Consultoría"
                className="w-full px-4 py-3 border border-neutral-300 rounded-brand focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Ubicación
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-brand focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Tamaño del Negocio */}
          <div>
            <label
              htmlFor="sizeId"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Tamaño del Negocio
            </label>
            <select
              id="sizeId"
              name="sizeId"
              value={formData.sizeId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-brand focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value={1}>Pequeño</option>
              <option value={2}>Mediano</option>
              <option value={3}>Grande</option>
            </select>
          </div>

          <VisualSelector
            label="Icono Representativo"
            name="icon"
            options={iconOptions}
            selectedValue={formData.icon}
            onChange={(value) => handleVisualSelectorChange("icon", value)}
          />

          {/* Selector de Color */}
          <VisualSelector
            label="Color del Tema"
            name="color"
            options={colorOptions}
            selectedValue={formData.color}
            onChange={(value) => handleVisualSelectorChange("color", value)}
          />

          {error && <p className="text-center text-error-dark">{error}</p>}

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-1/2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold py-3 px-4 rounded-brand transition-colors flex items-center justify-center gap-2"
            >
              <FaTimes /> Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-1/2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-brand transition-colors flex items-center justify-center gap-2"
            >
              <FaSave /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
