import React, { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { authService, type ILoginPayload } from "../../services/auth.service";
import type { User } from "../../@types/user";
import { getErrorMessage } from "../../utils";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User.IUser | null>(null);
  const [profile, setProfile] = useState<User.IUserProfile | null>(null);
  const [artist, setArtist] = useState<User.IArtist | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setAuthData = useCallback((data: User.IAuthMyData) => {
    setUser(data.user);
    setProfile(data.profile);
    setArtist(data.artist);
  }, []);

  const clearAuthData = useCallback(() => {
    setUser(null);
    setProfile(null);
    setArtist(null);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        const res = await authService.getMyDetails();
        setIsAuthenticated(true);
        setAuthData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsAuthLoading(false);
      }
    })();
  }, [setAuthData]);

  const handleLogin = async (payload: ILoginPayload) => {
    try {
      const res = await authService.login(payload);
      setIsAuthenticated(true);
      setUser(res.data.user);
      localStorage.setItem("accessToken", res.data.accessToken);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      clearAuthData();
      localStorage.removeItem("accessToken");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const refreshMyDetails = useCallback(async () => {
    try {
      const res = await authService.getMyDetails();
      setAuthData(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [setAuthData]);

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        artist,
        isAuthenticated,
        isAuthLoading,
        login: handleLogin,
        logout: handleLogout,
        refreshMyDetails,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
