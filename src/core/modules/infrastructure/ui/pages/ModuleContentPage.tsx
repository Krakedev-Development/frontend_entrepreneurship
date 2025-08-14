// src/features/progress-map/infrastructure/ui/ModuleContentPage.tsx
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaVideo, FaRobot, FaChartLine, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';

import { ModuleTopNav, type NavItem } from '../components/ModuleTopNav';
import { ModuleHeader } from '../../../../../shared/infrastructure/components/Header';
import { useEffect, useState } from 'react';
import type { ModuleContent } from '../../../domain/entities/ModuleContent';
import { ModuleRepositoryMock } from '../../adapters/ModuleRepositoryMock';
import { GetModuleContent } from '../../../application/useCase/GetModuleContent';
import { VideoSection } from '../components/VideoSection';
import { SimulationSection } from '../components/SimulationSection';
import { ResultsSection } from '../components/ResultSection';

// Tipos para el progreso del módulo
interface ModuleProgress {
  videoCompleted: boolean;
  simulationCompleted: boolean;
  resultsViewed: boolean;
}

export function ModuleContentPage() {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const [currentSection, setCurrentSection] = useState<'learn' | 'simulate' | 'results'>('learn');
  const [moduleContent, setModuleContent] = useState<ModuleContent>({
    id: 1,
    title: "Costos Fijos",
    concept: "Lorem ipsum...",
    resourceUrl: "vacio"
  });
  const [progress, setProgress] = useState<ModuleProgress>({
    videoCompleted: true,
    simulationCompleted: false,
    resultsViewed: false
  });

  // Crear navItems dinámicamente basado en el progreso
  const navItems: NavItem[] = [
    {
      id: 'learn',
      label: 'Aprender',
      icon: <FaVideo className="text-blue-600" />,
      status: currentSection === 'learn' ? 'active' : (progress.videoCompleted ? 'enabled' : 'enabled')
    },
    {
      id: 'simulate',
      label: 'Simulación',
      icon: <FaRobot className="text-green-600" />,
      status: currentSection === 'simulate' ? 'active' : (progress.videoCompleted ? 'enabled' : 'disabled')
    },
    {
      id: 'results',
      label: 'Resultados',
      icon: <FaChartLine className={progress.simulationCompleted ? "text-blue-600" : "text-neutral-400"} />,
      status: currentSection === 'results' ? 'active' : (progress.simulationCompleted ? 'enabled' : 'disabled')
    },
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const moduleRepository = new ModuleRepositoryMock();
        const getModuleContentUseCase = new GetModuleContent(moduleRepository);
        const fetchedContent = await getModuleContentUseCase.execute(1);
        setModuleContent(fetchedContent);
      } catch (e) {
        console.log("Error al cargar el contenido");
      }
    };

    fetchContent();
  }, []);

  const handleTopNavClick = (itemId: string) => {
    const sectionId = itemId as 'learn' | 'simulate' | 'results';

    // Verificar si la sección está habilitada
    const navItem = navItems.find(item => item.id === itemId);
    if (navItem?.status === 'disabled') {
      return; // No hacer nada si está deshabilitada
    }

    setCurrentSection(sectionId);

    if (sectionId === 'results') {
      setProgress(prev => ({ ...prev, resultsViewed: true }));
    }
  };

  const handleVideoComplete = () => {
    setProgress(prev => ({ ...prev, videoCompleted: true }));
  };

  const handleSimulationComplete = () => {
    setProgress(prev => ({ ...prev, simulationCompleted: true }));
  };

  const handleBack = () => {
    if (currentSection === 'learn') {
      navigate(`/businesses/${businessId}/learning-path`);
    } else if (currentSection === 'simulate') {
      setCurrentSection('learn');
    } else if (currentSection === 'results') {
      setCurrentSection('simulate');
    }

  };

  const handleNext = () => {
    if (currentSection === 'learn' && progress.videoCompleted) {
      setCurrentSection('simulate');
    } else if (currentSection === 'simulate' && progress.simulationCompleted) {
      setCurrentSection('results');
      setProgress(prev => ({ ...prev, resultsViewed: true }));
    } else if (currentSection === 'results' && progress.resultsViewed) {
      navigate(`/businesses/${businessId}/learning-path`);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'learn':
        return (
          <VideoSection
            moduleContent={moduleContent}
            onVideoComplete={handleVideoComplete}
          />
        );
      case 'simulate':
        return (
          <SimulationSection
            moduleContent={moduleContent}
            onSimulationComplete={handleSimulationComplete}
          />
        );
      case 'results':
        return <ResultsSection moduleContent={moduleContent} />;
      default:
        return (
          <VideoSection
            moduleContent={moduleContent}
            onVideoComplete={handleVideoComplete}
          />
        );
    }
  };

  const getNextButtonText = () => {
    if (currentSection === 'learn' && progress.videoCompleted) {
      return 'Ir a Simulación';
    } else if (currentSection === 'simulate' && progress.simulationCompleted) {
      return 'Ver Resultados';
    } else if (currentSection === 'results') {
      return 'Continuar';
    }
    return 'Siguiente';
  };

  const isNextButtonEnabled = () => {
    if (currentSection === 'learn') return progress.videoCompleted;
    if (currentSection === 'simulate') return progress.simulationCompleted;
    return true; // Results section always allows next
  };

  return (
    <>
      <ModuleHeader title="Educación Financiera" userName="Emprendedor" />
      <div className="bg-white p-6 sm:p-8 w-full max-w-4xl mx-auto my-8 rounded-brand shadow-brand-lg">

        <ModuleTopNav items={navItems} onItemClick={handleTopNavClick} />

        {/* Current Section Content */}
        {renderCurrentSection()}

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
            disabled={!isNextButtonEnabled()}
            className={clsx(
              "font-bold py-3 px-6 rounded-brand transition-colors flex items-center gap-2",
              {
                'bg-primary-500 hover:bg-primary-600 text-white': isNextButtonEnabled(),
                'bg-neutral-300 text-neutral-500 cursor-not-allowed': !isNextButtonEnabled()
              }
            )}
          >
            {getNextButtonText()}
            <FaArrowRight />
          </button>
        </div>

      </div>
    </>
  );
}