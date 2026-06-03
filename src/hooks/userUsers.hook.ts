import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "../@types/user";
import api from "../lib/api";
import { useQuery } from "./useQuery.hook";

export const useUsers = () => {
  const query = useQuery();

  const [users, setUsers] = useState<User.IPaginatedUserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
};
