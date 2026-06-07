import { useMemo, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { useMusics, useQuery } from "../../../hooks";
import { MusicsFilters } from "./musicsFilter";
import { MusicsTable } from "./musicsTable";
import { MusicModal } from "./musicModal";
import { Button } from "../../../common";
import styles from "./musics.module.scss";

export function MusicsPage() {
  const query = useQuery();

  const {
    data: musics,
    loading,
    mutationLoading,
    handlePageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useMusics();

  const handleModalSubmit = async (
    payload: Music.ICreateMusicPayload | Music.IUpdateMusicPayload,
    id?: string,
  ) => {
    if (id) {
      await handleUpdate(id, payload);
    } else {
      await handleCreate(payload as Music.ICreateMusicPayload);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMusic, setEditingMusic] = useState<Music.IMusic | null>(null);

  const remappedMusics = useMemo(() => {
    return Array.isArray(musics?.data)
      ? musics?.data?.map((music) => ({
          id: music.id,
          artist: music.artist_name,
          album: music.album_title || "-",
          title: music.title,
          genre: music.genre,
          language: music.language,
          duration: music.duration,
          releaseDate: music.release_date,
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

  const handleEdit = (musicRow: (typeof remappedMusics)[number]) => {
    const fullMusic = musics?.data?.find((m) => m.id === musicRow.id) || null;
    setEditingMusic(fullMusic);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingMusic(null);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.musicsPageContainer}>
      <div className={styles.headerRow}>
        <h3>Musics</h3>

        <Button size="sm" onClick={handleAdd}>
          <span className={styles.btnContent}>
            <HiOutlinePlus size={16} />
            Add Music
          </span>
        </Button>
      </div>
      <MusicsFilters />
      <MusicsTable
        data={remappedMusics}
        isLoading={loading}
        mutationLoading={mutationLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MusicModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMusic(null);
        }}
        music={editingMusic}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
