import React, { Suspense } from "react";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useRouter: jest.fn(() => ({ replace: jest.fn() })),
  usePathname: jest.fn(() => "/zh-TW/about"),
}));

jest.mock("../resume-dialog", () => ({
  ResumeDialog: ({ open }: { open: boolean }) =>
    React.createElement("div", {
      "data-testid": "resume-dialog",
      "data-open": String(open),
    }),
}));

import { ResumeDialogTrigger } from "../resume-dialog-trigger";
import { useSearchParams } from "next/navigation";

const mockUseSearchParams = useSearchParams as jest.Mock;

describe("ResumeDialogTrigger", () => {
  const defaultProps = {
    lang: "zh-TW" as const,
    pdfUrls: { tw: "https://cdn.sanity.io/files/tw.pdf", en: null, ja: null },
  };

  it("passes open=false when ?resume param is absent", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    render(
      <Suspense fallback={null}>
        <ResumeDialogTrigger {...defaultProps} />
      </Suspense>
    );
    const dialog = screen.getByTestId("resume-dialog");
    expect(dialog).toHaveAttribute("data-open", "false");
  });

  it("passes open=true when ?resume=open", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("resume=open"));

    render(
      <Suspense fallback={null}>
        <ResumeDialogTrigger {...defaultProps} />
      </Suspense>
    );
    const dialog = screen.getByTestId("resume-dialog");
    expect(dialog).toHaveAttribute("data-open", "true");
  });

  it("renders a trigger button with Download icon and 'resume' label", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    render(
      <Suspense fallback={null}>
        <ResumeDialogTrigger {...defaultProps} />
      </Suspense>
    );
    expect(screen.getByRole("button", { name: /resume/i })).toBeInTheDocument();
  });
});
