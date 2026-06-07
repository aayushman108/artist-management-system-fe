declare namespace Music {
  interface IMusicParams {
    page?: number;
    limit?: number;
    search?: string;
    artistId?: string;
  }

  interface IMusic {
    id: string;
    title: string;
    artist_id: string;
    artist_name: string;
    album_id: string | null;
    album_title: string | null;
    genre: string | null;
    language: string | null;
    duration: string | null;
    release_date: string | null;
    created_at: string;
    updated_at: string;
  }

  interface ICreateMusicPayload {
    title: string;
    artistId?: string;
    albumId?: string | null;
    genre?: string | null;
    language?: string | null;
    releaseDate?: string | null;
  }

  interface IUpdateMusicPayload {
    title?: string;
    albumId?: string | null;
    genre?: string | null;
    language?: string | null;
    releaseDate?: string | null;
  }

  type IPaginatedMusicResponse = Api.PaginatedData<IMusic>;
}
