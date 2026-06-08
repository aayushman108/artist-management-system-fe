import { useEffect, useMemo, useState } from "react";
import {
  useArtists,
  useImportExport,
  usePermissions,
  useQuery,
} from "../../../hooks";
import { artistService } from "../../../services";
import { ArtistsFilters } from "./artistsFilter";
import { ArtistsTable } from "./artistsTable";
import { ArtistModal } from "./artistModal";
import { ImportArtistsModal } from "./importArtistsModal";
import styles from "./artists.module.scss";
import { Button } from "../../../common";
import { HiOutlineUpload, HiOutlineDownload } from "react-icons/hi";
import { CgSpinner } from "react-icons/cg";
import { useLocation } from "react-router-dom";

export function ArtistsPage() {
  const {
    data: artists,
    loading,
    mutationLoading,
    handleUpdate,
    handleDelete,
    handlePageChange,
    fetchArtists,
  } = useArtists();

  const query = useQuery();

  const {
    canImportExport,
    importModalOpen,
    setImportModalOpen,
    exportLoading,
    exportError,
    handleExport,
    activeJobId,
    importStatus,
    importError,
    importResult,
    importing,
    handleJobStart,
    handleImportReset,
  } = useImportExport(fetchArtists);

  const { isSuperAdmin } = usePermissions();

  const { pathname } = useLocation();
  const isArtistsPage = useMemo(
    () => pathname.startsWith("/artists"),
    [pathname],
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist.IArtist | null>(
    null,
  );

  const [managerOptions, setManagerOptions] = useState<Artist.IManagerOption[]>(
    [],
  );

  useEffect(() => {
    if (isSuperAdmin && isArtistsPage) {
      artistService.getArtistManagers().then((res) => {
        setManagerOptions(res?.data || []);
      });
    }
  }, [isSuperAdmin, isArtistsPage]);

  const handleModalSubmit = async (
    payload: Artist.IUpdateArtistPayload,
    id?: string,
  ) => {
    if (id) {
      await handleUpdate(id, payload);
    }
  };

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

  const handleEdit = (artistRow: (typeof remappedArtists)[number]) => {
    const fullArtist =
      artists?.data?.find((a) => a.id === artistRow.id) || null;
    setEditingArtist(fullArtist);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.artistsPageContainer}>
      <div className={styles.headerRow}>
        <h3>Artists</h3>

        {/* Import and export buttons */}
        {canImportExport && (
          <div className={styles.headerActions}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportModalOpen(true)}
              disabled={importing}
            >
              <span className={styles.btnContent}>
                {importing ? (
                  <CgSpinner className={styles.spinner} />
                ) : (
                  <HiOutlineUpload />
                )}
                {importing ? "Importing…" : "Import"}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              isLoading={exportLoading}
            >
              <span className={styles.btnContent}>
                <HiOutlineDownload />
                Export
              </span>
            </Button>
          </div>
        )}
      </div>

      {exportError && <div className={styles.exportError}>{exportError}</div>}

      <ArtistsFilters managerOptions={managerOptions} />
      <ArtistsTable
        data={remappedArtists}
        isLoading={loading}
        mutationLoading={mutationLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onView={(id) => console.log("view", id)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ArtistModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingArtist(null);
        }}
        artist={editingArtist}
        managers={managerOptions}
        onSubmit={handleModalSubmit}
      />

      {canImportExport && (
        <ImportArtistsModal
          isOpen={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          onSuccess={fetchArtists}
          activeJobId={activeJobId}
          importStatus={importStatus}
          importError={importError}
          importResult={importResult}
          onJobStart={handleJobStart}
          onReset={handleImportReset}
        />
      )}
    </div>
  );
}
