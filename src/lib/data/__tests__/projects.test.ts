import {
  getAllProjects,
  getFeaturedProjects,
  getProject,
  generateProjectStaticParams,
} from "@/lib/data/projects";
import { client } from "@/lib/sanity/client";

jest.mock("../../sanity/client", () => ({
  client: { fetch: jest.fn() },
}));

const mockFetch = client.fetch as jest.Mock;

const makeSanityProject = (overrides = {}) => ({
  title: "Test Project",
  slug: "test-project",
  description: "Test description",
  date: "2025-01-01",
  featured: false,
  order: 1,
  tags: [{ title: "Next.js", slug: "nextjs" }],
  coverImage: null,
  githubUrl: "https://github.com/example/repo",
  demoUrl: null,
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getFeaturedProjects()", () => {
  it("returns featured projects mapped with locale and url", async () => {
    mockFetch.mockResolvedValue([
      makeSanityProject({
        slug: "proj-1",
        title: "Project 1",
        featured: true,
        order: 1,
      }),
      makeSanityProject({
        slug: "proj-2",
        title: "Project 2",
        featured: true,
        order: 2,
      }),
    ]);

    const result = await getFeaturedProjects("zh-TW");

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Project 1");
    expect(result[0].slug).toBe("proj-1");
    expect(result[0].locale).toBe("zh-TW");
    expect(result[0].url).toBe("/zh-TW/projects/proj-1");
    expect(result[0].featured).toBe(true);
  });

  it("returns empty array when no featured projects", async () => {
    mockFetch.mockResolvedValue([]);
    const result = await getFeaturedProjects("en");
    expect(result).toHaveLength(0);
  });

  it("includes project-specific fields", async () => {
    mockFetch.mockResolvedValue([
      makeSanityProject({
        featured: true,
        order: 3,
        githubUrl: "https://github.com/foo",
        demoUrl: "https://demo.foo",
      }),
    ]);

    const result = await getFeaturedProjects("zh-TW");
    expect(result[0].order).toBe(3);
    expect(result[0].githubUrl).toBe("https://github.com/foo");
    expect(result[0].demoUrl).toBe("https://demo.foo");
  });
});

describe("getProject()", () => {
  it("returns ProjectPageData when project exists", async () => {
    const body = [{ _type: "block", children: [] }];
    mockFetch.mockResolvedValue(makeSanityProject({ body }));

    const result = await getProject("zh-TW", "test-project");

    expect(result).not.toBeNull();
    expect(result?.title).toBe("Test Project");
    expect(result?.slug).toBe("test-project");
    expect(result?.locale).toBe("zh-TW");
    expect(result?.url).toBe("/zh-TW/projects/test-project");
    expect(result?.body).toEqual(body);
  });

  it("returns null when project does not exist", async () => {
    mockFetch.mockResolvedValue(null);
    const result = await getProject("zh-TW", "non-existent");
    expect(result).toBeNull();
  });
});

describe("getAllProjects()", () => {
  it("returns all projects mapped with locale and url", async () => {
    mockFetch.mockResolvedValue([
      makeSanityProject({ slug: "proj-1", title: "Project 1" }),
      makeSanityProject({ slug: "proj-2", title: "Project 2" }),
    ]);

    const result = await getAllProjects("ja");

    expect(result).toHaveLength(2);
    expect(result[0].locale).toBe("ja");
    expect(result[0].url).toBe("/ja/projects/proj-1");
  });

  it("returns empty array when no projects", async () => {
    mockFetch.mockResolvedValue([]);
    const result = await getAllProjects("en");
    expect(result).toHaveLength(0);
  });
});

describe("generateProjectStaticParams()", () => {
  it("returns locale and slug pairs", async () => {
    mockFetch.mockResolvedValue([
      { locale: "zh-TW", slug: "proj-1" },
      { locale: "en", slug: "proj-1" },
    ]);

    const result = await generateProjectStaticParams();

    expect(result).toEqual([
      { locale: "zh-TW", slug: "proj-1" },
      { locale: "en", slug: "proj-1" },
    ]);
  });
});
