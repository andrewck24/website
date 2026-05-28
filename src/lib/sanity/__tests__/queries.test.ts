import { getAvailableAboutLocalesQuery } from "@/lib/sanity/queries";

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
