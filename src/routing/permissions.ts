import { UserRole, type UserRoleType } from "../constants/general.constant";

export const ROLE_PERMISSIONS: Record<UserRoleType, string[]> = {
  [UserRole.SUPER_ADMIN]: [
    "/",
    "/profile",
    "/users",
    "/artist-managers",
    "/artists",
    "/invitations",
  ],

  [UserRole.ARTIST_MANAGER]: ["/", "/profile", "/artists", "/invitations"],

  [UserRole.ARTIST]: ["/", "/profile", "/musics"],
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
