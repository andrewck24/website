import { act, render, screen } from "@testing-library/react";
import React, { Suspense } from "react";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
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

import { useSearchParams } from "next/navigation";
import { ResumeDialogTrigger } from "../resume-dialog-trigger";

const mockUseSearchParams = useSearchParams as jest.Mock;

describe("ResumeDialogTrigger", () => {
  let mockReplaceState: jest.SpyInstance;

  beforeEach(() => {
    MockResumeDialog.mockClear();
    mockReplaceState = jest
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    mockReplaceState.mockRestore();
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
    expect(screen.getByTestId("resume-dialog")).toHaveAttribute(
      "data-open",
      "false"
    );
  });

  it("passes open=true when ?resume=open", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("resume=open"));

    render(
      <Suspense fallback={null}>
        <ResumeDialogTrigger {...defaultProps} />
      </Suspense>
    );
    expect(screen.getByTestId("resume-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
  });

  it("calls history.replaceState with clean pathname when dialog is closed after ?resume=open", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("resume=open"));

    render(
      <Suspense fallback={null}>
        <ResumeDialogTrigger {...defaultProps} />
      </Suspense>
    );

    expect(screen.getByTestId("resume-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );

    await act(async () => {
      screen.getByTestId("resume-dialog").click();
    });

    expect(mockReplaceState).toHaveBeenCalledWith(null, "", "/zh-TW/about");
  });

  it("preserves other query params when removing only resume", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("resume=open&x=1"));

    render(
      <Suspense fallback={null}>
        <ResumeDialogTrigger {...defaultProps} />
      </Suspense>
    );

    await act(async () => {
      screen.getByTestId("resume-dialog").click();
    });

    expect(mockReplaceState).toHaveBeenCalledWith(null, "", "/zh-TW/about?x=1");
  });

  it("does NOT call history.replaceState when dialog is closed without ?resume=open", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    render(
      <Suspense fallback={null}>
        <ResumeDialogTrigger {...defaultProps} />
      </Suspense>
    );

    await act(async () => {
      screen.getByTestId("resume-dialog").click();
    });

    expect(mockReplaceState).not.toHaveBeenCalled();
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
