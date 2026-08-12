"use client";

import { useState } from "react";

type TaskFilterStatus = "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED";

type TaskFiltersProps = {
  status?: TaskFilterStatus;
  category?: string;
  sort?: string;
  search?: string;
  categories?: string[];
  onStatusChange?: (status: TaskFilterStatus) => void;
  onCategoryChange?: (category: string) => void;
  onSortChange?: (sort: string) => void;
  onSearchChange?: (search: string) => void;
};

const statusOptions: Array<{
  value: TaskFilterStatus;
  label: string;
}> = [
  { value: "ALL", label: "All Tasks" },
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export function TaskFilters({
  status = "ALL",
  category = "ALL",
  sort = "DUE_DATE",
  search = "",
  categories = [],
  onStatusChange,
  onCategoryChange,
  onSortChange,
  onSearchChange,
}: TaskFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);

  function handleSearchChange(value: string) {
    setLocalSearch(value);
    onSearchChange?.(value);
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex overflow-x-auto rounded-lg border border-border bg-surface">
        {statusOptions.map((option) => {
          const active = status === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onStatusChange?.(option.value)}
              className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {option.label}

              {active && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(event) => onCategoryChange?.(event.target.value)}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          <option value="ALL">All Categories</option>

          {categories.map((categoryOption) => (
            <option key={categoryOption} value={categoryOption}>
              {categoryOption}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort tasks"
          value={sort}
          onChange={(event) => onSortChange?.(event.target.value)}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          <option value="DUE_DATE">Sort: Due Date</option>
          <option value="CREATED_DATE">Sort: Created Date</option>
          <option value="TITLE">Sort: Title</option>
        </select>

        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          >
            ⌕
          </span>

          <input
            type="search"
            aria-label="Search tasks"
            placeholder="Search tasks..."
            value={localSearch}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-52"
          />
        </div>
      </div>
    </div>
  );
}