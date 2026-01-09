import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Layout } from "@/components/layout/Layout";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Home } from "@/pages/Home";
import { Auth } from "@/pages/Auth";
import { Schedule } from "@/pages/Schedule";
import { NotFound } from "@/pages/NotFound";
import { BUTTONS } from "@/constants/strings";

function AppRoutes() {
  const { user, isInitialized } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().fetchUser();
  }, []);

  // Show loading while checking auth state
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <div className="text-text-secondary">{BUTTONS.LOADING}</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Home />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" replace /> : <Auth />}
        />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Schedule />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
