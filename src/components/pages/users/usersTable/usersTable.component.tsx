import { useCallback, useMemo, useState } from "react";
import styles from "./usersTable.module.scss";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import {
  DeleteType,
  UserRole,
  UserRoleMeta,
  UserStatusMeta,
  type UserRoleType,
} from "../../../../constants/general.constant";
import { Badge, Table, type Column } from "../../../../common";
import { DualDeleteConfirmationModal } from "../../../../common";
import { useMutationPermission, Module } from "../../../../hooks";

export interface IUser {
  id: string;
  artistId?: string;
  name: string;
  email: string;
  role: UserRoleType;
  status: string;
  created_by: string;
}

interface IUserTableProps {
  users: IUser[];
  isLoading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    pageSize: number;
  };
  onView: (user: IUser) => void;
  onEdit: (user: IUser) => void;
  onDelete: (id: string, type?: string) => void;
  onPageChange?: (page: number) => void;
  mutationLoading?: boolean;
}

const getDeleteDescriptions = (role: UserRoleType) => {
  if (role === UserRole.ARTIST) {
    return {
      softDeleteDescription:
        "Removes the artist profile and all associated albums/music permanently. The artist's user account is deactivated but preserved in the system and can be restored later.",
      hardDeleteDescription:
        "Permanently removes the artist, their albums, music, and user account from the system. This action cannot be undone.",
    };
  }
  return {
    softDeleteDescription:
      "Deactivates the user account. The account is preserved as inactive and can be restored later.",
    hardDeleteDescription:
      "Permanently removes the user from the system. This action cannot be undone.",
  };
};

export function UsersTable({
  users,
  isLoading,
  pagination,
  onView,
  onEdit,
  onDelete,
  onPageChange,
  mutationLoading,
}: IUserTableProps) {
  const canMutate = useMutationPermission(Module.USERS);

  const [deleteTarget, setDeleteTarget] = useState<IUser | null>(null);

  const { deleteDescriptions, hardDeleteDisabled } = useMemo(
    () => ({
      deleteDescriptions: deleteTarget
        ? getDeleteDescriptions(deleteTarget.role)
        : null,
      hardDeleteDisabled: deleteTarget
        ? deleteTarget.role !== UserRole.ARTIST
        : true,
    }),
    [deleteTarget],
  );

  const columns: Column<IUser>[] = [
    {
      header: "Name",
      key: "name",
      render: (user) => <span>{user.name}</span>,
    },
    {
      header: "Email",
      key: "email",
      render: (user) => <span>{user.email}</span>,
    },
    {
      header: "Role",
      key: "role",
      render: (user) => {
        return (
          <Badge
            variant={UserRoleMeta[user.role].badgeVariant}
            label={UserRoleMeta[user.role].label}
          />
        );
      },
    },
    {
      header: "Status",
      key: "status",
      render: (user) => {
        return (
          <Badge
            variant={
              UserStatusMeta[user.status as keyof typeof UserStatusMeta]
                .badgeVariant
            }
            label={
              UserStatusMeta[user.status as keyof typeof UserStatusMeta].label
            }
          />
        );
      },
    },
    {
      header: "Created By",
      key: "created_by",
      render: (user) => <span>{user.created_by || "N/A"}</span>,
    },
  ];

  const renderActions = useCallback(
    (user: IUser) => (
      <>
        <button
          className={`${styles.actionBtn} ${styles.view}`}
          onClick={() => onView(user)}
          title="View"
        >
          <HiOutlineEye />
        </button>

        {user.role !== UserRole.SUPER_ADMIN && (
          <button
            className={`${styles.actionBtn} ${styles.edit}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(user);
            }}
            title="Update"
          >
            <HiOutlinePencil />
          </button>
        )}

        {canMutate && (
          <button
            className={`${styles.actionBtn} ${styles.danger}`}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(user);
            }}
            title="Delete"
          >
            <HiOutlineTrash />
          </button>
        )}
      </>
    ),
    [onEdit, onView, canMutate],
  );

  return (
    <>
      <Table<IUser>
        data={users}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPageChange={onPageChange}
        onRowClick={(user) => onView(user)}
        actions={renderActions}
      />

      {deleteTarget && deleteDescriptions && (
        <DualDeleteConfirmationModal
          isOpen
          onClose={() => setDeleteTarget(null)}
          title="Delete User"
          message={
            <span>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>?
            </span>
          }
          hardDeleteDisabled={hardDeleteDisabled}
          onSoftDelete={async () => {
            await onDelete(deleteTarget.id, DeleteType.SOFT);
            setDeleteTarget(null);
          }}
          onHardDelete={async () => {
            await onDelete(deleteTarget.id, DeleteType.HARD);
            setDeleteTarget(null);
          }}
          softDeleteDescription={deleteDescriptions.softDeleteDescription}
          hardDeleteDescription={deleteDescriptions.hardDeleteDescription}
          isLoading={mutationLoading}
        />
      )}
    </>
  );
}
