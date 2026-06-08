import api from "../lib/api";

async function deleteUser(
  id: string,
  type?: string,
): Promise<Api.BaseResponse<null>> {
  const res = await api.delete(`/users/${id}`, {
    data: type ? { type } : undefined,
  });
  return res.data;
}

export const usersService = { deleteUser };
