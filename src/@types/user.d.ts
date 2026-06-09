import type { UserRoleType } from "../constants";

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
    dob: string | null;
    gender: string | null;
    address: string | null;
    stage_name: string | null;
    manager_id: string | null;
    artist_manager_name: string | null;
    first_release_year: number | null;
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

  interface IAuthMyData {
    user: IUser;
    profile: IUserProfile | null;
    artist: IArtist | null;
  }

  interface IUpdateProfilePayload {
    phone?: string | null;
    dob?: string | null;
    gender?: string | null;
    address?: string | null;
    firstName?: string;
    lastName?: string | null;
  }

  interface IUserProfileResponse {
    id: string;
    user_id: string;
    phone: string | null;
    avatar: { public_id: string; url: string } | null;
    dob: string | null;
    gender: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
  }
}
