import React from "react";
import { Navigate } from "react-router-dom";

import { LoginPage } from "../../../../core/auth/infrastructure/ui/LoginPage";
import { BusinessesPage } from "../../../../core/businesses/infrastructure/ui/BusinessesPage";
import { BusinessForm } from "../../../../core/businesses/infrastructure/ui/BusinessForm";
import { LearningPathPage } from "../../../../core/learning-path/infrastructure/ui/pages/LearningPathPage";

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
    layout: React.Fragment,
    routes: {
      businessesList: {
        title: "",
        path: "",
        element: BusinessesPage,
      },
      businessesForm: {
        title: "",
        path: "new",
        element: BusinessForm,
      },
    },
  },

  learningPath: {
    // La URL base para esta sección
    path: "/learning-path",
    
    // Por ahora usamos un Fragmento, pero podría ser un Layout de Dashboard
    layout: React.Fragment,
    
    // Las páginas específicas dentro de esta sección
    routes: {
      main: {
        title: "Camino de Aprendizaje",
        // La ruta es vacía porque queremos que esta página se muestre
        // directamente en /learning-path
        path: "",
        element: LearningPathPage, // El componente de página que importamos
      },
    }
  }
};
