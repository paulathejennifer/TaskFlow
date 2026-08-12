import type { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconClassName: string;
  iconBackgroundClassName: string;
  description?: string;
  progress?: number;
  progressClassName?: string;
}

export function SummaryCard({
  title,
  value,
  icon,
  iconClassName,
  iconBackgroundClassName,
  description,
  progress,
  progressClassName = "bg-primary",
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary">
            {title}
          </p>

          <p className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs text-text-muted">
              {description}
            </p>
          )}
        </div>

        <div
          aria-hidden="true"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBackgroundClassName}`}
        >
          <span className={iconClassName}>{icon}</span>
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div
            aria-hidden="true"
            className="h-1.5 overflow-hidden rounded-full bg-muted"
          >
            <div
              className={`h-full rounded-full ${progressClassName}`}
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}