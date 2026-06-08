import api from "../lib/api";

async function getAlbumsByArtistId(
  artistId: string,
  params?: Album.IAlbumParams,
): Promise<Api.PaginatedResponse<Album.IAlbum>> {
  const res = await api.get(`/albums/artist/${artistId}`, { params });
  return res.data;
}

async function createAlbum(
  payload: Album.ICreateAlbumPayload,
): Promise<Api.BaseResponse<Album.IAlbum>> {
  const res = await api.post("/albums", payload);
  return res.data;
}

async function updateAlbum(
  id: string,
  payload: Album.IUpdateAlbumPayload,
): Promise<Api.BaseResponse<Album.IAlbum>> {
  const res = await api.put(`/albums/${id}`, payload);
  return res.data;
}

async function deleteAlbum(id: string): Promise<Api.BaseResponse<null>> {
  const res = await api.delete(`/albums/${id}`);
  return res.data;
}

async function getMyAlbums(
  params?: Album.IAlbumParams,
): Promise<Api.PaginatedResponse<Album.IAlbum>> {
  const res = await api.get("/albums", { params });
  return res.data;
}

async function getMyAlbumAll(): Promise<Api.BaseResponse<Album.IAlbumAll[]>> {
  const res = await api.get("/albums", { params: { all: "true" } });
  return res.data;
}

async function getAlbumAllByArtistId(
  artistId: string,
): Promise<Api.BaseResponse<Album.IAlbumAll[]>> {
  const res = await api.get(`/albums/artist/${artistId}`, {
    params: { all: "true" },
  });
  return res.data;
}

export const albumService = {
  getMyAlbums,
  getAlbumsByArtistId,
  getMyAlbumAll,
  getAlbumAllByArtistId,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};
