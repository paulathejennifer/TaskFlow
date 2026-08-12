import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TaskPriority } from "@/app/components/tasks/task-priority";

describe("TaskPriority", () => {
  it("renders High priority", () => {
    render(<TaskPriority priority="HIGH" />);

    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders Medium priority", () => {
    render(<TaskPriority priority="MEDIUM" />);

    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("renders Low priority", () => {
    render(<TaskPriority priority="LOW" />);

    expect(screen.getByText("Low")).toBeInTheDocument();
  });
});