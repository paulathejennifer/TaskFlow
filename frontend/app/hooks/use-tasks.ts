"use client";

import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "@/app/lib/api";
import { getAccessToken } from "@/app/lib/auth";

import type {
  Task,
  TaskCreate,
  TaskUpdate,
} from "@/app/types/task";

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: TaskCreate) => Promise<Task>;
  updateTask: (taskId: string, data: TaskUpdate) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest<Task[]>("/tasks", {
        token,
      });

      setTasks(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load tasks.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    async (data: TaskCreate): Promise<Task> => {
      const token = getAccessToken();

      if (!token) {
        throw new Error("You must be logged in.");
      }

      const task = await apiRequest<Task>("/tasks", {
        method: "POST",
        token,
        body: JSON.stringify(data),
      });

      setTasks((currentTasks) => [task, ...currentTasks]);

      return task;
    },
    [],
  );

  const updateTask = useCallback(
    async (taskId: string, data: TaskUpdate): Promise<Task> => {
      const token = getAccessToken();

      if (!token) {
        throw new Error("You must be logged in.");
      }

      const updatedTask = await apiRequest<Task>(
        `/tasks/${taskId}`,
        {
          method: "PATCH",
          token,
          body: JSON.stringify(data),
        },
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? updatedTask : task,
        ),
      );

      return updatedTask;
    },
    [],
  );

  const deleteTask = useCallback(
    async (taskId: string): Promise<void> => {
      const token = getAccessToken();

      if (!token) {
        throw new Error("You must be logged in.");
      }

      await apiRequest<void>(`/tasks/${taskId}`, {
        method: "DELETE",
        token,
      });

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      );
    },
    [],
  );

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}