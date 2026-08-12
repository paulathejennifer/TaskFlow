"use client";

import { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { CreateTaskModal } from "@/app/components/tasks/create-task-modal";
import { EditTaskModal } from "@/app/components/tasks/edit-task-modal";
import { TaskSection } from "@/app/components/tasks/task-section";
import type { TaskFormValues } from "@/app/components/tasks/task-form-types";
import { useTasks } from "@/app/hooks/use-tasks";
import { useCategories } from "@/app/hooks/use-categories";
import type { Task } from "@/app/types/task";

export default function TasksPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const loading = tasksLoading || categoriesLoading;
  const error = tasksError ?? categoriesError ?? submitError;

  async function handleCreateTask(values: TaskFormValues) {
    setSubmitError(null);
    setActionLoading(true);

    try {
      await createTask(values);
      setCreateModalOpen(false);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to create task.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpdateTask(values: TaskFormValues) {
    if (!editTask) {
      return;
    }

    setSubmitError(null);
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
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to update task.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteTask(task: Task) {
    setSubmitError(null);
    setActionLoading(true);

    try {
      await deleteTask(task.id);

      if (editTask?.id === task.id) {
        setEditTask(null);
      }
    } catch (err) {
      setSubmitError(
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

        <Button
          type="button"
          onClick={() => {
            setSubmitError(null);
            setCreateModalOpen(true);
          }}
        >
          + Create task
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger"
        >
          {error}
        </div>
      )}

      <TaskSection
        tasks={tasks}
        categories={categories}
        loading={loading}
        onCreateTask={() => {
          setSubmitError(null);
          setCreateModalOpen(true);
        }}
        onEditTask={(task) => {
          setSubmitError(null);
          setEditTask(task);
        }}
        onDeleteTask={handleDeleteTask}
      />

      <CreateTaskModal
        open={createModalOpen}
        categories={categories}
        onClose={() => {
          if (!actionLoading) {
            setCreateModalOpen(false);
          }
        }}
        onSubmit={handleCreateTask}
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
        onCreateCategory={() => {
          setSubmitError(
            "Create the category from the Categories page first.",
          );
        }}
      />
    </main>
  );
}