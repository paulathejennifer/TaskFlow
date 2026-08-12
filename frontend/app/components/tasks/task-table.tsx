"use client";

import type { Task } from "@/app/types/task";

import { TaskRow } from "@/app/components/tasks/task-row";

type TaskTableProps = {
  tasks: Task[];
  categoryNames?: Record<string, string>;
  selectedTaskIds?: string[];
  onSelectTask?: (taskId: string, selected: boolean) => void;
  onTaskClick?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  loading?: boolean;
  emptyMessage?: string;
};

export function TaskTable({
  tasks,
  categoryNames = {},
  selectedTaskIds = [],
  onSelectTask,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  loading = false,
  emptyMessage = "No tasks found.",
}: TaskTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="bg-muted/40 text-left">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all tasks"
                  disabled
                  className="h-4 w-4 rounded border-border"
                />
              </th>

              <th className="px-4 py-3 text-xs font-semibold text-text-muted">
                Task
              </th>

              <th className="px-4 py-3 text-xs font-semibold text-text-muted">
                Category
              </th>

              <th className="px-4 py-3 text-xs font-semibold text-text-muted">
                Priority
              </th>

              <th className="px-4 py-3 text-xs font-semibold text-text-muted">
                Status
              </th>

              <th className="px-4 py-3 text-xs font-semibold text-text-muted">
                Due Date
              </th>

              <th className="px-4 py-3 text-xs font-semibold text-text-muted">
                Created
              </th>

              <th className="px-4 py-3 text-xs font-semibold text-text-muted">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-sm text-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  categoryName={
                    task.category_id
                      ? categoryNames[task.category_id] ?? "—"
                      : "—"
                  }
                  selected={selectedTaskIds.includes(task.id)}
                  onSelect={onSelectTask}
                  onClick={onTaskClick}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}