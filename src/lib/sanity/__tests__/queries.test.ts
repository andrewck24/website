import {
  getAvailableAboutLocalesQuery,
  getAllNotesQuery,
  getAllProjectsQuery,
  getLlmsNotesQuery,
  getLlmsProjectsQuery,
} from "@/lib/sanity/queries";

describe("getAllNotesQuery", () => {
  it("includes _updatedAt field", () => {
    expect(getAllNotesQuery).toContain("_updatedAt");
  });
});

describe("getAllProjectsQuery", () => {
  it("includes _updatedAt field", () => {
    expect(getAllProjectsQuery).toContain("_updatedAt");
  });
});

describe("getLlmsNotesQuery", () => {
  it("is a string", () => {
    expect(typeof getLlmsNotesQuery).toBe("string");
  });

  it("filters by _type note and language en", () => {
    expect(getLlmsNotesQuery).toContain('_type == "note"');
    expect(getLlmsNotesQuery).toContain('language == "en"');
  });

  it("fetches title, slug, and description", () => {
    expect(getLlmsNotesQuery).toContain("title");
    expect(getLlmsNotesQuery).toContain("slug");
    expect(getLlmsNotesQuery).toContain("description");
  });
});

describe("getLlmsProjectsQuery", () => {
  it("is a string", () => {
    expect(typeof getLlmsProjectsQuery).toBe("string");
  });

  it("filters by _type project and language en", () => {
    expect(getLlmsProjectsQuery).toContain('_type == "project"');
    expect(getLlmsProjectsQuery).toContain('language == "en"');
  });

  it("fetches title, slug, and description", () => {
    expect(getLlmsProjectsQuery).toContain("title");
    expect(getLlmsProjectsQuery).toContain("slug");
    expect(getLlmsProjectsQuery).toContain("description");
  });
});

describe("getAvailableAboutLocalesQuery", () => {
  it("is a string", () => {
    expect(typeof getAvailableAboutLocalesQuery).toBe("string");
  });

  it("filters by _type == about", () => {
    expect(getAvailableAboutLocalesQuery).toContain('_type == "about"');
  });

  it("uses defined(language)", () => {
    expect(getAvailableAboutLocalesQuery).toContain("defined(language)");
  });
});
