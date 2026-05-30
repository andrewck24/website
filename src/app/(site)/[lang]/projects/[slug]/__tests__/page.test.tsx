jest.mock("../../../../../../lib/data/projects", () => ({
  getProject: jest.fn(),
  generateProjectStaticParams: jest.fn(),
}));

jest.mock("../../../../../../lib/data/locales", () => ({
  getAvailableLocales: jest.fn(),
}));

jest.mock("../../../../../../components/article", () => ({
  Article: ({ article }: { article: { title: string } }) => (
    <div data-testid="article">{article.title}</div>
  ),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

import { render } from "@testing-library/react";
import { getProject } from "../../../../../../lib/data/projects";
import { getAvailableLocales } from "../../../../../../lib/data/locales";
import ProjectDetailPage, { generateMetadata } from "../page";

const mockGetProject = getProject as jest.Mock;
const mockGetAvailableLocales = getAvailableLocales as jest.Mock;

const fakeProject = {
  title: "My Project",
  description: "A cool project",
  date: "2024-01-01",
  _updatedAt: "2024-06-01",
  tags: [],
  featured: false,
  slug: "my-project",
  locale: "zh-TW",
  url: "/zh-TW/projects/my-project",
  body: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockGetProject.mockResolvedValue(fakeProject);
  mockGetAvailableLocales.mockResolvedValue(["zh-TW", "en"]);
});

describe("projects/[slug]/page — generateMetadata", () => {
  it("returns correct alternates.canonical", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW", slug: "my-project" }),
    });
    expect(metadata.alternates?.canonical).toBe("/zh-TW/projects/my-project");
  });

  it("includes available locales in alternates.languages", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW", slug: "my-project" }),
    });
    expect(metadata.alternates?.languages).toMatchObject({
      "zh-TW": "/zh-TW/projects/my-project",
      en: "/en/projects/my-project",
    });
  });

  it("sets x-default to zh-TW URL when zh-TW is available", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "en", slug: "my-project" }),
    });
    expect(metadata.alternates?.languages).toMatchObject({
      "x-default": "/zh-TW/projects/my-project",
    });
  });

  it("x-default falls back to first available locale when zh-TW is absent", async () => {
    mockGetAvailableLocales.mockResolvedValue(["en", "ja"]);
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "en", slug: "my-project" }),
    });
    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(languages["x-default"]).toBe("/en/projects/my-project");
  });

  it("does NOT include ja when ja is not in available locales", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW", slug: "my-project" }),
    });
    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(languages).not.toHaveProperty("ja");
  });

  it("returns title and description", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ lang: "zh-TW", slug: "my-project" }),
    });
    expect(metadata.title).toBe("My Project");
    expect(metadata.description).toBe("A cool project");
  });
});

describe("projects/[slug]/page — JSON-LD", () => {
  it("renders a script tag with application/ld+json type", async () => {
    const jsx = await ProjectDetailPage({
      params: Promise.resolve({ lang: "zh-TW", slug: "my-project" }),
    });
    render(jsx as React.ReactElement);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
  });

  it("JSON-LD contains @type CreativeWork", async () => {
    const jsx = await ProjectDetailPage({
      params: Promise.resolve({ lang: "zh-TW", slug: "my-project" }),
    });
    render(jsx as React.ReactElement);
    const script = document.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);
    expect(data["@type"]).toBe("CreativeWork");
  });

  it("JSON-LD contains correct name and description", async () => {
    const jsx = await ProjectDetailPage({
      params: Promise.resolve({ lang: "zh-TW", slug: "my-project" }),
    });
    render(jsx as React.ReactElement);
    const script = document.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);
    expect(data.name).toBe("My Project");
    expect(data.description).toBe("A cool project");
  });

  it("JSON-LD contains author Andrew Tseng", async () => {
    const jsx = await ProjectDetailPage({
      params: Promise.resolve({ lang: "zh-TW", slug: "my-project" }),
    });
    render(jsx as React.ReactElement);
    const script = document.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);
    expect(data.author).toEqual({ "@type": "Person", name: "Andrew Tseng" });
  });
});
