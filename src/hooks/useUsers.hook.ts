import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { useQuery } from "./useQuery.hook";
import { useUpdateQuery } from "./useUpdateQuery.hook";
import { usersService } from "../services";
import { getErrorMessage } from "../utils";
import type { User } from "../@types/user";

export const useUsers = () => {
  const query = useQuery();
  const updateQuery = useUpdateQuery();

  const [users, setUsers] = useState<User.IPaginatedUserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mutationLoading, setMutationLoading] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      page: Number(query.page || 1),
      limit: Number(query.limit || 10),
      search: query.search || undefined,
      status: query.status || undefined,
      role: query.role || undefined,
    }),
    [query],
  );

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/users", { params: filters });
      setUsers(response.data?.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleDelete = useCallback(
    async (id: string, type?: string) => {
      try {
        setMutationLoading(true);
        setMutationError(null);
        await usersService.deleteUser(id, type);
        fetchUsers();
      } catch (error) {
        setMutationError(getErrorMessage(error));
      } finally {
        setMutationLoading(false);
      }
    },
    [fetchUsers],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateQuery({ page: String(page) });
    },
    [updateQuery],
  );

  return {
    users,
    loading,
    error,
    mutationLoading,
    mutationError,
    handleDelete,
    handlePageChange,
    fetchUsers,
  };
};
