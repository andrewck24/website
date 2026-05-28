import {
  getAvailableAboutLocales,
  getAvailableLocales,
} from "@/lib/data/locales";
import { client } from "@/lib/sanity/client";

jest.mock("../../sanity/client", () => ({
  client: { fetch: jest.fn() },
}));

const mockFetch = client.fetch as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getAvailableLocales()", () => {
  it("returns locales for a slug that exists in multiple languages", async () => {
    mockFetch.mockResolvedValue(["zh-TW", "en"]);

    const result = await getAvailableLocales("react-hooks-guide", "notes");

    expect(result).toEqual(["zh-TW", "en"]);
  });

  it("returns all three locales when document exists in all languages", async () => {
    mockFetch.mockResolvedValue(["zh-TW", "en", "ja"]);

    const result = await getAvailableLocales("portfolio-website", "projects");

    expect(result).toEqual(["zh-TW", "en", "ja"]);
  });

  it("returns empty array when slug has no documents", async () => {
    mockFetch.mockResolvedValue([]);

    const result = await getAvailableLocales("non-existent", "notes");

    expect(result).toHaveLength(0);
  });

  it("passes correct _type for notes content type", async () => {
    mockFetch.mockResolvedValue(["zh-TW"]);

    await getAvailableLocales("some-note", "notes");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ type: "note", slug: "some-note" })
    );
  });

  it("passes correct _type for projects content type", async () => {
    mockFetch.mockResolvedValue(["zh-TW"]);

    await getAvailableLocales("some-project", "projects");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ type: "project", slug: "some-project" })
    );
  });
});

describe("getAvailableAboutLocales()", () => {
  it("returns locales when about documents exist in multiple languages", async () => {
    mockFetch.mockResolvedValue(["zh-TW", "en"]);

    const result = await getAvailableAboutLocales();

    expect(result).toEqual(["zh-TW", "en"]);
  });

  it("returns all three locales when about exists in all languages", async () => {
    mockFetch.mockResolvedValue(["zh-TW", "en", "ja"]);

    const result = await getAvailableAboutLocales();

    expect(result).toEqual(["zh-TW", "en", "ja"]);
  });

  it("returns empty array when no about documents exist", async () => {
    mockFetch.mockResolvedValue([]);

    const result = await getAvailableAboutLocales();

    expect(result).toHaveLength(0);
  });

  it("calls fetch with no extra params (no slug needed)", async () => {
    mockFetch.mockResolvedValue(["zh-TW"]);

    await getAvailableAboutLocales();

    expect(mockFetch).toHaveBeenCalledWith(expect.any(String));
  });
});
