import { useMemo } from "react";
import { useQuery, useUsers } from "../../../hooks";
import { UsersTable } from "../../usersTable";
import { UsersFilters } from "../../usersFilter";

export function UsersPage() {
  const { users, loading } = useUsers();
  const query = useQuery();

  const remappedUsers = useMemo(() => {
    return users?.data?.length > 0
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

  return (
    <div>
      <h3>Users List</h3>
      <UsersFilters />
      <UsersTable
        users={remappedUsers}
        isLoading={loading}
        pagination={pagination}
        onView={(id) => console.log("view", id)}
        onEdit={(user) => console.log("edit", user)}
        onDelete={(id) => console.log("delete", id)}
      />
    </div>
  );
}
