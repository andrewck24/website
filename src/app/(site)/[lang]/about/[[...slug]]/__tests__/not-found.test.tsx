jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useParams: jest.fn(),
}));

jest.mock("../../../../../../components/ui/empty", () => ({
  Empty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  EmptyTitle: ({ children }: { children: React.ReactNode }) => (
    <h1>{children}</h1>
  ),
  EmptyContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { useParams } from "next/navigation";
import NotFound from "../not-found";

const mockUseParams = useParams as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockUseParams.mockReturnValue({ lang: "zh-TW" });
});

describe("About NotFound", () => {
  it("renders zh-TW title when locale is zh-TW", () => {
    mockUseParams.mockReturnValue({ lang: "zh-TW" });
    render(<NotFound />);
    expect(screen.getByText("找不到關於頁面")).toBeInTheDocument();
  });

  it("renders en title when locale is en", () => {
    mockUseParams.mockReturnValue({ lang: "en" });
    render(<NotFound />);
    expect(screen.getByText("About page not found")).toBeInTheDocument();
  });

  it("renders ja title when locale is ja", () => {
    mockUseParams.mockReturnValue({ lang: "ja" });
    render(<NotFound />);
    expect(screen.getByText("Aboutページが見つかりません")).toBeInTheDocument();
  });

  it("renders return-to-home link with correct href for en", () => {
    mockUseParams.mockReturnValue({ lang: "en" });
    render(<NotFound />);
    const link = screen.getByText("Back to Home");
    expect(link.closest("a")).toHaveAttribute("href", "/en");
  });

  it("renders return-to-home link with correct href for zh-TW", () => {
    mockUseParams.mockReturnValue({ lang: "zh-TW" });
    render(<NotFound />);
    const link = screen.getByText("返回首頁");
    expect(link.closest("a")).toHaveAttribute("href", "/zh-TW");
  });

  it("falls back to zh-TW when lang param is missing", () => {
    mockUseParams.mockReturnValue({});
    render(<NotFound />);
    expect(screen.getByText("找不到關於頁面")).toBeInTheDocument();
  });
});
