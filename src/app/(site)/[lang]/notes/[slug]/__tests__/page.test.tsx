jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  notFound: jest.fn(),
}));

jest.mock("../../../../../../lib/data/notes", () => ({
  getNote: jest.fn(),
  generateNoteStaticParams: jest.fn(),
}));

jest.mock("../../../../../../lib/data/locales", () => ({
  getAvailableLocales: jest.fn(),
}));

jest.mock("../../../../../../components/article", () => ({
  Article: () => null,
}));

import { render } from "@testing-library/react";
import { getNote } from "../../../../../../lib/data/notes";
import { getAvailableLocales } from "../../../../../../lib/data/locales";
import Page, { generateMetadata } from "../page";

const mockGetNote = getNote as jest.Mock;
const mockGetAvailableLocales = getAvailableLocales as jest.Mock;

const fakeNote = {
  title: "Test Note",
  description: "Test description",
  date: "2024-01-01",
  _updatedAt: "2024-01-15T00:00:00Z",
  tags: [],
  featured: false,
  slug: "test-slug",
  locale: "zh-TW",
  url: "/zh-TW/notes/test-slug",
  body: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockGetNote.mockResolvedValue(fakeNote);
  mockGetAvailableLocales.mockResolvedValue(["zh-TW", "en"]);
});

describe("generateMetadata", () => {
  it("sets alternates.canonical", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW", slug: "test-slug" }),
    });
    expect(metadata.alternates?.canonical).toBe("/zh-TW/notes/test-slug");
  });

  it("includes only available locale entries in alternates.languages", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW", slug: "test-slug" }),
    });
    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(languages["zh-TW"]).toBe("/zh-TW/notes/test-slug");
    expect(languages["en"]).toBe("/en/notes/test-slug");
  });

  it("always includes x-default pointing to zh-TW", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW", slug: "test-slug" }),
    });
    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(languages["x-default"]).toBe("/zh-TW/notes/test-slug");
  });

  it("does not include unavailable locales (ja)", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW", slug: "test-slug" }),
    });
    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(languages["ja"]).toBeUndefined();
  });
});

describe("Page JSON-LD", () => {
  it("renders a script tag with Article JSON-LD", async () => {
    const { container } = render(
      await Page({
        params: Promise.resolve({ lang: "zh-TW", slug: "test-slug" }),
      })
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent!);
    expect(data["@type"]).toBe("Article");
    expect(data.headline).toBe("Test Note");
    expect(data.datePublished).toBe("2024-01-01");
    expect(data.dateModified).toBe("2024-01-15T00:00:00Z");
    expect(data.author).toEqual({ "@type": "Person", name: "Andrew Tseng" });
  });
});
