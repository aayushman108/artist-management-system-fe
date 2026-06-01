import { createContext } from "react";
import type { ILoginPayload } from "../../services/auth.service";

export interface AuthContextType {
  user: User.IUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (payload: ILoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
