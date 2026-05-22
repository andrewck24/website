import {
  getAllNotes,
  getFeaturedNotes,
  getNote,
  generateNoteStaticParams,
} from "@/lib/data/notes";
import { client } from "@/lib/sanity/client";

jest.mock("../../sanity/client", () => ({
  client: { fetch: jest.fn() },
}));

const mockFetch = client.fetch as jest.Mock;

const makeSanityNote = (overrides = {}) => ({
  title: "Test Note",
  slug: "test-note",
  description: "Test description",
  date: "2025-01-01",
  featured: false,
  tags: [{ title: "TypeScript", slug: "typescript" }],
  coverImage: null,
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getFeaturedNotes()", () => {
  it("returns featured notes mapped with locale and url", async () => {
    mockFetch.mockResolvedValue([
      makeSanityNote({ slug: "note-1", title: "Note 1", featured: true }),
      makeSanityNote({ slug: "note-2", title: "Note 2", featured: true }),
    ]);

    const result = await getFeaturedNotes("zh-TW");

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Note 1");
    expect(result[0].slug).toBe("note-1");
    expect(result[0].locale).toBe("zh-TW");
    expect(result[0].url).toBe("/zh-TW/notes/note-1");
    expect(result[0].featured).toBe(true);
  });

  it("returns empty array when no featured notes", async () => {
    mockFetch.mockResolvedValue([]);
    const result = await getFeaturedNotes("en");
    expect(result).toHaveLength(0);
  });

  it("includes tag objects with title and slug", async () => {
    mockFetch.mockResolvedValue([
      makeSanityNote({
        featured: true,
        tags: [{ title: "React", slug: "react" }],
      }),
    ]);

    const result = await getFeaturedNotes("zh-TW");
    expect(result[0].tags).toEqual([{ title: "React", slug: "react" }]);
  });
});

describe("getNote()", () => {
  it("returns NotePageData when note exists", async () => {
    const body = [{ _type: "block", children: [] }];
    mockFetch.mockResolvedValue(makeSanityNote({ body }));

    const result = await getNote("zh-TW", "test-note");

    expect(result).not.toBeNull();
    expect(result?.title).toBe("Test Note");
    expect(result?.slug).toBe("test-note");
    expect(result?.locale).toBe("zh-TW");
    expect(result?.url).toBe("/zh-TW/notes/test-note");
    expect(result?.body).toEqual(body);
  });

  it("returns null when note does not exist", async () => {
    mockFetch.mockResolvedValue(null);
    const result = await getNote("zh-TW", "non-existent");
    expect(result).toBeNull();
  });

  it("handles missing optional fields", async () => {
    mockFetch.mockResolvedValue({
      title: "Minimal",
      slug: "minimal",
      date: "2025-01-01",
      body: [],
    });
    const result = await getNote("en", "minimal");
    expect(result?.description).toBeUndefined();
    expect(result?.tags).toBeUndefined();
  });
});

describe("getAllNotes()", () => {
  it("returns all notes mapped with locale and url", async () => {
    mockFetch.mockResolvedValue([
      makeSanityNote({ slug: "note-1", title: "Note 1" }),
      makeSanityNote({ slug: "note-2", title: "Note 2" }),
    ]);

    const result = await getAllNotes("ja");

    expect(result).toHaveLength(2);
    expect(result[0].locale).toBe("ja");
    expect(result[0].url).toBe("/ja/notes/note-1");
    expect(result[1].url).toBe("/ja/notes/note-2");
  });

  it("returns empty array when no notes", async () => {
    mockFetch.mockResolvedValue([]);
    const result = await getAllNotes("en");
    expect(result).toHaveLength(0);
  });
});

describe("generateNoteStaticParams()", () => {
  it("returns locale and slug pairs", async () => {
    mockFetch.mockResolvedValue([
      { locale: "zh-TW", slug: "note-1" },
      { locale: "en", slug: "note-1" },
    ]);

    const result = await generateNoteStaticParams();

    expect(result).toEqual([
      { locale: "zh-TW", slug: "note-1" },
      { locale: "en", slug: "note-1" },
    ]);
  });

  it("returns empty array when no notes", async () => {
    mockFetch.mockResolvedValue([]);
    const result = await generateNoteStaticParams();
    expect(result).toHaveLength(0);
  });
});
