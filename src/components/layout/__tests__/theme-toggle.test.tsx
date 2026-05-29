jest.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: jest.fn(),
    theme: "light",
    resolvedTheme: "light",
  }),
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

describe("ThemeToggle", () => {
  it("renders without crashing", () => {
    const { container } = render(<ThemeToggle />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders a button with aria-label for light-dark mode", () => {
    render(<ThemeToggle mode="light-dark" />);
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it("renders three buttons for light-dark-system mode", () => {
    render(<ThemeToggle mode="light-dark-system" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });
});
