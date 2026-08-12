import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "@/app/components/ui/badge";

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge>High</Badge>);

    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders the selected variant", () => {
    render(<Badge variant="high">High</Badge>);

    const badge = screen.getByText("High");

    expect(badge.className).toContain("text-danger");
  });
});