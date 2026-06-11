import { useCallback, useState } from "react";
import moment from "moment";
import styles from "./albumsTable.module.scss";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Table, type Column } from "../../../../common";
import { ConfirmationModal } from "../../../../common";
import { Module, useMutationPermission } from "../../../../hooks";

interface IAlbumRow {
  id: string;
  title: string;
  releaseDate: string | null;
  createdAt: string;
}

interface IAlbumsTableProps {
  data: IAlbumRow[];
  isLoading?: boolean;
  mutationLoading?: boolean;
  pagination?: Common.IPagination;
  onPageChange?: (page: number) => void;
  onEdit: (album: IAlbumRow) => void;
  onDelete: (id: string) => void;
}

export function AlbumsTable({
  data,
  isLoading,
  mutationLoading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}: IAlbumsTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<IAlbumRow | null>(null);

  const canMutate = useMutationPermission(Module.ALBUMS);

  const columns: Column<IAlbumRow>[] = [
    {
      header: "Title",
      key: "title",
      render: (album) => <span>{album.title}</span>,
    },
    {
      header: "Release Date",
      key: "releaseDate",
      render: (album) => (
        <span>
          {album.releaseDate ? moment(album.releaseDate).format("ll") : "-"}
        </span>
      ),
    },
    {
      header: "Created At",
      key: "createdAt",
      render: (album) => <span>{moment(album.createdAt).format("ll")}</span>,
    },
  ];

  const renderActions = useCallback(
    (album: IAlbumRow) => (
      <>
        <button
          className={`${styles.actionBtn} ${styles.edit}`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(album);
          }}
          title="Edit"
        >
          <HiOutlinePencil />
        </button>
        <button
          className={`${styles.actionBtn} ${styles.danger}`}
          onClick={(e) => {
            e.stopPropagation();
            setDeleteTarget(album);
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
      <Table<IAlbumRow>
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
          onConfirm={async () => {
            await onDelete(deleteTarget.id);
            setDeleteTarget(null);
          }}
          title="Delete Album"
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
