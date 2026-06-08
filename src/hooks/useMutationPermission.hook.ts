import { UserRole, type UserRoleType } from "../constants";
import { useAuth } from "../context";

const Module = {
  USERS: "users",
  ARTISTS: "artists",
  MUSICS: "musics",
  ALBUMS: "albums",
} as const;

type ModuleType = (typeof Module)[keyof typeof Module];

const mutationPermissions: Record<UserRoleType, ModuleType[]> = {
  [UserRole.SUPER_ADMIN]: [
    Module.USERS,
    Module.ARTISTS,
    Module.MUSICS,
    Module.ALBUMS,
  ],
  [UserRole.ARTIST_MANAGER]: [Module.ARTISTS],
  [UserRole.ARTIST]: [Module.MUSICS, Module.ALBUMS],
};

export function useMutationPermission(module: ModuleType) {
  const { user } = useAuth();

  return mutationPermissions[user.role].includes(module);
}

export { Module };
