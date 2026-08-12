import type { ReactNode } from "react";

import { Button } from "@/app/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  buttonLabel: string;
  onAction: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  buttonLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 py-10 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon ?? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14M5 12h14"
            />
          </svg>
        )}
      </div>

      <h2 className="text-base font-semibold text-text-primary">
        {title}
      </h2>

      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-muted">
          {description}
        </p>
      )}

      <div className="mt-5">
        <Button type="button" onClick={onAction}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}