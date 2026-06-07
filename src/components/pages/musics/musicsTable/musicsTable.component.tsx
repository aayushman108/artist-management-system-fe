import { Table, type Column } from "../../../../common";

interface IMusicRow {
  id: string;
  artist: string;
  album: string;
  title: string;
  genre: string | null;
  language: string | null;
  duration: string | null;
  createdAt: string;
}

interface IMusicsTableProps {
  data: IMusicRow[];
  isLoading?: boolean;
  pagination?: Common.IPagination;
  onPageChange?: (page: number) => void;
}

export function MusicsTable({
  data,
  isLoading,
  pagination,
  onPageChange,
}: IMusicsTableProps) {
  const columns: Column<IMusicRow>[] = [
    {
      header: "Title",
      key: "title",
      render: (music) => <span>{music.title}</span>,
    },
    {
      header: "Artist",
      key: "artist",
      render: (music) => <span>{music.artist}</span>,
    },
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
      header: "Created At",
      key: "createdAt",
      render: (music) => (
        <span>{new Date(music.createdAt).toLocaleDateString()}</span>
      ),
    },
  ];

  return (
    <Table<IMusicRow>
      data={data}
      columns={columns}
      loading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
    />
  );
}
