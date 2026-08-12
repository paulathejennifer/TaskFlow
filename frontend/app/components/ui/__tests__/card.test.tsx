import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/app/components/ui/card";

describe("Card", () => {
  it("renders card content", () => {
    render(
      <Card>
        <CardHeader>Task summary</CardHeader>
        <CardContent>Build the dashboard</CardContent>
      </Card>,
    );

    expect(screen.getByText("Task summary")).toBeInTheDocument();
    expect(
      screen.getByText("Build the dashboard"),
    ).toBeInTheDocument();
  });
});