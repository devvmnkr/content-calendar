import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { BUTTONS } from "@/constants/strings";

export function ProtectedRoute() {
  const { user, isLoading, isInitialized } = useAuthStore();

  // Show loading state while checking auth
  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <div className="text-text-secondary">{BUTTONS.LOADING}</div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
