jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useParams: jest.fn(),
}));

jest.mock("../../../../../../components/ui/empty", () => ({
  Empty: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="empty">{children}</div>
  ),
  EmptyHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="empty-header">{children}</div>
  ),
  EmptyTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="empty-title">{children}</div>
  ),
  EmptyContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="empty-content">{children}</div>
  ),
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { useParams } from "next/navigation";
import NotFound from "../not-found";

const mockUseParams = useParams as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockUseParams.mockReturnValue({ lang: "zh-TW", slug: "my-note" });
});

describe("NotFound (notes/[slug])", () => {
  it("renders locale-specific title for zh-TW", () => {
    mockUseParams.mockReturnValue({ lang: "zh-TW", slug: "my-note" });
    render(<NotFound />);
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "找不到這篇筆記"
    );
  });

  it("renders locale-specific title for en", () => {
    mockUseParams.mockReturnValue({ lang: "en", slug: "my-note" });
    render(<NotFound />);
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "Note not found"
    );
  });

  it("renders locale-specific title for ja", () => {
    mockUseParams.mockReturnValue({ lang: "ja", slug: "my-note" });
    render(<NotFound />);
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "このノートは見つかりません"
    );
  });

  it("renders a 'return to notes list' link with correct href for zh-TW", () => {
    mockUseParams.mockReturnValue({ lang: "zh-TW", slug: "my-note" });
    render(<NotFound />);
    const backLink = screen.getByRole("link", { name: /返回筆記列表/i });
    expect(backLink).toHaveAttribute("href", "/zh-TW/notes");
  });

  it("renders a 'return to notes list' link with correct href for en", () => {
    mockUseParams.mockReturnValue({ lang: "en", slug: "my-note" });
    render(<NotFound />);
    const backLink = screen.getByRole("link", { name: /back to notes/i });
    expect(backLink).toHaveAttribute("href", "/en/notes");
  });

  it("falls back to zh-TW when lang param is missing", () => {
    mockUseParams.mockReturnValue({});
    render(<NotFound />);
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "找不到這篇筆記"
    );
  });
});
