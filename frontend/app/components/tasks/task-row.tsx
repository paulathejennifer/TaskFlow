import type { Task } from "@/app/types/task";

import { TaskPriority } from "@/app/components/tasks/task-priority";
import { TaskStatusBadge } from "@/app/components/tasks/task-status-badge";

type TaskRowProps = {
  task: Task;
  categoryName?: string;
  selected?: boolean;
  onSelect?: (taskId: string, selected: boolean) => void;
  onClick?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getDueDateState(value: string | null | undefined) {
  if (!value) {
    return {
      overdue: false,
      text: "—",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      overdue: false,
      text: "—",
    };
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  date.setHours(0, 0, 0, 0);

  return {
    overdue: date < today,
    text: formatDate(value),
  };
}

export function TaskRow({
  task,
  categoryName = "—",
  selected = false,
  onSelect,
  onClick,
  onEdit,
  onDelete,
}: TaskRowProps) {
  const dueDate = getDueDateState(task.due_date);

  return (
    <tr className="border-t border-border transition hover:bg-muted/40">
      <td className="w-12 px-4 py-4">
        <input
          type="checkbox"
          aria-label={`Select ${task.title}`}
          checked={selected}
          onChange={(event) =>
            onSelect?.(task.id, event.target.checked)
          }
          className="h-4 w-4 rounded border-border accent-primary"
        />
      </td>

      <td className="min-w-64 px-4 py-4">
        <button
          type="button"
          onClick={() => onClick?.(task)}
          className="text-left"
        >
          <p className="font-semibold text-text-primary">
            {task.title}
          </p>

          {task.description && (
            <p className="mt-1 line-clamp-1 text-xs text-text-muted">
              {task.description}
            </p>
          )}
        </button>
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-sm text-text-primary">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true">□</span>
          {categoryName}
        </span>
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <TaskPriority priority={String(task.priority)} />
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <TaskStatusBadge status={String(task.status)} />
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <div
          className={
            dueDate.overdue
              ? "font-semibold text-danger"
              : "text-text-primary"
          }
        >
          <p className="text-sm">{dueDate.text}</p>

          {dueDate.overdue && (
            <p className="mt-1 text-xs font-medium">Overdue</p>
          )}
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-sm text-text-muted">
        {formatDate(task.created_at)}
      </td>

      <td className="w-16 px-4 py-4 text-center">
        <div className="relative inline-block">
          <button
            type="button"
            aria-label={`Actions for ${task.title}`}
            className="rounded-md px-2 py-1 text-lg leading-none text-text-muted transition hover:bg-muted hover:text-text-primary"
            onClick={() => onEdit?.(task)}
          >
            ⋮
          </button>
        </div>
      </td>
    </tr>
  );
}