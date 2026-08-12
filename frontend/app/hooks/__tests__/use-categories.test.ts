import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCategories } from "@/app/hooks/use-categories";
import { apiRequest } from "@/app/lib/api";
import { getAccessToken } from "@/app/lib/auth";

vi.mock("@/app/lib/api", () => ({
  apiRequest: vi.fn(),
}));

vi.mock("@/app/lib/auth", () => ({
  getAccessToken: vi.fn(),
}));

const mockCategories = [
  {
    id: "category-1",
    user_id: "user-1",
    name: "Work",
    created_at: "2026-08-12T10:00:00Z",
    updated_at: "2026-08-12T10:00:00Z",
  },
  {
    id: "category-2",
    user_id: "user-1",
    name: "Personal",
    created_at: "2026-08-12T10:01:00Z",
    updated_at: "2026-08-12T10:01:00Z",
  },
];

describe("useCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAccessToken).mockReturnValue("test-token");
  });

  it("loads categories when a token exists", async () => {
    vi.mocked(apiRequest).mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(apiRequest).toHaveBeenCalledWith("/categories", {
      token: "test-token",
    });

    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.error).toBeNull();
  });

  it("clears categories when there is no access token", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual([]);
    expect(apiRequest).not.toHaveBeenCalled();
  });

  it("stores an API error when fetching categories fails", async () => {
    vi.mocked(apiRequest).mockRejectedValue(
      new Error("Failed to load categories."),
    );

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load categories.");
  });

  it("creates a category and adds it to the list", async () => {
    const newCategory = {
      id: "category-3",
      user_id: "user-1",
      name: "School",
      created_at: "2026-08-12T10:02:00Z",
      updated_at: "2026-08-12T10:02:00Z",
    };

    vi.mocked(apiRequest)
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce(newCategory);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.categories).toEqual(mockCategories);
    });

    let createdCategory;

    await act(async () => {
      createdCategory = await result.current.createCategory({
        name: "School",
      });
    });

    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/categories",
      {
        method: "POST",
        token: "test-token",
        body: JSON.stringify({
          name: "School",
        }),
      },
    );

    expect(createdCategory).toEqual(newCategory);
    expect(result.current.categories).toEqual([
      ...mockCategories,
      newCategory,
    ]);
  });

  it("updates a category", async () => {
    const updatedCategory = {
      ...mockCategories[0],
      name: "Updated Work",
    };

    vi.mocked(apiRequest)
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce(updatedCategory);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.categories).toEqual(mockCategories);
    });

    await act(async () => {
      await result.current.updateCategory("category-1", {
        name: "Updated Work",
      });
    });

    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/categories/category-1",
      {
        method: "PATCH",
        token: "test-token",
        body: JSON.stringify({
          name: "Updated Work",
        }),
      },
    );

    expect(result.current.categories[0]).toEqual(updatedCategory);
  });

  it("deletes a category", async () => {
    vi.mocked(apiRequest)
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.categories).toEqual(mockCategories);
    });

    await act(async () => {
      await result.current.deleteCategory("category-1");
    });

    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/categories/category-1",
      {
        method: "DELETE",
        token: "test-token",
      },
    );

    expect(result.current.categories).toEqual([
      mockCategories[1],
    ]);
  });

  it("rejects create when there is no access token", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      result.current.createCategory({
        name: "Work",
      }),
    ).rejects.toThrow("You must be logged in.");

    expect(apiRequest).not.toHaveBeenCalled();
  });

  it("rejects update when there is no access token", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      result.current.updateCategory("category-1", {
        name: "Updated",
      }),
    ).rejects.toThrow("You must be logged in.");
  });

  it("rejects delete when there is no access token", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      result.current.deleteCategory("category-1"),
    ).rejects.toThrow("You must be logged in.");
  });
});