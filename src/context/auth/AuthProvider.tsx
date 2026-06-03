import React, { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { authService, type ILoginPayload } from "../../services/auth.service";
import type { User } from "../../@types/user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User.IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        const res = await authService.getMyDetails();
        setIsAuthenticated(true);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsAuthLoading(false);
      }
    })();
  }, []);

  const handleLogin = async (payload: ILoginPayload) => {
    try {
      const res = await authService.login(payload);
      setIsAuthenticated(true);
      setUser(res.data.user);
      localStorage.setItem("accessToken", res.data.accessToken);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
