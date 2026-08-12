"use client";

import { useState } from "react";

import { CategoryCard } from "@/app/components/categories/category-card";
import { EmptyState } from "@/app/components/shared/empty-state";
import { Button } from "@/app/components/ui/button";
import { useCategories } from "@/app/hooks/use-categories";
import { useTasks } from "@/app/hooks/use-tasks";

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M12 5v14M5 12h14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CategoriesPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useTasks();

  const loading = categoriesLoading || tasksLoading;
  const error = categoriesError ?? tasksError;

  if (loading) {
    return (
      <main className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="h-8 w-44 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-5 w-72 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-10 w-36 animate-pulse rounded-lg bg-muted" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-xl border border-border bg-surface"
            />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Categories
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            Organize your tasks into categories.
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

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  return (
    <main className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Categories
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            Organize your tasks into categories.
          </p>
        </div>

        <Button
          type="button"
          aria-label="+ Create category"
          onClick={openCreateModal}
        >
          <PlusIcon />
          <span className="ml-2">Create category</span>
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create your first category to organize your tasks."
          buttonLabel="Create category"
          onAction={openCreateModal}
          icon={
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M12 5v14M5 12h14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      ) : (
        <section
          aria-label="Categories"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {categories.map((category, index) => {
            const taskCount = tasks.filter(
              (task) => task.category_id === category.id,
            ).length;

            return (
              <CategoryCard
                key={category.id}
                name={category.name}
                taskCount={taskCount}
                totalTasks={tasks.length}
                colorClassName={
                  [
                    "bg-primary",
                    "bg-success",
                    "bg-purple-500",
                    "bg-warning",
                  ][index % 4]
                }
              />
            );
          })}
        </section>
      )}

      {createModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Create category"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Create category
                </h2>

                <p className="mt-1 text-sm text-text-muted">
                  Category creation form will go here.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close create category dialog"
                onClick={() => setCreateModalOpen(false)}
                className="rounded-md px-2 py-1 text-text-muted hover:bg-muted hover:text-text-primary"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}