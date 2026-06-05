import type { Invitation } from "../@types/invitation";
import api from "../lib/api";

// SEND INVITATION REQUEST
async function sendInvitationRequest(
  payload: Invitation.ICreateInvitationRequestPayload,
): Promise<Api.BaseResponse<Invitation.IInvitation>> {
  const res = await api.post("/invitation-requests", payload);
  return res.data;
}

// GET INVITATION REQUESTS
async function getInvitationRequests(
  params?: Invitation.IInvitationRequestParams,
): Promise<Api.PaginatedResponse<Invitation.IInvitation>> {
  const res = await api.get("/invitation-requests", { params });
  return res.data;
}

// SEND INVITATION
async function sendInvitation(
  id: string,
): Promise<Api.BaseResponse<Invitation.IInvitation>> {
  const res = await api.patch(`/invitation-requests/${id}/invite`);
  return res.data;
}

// UPDATE INVITATION STATUS
async function updateInvitationStatus(
  id: string,
  payload: Invitation.IUpdateInvitationStatusPayload,
): Promise<Api.BaseResponse<Invitation.IInvitation>> {
  const res = await api.patch(`/invitation-requests/${id}/status`, payload);
  return res.data;
}

// DELETE INVITATION
async function deleteInvitation(id: string): Promise<Api.BaseResponse<null>> {
  const res = await api.delete(`/invitation-requests/${id}`);
  return res.data;
}

export const invitationService = {
  sendInvitationRequest,
  getInvitationRequests,
  sendInvitation,
  updateInvitationStatus,
  deleteInvitation,
};
