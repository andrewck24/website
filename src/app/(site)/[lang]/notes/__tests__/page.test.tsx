import { generateMetadata } from "../page";

jest.mock("../../../../../lib/data/notes", () => ({
  getFeaturedNotes: jest.fn().mockResolvedValue([]),
}));

jest.mock("../../../../../components/article", () => ({
  ArticleCard: () => null,
}));

describe("generateMetadata (notes page)", () => {
  it("returns canonical as /zh-TW/notes when lang is zh-TW", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW" }),
    });

    expect(metadata.alternates?.canonical).toBe("/zh-TW/notes");
  });

  it("returns canonical as /en/notes when lang is en", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "en" }),
    });

    expect(metadata.alternates?.canonical).toBe("/en/notes");
  });

  it("returns alternates.languages with zh-TW, en, ja, and x-default", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW" }),
    });

    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(languages["zh-TW"]).toBe("/zh-TW/notes");
    expect(languages["en"]).toBe("/en/notes");
    expect(languages["ja"]).toBe("/ja/notes");
    expect(languages["x-default"]).toBe("/zh-TW/notes");
  });
});
