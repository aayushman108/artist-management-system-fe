import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "./useQuery.hook";
import { artistService } from "../services/artists.service";
import { getErrorMessage } from "../utils";
import { useUpdateQuery } from "./useUpdateQuery.hook";

export const useArtists = (enabled = true) => {
  const query = useQuery();
  const updateQuery = useUpdateQuery();

  const [artists, setArtists] =
    useState<Artist.IPaginatedArtistResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mutationLoading, setMutationLoading] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      page: Number(query.page || 1),
      limit: Number(query.limit || 10),
      search: query.search || undefined,
      managerId: query.managerId || undefined,
    }),
    [query.page, query.limit, query.search, query.managerId],
  );

  const fetchArtists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await artistService.getAllArtists(
        filters as Artist.IArtistParams,
      );
      setArtists(response?.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (enabled) {
      fetchArtists();
    }
  }, [fetchArtists, enabled]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleUpdate = useCallback(
    async (id: string, payload: Artist.IUpdateArtistPayload) => {
      try {
        setMutationLoading(true);
        setMutationError(null);
        await artistService.updateArtist(id, payload);
        await fetchArtists();
      } catch (error) {
        setMutationError(getErrorMessage(error));
      } finally {
        setMutationLoading(false);
      }
    },
    [fetchArtists],
  );

  const handleDelete = useCallback(
    async (id: string, type?: string) => {
      try {
        setMutationLoading(true);
        setMutationError(null);
        await artistService.deleteArtist(id, type);
        fetchArtists();
      } catch (error) {
        setMutationError(getErrorMessage(error));
      } finally {
        setMutationLoading(false);
      }
    },
    [fetchArtists],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateQuery({ page: String(page) });
    },
    [updateQuery],
  );

  return {
    data: artists,
    loading,
    error,
    mutationLoading,
    mutationError,
    handleUpdate,
    handleDelete,
    handlePageChange,
    fetchArtists,
  };
};
