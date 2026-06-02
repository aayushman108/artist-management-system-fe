import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context";
import { hasRoutePermission, ROLE_PERMISSIONS } from "../routing/permissions";
import type { UserRoleType } from "../constants/general.constant";

export function usePermissions() {
  const { user } = useAuth();
  const location = useLocation();

  const role = user?.role as UserRoleType | undefined;

  const canAccessRoute = useMemo(() => {
    if (!role) return false;
    return (path: string) => hasRoutePermission(role, path);
  }, [role]);

  const isCurrentRouteAllowed = useMemo(() => {
    if (!role) return false;
    return hasRoutePermission(role, location.pathname);
  }, [role, location.pathname]);

  const allowedRoutes = role ? ROLE_PERMISSIONS[role] : [];

  return {
    role,
    allowedRoutes,
    canAccessRoute,
    isCurrentRouteAllowed,
  };
}
