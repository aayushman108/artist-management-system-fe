import { createContext } from "react";
import type { ILoginPayload } from "../../services/auth.service";
import type { User } from "../../@types/user";

export interface AuthContextType {
  user: User.IUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (payload: ILoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
