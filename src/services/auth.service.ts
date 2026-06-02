import type { UserRoleType } from "../constants/general.constant";
import api from "../lib/api";

interface ISignupPayload {
  companyName: string;
  email: string;
  password: string;
  role: UserRoleType;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

// SIGNUP
async function signup(
  payload: ISignupPayload,
): Promise<Api.BaseResponse<{ token: string }>> {
  const res = await api.post("/auth/signup", payload);
  return res.data;
}

// VERIFY EMAIL
async function verifyEmail(
  token: string,
  activationCode: string,
): Promise<Api.BaseResponse<User.IUser>> {
  const res = await api.post("/auth/verify-email", { token, activationCode });
  return res.data;
}

// LOGIN
async function login(
  email: string,
  password: string,
): Promise<Api.BaseResponse<User.ILoginResponse>> {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

// REFRESH TOKEN
async function refreshToken(): Promise<Api.BaseResponse<User.ILoginResponse>> {
  const res = await api.post("/auth/refresh");
  return res.data;
}

// GET MY DETAILS
async function getMyDetails(): Promise<Api.BaseResponse<User.IUser>> {
  const res = await api.get("/auth/me");
  return res.data;
}

// LOGOUT
async function logout(): Promise<Api.BaseResponse<void>> {
  const res = await api.post("/auth/logout");
  return res.data;
}

export const authService = {
  signup,
  verifyEmail,
  login,
  refreshToken,
  getMyDetails,
  logout,
};
