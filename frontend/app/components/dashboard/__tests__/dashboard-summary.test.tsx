import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardSummary } from "@/app/components/dashboard/dashboard-summary";

describe("DashboardSummary", () => {
  it("renders all four summary cards", () => {
    render(
      <DashboardSummary
        totalTasks={17}
        completedTasks={5}
        todoTasks={7}
        inProgressTasks={5}
      />,
    );

    expect(screen.getByText("Tasks Completed")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders the correct task counts", () => {
    render(
      <DashboardSummary
        totalTasks={17}
        completedTasks={5}
        todoTasks={7}
        inProgressTasks={5}
      />,
    );

    expect(screen.getByText("5 / 17")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getAllByText("5").length).toBeGreaterThanOrEqual(1);
  });

  it("calculates the completion percentage", () => {
    render(
      <DashboardSummary
        totalTasks={17}
        completedTasks={5}
        todoTasks={7}
        inProgressTasks={5}
      />,
    );

    expect(screen.getByText("29% completed")).toBeInTheDocument();
  });

  it("handles zero total tasks without dividing by zero", () => {
    render(
      <DashboardSummary
        totalTasks={0}
        completedTasks={0}
        todoTasks={0}
        inProgressTasks={0}
      />,
    );

    expect(screen.getByText("0 / 0")).toBeInTheDocument();
    expect(screen.getByText("0% completed")).toBeInTheDocument();
  });
});