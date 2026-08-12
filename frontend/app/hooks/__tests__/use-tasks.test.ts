import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTasks } from "@/app/hooks/use-tasks";
import { apiRequest } from "@/app/lib/api";
import { getAccessToken } from "@/app/lib/auth";

vi.mock("@/app/lib/api", () => ({
  apiRequest: vi.fn(),
}));

vi.mock("@/app/lib/auth", () => ({
  getAccessToken: vi.fn(),
}));

const mockTasks = [
  {
    id: "task-1",
    user_id: "user-1",
    category_id: null,
    title: "Build dashboard",
    description: "Create the dashboard UI",
    status: "TODO",
    priority: "HIGH",
    start_date: null,
    due_date: null,
    completed_at: null,
    created_at: "2026-08-12T10:00:00Z",
    updated_at: "2026-08-12T10:00:00Z",
  },
  {
    id: "task-2",
    user_id: "user-1",
    category_id: "category-1",
    title: "Write tests",
    description: "Write frontend tests",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    start_date: null,
    due_date: null,
    completed_at: null,
    created_at: "2026-08-12T10:01:00Z",
    updated_at: "2026-08-12T10:01:00Z",
  },
];

describe("useTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAccessToken).mockReturnValue("test-token");
  });

  it("loads tasks when a token exists", async () => {
    vi.mocked(apiRequest).mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(apiRequest).toHaveBeenCalledWith("/tasks", {
      token: "test-token",
    });

    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.error).toBeNull();
  });

  it("clears tasks when there is no access token", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tasks).toEqual([]);
    expect(apiRequest).not.toHaveBeenCalled();
  });

  it("stores an API error when fetching tasks fails", async () => {
    vi.mocked(apiRequest).mockRejectedValue(
      new Error("Failed to load tasks."),
    );

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load tasks.");
  });

  it("creates a task and adds it to the beginning of the list", async () => {
    const newTask = {
      id: "task-3",
      user_id: "user-1",
      category_id: null,
      title: "New task",
      description: null,
      status: "TODO",
      priority: "LOW",
      start_date: null,
      due_date: null,
      completed_at: null,
      created_at: "2026-08-12T10:02:00Z",
      updated_at: "2026-08-12T10:02:00Z",
    };

    vi.mocked(apiRequest)
      .mockResolvedValueOnce(mockTasks)
      .mockResolvedValueOnce(newTask);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toEqual(mockTasks);
    });

    await act(async () => {
      await result.current.createTask({
        title: "New task",
        description: null,
        category_id: null,
        status: "TODO",
        priority: "LOW",
        start_date: null,
        due_date: null,
      });
    });

    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/tasks",
      {
        method: "POST",
        token: "test-token",
        body: JSON.stringify({
          title: "New task",
          description: null,
          category_id: null,
          status: "TODO",
          priority: "LOW",
          start_date: null,
          due_date: null,
        }),
      },
    );

    expect(result.current.tasks).toEqual([
      newTask,
      ...mockTasks,
    ]);
  });

  it("updates a task", async () => {
    const updatedTask = {
      ...mockTasks[0],
      title: "Updated dashboard",
      priority: "MEDIUM",
    };

    vi.mocked(apiRequest)
      .mockResolvedValueOnce(mockTasks)
      .mockResolvedValueOnce(updatedTask);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toEqual(mockTasks);
    });

    await act(async () => {
      await result.current.updateTask("task-1", {
        title: "Updated dashboard",
        priority: "MEDIUM",
      });
    });

    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/tasks/task-1",
      {
        method: "PATCH",
        token: "test-token",
        body: JSON.stringify({
          title: "Updated dashboard",
          priority: "MEDIUM",
        }),
      },
    );

    expect(result.current.tasks[0]).toEqual(updatedTask);
  });

  it("deletes a task", async () => {
    vi.mocked(apiRequest)
      .mockResolvedValueOnce(mockTasks)
      .mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.tasks).toEqual(mockTasks);
    });

    await act(async () => {
      await result.current.deleteTask("task-1");
    });

    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/tasks/task-1",
      {
        method: "DELETE",
        token: "test-token",
      },
    );

    expect(result.current.tasks).toEqual([
      mockTasks[1],
    ]);
  });

  it("rejects create when there is no access token", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      result.current.createTask({
        title: "Test task",
        description: null,
        category_id: null,
        status: "TODO",
        priority: "MEDIUM",
        start_date: null,
        due_date: null,
      }),
    ).rejects.toThrow("You must be logged in.");

    expect(apiRequest).not.toHaveBeenCalled();
  });

  it("rejects update when there is no access token", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      result.current.updateTask("task-1", {
        title: "Updated",
      }),
    ).rejects.toThrow("You must be logged in.");
  });

  it("rejects delete when there is no access token", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      result.current.deleteTask("task-1"),
    ).rejects.toThrow("You must be logged in.");
  });
});