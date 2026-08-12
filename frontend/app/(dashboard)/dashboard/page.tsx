"use client";

import { useMemo, useState } from "react";

import { DashboardSummary } from "@/app/components/dashboard/dashboard-summary";
import { EditTaskModal } from "@/app/components/tasks/edit-task-modal";
import { TaskSection } from "@/app/components/tasks/task-section";
import type { TaskFormValues } from "@/app/components/tasks/task-form-types";
import { useAuth } from "@/app/hooks/use-auth";
import { useCategories } from "@/app/hooks/use-categories";
import { useTasks } from "@/app/hooks/use-tasks";
import type { Task } from "@/app/types/task";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    updateTask,
    deleteTask,
  } = useTasks();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [editTask, setEditTask] = useState<Task | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const summary = useMemo(() => {
    const completedTasks = tasks.filter(
      (task) =>
        String(task.status).toUpperCase() === "COMPLETED" ||
        String(task.status).toUpperCase() === "DONE",
    ).length;

    const todoTasks = tasks.filter(
      (task) =>
        String(task.status).toUpperCase() === "TODO",
    ).length;

    const inProgressTasks = tasks.filter(
      (task) =>
        String(task.status).toUpperCase() === "IN_PROGRESS",
    ).length;

    return {
      totalTasks: tasks.length,
      completedTasks,
      todoTasks,
      inProgressTasks,
    };
  }, [tasks]);

  const loading =
    authLoading || tasksLoading || categoriesLoading;

  const error =
    tasksError ??
    categoriesError ??
    actionError;

  async function handleUpdateTask(values: TaskFormValues) {
    if (!editTask) {
      return;
    }

    setActionError(null);
    setActionLoading(true);

    try {
      await updateTask(editTask.id, {
        title: values.title,
        description: values.description || null,
        category_id: values.category_id || null,
        status: values.status,
        priority: values.priority,
        start_date: values.start_date || null,
        due_date: values.due_date || null,
      });

      setEditTask(null);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to update task.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteTask(task: Task) {
    setActionError(null);
    setActionLoading(true);

    try {
      await deleteTask(task.id);

      if (editTask?.id === task.id) {
        setEditTask(null);
      }
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to delete task.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="space-y-8">
        <div>
          <div className="h-8 w-56 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-xl border border-border bg-surface"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            Welcome back
            {user?.full_name
              ? `, ${user.full_name}`
              : ""}.
          </p>
        </div>

        <div
          role="alert"
          className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger"
        >
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-text-muted">
          Welcome back
          {user?.full_name
            ? `, ${user.full_name}`
            : ""}.
          {" "}
          Here&apos;s an overview of your tasks.
        </p>
      </div>

      <DashboardSummary
        totalTasks={summary.totalTasks}
        completedTasks={summary.completedTasks}
        todoTasks={summary.todoTasks}
        inProgressTasks={summary.inProgressTasks}
      />

      <TaskSection
        tasks={tasks}
        categories={categories}
        onEditTask={(task) => {
          setActionError(null);
          setEditTask(task);
        }}
        onDeleteTask={handleDeleteTask}
      />

      <EditTaskModal
        open={editTask !== null}
        task={editTask}
        categories={categories}
        loading={actionLoading}
        onClose={() => {
          if (!actionLoading) {
            setEditTask(null);
          }
        }}
        onSubmit={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </main>
  );
}