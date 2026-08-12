"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import type { Category } from "@/app/types/category";

type DeleteCategoryModalProps = {
  open: boolean;
  category: Category | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export function DeleteCategoryModal({
  open,
  category,
  loading = false,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open, loading, onClose]);

  if (!open || !category) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-category-modal-title"
        aria-describedby="delete-category-modal-description"
        className="w-full max-w-md rounded-xl border border-border bg-surface shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2
            id="delete-category-modal-title"
            className="text-lg font-semibold text-text-primary"
          >
            Delete category
          </h2>

          <button
            type="button"
            aria-label="Close delete category dialog"
            onClick={onClose}
            disabled={loading}
            className="rounded-md p-1.5 text-text-muted transition hover:bg-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <p
            id="delete-category-modal-description"
            className="text-sm leading-6 text-text-muted"
          >
            Are you sure you want to delete{" "}
            <span className="font-semibold text-text-primary">
              {category.name}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-text-primary transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="h-10 rounded-lg bg-danger px-4 text-sm font-bold text-white transition hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete category"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}