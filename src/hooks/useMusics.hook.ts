import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "./useQuery.hook";
import { musicService } from "../services/music.service";
import { getErrorMessage } from "../utils";
import { useUpdateQuery } from "./useUpdateQuery.hook";
import { useParams } from "react-router-dom";
import { usePermissions } from "./userPermissions.hook";

export const useMusics = (enabled = true) => {
  const query = useQuery();
  const updateQuery = useUpdateQuery();

  const params = useParams();
  const { isArtist } = usePermissions();
  const artistId = isArtist ? undefined : params.artistId || undefined;

  const [musics, setMusics] = useState<Music.IPaginatedMusicResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mutationLoading, setMutationLoading] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      page: Number(query.page || 1),
      limit: Number(query.limit || 10),
      search: query.search || undefined,
    }),
    [query.page, query.limit, query.search],
  );

  const fetchMusics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = artistId
        ? await musicService.getMusicsByArtistId(artistId, filters)
        : await musicService.getMyMusics(filters);
      setMusics(response?.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters, artistId]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (enabled) {
      fetchMusics();
    }
  }, [fetchMusics, enabled]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handlePageChange = useCallback(
    (page: number) => {
      updateQuery({ page: String(page) });
    },
    [updateQuery],
  );

  const handleCreate = useCallback(
    async (payload: Music.ICreateMusicPayload) => {
      try {
        setMutationLoading(true);
        setMutationError(null);
        await musicService.createMusic(payload);
        await fetchMusics();
      } catch (error) {
        setMutationError(getErrorMessage(error));
      } finally {
        setMutationLoading(false);
      }
    },
    [fetchMusics],
  );

  const handleUpdate = useCallback(
    async (id: string, payload: Music.IUpdateMusicPayload) => {
      try {
        setMutationLoading(true);
        setMutationError(null);
        await musicService.updateMusic(id, payload);
        await fetchMusics();
      } catch (error) {
        setMutationError(getErrorMessage(error));
      } finally {
        setMutationLoading(false);
      }
    },
    [fetchMusics],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        setMutationLoading(true);
        setMutationError(null);
        await musicService.deleteMusic(id);
        await fetchMusics();
      } catch (error) {
        setMutationError(getErrorMessage(error));
      } finally {
        setMutationLoading(false);
      }
    },
    [fetchMusics],
  );

  return {
    data: musics,
    loading,
    error,
    mutationLoading,
    mutationError,
    handlePageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
    fetchMusics,
  };
};
