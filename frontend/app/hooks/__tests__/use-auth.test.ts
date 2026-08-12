import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "@/app/hooks/use-auth";
import { apiRequest } from "@/app/lib/api";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/app/lib/auth";

vi.mock("@/app/lib/api", () => ({
  apiRequest: vi.fn(),
}));

vi.mock("@/app/lib/auth", () => ({
  getAccessToken: vi.fn(),
  removeAccessToken: vi.fn(),
  setAccessToken: vi.fn(),
}));

const mockUser = {
  id: "user-123",
  full_name: "John Doe",
  email: "john@example.com",
};

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAccessToken).mockReturnValue(null);
  });

  it("starts unauthenticated when there is no access token", async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("loads the current user when an access token exists", async () => {
    vi.mocked(getAccessToken).mockReturnValue("test-token");
    vi.mocked(apiRequest).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(apiRequest).toHaveBeenCalledWith("/auth/me", {
      token: "test-token",
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("removes an invalid token when loading the current user fails", async () => {
    vi.mocked(getAccessToken).mockReturnValue("invalid-token");
    vi.mocked(apiRequest).mockRejectedValue(
      new Error("Invalid token"),
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(removeAccessToken).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("logs in and stores the returned access token", async () => {
    vi.mocked(apiRequest)
      .mockResolvedValueOnce({
        access_token: "new-token",
        token_type: "bearer",
      })
      .mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.login({
        email: "john@example.com",
        password: "TestPassword123!",
      });
    });

    expect(apiRequest).toHaveBeenNthCalledWith(
      1,
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: "john@example.com",
          password: "TestPassword123!",
        }),
      },
    );

    expect(setAccessToken).toHaveBeenCalledWith("new-token");

    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/auth/me",
      {
        token: "new-token",
      },
    );

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("registers a user and then logs them in", async () => {
    vi.mocked(apiRequest)
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce({
        access_token: "new-token",
        token_type: "bearer",
      })
      .mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.register({
        full_name: "John Doe",
        email: "john@example.com",
        password: "TestPassword123!",
      });
    });

    expect(apiRequest).toHaveBeenNthCalledWith(
      1,
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          full_name: "John Doe",
          email: "john@example.com",
          password: "TestPassword123!",
        }),
      },
    );

    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: "john@example.com",
          password: "TestPassword123!",
        }),
      },
    );

    expect(setAccessToken).toHaveBeenCalledWith("new-token");

    expect(apiRequest).toHaveBeenNthCalledWith(
      3,
      "/auth/me",
      {
        token: "new-token",
      },
    );

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("logs out the current user", async () => {
    vi.mocked(getAccessToken).mockReturnValue("test-token");
    vi.mocked(apiRequest).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    act(() => {
      result.current.logout();
    });

    expect(removeAccessToken).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("refreshes the current user", async () => {
    vi.mocked(getAccessToken).mockReturnValue("test-token");
    vi.mocked(apiRequest).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    const updatedUser = {
      ...mockUser,
      full_name: "Updated Name",
    };

    vi.mocked(apiRequest).mockResolvedValue(updatedUser);

    await act(async () => {
      await result.current.refreshUser();
    });

    expect(result.current.user).toEqual(updatedUser);
  });
});