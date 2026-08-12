import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TasksPage from "@/app/(dashboard)/tasks/page";

const mockUseTasks = vi.fn();
const mockUseCategories = vi.fn();

vi.mock("@/app/hooks/use-tasks", () => ({
  useTasks: () => mockUseTasks(),
}));

vi.mock("@/app/hooks/use-categories", () => ({
  useCategories: () => mockUseCategories(),
}));

vi.mock("@/app/components/tasks/task-section", () => ({
  TaskSection: ({
    tasks,
    categories,
  }: {
    tasks: unknown[];
    categories: unknown[];
  }) => (
    <div data-testid="task-section">
      Tasks: {tasks.length} Categories: {categories.length}
    </div>
  ),
}));

describe("TasksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseTasks.mockReturnValue({
      tasks: [
        {
          id: "task-1",
          title: "Prepare internship report",
        },
        {
          id: "task-2",
          title: "Grocery shopping",
        },
      ],
      loading: false,
      error: null,
    });

    mockUseCategories.mockReturnValue({
      categories: [
        {
          id: "category-1",
          name: "Work",
        },
      ],
      loading: false,
      error: null,
    });
  });

  it("renders the tasks page heading", () => {
    render(<TasksPage />);

    expect(
      screen.getByRole("heading", { name: "Tasks" }),
    ).toBeInTheDocument();
  });

  it("renders the create task button", () => {
    render(<TasksPage />);

    expect(
      screen.getByRole("button", { name: "+ Create task" }),
    ).toBeInTheDocument();
  });

  it("renders the shared task section", () => {
    render(<TasksPage />);

    expect(screen.getByTestId("task-section")).toHaveTextContent(
      "Tasks: 2 Categories: 1",
    );
  });

  it("shows an error when loading tasks fails", () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      loading: false,
      error: "Unable to load tasks.",
    });

    render(<TasksPage />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load tasks.",
    );
  });

  it("shows a loading state", () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      loading: true,
      error: null,
    });

    render(<TasksPage />);

    expect(
      screen.queryByRole("heading", { name: "Tasks" }),
    ).not.toBeInTheDocument();
  });
});