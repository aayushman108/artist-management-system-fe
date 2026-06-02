import { FiHome, FiUsers, FiUser, FiMusic, FiBriefcase } from "react-icons/fi";

export const UserRole = {
  SUPER_ADMIN: "super_admin",
  ARTIST_MANAGER: "artist_manager",
  ARTIST: "artist",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const DASHBOARD_NAV_ITEMS = {
  [UserRole.SUPER_ADMIN]: [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/users", label: "Users", icon: FiUsers },
    { href: "/artist-managers", label: "Artist Managers", icon: FiBriefcase },
    { href: "/artists", label: "Artists", icon: FiUser },
  ],

  [UserRole.ARTIST_MANAGER]: [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/artists", label: "Artists", icon: FiUser },
  ],

  [UserRole.ARTIST]: [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/musics", label: "Musics", icon: FiMusic },
  ],
};
