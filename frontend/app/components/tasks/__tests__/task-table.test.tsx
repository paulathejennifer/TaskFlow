import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TaskTable } from "@/app/components/tasks/task-table";

const task = {
  id: "task-1",
  user_id: "user-1",
  category_id: "category-1",
  title: "Prepare internship report",
  description: "Work on the final internship report",
  status: "IN_PROGRESS",
  priority: "HIGH",
  start_date: "2025-05-10T00:00:00.000Z",
  due_date: "2099-05-20T00:00:00.000Z",
  completed_at: null,
  created_at: "2025-05-10T00:00:00.000Z",
  updated_at: "2025-05-18T00:00:00.000Z",
} as never;

describe("TaskTable", () => {
  it("renders table headers", () => {
    render(<TaskTable tasks={[]} />);

    expect(screen.getByText("Task")).toBeInTheDocument();
    expect(
      screen.getByText("Category"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Priority"),
    ).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(
      screen.getByText("Due Date"),
    ).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(
      screen.getByText("Actions"),
    ).toBeInTheDocument();
  });

  it("renders tasks", () => {
    render(
      <TaskTable
        tasks={[task]}
        categoryNames={{
          "category-1": "Work",
        }}
      />,
    );

    expect(
      screen.getByText("Prepare internship report"),
    ).toBeInTheDocument();

    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("renders the empty state", () => {
    render(
      <TaskTable
        tasks={[]}
        emptyMessage="No tasks yet."
      />,
    );

    expect(
      screen.getByText("No tasks yet."),
    ).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(
      <TaskTable
        tasks={[]}
        loading
      />,
    );

    expect(
      screen.getByText("Loading tasks..."),
    ).toBeInTheDocument();
  });
});
