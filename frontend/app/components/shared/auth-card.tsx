import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-[var(--shadow-card)]">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          {title}
        </h1>

        <p className="mt-2 text-sm text-text-muted">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}