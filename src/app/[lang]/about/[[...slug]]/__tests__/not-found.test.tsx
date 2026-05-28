jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  notFound: jest.fn(),
}));

jest.mock("../../../../../lib/locale-from-headers", () => ({
  getLocaleFromHeaders: jest.fn(),
}));

jest.mock("../../../../../lib/data/locales", () => ({
  getAvailableAboutLocales: jest.fn(),
}));

jest.mock("../../../../../components/ui/empty", () => ({
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
import NotFound from "../not-found";
import { getLocaleFromHeaders } from "../../../../../lib/locale-from-headers";
import { getAvailableAboutLocales } from "../../../../../lib/data/locales";

const mockGetLocale = getLocaleFromHeaders as jest.Mock;
const mockGetLocales = getAvailableAboutLocales as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("About NotFound", () => {
  it("renders zh-TW title when locale is zh-TW", async () => {
    mockGetLocale.mockResolvedValue("zh-TW");
    mockGetLocales.mockResolvedValue(["zh-TW", "en"]);

    render(await NotFound());

    expect(screen.getByText("找不到關於頁面")).toBeInTheDocument();
  });

  it("renders en title when locale is en", async () => {
    mockGetLocale.mockResolvedValue("en");
    mockGetLocales.mockResolvedValue(["en", "zh-TW"]);

    render(await NotFound());

    expect(screen.getByText("About page not found")).toBeInTheDocument();
  });

  it("renders ja title when locale is ja", async () => {
    mockGetLocale.mockResolvedValue("ja");
    mockGetLocales.mockResolvedValue(["ja"]);

    render(await NotFound());

    expect(screen.getByText("Aboutページが見つかりません")).toBeInTheDocument();
  });

  it("shows locale buttons only for other available locales", async () => {
    mockGetLocale.mockResolvedValue("en");
    mockGetLocales.mockResolvedValue(["zh-TW", "en"]);

    render(await NotFound());

    expect(screen.getByText("繁體中文")).toBeInTheDocument();
    expect(screen.queryByText("English")).not.toBeInTheDocument();
  });

  it("renders return-to-home link with correct href", async () => {
    mockGetLocale.mockResolvedValue("en");
    mockGetLocales.mockResolvedValue([]);

    render(await NotFound());

    const link = screen.getByText("Back to Home");
    expect(link.closest("a")).toHaveAttribute("href", "/en");
  });

  it("shows human-readable locale names, not raw locale codes", async () => {
    mockGetLocale.mockResolvedValue("en");
    mockGetLocales.mockResolvedValue(["zh-TW", "en", "ja"]);

    render(await NotFound());

    expect(screen.getByText("繁體中文")).toBeInTheDocument();
    expect(screen.getByText("日本語")).toBeInTheDocument();
    expect(screen.queryByText("zh-TW")).not.toBeInTheDocument();
    expect(screen.queryByText("ja")).not.toBeInTheDocument();
  });

  it("shows switcherLabel when other locales are available", async () => {
    mockGetLocale.mockResolvedValue("en");
    mockGetLocales.mockResolvedValue(["zh-TW", "en"]);

    render(await NotFound());

    expect(
      screen.getByText("This content is also available in:")
    ).toBeInTheDocument();
  });

  it("does NOT show switcherLabel when no other locales are available", async () => {
    mockGetLocale.mockResolvedValue("en");
    mockGetLocales.mockResolvedValue(["en"]);

    render(await NotFound());

    expect(
      screen.queryByText("This content is also available in:")
    ).not.toBeInTheDocument();
  });

  it("still renders without crashing when getAvailableAboutLocales throws", async () => {
    mockGetLocale.mockResolvedValue("zh-TW");
    mockGetLocales.mockRejectedValue(new Error("Sanity error"));

    expect(async () => render(await NotFound())).not.toThrow();

    render(await NotFound());
    expect(screen.getAllByText("找不到關於頁面")[0]).toBeInTheDocument();
  });
});
