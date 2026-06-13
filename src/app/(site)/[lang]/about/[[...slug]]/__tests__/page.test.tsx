import AboutPage, { generateMetadata } from "../page";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("../../../../../../lib/sanity/client", () => ({
  client: { fetch: jest.fn() },
}));

jest.mock("../../../../../../components/about/business-card", () => ({
  BusinessCard: ({
    lang,
    pdfUrls,
  }: {
    lang: string;
    pdfUrls: { tw: string | null; en: string | null; ja: string | null };
  }) =>
    React.createElement("div", {
      "data-testid": "business-card",
      "data-lang": lang,
      "data-pdf-tw": pdfUrls.tw,
      "data-pdf-en": pdfUrls.en,
      "data-pdf-ja": pdfUrls.ja,
    }),
}));

jest.mock("@portabletext/react", () => ({
  PortableText: () => null,
}));

jest.mock("../../../../../../components/mdx/portable-text", () => ({
  portableTextComponents: {},
}));

import { render } from "@testing-library/react";
import React from "react";
import { client } from "../../../../../../lib/sanity/client";
import { notFound } from "next/navigation";

const mockFetch = client.fetch as jest.Mock;
const mockNotFound = notFound as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("generateMetadata", () => {
  it("returns alternates.canonical as /zh-TW/about when lang is zh-TW", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW" }),
    });
    expect(metadata.alternates?.canonical).toBe("/zh-TW/about");
  });

  it("returns alternates.languages with zh-TW, en, ja, and x-default", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW" }),
    });
    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(languages["zh-TW"]).toBe("/zh-TW/about");
    expect(languages["en"]).toBe("/en/about");
    expect(languages["ja"]).toBe("/ja/about");
    expect(languages["x-default"]).toBe("/zh-TW/about");
  });
});

describe("AboutPage", () => {
  it("calls notFound() when Sanity returns null for about", async () => {
    mockFetch
      .mockResolvedValueOnce(null) // about
      .mockResolvedValueOnce(null); // siteSettings

    await expect(
      AboutPage({ params: Promise.resolve({ lang: "en" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockNotFound).toHaveBeenCalled();
  });

  it("renders without calling notFound() when about document exists", async () => {
    mockFetch
      .mockResolvedValueOnce({ title: "About", body: [] })
      .mockResolvedValueOnce(null);

    await expect(
      AboutPage({ params: Promise.resolve({ lang: "zh-TW" }) })
    ).resolves.not.toThrow();

    expect(mockNotFound).not.toHaveBeenCalled();
  });

  it("renders BusinessCard", async () => {
    mockFetch
      .mockResolvedValueOnce({ title: "About", body: [] })
      .mockResolvedValueOnce(null);

    const jsx = await AboutPage({ params: Promise.resolve({ lang: "zh-TW" }) });
    const { queryByTestId } = render(jsx as React.ReactElement);

    expect(queryByTestId("business-card")).toBeInTheDocument();
  });

  it("passes pdfUrls from siteSettings to BusinessCard", async () => {
    mockFetch
      .mockResolvedValueOnce({ title: "About", body: [] })
      .mockResolvedValueOnce({
        resumePdfTwUrl: "https://cdn.sanity.io/files/tw.pdf",
        resumePdfEnUrl: null,
        resumePdfJaUrl: "https://cdn.sanity.io/files/ja.pdf",
      });

    const jsx = await AboutPage({ params: Promise.resolve({ lang: "zh-TW" }) });
    const { getByTestId } = render(jsx as React.ReactElement);

    const card = getByTestId("business-card");
    expect(card.getAttribute("data-pdf-tw")).toBe(
      "https://cdn.sanity.io/files/tw.pdf"
    );
    expect(card.getAttribute("data-pdf-en")).toBeNull();
    expect(card.getAttribute("data-pdf-ja")).toBe(
      "https://cdn.sanity.io/files/ja.pdf"
    );
  });

  it("passes null pdfUrls when siteSettings is null", async () => {
    mockFetch
      .mockResolvedValueOnce({ title: "About", body: [] })
      .mockResolvedValueOnce(null);

    const jsx = await AboutPage({ params: Promise.resolve({ lang: "zh-TW" }) });
    const { getByTestId } = render(jsx as React.ReactElement);

    const card = getByTestId("business-card");
    expect(card.getAttribute("data-pdf-tw")).toBeNull();
    expect(card.getAttribute("data-pdf-en")).toBeNull();
    expect(card.getAttribute("data-pdf-ja")).toBeNull();
  });

  it("article does not have border class", async () => {
    mockFetch
      .mockResolvedValueOnce({ title: "About", body: [] })
      .mockResolvedValueOnce(null);

    const jsx = await AboutPage({ params: Promise.resolve({ lang: "zh-TW" }) });
    const { container } = render(jsx as React.ReactElement);

    const article = container.querySelector("article");
    expect(article?.className).not.toContain("border-border");
    expect(article?.className).toContain("px-0");
    expect(article?.className).toContain("py-6");
  });

  it("page wrapper does not have lg:flex-row class", async () => {
    mockFetch
      .mockResolvedValueOnce({ title: "About", body: [] })
      .mockResolvedValueOnce(null);

    const jsx = await AboutPage({ params: Promise.resolve({ lang: "zh-TW" }) });
    const { getByTestId } = render(jsx as React.ReactElement);

    const wrapper = getByTestId("about-page");
    expect(wrapper.className).not.toContain("lg:flex-row");
  });
});
