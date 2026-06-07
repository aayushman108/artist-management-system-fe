import { useMemo } from "react";
import { useArtists, useQuery } from "../../../hooks";
import { ArtistsFilters } from "./artistsFilter";
import { ArtistsTable } from "./artistsTable";
import styles from "./artists.module.scss";

export function ArtistsPage() {
  const {
    data: artists,
    loading,
    mutationLoading,
    handleDelete,
    handlePageChange,
  } = useArtists();

  const query = useQuery();

  const remappedArtists = useMemo(() => {
    return Array.isArray(artists?.data)
      ? artists?.data?.map((artist) => ({
          id: artist.id,
          name: artist.name,
          email: artist.email,
          stageName: artist.stage_name,
          noOfAlbums: artist.no_of_albums,
          noOfMusics: artist.no_of_musics,
          userStatus: artist.user_status,
          managerName: artist.manager_name,
        }))
      : [];
  }, [artists?.data]);

  const pagination = useMemo(() => {
    return {
      currentPage: Number(query.page) || 1,
      totalPages: artists?.pagination?.totalPages || 0,
      totalResults: artists?.pagination?.total || 0,
      pageSize: Number(query.limit) || 10,
    };
  }, [artists?.pagination, query.limit, query.page]);

  return (
    <div className={styles.artistsPageContainer}>
      <h3>Artists</h3>
      <ArtistsFilters />
      <ArtistsTable
        data={remappedArtists}
        isLoading={loading}
        mutationLoading={mutationLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onView={(id) => console.log("view", id)}
        onEdit={(id) => console.log("edit", id)}
        onDelete={handleDelete}
      />
    </div>
  );
}
