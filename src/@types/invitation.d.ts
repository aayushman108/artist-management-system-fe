import type {
  InvitationRequestStatusType,
  UserRoleType,
} from "../constants/general.constant";

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
}
