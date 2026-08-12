"use client";

import { useState } from "react";

import { CategoryCard } from "@/app/components/categories/category-card";
import { CreateCategoryModal } from "@/app/components/categories/create-category-modal";
import { DeleteCategoryModal } from "@/app/components/categories/delete-category-modal";
import { EditCategoryModal } from "@/app/components/categories/edit-category-modal";
import { EmptyState } from "@/app/components/shared/empty-state";
import { Button } from "@/app/components/ui/button";
import { useCategories } from "@/app/hooks/use-categories";
import { useTasks } from "@/app/hooks/use-tasks";

import type { Category } from "@/app/types/category";

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
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deletingCategory, setDeletingCategory] =
    useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useTasks();

  const loading = categoriesLoading || tasksLoading;
  const error = categoriesError ?? tasksError;

  const openCreateModal = () => {
    setCreateError(null);
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    if (!createLoading) {
      setCreateModalOpen(false);
    }
  };

  async function handleCreateCategory(name: string) {
    setCreateLoading(true);
    setCreateError(null);

    try {
      await createCategory({
        name,
      });

      setCreateModalOpen(false);
    } catch (err) {
      setCreateError(
        err instanceof Error
          ? err.message
          : "Failed to create category.",
      );
    } finally {
      setCreateLoading(false);
    }
  }

  const handleOpenEdit = (category: Category) => {
    setEditError(null);
    setEditingCategory(category);
  };

  const handleCloseEdit = () => {
    if (!editLoading) {
      setEditingCategory(null);
      setEditError(null);
    }
  };

  async function handleEditCategory(name: string) {
    if (!editingCategory) {
      return;
    }

    setEditLoading(true);
    setEditError(null);

    try {
      await updateCategory(editingCategory.id, {
        name,
      });

      setEditingCategory(null);
    } catch (err) {
      setEditError(
        err instanceof Error
          ? err.message
          : "Failed to update category.",
      );
    } finally {
      setEditLoading(false);
    }
  }

  const handleOpenDelete = (category: Category) => {
    setDeleteError(null);
    setDeletingCategory(category);
  };

  const handleCloseDelete = () => {
    if (!deleteLoading) {
      setDeletingCategory(null);
      setDeleteError(null);
    }
  };

  async function handleDeleteCategory() {
    if (!deletingCategory) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await deleteCategory(deletingCategory.id);

      setDeletingCategory(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Failed to delete category.",
      );
    } finally {
      setDeleteLoading(false);
    }
  }

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
            onClick={openCreateModal}
          >
            <PlusIcon />
            <span className="ml-2">Create category</span>
          </Button>
        </div>

        <div
          role="alert"
          className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger"
        >
          {error}
        </div>

        <CreateCategoryModal
          open={createModalOpen}
          loading={createLoading}
          onClose={closeCreateModal}
          onSubmit={handleCreateCategory}
        />
      </main>
    );
  }

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
          aria-label="Create category"
          onClick={openCreateModal}
        >
          <PlusIcon />
          <span className="ml-2">Create category</span>
        </Button>
      </div>

      {createError && (
        <div
          role="alert"
          className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger"
        >
          {createError}
        </div>
      )}

      {editError && (
        <div
          role="alert"
          className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger"
        >
          {editError}
        </div>
      )}

      {deleteError && (
        <div
          role="alert"
          className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger"
        >
          {deleteError}
        </div>
      )}

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
                category={category}
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
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            );
          })}
        </section>
      )}

      <CreateCategoryModal
        open={createModalOpen}
        loading={createLoading}
        onClose={closeCreateModal}
        onSubmit={handleCreateCategory}
      />

      <EditCategoryModal
        open={editingCategory !== null}
        category={editingCategory}
        loading={editLoading}
        onClose={handleCloseEdit}
        onSubmit={handleEditCategory}
      />

      <DeleteCategoryModal
        open={deletingCategory !== null}
        category={deletingCategory}
        loading={deleteLoading}
        onClose={handleCloseDelete}
        onConfirm={handleDeleteCategory}
      />
    </main>
  );
}