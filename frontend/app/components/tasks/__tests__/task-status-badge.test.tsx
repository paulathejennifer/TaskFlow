import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TaskStatusBadge } from "@/app/components/tasks/task-status-badge";

describe("TaskStatusBadge", () => {
  it("renders To Do", () => {
    render(<TaskStatusBadge status="TODO" />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("renders In Progress", () => {
    render(
      <TaskStatusBadge status="IN_PROGRESS" />,
    );

    expect(
      screen.getByText("In Progress"),
    ).toBeInTheDocument();
  });

  it("renders Completed", () => {
    render(
      <TaskStatusBadge status="COMPLETED" />,
    );

    expect(
      screen.getByText("Completed"),
    ).toBeInTheDocument();
  });
});