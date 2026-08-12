import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TaskFilters } from "@/app/components/tasks/task-filters";

describe("TaskFilters", () => {
  it("renders all filter controls", () => {
    render(
      <TaskFilters
        categories={["Work", "Personal", "Health"]}
      />,
    );

    expect(screen.getByText("All Tasks")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(
      screen.getByText("In Progress"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Completed"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Filter by category"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Sort tasks"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Search tasks"),
    ).toBeInTheDocument();
  });

  it("calls onStatusChange", () => {
    const onStatusChange = vi.fn();

    render(
      <TaskFilters
        onStatusChange={onStatusChange}
      />,
    );

    fireEvent.click(screen.getByText("Completed"));

    expect(onStatusChange).toHaveBeenCalledWith(
      "COMPLETED",
    );
  });

  it("calls onSearchChange", () => {
    const onSearchChange = vi.fn();

    render(
      <TaskFilters
        onSearchChange={onSearchChange}
      />,
    );

    fireEvent.change(
      screen.getByLabelText("Search tasks"),
      {
        target: {
          value: "internship",
        },
      },
    );

    expect(onSearchChange).toHaveBeenCalledWith(
      "internship",
    );
  });
});