"use client";

import { useState } from "react";

type CategoryCardProps = {
  name: string;
  taskCount: number;
  totalTasks: number;
  colorClassName?: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const colorVariants = [
  {
    icon: "bg-primary/10 text-primary",
    progress: "bg-primary",
  },
  {
    icon: "bg-success/10 text-success",
    progress: "bg-success",
  },
  {
    icon: "bg-purple-500/10 text-purple-600",
    progress: "bg-purple-500",
  },
  {
    icon: "bg-warning/10 text-warning",
    progress: "bg-warning",
  },
];

function FolderIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4l2 2h7A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
      />
    </svg>
  );
}

function EllipsisIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

export function CategoryCard({
  name,
  taskCount,
  totalTasks,
  colorClassName,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const percentage =
    totalTasks > 0
      ? Math.min(100, Math.round((taskCount / totalTasks) * 100))
      : 0;

  const variant =
    colorVariants[Math.abs(name.length) % colorVariants.length];

  const iconClassName = colorClassName ?? variant.icon;
  const progressClassName = colorClassName ?? variant.progress;

  return (
    <article className="relative rounded-xl border border-border bg-surface p-4 transition hover:border-border/80 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-full",
            iconClassName,
          ].join(" ")}
        >
          <FolderIcon />
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label={`Actions for ${name}`}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-md p-2 text-text-muted transition hover:bg-muted hover:text-text-primary"
          >
            <EllipsisIcon />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 z-10 min-w-28 rounded-lg border border-border bg-surface p-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-text-primary hover:bg-muted"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-danger/10"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold text-text-primary">
          {name}
        </h2>

        <p className="mt-1 text-sm text-text-muted">
          {taskCount} {taskCount === 1 ? "task" : "tasks"}
        </p>
      </div>

      <div
        role="progressbar"
        aria-label={`${percentage}% of tasks`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={[
            "h-full rounded-full transition-all",
            progressClassName,
          ].join(" ")}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </article>
  );
}