import type { HTMLAttributes } from "react";

type BadgeVariant =
  | "default"
  | "todo"
  | "in-progress"
  | "completed"
  | "high"
  | "medium"
  | "low";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-muted text-text-secondary",
  todo: "bg-muted text-text-secondary",
  "in-progress": "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  high: "bg-danger/10 text-danger",
  medium: "bg-warning/10 text-warning",
  low: "bg-success/10 text-success",
};

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}