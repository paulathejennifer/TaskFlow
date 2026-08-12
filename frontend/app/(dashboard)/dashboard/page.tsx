"use client";

import { useMemo } from "react";

import { DashboardSummary } from "@/app/components/dashboard/dashboard-summary";
import { TaskSection } from "@/app/components/tasks/task-section";
import { useAuth } from "@/app/hooks/use-auth";
import { useCategories } from "@/app/hooks/use-categories";
import { useTasks } from "@/app/hooks/use-tasks";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useTasks();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

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

  const error = tasksError ?? categoriesError;

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
            Welcome back{user?.full_name ? `, ${user.full_name}` : ""}.
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
          Welcome back{user?.full_name ? `, ${user.full_name}` : ""}.
          {" "}Here&apos;s an overview of your tasks.
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
      />
    </main>
  );
}