import { useCallback } from "react";
import styles from "./usersTable.module.scss";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Table, type Column } from "../../common";
import type { UserRoleType } from "../../constants/general.constant";

interface IUser {
  id: string;
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
  onView: (id: string) => void;
  onEdit: (user: IUser) => void;
  onDelete: (id: string) => void;
  onPageChange?: (page: number) => void;
}

export function UsersTable({
  users,
  isLoading,
  pagination,
  onView,
  onEdit,
  onDelete,
  onPageChange,
}: IUserTableProps) {
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
      render: (user) => (
        <span className={styles.roleBadge}>{user.role.toLowerCase()}</span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (user) => (
        <span
          className={`${styles.statusBadge} ${
            styles[user.status.toLowerCase()]
          }`}
        >
          {user.status.toLowerCase()}
        </span>
      ),
    },
    {
      header: "Created By",
      key: "created_by",
      render: (user) => <span>{user.created_by}</span>,
    },
  ];

  const renderActions = useCallback(
    (user: IUser) => (
      <>
        <button
          className={`${styles.actionBtn} ${styles.view}`}
          onClick={() => onView(user.id)}
          title="View"
        >
          <HiOutlineEye />
        </button>

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

        <button
          className={`${styles.actionBtn} ${styles.danger}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(user.id);
          }}
          title="Delete"
        >
          <HiOutlineTrash />
        </button>
      </>
    ),
    [onView, onEdit, onDelete],
  );

  return (
    <Table<IUser>
      data={users}
      columns={columns}
      loading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
      onRowClick={(user) => onView(user.id)}
      actions={renderActions}
    />
  );
}
