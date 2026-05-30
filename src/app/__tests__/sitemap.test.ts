jest.mock("../../lib/data/notes", () => ({
  getAllNotes: jest.fn(),
}));

jest.mock("../../lib/data/projects", () => ({
  getAllProjects: jest.fn(),
}));

import { getAllNotes } from "../../lib/data/notes";
import { getAllProjects } from "../../lib/data/projects";
import sitemap from "../sitemap";

const mockGetAllNotes = getAllNotes as jest.Mock;
const mockGetAllProjects = getAllProjects as jest.Mock;

const fakeNote = {
  title: "Test Note",
  slug: "test-note",
  _updatedAt: "2024-03-01T10:00:00Z",
  locale: "zh-TW",
  url: "/zh-TW/notes/test-note",
  date: "2024-03-01",
  tags: [],
  featured: false,
  body: [],
};

const fakeProject = {
  title: "Test Project",
  slug: "test-project",
  _updatedAt: "2024-04-15T12:00:00Z",
  locale: "en",
  url: "/en/projects/test-project",
  date: "2024-04-01",
  tags: [],
  featured: false,
  body: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockGetAllNotes.mockResolvedValue([fakeNote]);
  mockGetAllProjects.mockResolvedValue([fakeProject]);
});

describe("sitemap", () => {
  it("includes a notes URL for a published note", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(
      "https://andrewck24.vercel.app/zh-TW/notes/test-note"
    );
  });

  it("includes a projects URL for a published project", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(
      "https://andrewck24.vercel.app/en/projects/test-project"
    );
  });

  it("uses _updatedAt for note lastModified", async () => {
    const entries = await sitemap();
    const noteEntry = entries.find((e) =>
      e.url.includes("/zh-TW/notes/test-note")
    );
    expect(noteEntry?.lastModified).toEqual(new Date("2024-03-01T10:00:00Z"));
  });

  it("uses _updatedAt for project lastModified (not build time)", async () => {
    const entries = await sitemap();
    const projectEntry = entries.find((e) =>
      e.url.includes("/en/projects/test-project")
    );
    expect(projectEntry?.lastModified).toEqual(
      new Date("2024-04-15T12:00:00Z")
    );
  });

  it("lastModified values differ between documents", async () => {
    const entries = await sitemap();
    const noteEntry = entries.find((e) =>
      e.url.includes("/zh-TW/notes/test-note")
    );
    const projectEntry = entries.find((e) =>
      e.url.includes("/en/projects/test-project")
    );
    expect(noteEntry?.lastModified).not.toEqual(projectEntry?.lastModified);
  });
});
