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

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { useParams } from "next/navigation";
import NotFound from "../not-found";

const mockUseParams = useParams as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockUseParams.mockReturnValue({ lang: "en", slug: "my-slug" });
});

describe("projects/[slug]/not-found", () => {
  it("renders locale-specific title for 'en'", () => {
    mockUseParams.mockReturnValue({ lang: "en", slug: "my-slug" });
    render(<NotFound />);
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "Project not found"
    );
  });

  it("renders locale-specific title for 'zh-TW'", () => {
    mockUseParams.mockReturnValue({ lang: "zh-TW", slug: "my-slug" });
    render(<NotFound />);
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "找不到這個專案"
    );
  });

  it("renders locale-specific title for 'ja'", () => {
    mockUseParams.mockReturnValue({ lang: "ja", slug: "my-slug" });
    render(<NotFound />);
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "このプロジェクトは見つかりません"
    );
  });

  it("renders 'return to projects' link with correct href for en", () => {
    mockUseParams.mockReturnValue({ lang: "en", slug: "my-slug" });
    render(<NotFound />);
    const backLink = screen.getByRole("link", { name: /back to projects/i });
    expect(backLink).toHaveAttribute("href", "/en/projects");
  });

  it("renders 'return to projects' link with correct href for zh-TW", () => {
    mockUseParams.mockReturnValue({ lang: "zh-TW", slug: "my-slug" });
    render(<NotFound />);
    const backLink = screen.getByRole("link", { name: /返回專案列表/i });
    expect(backLink).toHaveAttribute("href", "/zh-TW/projects");
  });

  it("falls back to zh-TW when lang param is missing", () => {
    mockUseParams.mockReturnValue({});
    render(<NotFound />);
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "找不到這個專案"
    );
  });
});
