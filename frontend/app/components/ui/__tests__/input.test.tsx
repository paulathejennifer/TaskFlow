import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "@/app/components/ui/input";

describe("Input", () => {
  it("renders an input", () => {
    render(<Input placeholder="Enter your email" />);

    expect(
      screen.getByPlaceholderText("Enter your email"),
    ).toBeInTheDocument();
  });

  it("supports the disabled state", () => {
    render(<Input disabled placeholder="Disabled input" />);

    expect(
      screen.getByPlaceholderText("Disabled input"),
    ).toBeDisabled();
  });
});