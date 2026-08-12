import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TaskSection } from "@/app/components/tasks/task-section";

const tasks = [
  {
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
  },
  {
    id: "task-2",
    user_id: "user-1",
    category_id: "category-2",
    title: "Grocery shopping",
    description: "Buy groceries for the week",
    status: "TODO",
    priority: "LOW",
    start_date: "2025-05-10T00:00:00.000Z",
    due_date: "2099-05-22T00:00:00.000Z",
    completed_at: null,
    created_at: "2025-05-14T00:00:00.000Z",
    updated_at: "2025-05-14T00:00:00.000Z",
  },
] as never[];

describe("TaskSection", () => {
  it("renders the task section", () => {
    render(
      <TaskSection
        tasks={tasks}
        categories={[
          {
            id: "category-1",
            name: "Work",
          },
          {
            id: "category-2",
            name: "Personal",
          },
        ]}
      />,
    );

    expect(
      screen.getByText("Prepare internship report"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Grocery shopping"),
    ).toBeInTheDocument();
  });

  it("filters tasks by status", () => {
    render(
      <TaskSection
        tasks={tasks}
        categories={[
          {
            id: "category-1",
            name: "Work",
          },
          {
            id: "category-2",
            name: "Personal",
          },
        ]}
      />,
    );

    fireEvent.click(
  screen.getByRole("button", { name: "In Progress" }),
);

    expect(
      screen.getByText("Prepare internship report"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Grocery shopping"),
    ).not.toBeInTheDocument();
  });

  it("searches tasks", () => {
    render(
      <TaskSection
        tasks={tasks}
        categories={[
          {
            id: "category-1",
            name: "Work",
          },
          {
            id: "category-2",
            name: "Personal",
          },
        ]}
      />,
    );

    fireEvent.change(
      screen.getByLabelText("Search tasks"),
      {
        target: {
          value: "grocery",
        },
      },
    );

    expect(
      screen.getByText("Grocery shopping"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Prepare internship report"),
    ).not.toBeInTheDocument();
  });
});