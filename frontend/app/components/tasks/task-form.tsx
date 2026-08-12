"use client";

import {
  CalendarDays,
  ChevronDown,
  Flag,
  Folder,
  Info,
  Trash2,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import type { Task } from "@/app/types/task";

import {
  EMPTY_TASK_FORM,
  type TaskFormProps,
  type TaskFormValues,
} from "./task-form-types";

function formatDateForInput(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function getInitialValues(
  task?: Task | null,
): TaskFormValues {
  if (!task) {
    return EMPTY_TASK_FORM;
  }

  return {
    title: task.title ?? "",
    description: task.description ?? "",
    category_id: task.category_id ?? "",
    status:
      task.status === "IN_PROGRESS"
        ? "IN_PROGRESS"
        : task.status === "DONE"
          ? "DONE"
          : "TODO",
    priority:
      task.priority === "HIGH"
        ? "HIGH"
        : task.priority === "MEDIUM"
          ? "MEDIUM"
          : "LOW",
    start_date: formatDateForInput(task.start_date),
    due_date: formatDateForInput(task.due_date),
  };
}

function getPriorityColor(
  priority: TaskFormValues["priority"],
) {
  switch (priority) {
    case "HIGH":
      return "text-danger";
    case "MEDIUM":
      return "text-warning";
    default:
      return "text-success";
  }
}

function getStatusDotColor(
  status: TaskFormValues["status"],
) {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-primary";
    case "DONE":
      return "bg-success";
    default:
      return "bg-muted-foreground";
  }
}

export function TaskForm({
  mode,
  task = null,
  categories = [],
  loading = false,
  onSubmit,
  onDelete,
  onCreateCategory,
}: TaskFormProps) {
  const isEditMode = mode === "edit";

  const [form, setForm] = useState<TaskFormValues>(
    getInitialValues(task),
  );

  const [error, setError] = useState("");

  useEffect(() => {
    setForm(getInitialValues(task));
    setError("");
  }, [task]);

  function updateField<K extends keyof TaskFormValues>(
    field: K,
    value: TaskFormValues[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  function validate() {
    if (!form.title.trim()) {
      return "Task title is required.";
    }

    if (!form.priority) {
      return "Priority is required.";
    }

    if (!form.status) {
      return "Status is required.";
    }

    if (
      form.start_date &&
      form.due_date &&
      form.start_date > form.due_date
    ) {
      return "Start date cannot be after the due date.";
    }

    return "";
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    await onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });
  }

  async function handleDelete() {
    if (!task || !onDelete) {
      return;
    }

    await onDelete(task);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="px-6 py-6 sm:px-8 sm:py-7">
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-sm font-semibold text-text-primary"
            >
              Task Title <span className="text-danger">*</span>
            </label>

            <input
              id="task-title"
              name="title"
              type="text"
              value={form.title}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              placeholder="Enter task title"
              className="h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-2 block text-sm font-semibold text-text-primary"
            >
              Description
            </label>

            <textarea
              id="task-description"
              name="description"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Enter task description (optional)"
              rows={4}
              className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="task-category"
                className="mb-2 block text-sm font-semibold text-text-primary"
              >
                Category
              </label>

              <div className="relative">
                <Folder className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                <select
                  id="task-category"
                  name="category"
                  value={form.category_id}
                  onChange={(event) =>
                    updateField(
                      "category_id",
                      event.target.value,
                    )
                  }
                  className="h-12 w-full appearance-none rounded-lg border border-border bg-surface pl-12 pr-10 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
              </div>

              {onCreateCategory && (
                <button
                  type="button"
                  onClick={onCreateCategory}
                  className="mt-2 text-sm font-medium text-primary hover:underline"
                >
                  + Create new category
                </button>
              )}
            </div>

            <div>
              <label
                htmlFor="task-status"
                className="mb-2 block text-sm font-semibold text-text-primary"
              >
                Status <span className="text-danger">*</span>
              </label>

              <div className="relative">
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full ${getStatusDotColor(form.status)}`}
                />

                <select
                  id="task-status"
                  name="status"
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as TaskFormValues["status"],
                    )
                  }
                  className="h-12 w-full appearance-none rounded-lg border border-border bg-surface pl-10 pr-10 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">
                    In Progress
                  </option>
                  <option value="DONE">Completed</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
              </div>
            </div>

            <div>
              <label
                htmlFor="task-priority"
                className="mb-2 block text-sm font-semibold text-text-primary"
              >
                Priority <span className="text-danger">*</span>
              </label>

              <div className="relative">
                <Flag
                  className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${getPriorityColor(form.priority)}`}
                />

                <select
                  id="task-priority"
                  name="priority"
                  value={form.priority}
                  onChange={(event) =>
                    updateField(
                      "priority",
                      event.target.value as TaskFormValues["priority"],
                    )
                  }
                  className="h-12 w-full appearance-none rounded-lg border border-border bg-surface pl-12 pr-10 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
              </div>
            </div>

            <div>
              <label
                htmlFor="task-start-date"
                className="mb-2 block text-sm font-semibold text-text-primary"
              >
                Start Date
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                <input
                  id="task-start-date"
                  name="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(event) =>
                    updateField(
                      "start_date",
                      event.target.value,
                    )
                  }
                  className="h-12 w-full rounded-lg border border-border bg-surface px-4 pl-12 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="task-due-date"
              className="mb-2 block text-sm font-semibold text-text-primary"
            >
              Due Date
            </label>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="task-due-date"
                name="due_date"
                type="date"
                value={form.due_date}
                onChange={(event) =>
                  updateField(
                    "due_date",
                    event.target.value,
                  )
                }
                className="h-12 w-full rounded-lg border border-border bg-surface px-4 pl-12 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {isEditMode &&
            form.start_date &&
            form.due_date && (
              <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                <Info className="mt-0.5 h-5 w-5 shrink-0" />

                <p>
                  If both start and due dates are set, the
                  start date cannot be after the due date.
                </p>
              </div>
            )}
        </div>
      </div>

      <div className="border-t border-border px-6 py-5 sm:px-8">
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {isEditMode && task && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="inline-flex items-center gap-2 text-sm font-medium text-danger transition hover:text-danger/80 disabled:opacity-50"
              >
                <Trash2 className="h-5 w-5" />
                Delete Task
              </button>
            ) : (
              <p className="text-sm text-text-muted">
                <span className="text-danger">*</span>{" "}
                Required fields
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={loading}
              className="h-11 rounded-lg border border-border bg-surface px-6 text-sm font-semibold text-text-primary transition hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-lg bg-text-primary px-7 text-sm font-semibold text-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}