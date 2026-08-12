"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import { TaskForm } from "./task-form";
import type {
  Category,
  TaskFormValues,
} from "./task-form-types";

type CreateTaskModalProps = {
  open: boolean;
  categories?: Category[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (
    values: TaskFormValues,
  ) => void | Promise<void>;
  onCreateCategory?: () => void;
};

export function CreateTaskModal({
  open,
  categories = [],
  loading = false,
  onClose,
  onSubmit,
  onCreateCategory,
}: CreateTaskModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
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
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-modal-title"
        className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-7">
          <h2
            id="create-task-modal-title"
            className="text-2xl font-semibold text-text-primary"
          >
            Create New Task
          </h2>

          <button
            type="button"
            aria-label="Close task modal"
            onClick={onClose}
            className="rounded-md p-2 text-text-primary transition hover:bg-muted"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <TaskForm
          mode="create"
          categories={categories}
          loading={loading}
          onSubmit={onSubmit}
          onCreateCategory={onCreateCategory}
        onClose={onClose}

        />
      </div>
    </div>
  );
}