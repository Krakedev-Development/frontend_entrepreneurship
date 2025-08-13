// ... (otras importaciones)
import React from "react";
import { BusinessesPage } from "../../../../core/businesses/infrastructure/ui/BusinessesPage";
import { BusinessForm } from "../../../../core/businesses/infrastructure/ui/BusinessForm";
import { LearningPathPage } from "../../../../core/learning-path/infrastructure/ui/pages/LearningPathPage";
// ... (layout si lo usas)

export const Routes = {
  // ... (sección 'home' y 'auth' sin cambios)

  businesses: {
    path: "/businesses",
    layout: React.Fragment, // O tu DashboardLayout
    routes: {
      businessesList: {
        title: "Lista de Negocios",
        path: "", // Se renderiza en /businesses
        element: BusinessesPage,
      },
      businessesForm: {
        title: "Formulario de Negocio",
        path: "new", // Se renderiza en /businesses/new
        element: BusinessForm,
      },
      // 👇 AÑADE ESTA NUEVA RUTA ANIDADA AQUÍ
      learningPath: {
        title: "Camino de Aprendizaje",
        // La ruta ahora contiene un parámetro dinámico ':businessId'
        path: ":businessId/learning-path", 
        element: LearningPathPage,
      },
    },
  },

  
};