import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProductosAdminPage from "../pages/ProductosAdminPage";
import ProtectedRoute from "../components/ProtectedRoute";
import ClientesAdminPage from "../pages/ClientesAdminPage";
import VentasAdminPage from "../pages/VentasAdminPage";
import ClienteHomePage from "../pages/ClienteHomePage";
import LandingPage from "../pages/LandingPage";
import useStore from "../store/useStore";


export default function AppRoutes() {
  const user = useStore((state) => state.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin/productos"
          element={
            
              <ProductosAdminPage />
          }
        />

        <Route
          path="/admin/clientes"
          element={
            <ProtectedRoute role="admin">
              <ClientesAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/ventas"
          element={
            <ProtectedRoute role="admin">
              <VentasAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cliente"
          element={
            <ProtectedRoute role="cliente">
              <ClienteHomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
