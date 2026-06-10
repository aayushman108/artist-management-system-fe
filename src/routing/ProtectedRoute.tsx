import { useAuth } from "../context";
import { Navigate, Outlet } from "react-router-dom";
import { usePermissions } from "../hooks/userPermissions.hook";
import { Spinner } from "../common/spinner/spinner.common";

export function ProtectedRoute() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const { isCurrentRouteAllowed } = usePermissions();

  if (isAuthLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isCurrentRouteAllowed) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
}
