import { act, render, screen } from "@testing-library/react";
import React, { Suspense } from "react";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useRouter: jest.fn(() => ({ replace: jest.fn() })),
  usePathname: jest.fn(() => "/zh-TW/about"),
}));

const MockResumeDialog = jest.fn(
  ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) =>
    React.createElement("div", {
      "data-testid": "resume-dialog",
      "data-open": String(open),
      onClick: () => onOpenChange?.(false),
    })
);

jest.mock("../resume-dialog", () => ({
  ResumeDialog: (...args: unknown[]) =>
    MockResumeDialog(...(args as Parameters<typeof MockResumeDialog>)),
}));

import { useRouter, useSearchParams } from "next/navigation";
import { ResumeDialogTrigger } from "../resume-dialog-trigger";

const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe("ResumeDialogTrigger", () => {
  beforeEach(() => {
    MockResumeDialog.mockClear();
  });
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

  it("calls router.replace with pathname (no query) when dialog is closed after arriving via ?resume=open", async () => {
    const mockReplace = jest.fn();
    mockUseSearchParams.mockReturnValue(new URLSearchParams("resume=open"));
    mockUseRouter.mockReturnValue({ replace: mockReplace });

    render(
      <Suspense fallback={null}>
        <ResumeDialogTrigger {...defaultProps} />
      </Suspense>
    );

    // Dialog should be open initially
    expect(screen.getByTestId("resume-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );

    // Simulate dialog close (onOpenChange(false))
    await act(async () => {
      screen.getByTestId("resume-dialog").click();
    });

    // Explicitly constructs URL without resume param — required for production static pages
    expect(mockReplace).toHaveBeenCalledWith("/zh-TW/about", { scroll: false });
    // Ensure resume param is absent from the called URL
    const calledUrl = mockReplace.mock.calls[0][0] as string;
    expect(calledUrl).not.toContain("resume");
  });

  it("does NOT call router.replace when dialog is closed without ?resume=open param", async () => {
    const mockReplace = jest.fn();
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    mockUseRouter.mockReturnValue({ replace: mockReplace });

    render(
      <Suspense fallback={null}>
        <ResumeDialogTrigger {...defaultProps} />
      </Suspense>
    );

    await act(async () => {
      screen.getByTestId("resume-dialog").click();
    });

    expect(mockReplace).not.toHaveBeenCalled();
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
