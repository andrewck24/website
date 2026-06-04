jest.mock("sanity", () => ({
  defineField: (field: Record<string, unknown>) => field,
  defineType: (type: Record<string, unknown>) => type,
}));

import { about } from "../about";

describe("about schema", () => {
  it("does not have resumePdfZh field", () => {
    const field = (about as { fields: { name: string }[] }).fields.find(
      (f) => f.name === "resumePdfZh"
    );
    expect(field).toBeUndefined();
  });

  it("does not have resumePdfEn field", () => {
    const field = (about as { fields: { name: string }[] }).fields.find(
      (f) => f.name === "resumePdfEn"
    );
    expect(field).toBeUndefined();
  });
});
