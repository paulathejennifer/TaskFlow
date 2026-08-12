import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DashboardPage from "@/app/(dashboard)/dashboard/page";
import { useAuth } from "@/app/hooks/use-auth";
import { useCategories } from "@/app/hooks/use-categories";
import { useTasks } from "@/app/hooks/use-tasks";

vi.mock("@/app/hooks/use-auth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/app/hooks/use-categories", () => ({
  useCategories: vi.fn(),
}));

vi.mock("@/app/hooks/use-tasks", () => ({
  useTasks: vi.fn(),
}));

vi.mock("@/app/components/dashboard/dashboard-summary", () => ({
  DashboardSummary: ({
    totalTasks,
    completedTasks,
    todoTasks,
    inProgressTasks,
  }: {
    totalTasks: number;
    completedTasks: number;
    todoTasks: number;
    inProgressTasks: number;
  }) => (
    <div data-testid="dashboard-summary">
      {totalTasks} total
      {completedTasks} completed
      {todoTasks} todo
      {inProgressTasks} in progress
    </div>
  ),
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
      {tasks.length} tasks
      {categories.length} categories
    </div>
  ),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: "user-123",
        full_name: "John Doe",
        email: "john@example.com",
      },
      loading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    vi.mocked(useTasks).mockReturnValue({
      tasks: [
        {
          id: "task-1",
          status: "COMPLETED",
        },
        {
          id: "task-2",
          status: "TODO",
        },
        {
          id: "task-3",
          status: "IN_PROGRESS",
        },
      ],
      loading: false,
      error: null,
      fetchTasks: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    } as never);

    vi.mocked(useCategories).mockReturnValue({
      categories: [
        {
          id: "category-1",
          name: "Work",
        },
      ],
      loading: false,
      error: null,
      fetchCategories: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
    } as never);
  });

  it("renders the dashboard heading and welcome message", async () => {
    render(<DashboardPage />);

    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Welcome back, John Doe/),
    ).toBeInTheDocument();
  });

  it("calculates and displays the task summary", () => {
    render(<DashboardPage />);

    expect(screen.getByTestId("dashboard-summary")).toHaveTextContent(
      "3 total",
    );

    expect(screen.getByTestId("dashboard-summary")).toHaveTextContent(
      "1 completed",
    );

    expect(screen.getByTestId("dashboard-summary")).toHaveTextContent(
      "1 todo",
    );

    expect(
      screen.getByTestId("dashboard-summary"),
    ).toHaveTextContent("1 in progress");
  });

  it("passes tasks and categories to the task section", () => {
    render(<DashboardPage />);

    expect(screen.getByTestId("task-section")).toHaveTextContent(
      "3 tasks",
    );

    expect(screen.getByTestId("task-section")).toHaveTextContent(
      "1 categories",
    );
  });

  it("shows an error when loading tasks fails", () => {
    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      loading: false,
      error: "Failed to load tasks.",
      fetchTasks: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    } as never);

    render(<DashboardPage />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to load tasks.",
    );
  });

  it("shows a loading state while data is loading", () => {
    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      loading: true,
      error: null,
      fetchTasks: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    } as never);

    render(<DashboardPage />);

    expect(
      screen.queryByTestId("task-section"),
    ).not.toBeInTheDocument();
  });
});