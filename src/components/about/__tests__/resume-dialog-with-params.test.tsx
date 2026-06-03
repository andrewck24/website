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

import { ResumeDialogWithParams } from "../resume-dialog-with-params";
import { useSearchParams } from "next/navigation";

const mockUseSearchParams = useSearchParams as jest.Mock;

describe("ResumeDialogWithParams", () => {
  const defaultProps = {
    lang: "zh-TW" as const,
    pdfUrls: { zh: "https://cdn.sanity.io/files/zh.pdf", en: null },
  };

  it("passes open=false when ?resume param is absent", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    render(
      <Suspense fallback={null}>
        <ResumeDialogWithParams {...defaultProps} />
      </Suspense>
    );
    const dialog = screen.getByTestId("resume-dialog");
    expect(dialog).toHaveAttribute("data-open", "false");
  });

  it("passes open=true when ?resume=open", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("resume=open"));

    render(
      <Suspense fallback={null}>
        <ResumeDialogWithParams {...defaultProps} />
      </Suspense>
    );
    const dialog = screen.getByTestId("resume-dialog");
    expect(dialog).toHaveAttribute("data-open", "true");
  });

  it("renders a trigger button", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    render(
      <Suspense fallback={null}>
        <ResumeDialogWithParams {...defaultProps} />
      </Suspense>
    );
    expect(
      screen.getByRole("button", { name: /pdf|resume|履歷/i })
    ).toBeInTheDocument();
  });
});
