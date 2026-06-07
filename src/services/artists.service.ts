import api from "../lib/api";

async function getAllArtists(
  params?: Artist.IArtistParams,
): Promise<Api.PaginatedResponse<Artist.IArtist>> {
  const res = await api.get("/artists", { params });
  return res.data;
}

async function getArtistsByManagerId(
  managerId: string,
  params?: Artist.IArtistParams,
): Promise<Api.PaginatedResponse<Artist.IArtist>> {
  const res = await api.get(`/artists/manager/${managerId}`, { params });
  return res.data;
}

async function getArtistsById(
  id: string,
): Promise<Api.BaseResponse<Artist.IArtist>> {
  const res = await api.get(`/artists/${id}`);
  return res.data;
}

async function updateArtist(
  id: string,
  payload: Artist.IUpdateArtistPayload,
): Promise<Api.BaseResponse<Artist.IArtist>> {
  const res = await api.put(`/artists/${id}`, payload);
  return res.data;
}

async function deleteArtist(
  id: string,
  type?: string,
): Promise<Api.BaseResponse<null>> {
  const res = await api.delete(`/artists/${id}`, {
    data: type ? { type } : undefined,
  });
  return res.data;
}

export const artistService = {
  getAllArtists,
  getArtistsByManagerId,
  getArtistsById,
  updateArtist,
  deleteArtist,
};
