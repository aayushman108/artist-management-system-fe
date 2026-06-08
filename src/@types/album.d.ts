declare namespace Album {
  interface IAlbumParams {
    page?: number;
    limit?: number;
    search?: string;
  }

  interface IAlbum {
    id: string;
    artist_id: string;
    title: string;
    release_date: string | null;
    created_at: string;
    updated_at: string;
  }

  interface ICreateAlbumPayload {
    title: string;
    artistId?: string;
    releaseDate?: string | null;
  }

  interface IUpdateAlbumPayload {
    title?: string;
    releaseDate?: string | null;
  }

  interface IAlbumAll {
    id: string;
    title: string;
  }

  type IPaginatedAlbumResponse = Api.PaginatedData<IAlbum>;
}
