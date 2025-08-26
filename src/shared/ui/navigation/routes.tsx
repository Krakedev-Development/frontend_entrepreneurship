// ... (otras importaciones)
import React from "react";
import { BusinessesPage } from "../../../businesses/ui/BusinessesPage";
import { BusinessForm } from "../../../businesses/ui/BusinessForm";
import { LearningPathPage } from "../../../learning-path/ui/pages/LearningPathPage";
import { Navigate } from "react-router-dom";
import { LoginPage } from "../../../auth/ui/pages/LoginPage";
import { ModuleContentPage } from "../../../modules/ui/pages/ModuleContentPage";
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
        path: ":businessId/learning-path",
        layout: React.Fragment,
        routes: {
          index: {
            title: "Vista Principal",
            path: "", // index route
            element: LearningPathPage,
          },
          module: {
            title: "Module",
            path: ":moduleId", 
            element: ModuleContentPage,
          },
        },
      },
    },
  },

  
};