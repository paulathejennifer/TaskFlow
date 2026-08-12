import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CategoriesPage from "@/app/(dashboard)/categories/page";

const mockUseCategories = vi.fn();
const mockUseTasks = vi.fn();

vi.mock("@/app/hooks/use-categories", () => ({
  useCategories: () => mockUseCategories(),
}));

vi.mock("@/app/hooks/use-tasks", () => ({
  useTasks: () => mockUseTasks(),
}));

describe("CategoriesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseCategories.mockReturnValue({
      categories: [
        {
          id: "work",
          name: "Work",
        },
        {
          id: "personal",
          name: "Personal",
        },
        {
          id: "health",
          name: "Health",
        },
        {
          id: "learning",
          name: "Learning",
        },
      ],
      loading: false,
      error: null,
    });

    mockUseTasks.mockReturnValue({
      tasks: [
        {
          id: "task-1",
          category_id: "work",
        },
        {
          id: "task-2",
          category_id: "work",
        },
        {
          id: "task-3",
          category_id: "personal",
        },
      ],
      loading: false,
      error: null,
    });
  });

  it("renders the categories heading", () => {
    render(<CategoriesPage />);

    expect(
      screen.getByRole("heading", {
        name: "Categories",
      }),
    ).toBeInTheDocument();
  });

  it("renders the create category button", () => {
    render(<CategoriesPage />);

    expect(
      screen.getByRole("button", {
        name: "+ Create category",
      }),
    ).toBeInTheDocument();
  });

  it("renders all category cards", () => {
    render(<CategoriesPage />);

    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Health")).toBeInTheDocument();
    expect(screen.getByText("Learning")).toBeInTheDocument();
  });

  it("calculates task counts from the loaded tasks", () => {
    render(<CategoriesPage />);

    expect(screen.getByText("2 tasks")).toBeInTheDocument();
    expect(screen.getByText("1 task")).toBeInTheDocument();
  });

  it("shows the empty state when there are no categories", () => {
    mockUseCategories.mockReturnValue({
      categories: [],
      loading: false,
      error: null,
    });

    render(<CategoriesPage />);

    expect(screen.getByText("No categories yet")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Create category",
      }),
    ).toBeInTheDocument();
  });

  it("shows an error when categories fail to load", () => {
    mockUseCategories.mockReturnValue({
      categories: [],
      loading: false,
      error: "Unable to load categories.",
    });

    render(<CategoriesPage />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load categories.",
    );
  });
});