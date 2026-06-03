jest.mock("sanity", () => ({
  defineField: (field: Record<string, unknown>) => field,
  defineType: (type: Record<string, unknown>) => type,
}));

import { about } from "../about";

describe("about schema", () => {
  it("has resumePdfZh field", () => {
    const field = (
      about as { fields: { name: string; type: string }[] }
    ).fields.find((f) => f.name === "resumePdfZh");
    expect(field).toBeDefined();
  });

  it("has resumePdfEn field", () => {
    const field = (
      about as { fields: { name: string; type: string }[] }
    ).fields.find((f) => f.name === "resumePdfEn");
    expect(field).toBeDefined();
  });

  it("resumePdfZh is optional file type", () => {
    const field = (
      about as { fields: { name: string; type: string }[] }
    ).fields.find((f) => f.name === "resumePdfZh");
    expect(field?.type).toBe("file");
  });

  it("resumePdfEn is optional file type", () => {
    const field = (
      about as { fields: { name: string; type: string }[] }
    ).fields.find((f) => f.name === "resumePdfEn");
    expect(field?.type).toBe("file");
  });
});
