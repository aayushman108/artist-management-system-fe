export const UserRole = {
  SUPER_ADMIN: "super_admin",
  ARTIST_MANAGER: "artist_manager",
  ARTIST: "artist",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
