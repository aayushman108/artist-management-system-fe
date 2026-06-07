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

async function importArtists(
  file: File,
): Promise<Api.BaseResponse<Artist.IImportJobResponse>> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/artists/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  return res.data;
}

async function getJobStatus(
  jobId: string,
): Promise<Api.BaseResponse<Artist.IJobStatus>> {
  const res = await api.get(`/jobs/${jobId}`);
  return res.data;
}

async function exportArtists(): Promise<Blob> {
  const res = await api.get("/artists/export", {
    responseType: "blob",
  });
  return res.data;
}

export const artistService = {
  getAllArtists,
  getArtistsByManagerId,
  getArtistsById,
  updateArtist,
  deleteArtist,
  importArtists,
  exportArtists,
  getJobStatus,
};
