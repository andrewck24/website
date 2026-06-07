import { TerminalAnimation } from "@/components/home/hero/terminal-animation";
import { act, render, screen } from "@testing-library/react";

describe("TerminalAnimation", () => {
  it("renders terminal animation component", () => {
    render(<TerminalAnimation />);
    expect(screen.getByTestId("terminal-animation")).toBeInTheDocument();
  });

  it("displays terminal code content", () => {
    jest.useFakeTimers();
    render(<TerminalAnimation />);

    // Advance past the full command-typing → output → ASCII sequence
    act(() => {
      jest.advanceTimersByTime(6000);
    });

    const terminal = screen.getByTestId("terminal-animation");
    expect(terminal.textContent).toContain("npm install andrewck24@latest");
    expect(terminal.textContent).toContain(
      "added andrewck24 in Taipei, Taiwan"
    );
    expect(terminal.textContent).toContain("npm start");
    expect(terminal.textContent).toContain("andrewck24");

    jest.useRealTimers();
  });
});
