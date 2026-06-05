import type { UserRoleType } from "../constants/general.constant";
import api from "../lib/api";

interface IInvitationRequestPayload {
  firstName: string;
  lastName?: string;
  email: string;
  role: UserRoleType;
}

// SEND INVITATION REQUEST
async function sendInvitationRequest(
  payload: IInvitationRequestPayload,
): Promise<Api.BaseResponse<null>> {
  const res = await api.post("/invitation-requests", payload);
  return res.data;
}

export const invitationService = {
  sendInvitationRequest,
};
