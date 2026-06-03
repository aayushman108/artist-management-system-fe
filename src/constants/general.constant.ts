import { FiHome, FiUsers, FiUser, FiMusic, FiBriefcase } from "react-icons/fi";

export const UserRole = {
  SUPER_ADMIN: "super_admin",
  ARTIST_MANAGER: "artist_manager",
  ARTIST: "artist",
} as const;

export const UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

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

export const UserRoleMeta: Record<
  UserRoleType,
  {
    label: string;
    badgeVariant: UserRoleType;
  }
> = {
  [UserRole.SUPER_ADMIN]: {
    label: "Super Admin",
    badgeVariant: UserRole.SUPER_ADMIN,
  },
  [UserRole.ARTIST_MANAGER]: {
    label: "Artist Manager",
    badgeVariant: UserRole.ARTIST_MANAGER,
  },
  [UserRole.ARTIST]: {
    label: "Artist",
    badgeVariant: UserRole.ARTIST,
  },
};

export const USER_ROLE_ARR = [
  {
    value: UserRole.SUPER_ADMIN,
    label: UserRoleMeta[UserRole.SUPER_ADMIN].label,
  },
  {
    value: UserRole.ARTIST_MANAGER,
    label: UserRoleMeta[UserRole.ARTIST_MANAGER].label,
  },
  { value: UserRole.ARTIST, label: UserRoleMeta[UserRole.ARTIST].label },
];

export const UserStatusMeta: Record<
  UserStatusType,
  {
    label: string;
    badgeVariant: UserStatusType;
  }
> = {
  [UserStatus.ACTIVE]: {
    label: "Active",
    badgeVariant: UserStatus.ACTIVE,
  },
  [UserStatus.INACTIVE]: {
    label: "Inactive",
    badgeVariant: UserStatus.INACTIVE,
  },
};

export const USER_STATUS_ARR = [
  { value: UserStatus.ACTIVE, label: "Active" },
  { value: UserStatus.INACTIVE, label: "Inactive" },
];
