import { useCallback, useState } from "react";
import moment from "moment";
import styles from "./musicsTable.module.scss";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Table, type Column } from "../../../../common";
import { ConfirmationModal } from "../../../../common";
import {
  Module,
  useMutationPermission,
  usePermissions,
} from "../../../../hooks";

interface IMusicRow {
  id: string;
  artist: string;
  album: string;
  title: string;
  genre: string | null;
  language: string | null;
  duration: string | null;
  releaseDate: string | null;
  createdAt: string;
}

interface IMusicsTableProps {
  data: IMusicRow[];
  isLoading?: boolean;
  mutationLoading?: boolean;
  pagination?: Common.IPagination;
  onPageChange?: (page: number) => void;
  onEdit: (music: IMusicRow) => void;
  onDelete: (id: string) => void;
}

export function MusicsTable({
  data,
  isLoading,
  mutationLoading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}: IMusicsTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<IMusicRow | null>(null);

  const { isArtist } = usePermissions();

  const canMutate = useMutationPermission(Module.MUSICS);

  const columns: Column<IMusicRow>[] = [
    {
      header: "Title",
      key: "title",
      render: (music) => <span>{music.title}</span>,
    },
    ...(!isArtist
      ? [
          {
            header: "Artist",
            key: "artist",
            render: (music: IMusicRow) => <span>{music.artist}</span>,
          },
        ]
      : []),
    {
      header: "Album",
      key: "album",
      render: (music) => <span>{music.album}</span>,
    },
    {
      header: "Genre",
      key: "genre",
      render: (music) => <span>{music.genre || "-"}</span>,
    },
    {
      header: "Language",
      key: "language",
      render: (music) => <span>{music.language || "-"}</span>,
    },
    {
      header: "Release Date",
      key: "releaseDate",
      render: (music) => (
        <span>
          {music.releaseDate ? moment(music.releaseDate).format("ll") : "-"}
        </span>
      ),
    },
    {
      header: "Created At",
      key: "createdAt",
      render: (music) => <span>{moment(music.createdAt).format("ll")}</span>,
    },
  ];

  const renderActions = useCallback(
    (music: IMusicRow) => (
      <>
        <button
          className={`${styles.actionBtn} ${styles.edit}`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(music);
          }}
          title="Edit"
        >
          <HiOutlinePencil />
        </button>
        <button
          className={`${styles.actionBtn} ${styles.danger}`}
          onClick={(e) => {
            e.stopPropagation();
            setDeleteTarget(music);
          }}
          title="Delete"
        >
          <HiOutlineTrash />
        </button>
      </>
    ),
    [onEdit],
  );

  return (
    <>
      <Table<IMusicRow>
        data={data}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPageChange={onPageChange}
        actions={canMutate ? renderActions : undefined}
      />

      {deleteTarget && (
        <ConfirmationModal
          isOpen
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            onDelete(deleteTarget.id);
            setDeleteTarget(null);
          }}
          title="Delete Music"
          message={
            <span>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.title}</strong>?
            </span>
          }
          confirmText="Delete"
          confirmVariant="danger"
          isLoading={mutationLoading}
        />
      )}
    </>
  );
}
