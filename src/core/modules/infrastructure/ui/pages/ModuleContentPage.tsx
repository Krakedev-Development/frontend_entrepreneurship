// src/features/progress-map/infrastructure/ui/ModuleContentPage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import {
  FaVideo, FaRobot, FaChartLine, FaGraduationCap, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';

import { ModuleTopNav, type NavItem } from '../components/ModuleTopNav';
import { ModuleConcept } from '../components/ModuleConcept';
import { ModuleHeader } from '../../../../../shared/infrastructure/components/Header';
import { useEffect, useState } from 'react';
import type { ModuleContent } from '../../../domain/entities/ModuleContent';
import { ModuleRepositoryMock } from '../../adapters/ModuleRepositoryMock';
import { GetModuleContent } from '../../../application/useCase/GetModuleContent';

const navItems: NavItem[] = [
  { id: 'learn', label: 'Aprender', icon: <FaVideo className="text-blue-600" />, status: 'active' },
  { id: 'simulate', label: 'Simulación', icon: <FaRobot className="text-green-600" />, status: 'enabled' },
  { id: 'results', label: 'Resultados', icon: <FaChartLine className="text-neutral-400" />, status: 'disabled' },
];

export function ModuleContentPage() {
  const navigate = useNavigate();
  const { businessId } = useParams(); // Para saber a dónde volver
  const [moduleContent, setModuleContent] = useState<ModuleContent>(
    {
        id: 1,
        title: "Costos Fijos",
        concept: "Lorem ipsum...",
        resourceUrl: "vacio"
      }
  )

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const moduleRepository = new ModuleRepositoryMock ();
        const getModuleContentUseCase = new GetModuleContent (
            moduleRepository
        );

        // Ejecutamos el caso de uso
        const fetchedContent = await getModuleContentUseCase.execute(1);
        setModuleContent(fetchedContent);
      } catch (e) {
        console.log("Error al cargar el contenido")
      } 
    };

    fetchContent();
  }, []);

  const handleTopNavClick = (itemId: string) => {
    console.log(`Navegando a la sección: ${itemId}`);
    // Aquí iría la lógica para cambiar la vista (ej. a la pantalla de simulación)
  };

  const handleBack = () => {
    // Vuelve a la lista de módulos de ese negocio
    navigate(`/businesses/${businessId}/modules`);
  };

  const handleNext = () => {
    // Navega a la siguiente sección o módulo
    console.log('Navegando al siguiente paso');
  };

  return (
    <>
      <ModuleHeader title="Educación Financiera" userName="Emprendedor" />
      <div className="bg-white p-6 sm:p-8 w-full max-w-4xl mx-auto my-8 rounded-brand shadow-brand-lg">
        
        <ModuleTopNav items={navItems} onItemClick={handleTopNavClick} />
        
        {/* Sección del Video Educativo */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-neutral-800 mb-2 flex items-center gap-3">
            <FaGraduationCap className="text-primary-500" />
            <span>{moduleContent.title}</span>
          </h3>
          <p className="text-lg text-neutral-600 mb-6">moduleContent.description</p>
          
          {/* Contenedor del Video */}
          <div className="aspect-w-16 aspect-h-9 rounded-brand overflow-hidden shadow-md mb-6 bg-black">
            <iframe
              className="w-full h-full"
              src={moduleContent.resourceUrl}
              title="Video Educativo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <ModuleConcept>{moduleContent.concept}</ModuleConcept>
        </div>
        
        {/* Botones de Navegación */}
        <div className="flex justify-between mt-8 border-t border-neutral-200 pt-6">
          <button
            onClick={handleBack}
            className="bg-neutral-500 hover:bg-neutral-600 text-white font-bold py-3 px-6 rounded-brand transition-colors flex items-center gap-2"
          >
            <FaArrowLeft />
            Volver
          </button>
          <button
            onClick={handleNext}
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-brand transition-colors flex items-center gap-2"
          >
            Siguiente
            <FaArrowRight />
          </button>
        </div>
        
      </div>
    </>
  );
}