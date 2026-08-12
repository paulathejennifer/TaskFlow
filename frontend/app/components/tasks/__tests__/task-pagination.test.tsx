import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TaskPagination } from "@/app/components/tasks/task-pagination";

describe("TaskPagination", () => {
  it("shows the current range", () => {
    render(
      <TaskPagination
        currentPage={1}
        totalPages={3}
        totalItems={17}
        itemsPerPage={7}
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Showing 1 to 7 of 17 tasks"),
    ).toBeInTheDocument();
  });

  it("calls onPageChange when a page is selected", () => {
    const onPageChange = vi.fn();

    render(
      <TaskPagination
        currentPage={1}
        totalPages={3}
        totalItems={17}
        itemsPerPage={7}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Page 2",
      }),
    );

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables previous on the first page", () => {
    render(
      <TaskPagination
        currentPage={1}
        totalPages={3}
        totalItems={17}
        itemsPerPage={7}
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Previous page",
      }),
    ).toBeDisabled();
  });

  it("disables next on the last page", () => {
    render(
      <TaskPagination
        currentPage={3}
        totalPages={3}
        totalItems={17}
        itemsPerPage={7}
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Next page",
      }),
    ).toBeDisabled();
  });
});