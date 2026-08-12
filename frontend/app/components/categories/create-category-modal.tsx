
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface CreateCategoryModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void | Promise<void>;
}

export function CreateCategoryModal({
  open,
  loading = false,
  onClose,
  onSubmit,
}: CreateCategoryModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    await onSubmit(trimmedName);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-category-modal-title"
        className="w-full max-w-md rounded-xl border border-border bg-surface shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2
            id="create-category-modal-title"
            className="text-lg font-semibold text-text-primary"
          >
            Create category
          </h2>

          <button
            type="button"
            aria-label="Close create category dialog"
            onClick={onClose}
            disabled={loading}
            className="rounded-md p-1.5 text-text-muted transition hover:bg-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="space-y-2">
            <label
              htmlFor="category-name"
              className="text-sm font-medium text-text-primary"
            >
              Name
            </label>

            <input
              id="category-name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Work"
              autoComplete="off"
              autoFocus
              required
              disabled={loading}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

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
              type="submit"
              disabled={loading || !name.trim()}
              className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

