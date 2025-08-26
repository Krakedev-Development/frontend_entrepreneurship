import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaPlus } from "react-icons/fa";
import type { Business } from "../entities/Business";
import { GetAllBusinesses } from "../useCases/GetAllBusinesses";
import { BusinessService } from "../BusinessService";
import { BusinessList } from "./BusinessList";
import { ModuleHeader } from "../../shared/ui/components/Header";

export function BusinessesPage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const businessRepository = BusinessService.getInstance();
        const getAllBusinessesUseCase = new GetAllBusinesses(
          businessRepository
        );

        // Ejecutamos el caso de uso
        const fetchedBusinesses = await getAllBusinessesUseCase.execute();
        console.log(fetchedBusinesses);
        setBusinesses(fetchedBusinesses);
      } catch (e) {
        setError("No se pudieron cargar los negocios.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const handleAddBusiness = () => {
    navigate("/businesses/new");
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <p className="text-center text-neutral-500 h-full flex items-center justify-center">
          Cargando negocios...
        </p>
      );
    }
    if (error) {
      return (
        <p className="text-center text-error h-full flex items-center justify-center">
          {error}
        </p>
      );
    }
    return <BusinessList businesses={businesses} />;
  };

  return (
    <>
      <ModuleHeader title="Mis Negocios" userName="Usuario de Prueba" />
      <div className="flex flex-col flex-grow h-full items-center justify-center p-4 bg-neutral-50">
        <div className="bg-white rounded-brand shadow-brand-lg p-6 sm:p-8 w-full max-w-4xl">
          <header className="pb-4 border-b border-neutral-200">
            <h2 className="text-3xl font-bold text-neutral-800 flex items-center gap-3">
              <FaBriefcase className="text-primary-500" />
              <span>Negocios Registrados</span>
            </h2>
          </header>

          <div className="mt-8">
            <div className="overflow-y-auto h-[45vh] border bg-neutral-50 p-4 rounded-brand mb-8">
              {renderContent()}
            </div>
            <div className="flex justify-end w-full">
              <button
                onClick={handleAddBusiness}
                className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded-brand transition-transform hover:scale-105 shadow-sm flex items-center gap-2"
              >
                <FaPlus />
                Añadir Negocio
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
