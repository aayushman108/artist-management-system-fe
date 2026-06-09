import { useState, useMemo } from "react";
import { useQuery, useUsers } from "../../../hooks";
import { UsersFilters } from "./usersFilter";
import { UsersTable } from "./usersTable";
import { UserEditModal } from "./userEditModal";
import { UserViewModal } from "./userViewModal";
import { UserRole } from "../../../constants";
import { useNavigate } from "react-router-dom";
import type { User } from "../../../@types/user";

export function UsersPage() {
  const {
    users,
    loading,
    mutationLoading,
    handleDelete,
    handlePageChange,
    fetchUsers,
  } = useUsers();
  const query = useQuery();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User.IExtendedUser | null>(
    null,
  );

  const [viewUser, setViewUser] = useState<User.IExtendedUser | null>(null);

  const remappedUsers = useMemo(() => {
    return Array.isArray(users?.data)
      ? users?.data?.map((user) => {
          return {
            id: user?.user?.id,
            name: `${user?.user?.first_name} ${user?.user?.last_name}`,
            email: user?.user?.email,
            role: user?.user?.role,
            status: user?.user?.status,
            created_by: user?.user?.creator_name,
          };
        })
      : [];
  }, [users?.data]);

  const pagination = useMemo(() => {
    return {
      currentPage: Number(query.page) || 1,
      totalPages: users?.pagination?.totalPages || 0,
      totalResults: users?.pagination?.total || 0,
      pageSize: Number(query.limit) || 10,
    };
  }, [users?.pagination, query.limit, query.page]);

  const handleEdit = (userRow: (typeof remappedUsers)[number]) => {
    const fullUser = users?.data?.find((u) => u.user.id === userRow.id) || null;
    setEditingUser(fullUser);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchUsers();
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleView = (userRow: (typeof remappedUsers)[number]) => {
    if (userRow.role === UserRole.SUPER_ADMIN) {
      const fullUser =
        users?.data?.find((u) => u.user.id === userRow.id) || null;
      setViewUser(fullUser);
    } else if (userRow.role === UserRole.ARTIST_MANAGER) {
      navigate(`/users/artist-managers/${userRow.id}`);
    } else if (userRow.role === UserRole.ARTIST) {
      navigate(`/users/artists/${userRow.id}`);
    }
  };

  return (
    <div>
      <h3>Users List</h3>
      <UsersFilters />
      <UsersTable
        users={remappedUsers}
        isLoading={loading}
        pagination={pagination}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={(id, type) => handleDelete(id, type)}
        onPageChange={handlePageChange}
        mutationLoading={mutationLoading}
      />

      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSuccess={handleEditSuccess}
      />

      <UserViewModal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        user={viewUser}
      />
    </div>
  );
}
