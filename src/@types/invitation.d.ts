import type {
  InvitationRequestStatusType,
  InvitationStatusType,
  UserRoleType,
} from "../constants";

declare namespace Invitation {
  interface IInvitationRequestParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: InvitationRequestStatusType;
    role?: UserRoleType;
  }

  interface ICreateInvitationRequestPayload {
    firstName: string;
    lastName?: string;
    email: string;
    role: string;
  }

  interface IInvitation {
    id: string;
    first_name: string;
    last_name: string | null;
    email: string;
    role: UserRoleType;
    status: InvitationRequestStatusType;
    created_at: string;
    updated_at: string;
  }

  interface IUpdateInvitationStatusPayload {
    status: InvitationRequestStatusType;
  }

  type IPaginatedInvitationResponse = Api.PaginatedData<IInvitation>;

  interface ISentInvitationParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: InvitationStatusType;
    role?: UserRoleType;
  }

  interface ISentInvitation {
    id: string;
    email: string;
    name: string;
    role: UserRoleType;
    status: InvitationStatusType;
    invited_by: string;
    expires_at: string;
    accepted_at: string | null;
    created_at: string;
    updated_at: string;
  }

  type IPaginatedSentInvitationResponse = Api.PaginatedData<ISentInvitation>;
}
