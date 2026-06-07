import api from "../lib/api";

async function getMyMusics(
  params?: Music.IMusicParams,
): Promise<Api.PaginatedResponse<Music.IMusic>> {
  const res = await api.get("/musics", { params });
  return res.data;
}

async function getMusicsByArtistId(
  artistId: string,
  params?: Music.IMusicParams,
): Promise<Api.PaginatedResponse<Music.IMusic>> {
  const res = await api.get(`/musics/artist/${artistId}`, { params });
  return res.data;
}

export const musicService = {
  getMyMusics,
  getMusicsByArtistId,
};
