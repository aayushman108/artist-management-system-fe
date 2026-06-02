import { useAuth } from "../context";
import { Navigate, Outlet } from "react-router-dom";
import { usePermissions } from "../hooks/userPermissions.hook";

export function ProtectedRoute() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const { isCurrentRouteAllowed } = usePermissions();

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isCurrentRouteAllowed) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
}
