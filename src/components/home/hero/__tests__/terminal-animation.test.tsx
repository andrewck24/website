import { render, screen } from "@testing-library/react";
import { TerminalAnimation } from "../terminal-animation";

describe("TerminalAnimation", () => {
  it("renders terminal animation component", () => {
    render(<TerminalAnimation />);
    expect(screen.getByTestId("terminal-animation")).toBeInTheDocument();
  });

  it("displays terminal code content", () => {
    render(<TerminalAnimation />);

    const terminalCode = screen.getByText(/npm install andrewck24/);
    expect(terminalCode).toBeInTheDocument();
    expect(terminalCode.textContent).toContain("cd andrewck24");
    expect(terminalCode.textContent).toContain("npm run build");
    expect(terminalCode.textContent).toContain("npm start");
    expect(terminalCode.textContent).toContain("Starting server...");
    expect(terminalCode.textContent).toContain(
      "Server started at http://localhost:3000"
    );
    expect(terminalCode.textContent).toContain(
      "AT runtime, where our ideas execute"
    );
  });
});
