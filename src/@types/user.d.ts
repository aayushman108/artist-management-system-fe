import type { UserRoleType } from "../constants/general.constant";

declare namespace User {
  interface IUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: UserRoleType;
    created_by: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  }

  interface ILoginResponse {
    user: IUser;
    accessToken: string;
  }

  interface IUserProfile {
    dob: string | null;
    gender: string | null;
    address: string | null;
    phone: string | null;
    avatar: {
      public_id: string;
      url: string;
    } | null;
  }

  interface IArtist {
    stage_name: string | null;
    manager_id: string | null;
    artist_manager_name: string | null;
  }

  interface IExtendedUser {
    user: IUser & { creator_name: string; creator_role: UserRoleType };
    profile: IUserProfile | null;
    artist: IArtist | null;
  }

  type IPaginatedUserResponse = Api.PaginatedData<IExtendedUser>;

  interface ISignupEligibilityResponse {
    isSignupAllowed: boolean;
  }
}
