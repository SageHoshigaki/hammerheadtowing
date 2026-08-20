import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { UniversalNav } from "./components/UniversalNav";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { captureAttribution } from "./lib/attribution";
import { RecoveryPage } from "./pages/RecoveryPage";
import { PrestigePage } from "./pages/PrestigePage";
import { PrestigeServicesPage } from "./pages/PrestigeServicesPage";
import { RequestTransportPage } from "./pages/RequestTransportPage";
import LiveLocationPage from "./pages/LiveLocationPage";
import ServicesPage from "./pages/ServicesPage";
import CompanyPage from "./pages/CompanyPage";
import RequestRecoveryPage from "./pages/RequestRecoveryPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#08090a] text-white">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-red-500" />
          <p className="mt-4 text-xs text-white/30">Loading…</p>
        </div>
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  return children;
}

function AppShell() {
  const location = window.location.pathname;
  const isAdmin = location.startsWith("/admin");

  useEffect(() => { captureAttribution(); }, []);

  return (
    <>
      {!isAdmin && (
        <UniversalNav
          logoSrc="/images/hammerhead-logo.png"
          phoneNumber="(631) 300-5559"
        />
      )}
      <Routes>
        <Route path="/" element={<RecoveryPage />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/request-recovery" element={<RequestRecoveryPage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/location" element={<LiveLocationPage />} />
        <Route path="/prestige" element={<PrestigePage />} />
        <Route path="/prestige/services" element={<PrestigeServicesPage />} />
        <Route path="/prestige/request" element={<RequestTransportPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
