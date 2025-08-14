// ... (otras importaciones)
import React from "react";
import { BusinessesPage } from "../../../../core/businesses/infrastructure/ui/BusinessesPage";
import { BusinessForm } from "../../../../core/businesses/infrastructure/ui/BusinessForm";
import { LearningPathPage } from "../../../../core/learning-path/infrastructure/ui/pages/LearningPathPage";
import { Navigate } from "react-router-dom";
import { LoginPage } from "../../../../core/auth/infrastructure/ui/LoginPage";
// ... (layout si lo usas)

export const Routes = {
  home: {
    path: "",
    layout: React.Fragment,
    routes: {
      redirect: {
        title: "",
        path: "",
        element: () => <Navigate to="/login" />,
      },
    },
  },
  auth: {
    path: "/login",
    layout: React.Fragment,
    routes: {
      login: {
        title: "",
        path: "",
        element: LoginPage,
      },
    },
  },

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