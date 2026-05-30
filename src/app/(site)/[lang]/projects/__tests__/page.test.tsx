import { generateMetadata } from "../page";

jest.mock("../../../../../lib/data/projects", () => ({
  getFeaturedProjects: jest.fn().mockResolvedValue([]),
}));

jest.mock("../../../../../components/projects", () => ({
  Projects: () => null,
}));

describe("generateMetadata (projects page)", () => {
  it("returns canonical as /zh-TW/projects when lang is zh-TW", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW" }),
    });

    expect(metadata.alternates?.canonical).toBe("/zh-TW/projects");
  });

  it("returns alternates.languages with zh-TW, en, ja, and x-default", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW" }),
    });

    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(languages["zh-TW"]).toBe("/zh-TW/projects");
    expect(languages["en"]).toBe("/en/projects");
    expect(languages["ja"]).toBe("/ja/projects");
    expect(languages["x-default"]).toBe("/zh-TW/projects");
  });
});
