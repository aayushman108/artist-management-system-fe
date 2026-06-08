import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "./useQuery.hook";
import { albumService } from "../services/album.service";
import { getErrorMessage } from "../utils";
import { useUpdateQuery } from "./useUpdateQuery.hook";
import { useParams } from "react-router-dom";
import { usePermissions } from "./userPermissions.hook";

export const useAlbums = (enabled = true) => {
  const query = useQuery();
  const updateQuery = useUpdateQuery();

  const params = useParams();
  const { isArtist } = usePermissions();
  const artistId = isArtist ? undefined : params.artistId || undefined;

  const [albums, setAlbums] = useState<Album.IPaginatedAlbumResponse | null>(
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

  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = artistId
        ? await albumService.getAlbumsByArtistId(artistId, filters)
        : await albumService.getMyAlbums(filters);
      setAlbums(response?.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters, artistId]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (enabled) {
      fetchAlbums();
    }
  }, [fetchAlbums, enabled]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handlePageChange = useCallback(
    (page: number) => {
      updateQuery({ page: String(page) });
    },
    [updateQuery],
  );

  const handleCreate = useCallback(
    async (payload: Album.ICreateAlbumPayload) => {
      try {
        setMutationLoading(true);
        setMutationError(null);
        await albumService.createAlbum(payload);
        await fetchAlbums();
      } catch (error) {
        setMutationError(getErrorMessage(error));
      } finally {
        setMutationLoading(false);
      }
    },
    [fetchAlbums],
  );

  const handleUpdate = useCallback(
    async (id: string, payload: Album.IUpdateAlbumPayload) => {
      try {
        setMutationLoading(true);
        setMutationError(null);
        await albumService.updateAlbum(id, payload);
        await fetchAlbums();
      } catch (error) {
        setMutationError(getErrorMessage(error));
      } finally {
        setMutationLoading(false);
      }
    },
    [fetchAlbums],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        setMutationLoading(true);
        setMutationError(null);
        await albumService.deleteAlbum(id);
        await fetchAlbums();
      } catch (error) {
        setMutationError(getErrorMessage(error));
      } finally {
        setMutationLoading(false);
      }
    },
    [fetchAlbums],
  );

  return {
    data: albums,
    loading,
    error,
    mutationLoading,
    mutationError,
    handlePageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
    fetchAlbums,
  };
};
