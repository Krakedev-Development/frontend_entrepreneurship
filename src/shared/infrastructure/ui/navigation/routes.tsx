import React from "react";
import { Navigate } from "react-router-dom";

import { LoginPage } from "../../../../core/auth/infrastructure/ui/LoginPage";
import { BusinessesPage } from "../../../../core/businesses/infrastructure/ui/BusinessesPage";
import { BusinessForm } from "../../../../core/businesses/infrastructure/ui/BusinessForm";

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
};
