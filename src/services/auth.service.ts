import type { User } from "../@types/user";
import type { UserRoleType } from "../constants/general.constant";
import api from "../lib/api";

interface ISignupPayload {
  firstName: string;
  lastName: string;
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
  payload: ILoginPayload,
): Promise<Api.BaseResponse<User.ILoginResponse>> {
  const res = await api.post("/auth/login", payload);
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

// CHECK SIGNUP ELEGIBILITY
async function checkSignupEligibility(): Promise<
  Api.BaseResponse<User.ISignupEligibilityResponse>
> {
  const res = await api.get("/auth/signup-eligibility");
  return res.data;
}

// VERIFY INVITE
async function verifyInvite(
  token: string,
  password: string,
): Promise<Api.BaseResponse<null>> {
  const res = await api.post("/users/verify-invite", { token, password });
  return res.data;
}

// FORGOT PASSWORD
async function forgotPassword(payload: {
  email: string;
}): Promise<Api.BaseResponse<{ message: string }>> {
  const res = await api.post("/auth/forgot-password", payload);
  return res.data;
}

// RESET PASSWORD
async function resetPassword(payload: {
  token: string;
  password: string;
}): Promise<Api.BaseResponse<{ message: string }>> {
  const res = await api.post("/auth/reset-password", payload);
  return res.data;
}

export const authService = {
  signup,
  verifyEmail,
  login,
  refreshToken,
  getMyDetails,
  logout,
  checkSignupEligibility,
  verifyInvite,
  forgotPassword,
  resetPassword,
};
