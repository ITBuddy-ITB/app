import { createBrowserRouter } from "react-router";
import Homepage from "../pages/Homepage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../layouts/Layout";
import BusinessPage from "../pages/business/BusinessPage";
import InvestmentPage from "../pages/investment/InvestmentPage";
import Step1Page from "../pages/business/StepOne";
import Step2Page from "../pages/business/StepTwo";
import Step3Page from "../pages/business/StepThree";
import BusinessDetailPage from "../pages/business/BusinessDetailPage";
import ProductsPage from "../pages/business/ProductsPage";
import LegalPage from "../pages/business/LegalPage";
import FinancialPage from "../pages/business/FinancialPage";
import ProjectionsPage from "../pages/business/ProjectionsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "business",
        element: (
          <ProtectedRoute>
            <BusinessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "business/step-1",
        element: (
          <ProtectedRoute>
            <Step1Page />
          </ProtectedRoute>
        ),
      },
      {
        path: "business/step-2",
        element: (
          <ProtectedRoute>
            <Step2Page />
          </ProtectedRoute>
        ),
      },
      {
        path: "business/step-3",
        element: (
          <ProtectedRoute>
            <Step3Page />
          </ProtectedRoute>
        ),
      },
      {
        path: "business/:businessId/details",
        element: (
          <ProtectedRoute>
            <BusinessDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "business/:businessId/products",
        element: (
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "business/:businessId/legal",
        element: (
          <ProtectedRoute>
            <LegalPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "business/:businessId/finance",
        element: (
          <ProtectedRoute>
            <FinancialPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "business/:businessId/projections",
        element: (
          <ProtectedRoute>
            <ProjectionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "investments",
        element: (
          <ProtectedRoute>
            <InvestmentPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
