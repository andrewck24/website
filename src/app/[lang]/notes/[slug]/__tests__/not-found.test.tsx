import { render, screen } from "@testing-library/react";
import React from "react";

// Mock next/headers before importing the component
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

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
}));

import { getLocaleFromHeaders } from "../../../../../lib/locale-from-headers";
import { getAvailableLocales } from "../../../../../lib/data/locales";
import { headers } from "next/headers";

const mockGetLocaleFromHeaders = getLocaleFromHeaders as jest.Mock;
const mockGetAvailableLocales = getAvailableLocales as jest.Mock;
const mockHeaders = headers as jest.Mock;

function makeHeadersObj(pathname: string) {
  return {
    get: jest.fn((key: string) => (key === "x-pathname" ? pathname : null)),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockHeaders.mockResolvedValue(makeHeadersObj("/zh-TW/notes/my-note"));
  mockGetLocaleFromHeaders.mockResolvedValue("zh-TW");
  mockGetAvailableLocales.mockResolvedValue(["zh-TW", "en", "ja"]);
});

async function renderNotFound() {
  // Use require to get current module state (mocks are applied at module level)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const NotFound = require("../not-found").default;
  const result = await NotFound();
  render(result as React.ReactElement);
}

describe("NotFound (notes/[slug])", () => {
  it("renders locale-specific title for zh-TW", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("zh-TW");
    mockHeaders.mockResolvedValue(makeHeadersObj("/zh-TW/notes/my-note"));
    await renderNotFound();
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "找不到這篇筆記"
    );
  });

  it("renders locale-specific title for en", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("en");
    mockHeaders.mockResolvedValue(makeHeadersObj("/en/notes/my-note"));
    await renderNotFound();
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "Note not found"
    );
  });

  it("renders locale-specific title for ja", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("ja");
    mockHeaders.mockResolvedValue(makeHeadersObj("/ja/notes/my-note"));
    await renderNotFound();
    expect(screen.getByTestId("empty-title")).toHaveTextContent(
      "このノートは見つかりません"
    );
  });

  it("shows locale switcher buttons only for other locales (not current)", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("zh-TW");
    mockHeaders.mockResolvedValue(makeHeadersObj("/zh-TW/notes/my-note"));
    mockGetAvailableLocales.mockResolvedValue(["zh-TW", "en", "ja"]);
    await renderNotFound();

    expect(screen.getByRole("link", { name: "English" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "日本語" })).toBeInTheDocument();
  });

  it("does NOT show a locale switcher button for the current locale", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("zh-TW");
    mockHeaders.mockResolvedValue(makeHeadersObj("/zh-TW/notes/my-note"));
    mockGetAvailableLocales.mockResolvedValue(["zh-TW", "en", "ja"]);
    await renderNotFound();

    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    // No switcher link should point to /zh-TW/notes/my-note
    expect(hrefs).not.toContain("/zh-TW/notes/my-note");
  });

  it("renders a 'return to notes list' link with correct href", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("zh-TW");
    mockHeaders.mockResolvedValue(makeHeadersObj("/zh-TW/notes/my-note"));
    await renderNotFound();

    const backLink = screen.getByRole("link", { name: /返回筆記列表/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/zh-TW/notes");
  });

  it("shows human-readable locale names in switcher buttons, not raw codes", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("zh-TW");
    mockHeaders.mockResolvedValue(makeHeadersObj("/zh-TW/notes/my-note"));
    mockGetAvailableLocales.mockResolvedValue(["zh-TW", "en", "ja"]);
    await renderNotFound();

    expect(screen.getByRole("link", { name: "English" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "日本語" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "en" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "ja" })).not.toBeInTheDocument();
  });

  it("shows zh-TW display name '繁體中文' when zh-TW is an alternate locale", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("en");
    mockHeaders.mockResolvedValue(makeHeadersObj("/en/notes/my-note"));
    mockGetAvailableLocales.mockResolvedValue(["zh-TW", "en"]);
    await renderNotFound();

    expect(screen.getByRole("link", { name: "繁體中文" })).toBeInTheDocument();
  });

  it("shows switcherLabel when other locales are available", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("en");
    mockHeaders.mockResolvedValue(makeHeadersObj("/en/notes/my-note"));
    mockGetAvailableLocales.mockResolvedValue(["en", "zh-TW"]);
    await renderNotFound();

    expect(
      screen.getByText("This content is also available in:")
    ).toBeInTheDocument();
  });

  it("does NOT show switcherLabel when no other locales are available", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("zh-TW");
    mockHeaders.mockResolvedValue(makeHeadersObj("/zh-TW/notes/my-note"));
    mockGetAvailableLocales.mockResolvedValue(["zh-TW"]);
    await renderNotFound();

    expect(
      screen.queryByText("此內容也提供以下語言版本：")
    ).not.toBeInTheDocument();
  });

  it("renders without crashing when getAvailableLocales throws", async () => {
    mockGetLocaleFromHeaders.mockResolvedValue("zh-TW");
    mockHeaders.mockResolvedValue(makeHeadersObj("/zh-TW/notes/my-note"));
    mockGetAvailableLocales.mockRejectedValue(new Error("fetch failed"));
    await expect(renderNotFound()).resolves.not.toThrow();
    expect(screen.getByTestId("empty-title")).toBeInTheDocument();
  });
});
