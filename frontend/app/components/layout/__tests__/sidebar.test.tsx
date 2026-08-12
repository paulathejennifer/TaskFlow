import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Sidebar } from "@/app/components/layout/sidebar";

const mockPush = vi.fn();
const mockLogout = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/app/hooks/use-auth", () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Sidebar", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const navigation = await import("next/navigation");
    vi.mocked(navigation.usePathname).mockReturnValue("/dashboard");
  });

  it("renders the TaskFlow brand", () => {
    render(<Sidebar />);

    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard",
    );

    expect(screen.getByRole("link", { name: "Tasks" })).toHaveAttribute(
      "href",
      "/tasks",
    );

    expect(
      screen.getByRole("link", { name: "Categories" }),
    ).toHaveAttribute("href", "/categories");
  });

  it("marks the current route as active", () => {
    render(<Sidebar />);

    expect(
      screen.getByRole("link", { name: "Dashboard" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("marks nested task routes as active", async () => {
    const navigation = await import("next/navigation");

    vi.mocked(navigation.usePathname).mockReturnValue("/tasks/123");

    render(<Sidebar />);

    expect(screen.getByRole("link", { name: "Tasks" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("logs out and redirects to login", () => {
    render(<Sidebar />);

    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});