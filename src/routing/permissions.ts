import { UserRole, type UserRoleType } from "../constants/general.constant";

export const ROLE_PERMISSIONS: Record<UserRoleType, string[]> = {
  [UserRole.SUPER_ADMIN]: ["/", "/users", "/artist-managers", "/artists"],

  [UserRole.ARTIST_MANAGER]: ["/", "/artists"],

  [UserRole.ARTIST]: ["/", "/musics"],
};

export function hasRoutePermission(
  role: UserRoleType,
  pathname: string,
): boolean {
  const allowedRoutes = ROLE_PERMISSIONS[role] ?? [];

  return allowedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
