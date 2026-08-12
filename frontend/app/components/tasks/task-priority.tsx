type TaskPriorityProps = {
  priority: string;
};

const priorityStyles: Record<string, string> = {
  HIGH: "bg-danger",
  MEDIUM: "bg-warning",
  LOW: "bg-success",
};

const priorityLabels: Record<string, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export function TaskPriority({ priority }: TaskPriorityProps) {
  const normalizedPriority = priority.toUpperCase();

  const dotClass =
    priorityStyles[normalizedPriority] ?? "bg-text-muted";

  const label =
    priorityLabels[normalizedPriority] ??
    priority
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <span className="inline-flex items-center gap-2 text-sm text-text-primary">
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 rounded-full ${dotClass}`}
      />
      {label}
    </span>
  );
}