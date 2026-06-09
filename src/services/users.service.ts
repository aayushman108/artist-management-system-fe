import type { User } from "../@types/user";
import api from "../lib/api";

async function getUserById(
  id: string,
): Promise<Api.BaseResponse<User.IExtendedUser>> {
  const res = await api.get(`/users/${id}`);
  return res.data;
}

async function deleteUser(
  id: string,
  type?: string,
): Promise<Api.BaseResponse<null>> {
  const res = await api.delete(`/users/${id}`, {
    data: type ? { type } : undefined,
  });
  return res.data;
}

async function updateMyProfile(
  payload: User.IUpdateProfilePayload,
): Promise<Api.BaseResponse<null>> {
  const res = await api.patch("/users/profile/me", payload);
  return res.data;
}

async function updateUserProfile(
  id: string,
  payload: User.IUpdateProfilePayload,
): Promise<Api.BaseResponse<null>> {
  const res = await api.patch(`/users/${id}/profile`, payload);
  return res.data;
}

export const usersService = {
  getUserById,
  deleteUser,
  updateMyProfile,
  updateUserProfile,
};
