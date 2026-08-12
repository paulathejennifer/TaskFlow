import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TaskRow } from "@/app/components/tasks/task-row";

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

describe("TaskRow", () => {
  it("renders the task information", () => {
    render(
      <table>
        <tbody>
          <TaskRow
            task={task}
            categoryName="Work"
          />
        </tbody>
      </table>,
    );

    expect(
      screen.getByText("Prepare internship report"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Work on the final internship report",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(
      screen.getByText("In Progress"),
    ).toBeInTheDocument();
  });

  it("calls onSelect when the checkbox changes", () => {
    const onSelect = vi.fn();

    render(
      <table>
        <tbody>
          <TaskRow
            task={task}
            categoryName="Work"
            onSelect={onSelect}
          />
        </tbody>
      </table>,
    );

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /select prepare internship report/i,
      }),
    );

    expect(onSelect).toHaveBeenCalledWith(
      "task-1",
      true,
    );
  });

  it("calls onClick when the task title is clicked", () => {
    const onClick = vi.fn();

    render(
      <table>
        <tbody>
          <TaskRow
            task={task}
            categoryName="Work"
            onClick={onClick}
          />
        </tbody>
      </table>,
    );

    fireEvent.click(
      screen.getByText("Prepare internship report"),
    );

    expect(onClick).toHaveBeenCalledWith(task);
  });
});