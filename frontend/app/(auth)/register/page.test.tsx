import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RegisterPage from "./page";

const mockRegister = vi.fn();
const mockPush = vi.fn();

vi.mock("@/app/hooks/use-auth", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    login: vi.fn(),
    register: mockRegister,
    logout: vi.fn(),
    refreshUser: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the registration form", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("heading", {
        name: /create your account/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /create account/i,
      }),
    ).toBeInTheDocument();
  });

  it("submits the user's registration details", async () => {
    const user = userEvent.setup();

    mockRegister.mockResolvedValue(undefined);

    render(<RegisterPage />);

    await user.type(
      screen.getByLabelText(/full name/i),
      "John Doe",
    );

    await user.type(
      screen.getByLabelText(/email/i),
      "john@example.com",
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "TestPassword123!",
    );

    await user.click(
      screen.getByRole("button", {
        name: /create account/i,
      }),
    );

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        full_name: "John Doe",
        email: "john@example.com",
        password: "TestPassword123!",
      });
    });
  });

  it("redirects to the dashboard after successful registration", async () => {
    const user = userEvent.setup();

    mockRegister.mockResolvedValue(undefined);

    render(<RegisterPage />);

    await user.type(
      screen.getByLabelText(/full name/i),
      "John Doe",
    );

    await user.type(
      screen.getByLabelText(/email/i),
      "john@example.com",
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "TestPassword123!",
    );

    await user.click(
      screen.getByRole("button", {
        name: /create account/i,
      }),
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error when registration fails", async () => {
    const user = userEvent.setup();

    mockRegister.mockRejectedValue(
      new Error("A user with this email already exists."),
    );

    render(<RegisterPage />);

    await user.type(
      screen.getByLabelText(/full name/i),
      "John Doe",
    );

    await user.type(
      screen.getByLabelText(/email/i),
      "john@example.com",
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "TestPassword123!",
    );

    await user.click(
      screen.getByRole("button", {
        name: /create account/i,
      }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "A user with this email already exists.",
    );
  });

  it("links to the login page", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("link", { name: /log in/i }),
    ).toHaveAttribute("href", "/login");
  });
});