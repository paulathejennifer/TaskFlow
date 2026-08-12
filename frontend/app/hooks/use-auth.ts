"use client";

import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "@/app/lib/api";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/app/lib/auth";

import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "@/app/types/auth";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await apiRequest<User>("/auth/me", {
        token,
      });

      setUser(currentUser);
    } catch {
      removeAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (data: LoginRequest) => {
      const response = await apiRequest<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setAccessToken(response.access_token);

      await refreshUser();
    },
    [refreshUser],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      await apiRequest<User>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      await login({
        email: data.email,
        password: data.password,
      });
    },
    [login],
  );

  const logout = useCallback(() => {
    removeAccessToken();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    refreshUser,
  };
}