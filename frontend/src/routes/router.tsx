import { createBrowserRouter } from "react-router";
import Homepage from "../pages/Homepage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "../components/ProtectedRoute";
import BusinessPage from "../pages/business/BusinessPage";
import InvestmentPage from "../pages/investment/InvestmentPage";

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
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/business",
    element: (
      <ProtectedRoute>
        <BusinessPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/investments",
    element: (
      <ProtectedRoute>
        <InvestmentPage />
      </ProtectedRoute>
    ),
  },
]);

export default router;
