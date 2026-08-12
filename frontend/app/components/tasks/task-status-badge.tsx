type TaskStatusBadgeProps = {
  status: string;
};

const statusStyles: Record<string, string> = {
  TODO: "border-border bg-muted text-text-secondary",
  "TO DO": "border-border bg-muted text-text-secondary",
  IN_PROGRESS: "border-primary/20 bg-primary/10 text-primary",
  "IN PROGRESS": "border-primary/20 bg-primary/10 text-primary",
  COMPLETED: "border-success/20 bg-success/10 text-success",
};

const statusLabels: Record<string, string> = {
  TODO: "To Do",
  "TO DO": "To Do",
  IN_PROGRESS: "In Progress",
  "IN PROGRESS": "In Progress",
  COMPLETED: "Completed",
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();
  const className =
    statusStyles[normalizedStatus] ??
    "border-border bg-muted text-text-secondary";

  const label =
    statusLabels[normalizedStatus] ??
    status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}