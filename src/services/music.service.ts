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

async function createMusic(
  payload: Music.ICreateMusicPayload,
): Promise<Api.BaseResponse<Music.IMusic>> {
  const res = await api.post("/musics", payload);
  return res.data;
}

async function updateMusic(
  id: string,
  payload: Music.IUpdateMusicPayload,
): Promise<Api.BaseResponse<Music.IMusic>> {
  const res = await api.put(`/musics/${id}`, payload);
  return res.data;
}

async function deleteMusic(id: string): Promise<Api.BaseResponse<null>> {
  const res = await api.delete(`/musics/${id}`);
  return res.data;
}

export const musicService = {
  getMyMusics,
  getMusicsByArtistId,
  createMusic,
  updateMusic,
  deleteMusic,
};
