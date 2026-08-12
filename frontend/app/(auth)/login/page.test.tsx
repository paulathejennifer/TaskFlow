import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginPage from "./page";

const mockLogin = vi.fn();
const mockPush = vi.fn();

vi.mock("@/app/hooks/use-auth", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    login: mockLogin,
    register: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", {
        name: /welcome back/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /log in/i,
      }),
    ).toBeInTheDocument();
  });

  it("submits the user's credentials", async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValue(undefined);

    render(<LoginPage />);

    await user.type(
      screen.getByLabelText(/email/i),
      "test@example.com",
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "TestPassword123!",
    );

    await user.click(
      screen.getByRole("button", {
        name: /log in/i,
      }),
    );

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "TestPassword123!",
      });
    });
  });

  it("shows an error when login fails", async () => {
    const user = userEvent.setup();

    mockLogin.mockRejectedValue(
      new Error("Invalid email or password."),
    );

    render(<LoginPage />);

    await user.type(
      screen.getByLabelText(/email/i),
      "wrong@example.com",
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "wrong-password",
    );

    await user.click(
      screen.getByRole("button", {
        name: /log in/i,
      }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "Invalid email or password.",
    );
  });

  it("links to the register page", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("link", {
        name: /create one/i,
      }),
    ).toHaveAttribute("href", "/register");
  });
});