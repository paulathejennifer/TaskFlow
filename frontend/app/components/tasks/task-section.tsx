"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/app/components/shared/empty-state";
import { TaskFilters } from "@/app/components/tasks/task-filters";
import { TaskPagination } from "@/app/components/tasks/task-pagination";
import { TaskTable } from "@/app/components/tasks/task-table";

import type { Task } from "@/app/types/task";

type TaskSectionProps = {
  tasks: Task[];
  categories?: Array<{
    id: string;
    name: string;
  }>;
  loading?: boolean;
  onCreateTask?: () => void;
  onTaskClick?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
};

const ITEMS_PER_PAGE = 7;

export function TaskSection({
  tasks,
  categories = [],
  loading = false,
  onCreateTask,
  onTaskClick,
  onEditTask,
  onDeleteTask,
}: TaskSectionProps) {
  const [status, setStatus] = useState<
    "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED"
  >("ALL");

  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("DUE_DATE");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const categoryNames = useMemo(
    () =>
      Object.fromEntries(
        categories.map((item) => [item.id, item.name]),
      ),
    [categories],
  );

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const taskStatus = String(task.status).toUpperCase();

      const normalizedStatus =
        taskStatus === "DONE" ? "COMPLETED" : taskStatus;

      const matchesStatus =
        status === "ALL" || normalizedStatus === status;

      const matchesCategory =
        category === "ALL" || task.category_id === category;

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query);

      return (
        matchesStatus &&
        matchesCategory &&
        matchesSearch
      );
    });

    return [...result].sort((a, b) => {
      if (sort === "TITLE") {
        return a.title.localeCompare(b.title);
      }

      if (sort === "CREATED_DATE") {
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      }

      return (
        new Date(a.due_date ?? "9999-12-31").getTime() -
        new Date(b.due_date ?? "9999-12-31").getTime()
      );
    });
  }, [tasks, status, category, search, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTasks.length / ITEMS_PER_PAGE),
  );

  const visibleTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  function handleStatusChange(
    value: "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED",
  ) {
    setStatus(value);
    setCurrentPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setCurrentPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleSelectTask(
    taskId: string,
    selected: boolean,
  ) {
    setSelectedTaskIds((current) =>
      selected
        ? current.includes(taskId)
          ? current
          : [...current, taskId]
        : current.filter((id) => id !== taskId),
    );
  }

  if (!loading && tasks.length === 0) {
    return (
      <section className="space-y-4">
        <EmptyState
          title="No tasks yet"
          description="Create your first task to get started."
          buttonLabel="Create task"
          onAction={() => onCreateTask?.()}
        />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <TaskFilters
        status={status}
        category={category}
        sort={sort}
        search={search}
        categories={categories.map((item) => item.name)}
        onStatusChange={handleStatusChange}
        onCategoryChange={(value) => {
          const selectedCategory = categories.find(
            (item) => item.name === value,
          );

          handleCategoryChange(
            selectedCategory?.id ?? "ALL",
          );
        }}
        onSortChange={(value) => {
          setSort(value);
          setCurrentPage(1);
        }}
        onSearchChange={handleSearchChange}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <TaskTable
          tasks={visibleTasks}
          categoryNames={categoryNames}
          selectedTaskIds={selectedTaskIds}
          onSelectTask={handleSelectTask}
          onTaskClick={onTaskClick}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          loading={loading}
        />

        {!loading && (
          <TaskPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTasks.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </section>
  );
}