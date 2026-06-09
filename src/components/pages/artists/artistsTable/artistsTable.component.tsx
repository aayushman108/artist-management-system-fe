import { useCallback, useMemo, useState } from "react";
import styles from "./artistsTable.module.scss";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { DeleteType, UserStatusMeta } from "../../../../constants";
import { Badge, Table, type Column } from "../../../../common";
import { DualDeleteConfirmationModal } from "../../../../common";
import { usePermissions } from "../../../../hooks";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface IArtistRow {
  id: string;
  userId: string;
  name: string;
  email: string;
  stageName: string | null;
  noOfAlbums: number;
  noOfMusics: number;
  userStatus: string;
  managerName: string | null;
}

interface IArtistsTableProps {
  data: IArtistRow[];
  isLoading?: boolean;
  pagination?: Common.IPagination;
  onView: (id: string) => void;
  onEdit: (artist: IArtistRow) => void;
  onDelete: (id: string, type?: string) => void;
  onPageChange?: (page: number) => void;
  mutationLoading?: boolean;
}

export function ArtistsTable({
  data,
  isLoading,
  pagination,
  onView,
  onEdit,
  onDelete,
  onPageChange,
  mutationLoading,
}: IArtistsTableProps) {
  const { isArtistManager } = usePermissions();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const params = useParams();

  const isArtistsPage = useMemo(
    () => pathname.startsWith("/artists"),
    [pathname],
  );

  const [deleteTarget, setDeleteTarget] = useState<IArtistRow | null>(null);

  const columns: Column<IArtistRow>[] = [
    {
      header: "Name",
      key: "name",
      render: (artist) => <span>{artist.name}</span>,
    },
    {
      header: "Email",
      key: "email",
      render: (artist) => <span>{artist.email}</span>,
    },
    {
      header: "Stage Name",
      key: "stageName",
      render: (artist) => <span>{artist.stageName || "-"}</span>,
    },
    {
      header: "Albums",
      key: "noOfAlbums",
      render: (artist) => <span>{artist.noOfAlbums}</span>,
    },
    {
      header: "Musics",
      key: "noOfMusics",
      render: (artist) => <span>{artist.noOfMusics}</span>,
    },
    {
      header: "Status",
      key: "userStatus",
      render: (artist) => (
        <Badge
          variant={
            UserStatusMeta[artist.userStatus as keyof typeof UserStatusMeta]
              ?.badgeVariant
          }
          label={
            UserStatusMeta[artist.userStatus as keyof typeof UserStatusMeta]
              ?.label
          }
        />
      ),
    },
    {
      header: "Manager",
      key: "managerName",
      render: (artist) => <span>{artist?.managerName || "N/A"}</span>,
    },
  ];

  const renderActions = useCallback(
    (artist: IArtistRow) => (
      <>
        <button
          className={`${styles.actionBtn} ${styles.view}`}
          onClick={() => {
            if (isArtistsPage) {
              navigate(`/artists/${artist.id}`);
            } else {
              navigate(
                `/users/artist-manager/${params?.managerId}/artists/${artist.userId}`,
              );
            }
          }}
          title="View"
        >
          <HiOutlineEye />
        </button>

        <button
          className={`${styles.actionBtn} ${styles.edit}`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(artist);
          }}
          title="Edit"
        >
          <HiOutlinePencil />
        </button>

        <button
          className={`${styles.actionBtn} ${styles.danger}`}
          onClick={(e) => {
            e.stopPropagation();
            setDeleteTarget(artist);
          }}
          title="Delete"
        >
          <HiOutlineTrash />
        </button>
      </>
    ),
    [onEdit, navigate, isArtistsPage, params?.managerId],
  );

  return (
    <>
      <Table<IArtistRow>
        data={data}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPageChange={onPageChange}
        onRowClick={(artist) => onView(artist.id)}
        actions={renderActions}
      />

      {deleteTarget && (
        <DualDeleteConfirmationModal
          isOpen
          onClose={() => setDeleteTarget(null)}
          title="Delete Artist"
          message={
            <span>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>?
            </span>
          }
          hardDeleteDisabled={isArtistManager}
          onSoftDelete={() => {
            onDelete(deleteTarget.id, DeleteType.SOFT);
            setDeleteTarget(null);
          }}
          onHardDelete={() => {
            onDelete(deleteTarget.id, DeleteType.HARD);
            setDeleteTarget(null);
          }}
          softDeleteDescription="Removes the artist profile and all associated albums/music. The artist's user account is deactivated but preserved in the system and can be restored later."
          hardDeleteDescription="Permanently removes the artist, their albums, music, and user account from the system. This action cannot be undone."
          isLoading={mutationLoading}
        />
      )}
    </>
  );
}
