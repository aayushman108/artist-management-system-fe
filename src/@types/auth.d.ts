declare namespace User {
  interface IUser {
    id: string;
    company_name: string;
    email: string;
    role: string;
    parent_user_id: string | null;
    super_admin_id: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  }

  interface ILoginResponse {
    user: IUser;
    accessToken: string;
  }
}
