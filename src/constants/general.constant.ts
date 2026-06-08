import { FiHome, FiUsers, FiUser, FiMusic } from "react-icons/fi";
import { HiOutlinePaperAirplane } from "react-icons/hi2";

export const UserRole = {
  SUPER_ADMIN: "super_admin",
  ARTIST_MANAGER: "artist_manager",
  ARTIST: "artist",
} as const;

export const UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  MIGRATED: "migrated",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

export const DASHBOARD_NAV_ITEMS = {
  [UserRole.SUPER_ADMIN]: [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/users", label: "Users", icon: FiUsers },
    {
      href: "/invitations",
      label: "Invitations",
      icon: HiOutlinePaperAirplane,
    },
    { href: "/artists", label: "Artists", icon: FiUser },
  ],

  [UserRole.ARTIST_MANAGER]: [
    { href: "/", label: "Home", icon: FiHome },
    {
      href: "/invitations",
      label: "Invitations",
      icon: HiOutlinePaperAirplane,
    },
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

export const DeleteType = {
  HARD: "hard",
  SOFT: "soft",
} as const;

export type DeleteTypeType = (typeof DeleteType)[keyof typeof DeleteType];

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
  [UserStatus.MIGRATED]: {
    label: "Migrated",
    badgeVariant: UserStatus.MIGRATED,
  },
};

export const USER_STATUS_ARR = [
  { value: UserStatus.ACTIVE, label: UserStatusMeta[UserStatus.ACTIVE].label },
  {
    value: UserStatus.INACTIVE,
    label: UserStatusMeta[UserStatus.INACTIVE].label,
  },
  {
    value: UserStatus.MIGRATED,
    label: UserStatusMeta[UserStatus.MIGRATED].label,
  },
];

export const ImportStatus = {
  IDLE: "idle",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type ImportStatusType = (typeof ImportStatus)[keyof typeof ImportStatus];

export const Gender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;

export type GenderType = (typeof Gender)[keyof typeof Gender];

export const GENDER_ARR = [
  { value: Gender.MALE, label: "Male" },
  {
    value: Gender.FEMALE,
    label: "Female",
  },
  {
    value: Gender.OTHER,
    label: "Other",
  },
];
