// app/components/dashboard/__tests__/summary-card.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCard } from "@/app/components/dashboard/summary-card";

describe("SummaryCard", () => {
  it("renders the title and value", () => {
    render(
      <SummaryCard
        title="To Do"
        value={7}
        icon={<span>icon</span>}
        iconClassName="text-primary"
        iconBackgroundClassName="bg-primary/10"
      />,
    );

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("renders an optional description", () => {
    render(
      <SummaryCard
        title="Tasks Completed"
        value="5 / 17"
        description="29% completed"
        icon={<span>icon</span>}
        iconClassName="text-success"
        iconBackgroundClassName="bg-success/10"
      />,
    );

    expect(screen.getByText("29% completed")).toBeInTheDocument();
  });

  it("renders a progress bar when progress is provided", () => {
    const { container } = render(
      <SummaryCard
        title="Tasks Completed"
        value="5 / 17"
        progress={29}
        icon={<span>icon</span>}
        iconClassName="text-success"
        iconBackgroundClassName="bg-success/10"
      />,
    );

    const progress = container.querySelector(
      '[style="width: 29%;"]',
    );

    expect(progress).toBeInTheDocument();
  });

  it("does not render a progress bar when progress is omitted", () => {
    const { container } = render(
      <SummaryCard
        title="To Do"
        value={7}
        icon={<span>icon</span>}
        iconClassName="text-primary"
        iconBackgroundClassName="bg-primary/10"
      />,
    );

    expect(
      container.querySelector('[style*="width"]'),
    ).not.toBeInTheDocument();
  });
});