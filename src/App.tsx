import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/BottomNav";
import Login from "./pages/Login";
import Ponto from "./pages/Ponto";
import Dashboard from "./pages/Dashboard";

function Layout() {
  const { usuario } = useAuth();
  const location = useLocation();
  const mostrarNav =
    usuario?.role === "Admin" && location.pathname !== "/login";

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/ponto"
          element={
            <ProtectedRoute>
              <Ponto />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute rolesPermitidas={["Admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/ponto" replace />} />
        <Route path="*" element={<Navigate to="/ponto" replace />} />
      </Routes>

      {mostrarNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}
