import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Textarea } from "@/app/components/ui/textarea";

describe("Textarea", () => {
  it("renders a textarea", () => {
    render(<Textarea placeholder="Enter a description" />);

    expect(
      screen.getByPlaceholderText("Enter a description"),
    ).toBeInTheDocument();
  });

  it("supports the disabled state", () => {
    render(<Textarea disabled placeholder="Disabled textarea" />);

    expect(
      screen.getByPlaceholderText("Disabled textarea"),
    ).toBeDisabled();
  });
});