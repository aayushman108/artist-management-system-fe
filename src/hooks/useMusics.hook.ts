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

  return {
    data: musics,
    loading,
    error,
    handlePageChange,
    fetchMusics,
  };
};
