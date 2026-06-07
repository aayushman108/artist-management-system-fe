import { useMemo } from "react";
import { useMusics, useQuery } from "../../../hooks";
import { MusicsFilters } from "./musicsFilter";
import { MusicsTable } from "./musicsTable";
import styles from "./musics.module.scss";

export function MusicsPage() {
  const query = useQuery();

  const { data: musics, loading, handlePageChange } = useMusics();

  const remappedMusics = useMemo(() => {
    return Array.isArray(musics?.data)
      ? musics?.data?.map((music) => ({
          id: music.id,
          artist: music.artist_name,
          album: music.album_title,
          title: music.title,
          genre: music.genre,
          language: music.language,
          duration: music.duration,
          createdAt: music.created_at,
        }))
      : [];
  }, [musics?.data]);

  const pagination = useMemo(() => {
    return {
      currentPage: Number(query.page) || 1,
      totalPages: musics?.pagination?.totalPages || 0,
      totalResults: musics?.pagination?.total || 0,
      pageSize: Number(query.limit) || 10,
    };
  }, [musics?.pagination, query.limit, query.page]);

  return (
    <div className={styles.musicsPageContainer}>
      <h3>Musics</h3>
      <MusicsFilters />
      <MusicsTable
        data={remappedMusics}
        isLoading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
