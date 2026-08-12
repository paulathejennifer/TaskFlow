"use client";

import { useTasks } from "@/app/hooks/use-tasks";
import { useCategories } from "@/app/hooks/use-categories";

import { Button } from "@/app/components/ui/button";
import { TaskSection } from "@/app/components/tasks/task-section";

export default function TasksPage() {
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

  const loading = tasksLoading || categoriesLoading;
  const error = tasksError ?? categoriesError;

  if (loading) {
    return (
      <main className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-5 w-64 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
        </div>

        <div className="h-[500px] animate-pulse rounded-xl border border-border bg-surface" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Tasks
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            Manage all of your tasks in one place.
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Tasks
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            Manage all of your tasks in one place.
          </p>
        </div>

        <Button type="button">
          + Create task
        </Button>
      </div>

      <TaskSection
        tasks={tasks}
        categories={categories}
      />
    </main>
  );
}