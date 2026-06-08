import { useEffect, useMemo, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import {
  useMusics,
  useQuery,
  useUpdateQuery,
  useAlbums,
  useMutationPermission,
  Module,
} from "../../../hooks";
import { MusicsFilters } from "./musicsFilter";
import { MusicsTable } from "./musicsTable";
import { MusicModal } from "./musicModal";
import { AlbumsFilter } from "../albums/albumsFilter";
import { AlbumsTable } from "../albums/albumsTable";
import { AlbumModal } from "../albums/albumModal";
import { albumService } from "../../../services";
import { Button } from "../../../common";
import styles from "./musics.module.scss";
import { useParams } from "react-router-dom";

export function MusicsPage() {
  const query = useQuery();
  const updateQuery = useUpdateQuery();
  const activeTab = query.tab || "musics";

  const handleTabChange = (tab: string) => {
    updateQuery({ tab, page: "1", search: null });
  };

  return (
    <div className={styles.musicsPageContainer}>
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === "musics" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("musics")}
        >
          My Musics
        </button>
        <button
          className={`${styles.tab} ${activeTab === "albums" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("albums")}
        >
          My Albums
        </button>
      </div>

      {activeTab === "musics" && <MusicsSection />}
      {activeTab === "albums" && <AlbumsSection />}
    </div>
  );
}

function MusicsSection() {
  const query = useQuery();
  const [albumOptions, setAlbumOptions] = useState<Album.IAlbumAll[]>([]);

  const params = useParams();

  useEffect(() => {
    if (params.artistId) {
      albumService.getAlbumAllByArtistId(params.artistId).then((res) => {
        setAlbumOptions(res?.data || []);
      });
    } else {
      albumService.getMyAlbumAll().then((res) => {
        setAlbumOptions(res?.data || []);
      });
    }
  }, [params.artistId]);

  const {
    data: musics,
    loading,
    mutationLoading,
    handlePageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useMusics();

  const canMutate = useMutationPermission(Module.MUSICS);

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
    <div className={styles.tabContent}>
      {canMutate && (
        <div className={styles.tabHeader}>
          <Button size="sm" onClick={handleAdd}>
            <span className={styles.btnContent}>
              <HiOutlinePlus size={16} />
              Add Music
            </span>
          </Button>
        </div>
      )}
      <MusicsFilters albums={albumOptions} />
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
        albums={albumOptions}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}

function AlbumsSection() {
  const query = useQuery();

  const {
    data: albums,
    loading,
    mutationLoading,
    handlePageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useAlbums();

  const canMutate = useMutationPermission(Module.ALBUMS);

  const handleModalSubmit = async (
    payload: Album.ICreateAlbumPayload | Album.IUpdateAlbumPayload,
    id?: string,
  ) => {
    if (id) {
      await handleUpdate(id, payload);
    } else {
      await handleCreate(payload as Album.ICreateAlbumPayload);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album.IAlbum | null>(null);

  const remappedAlbums = useMemo(() => {
    return Array.isArray(albums?.data)
      ? albums?.data?.map((album) => ({
          id: album.id,
          title: album.title,
          releaseDate: album.release_date,
          createdAt: album.created_at,
        }))
      : [];
  }, [albums?.data]);

  const pagination = useMemo(() => {
    return {
      currentPage: Number(query.page) || 1,
      totalPages: albums?.pagination?.totalPages || 0,
      totalResults: albums?.pagination?.total || 0,
      pageSize: Number(query.limit) || 10,
    };
  }, [albums?.pagination, query.limit, query.page]);

  const handleEdit = (albumRow: (typeof remappedAlbums)[number]) => {
    const fullAlbum = albums?.data?.find((a) => a.id === albumRow.id) || null;
    setEditingAlbum(fullAlbum);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingAlbum(null);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.tabContent}>
      {canMutate && (
        <div className={styles.tabHeader}>
          <Button size="sm" onClick={handleAdd}>
            <span className={styles.btnContent}>
              <HiOutlinePlus size={16} />
              Add Album
            </span>
          </Button>
        </div>
      )}
      <AlbumsFilter />
      <AlbumsTable
        data={remappedAlbums}
        isLoading={loading}
        mutationLoading={mutationLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AlbumModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAlbum(null);
        }}
        album={editingAlbum}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
