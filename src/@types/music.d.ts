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
    created_at: string;
    updated_at: string;
  }

  type IPaginatedMusicResponse = Api.PaginatedData<IMusic>;
}
