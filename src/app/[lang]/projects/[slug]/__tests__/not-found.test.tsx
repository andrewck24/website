import { render, screen } from "@testing-library/react";
import NotFound from "../not-found";

jest.mock("../../../../../lib/locale-from-headers", () => ({
  getLocaleFromHeaders: jest.fn(),
}));

jest.mock("../../../../../lib/data/locales", () => ({
  getAvailableLocales: jest.fn(),
}));

jest.mock("../../../../../components/ui/empty", () => ({
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
  EmptyDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="empty-description">{children}</div>
  ),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue("/en/projects/my-slug"),
  }),
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

import { getLocaleFromHeaders } from "../../../../../lib/locale-from-headers";
import { getAvailableLocales } from "../../../../../lib/data/locales";
import { headers } from "next/headers";

const mockGetLocaleFromHeaders = getLocaleFromHeaders as jest.Mock;
const mockGetAvailableLocales = getAvailableLocales as jest.Mock;
const mockHeaders = headers as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  // Default: English locale, slug = "my-slug"
  mockGetLocaleFromHeaders.mockResolvedValue("en");
  mockHeaders.mockResolvedValue({
    get: jest.fn().mockReturnValue("/en/projects/my-slug"),
  });
});

describe("projects/[slug]/not-found", () => {
  it("renders locale-specific title for 'en'", async () => {
    mockGetAvailableLocales.mockResolvedValue(["en", "zh-TW"]);

    render(await NotFound());

    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "Project not found"
    );
  });

  it("renders locale-specific title for 'zh-TW'", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("zh-TW");
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue("/zh-TW/projects/my-slug"),
    });
    mockGetAvailableLocales.mockResolvedValue(["zh-TW", "en"]);

    render(await NotFound());

    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "找不到這個專案"
    );
  });

  it("renders locale-specific title for 'ja'", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("ja");
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue("/ja/projects/my-slug"),
    });
    mockGetAvailableLocales.mockResolvedValue(["ja"]);

    render(await NotFound());

    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "このプロジェクトは見つかりません"
    );
  });

  it("shows buttons only for other available locales, not the current one", async () => {
    mockGetAvailableLocales.mockResolvedValue(["en", "zh-TW", "ja"]);

    render(await NotFound());

    // "en" is current locale, should NOT appear as a locale switcher link
    const links = screen.getAllByRole("link");
    const localeSwitcherLinks = links.filter(
      (link) =>
        link.getAttribute("href")?.includes("/en/projects/my-slug") &&
        !link.getAttribute("href")?.endsWith("/projects")
    );
    expect(localeSwitcherLinks).toHaveLength(0);

    // zh-TW and ja should appear
    expect(screen.getByRole("link", { name: /zh-TW/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ja/i })).toBeInTheDocument();
  });

  it("does NOT show a button for the current locale", async () => {
    mockGetAvailableLocales.mockResolvedValue(["en", "zh-TW"]);

    render(await NotFound());

    const localeSwitcherLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === "/en/projects/my-slug");
    expect(localeSwitcherLinks).toHaveLength(0);
  });

  it("renders 'return to projects' link with correct href", async () => {
    mockGetAvailableLocales.mockResolvedValue(["en"]);

    render(await NotFound());

    const backLink = screen.getByRole("link", { name: /back to projects/i });
    expect(backLink).toHaveAttribute("href", "/en/projects");
  });

  it("still renders without crashing when getAvailableLocales throws", async () => {
    mockGetAvailableLocales.mockRejectedValue(new Error("Sanity error"));

    // Should not throw
    expect(async () => render(await NotFound())).not.toThrow();

    render(await NotFound());
    expect(screen.getAllByTestId("empty-title")[0]).toHaveTextContent(
      "Project not found"
    );
  });
});
