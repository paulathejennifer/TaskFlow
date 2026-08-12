"use client";

import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "@/app/lib/api";
import { getAccessToken } from "@/app/lib/auth";

import type {
  Category,
  CategoryCreate,
  CategoryUpdate,
} from "@/app/types/category";

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (data: CategoryCreate) => Promise<Category>;
  updateCategory: (
    categoryId: string,
    data: CategoryUpdate,
  ) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setCategories([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest<Category[]>("/categories", {
        token,
      });

      setCategories(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load categories.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(
    async (data: CategoryCreate): Promise<Category> => {
      const token = getAccessToken();

      if (!token) {
        throw new Error("You must be logged in.");
      }

      const category = await apiRequest<Category>("/categories", {
        method: "POST",
        token,
        body: JSON.stringify(data),
      });

      setCategories((currentCategories) => [
        ...currentCategories,
        category,
      ]);

      return category;
    },
    [],
  );

  const updateCategory = useCallback(
    async (
      categoryId: string,
      data: CategoryUpdate,
    ): Promise<Category> => {
      const token = getAccessToken();

      if (!token) {
        throw new Error("You must be logged in.");
      }

      const updatedCategory = await apiRequest<Category>(
        `/categories/${categoryId}`,
        {
          method: "PATCH",
          token,
          body: JSON.stringify(data),
        },
      );

      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category.id === categoryId
            ? updatedCategory
            : category,
        ),
      );

      return updatedCategory;
    },
    [],
  );

  const deleteCategory = useCallback(
    async (categoryId: string): Promise<void> => {
      const token = getAccessToken();

      if (!token) {
        throw new Error("You must be logged in.");
      }

      await apiRequest<void>(`/categories/${categoryId}`, {
        method: "DELETE",
        token,
      });

      setCategories((currentCategories) =>
        currentCategories.filter(
          (category) => category.id !== categoryId,
        ),
      );
    },
    [],
  );

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}