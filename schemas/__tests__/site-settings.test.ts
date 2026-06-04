jest.mock("sanity", () => ({
  defineField: (field: Record<string, unknown>) => field,
  defineType: (type: Record<string, unknown>) => type,
}));

import { siteSettings } from "../site-settings";

type Field = { name: string; type: string; options?: { accept?: string } };
type Schema = {
  name: string;
  type: string;
  __experimental_actions: string[];
  fields: Field[];
};

describe("siteSettings schema", () => {
  const schema = siteSettings as unknown as Schema;

  it("has name siteSettings", () => {
    expect(schema.name).toBe("siteSettings");
  });

  it("has type document", () => {
    expect(schema.type).toBe("document");
  });

  it("has __experimental_actions with only update", () => {
    expect(schema.__experimental_actions).toEqual(["update"]);
  });

  it("has resumePdfTw file field", () => {
    const field = schema.fields.find((f) => f.name === "resumePdfTw");
    expect(field).toBeDefined();
    expect(field?.type).toBe("file");
  });

  it("has resumePdfEn file field", () => {
    const field = schema.fields.find((f) => f.name === "resumePdfEn");
    expect(field).toBeDefined();
    expect(field?.type).toBe("file");
  });

  it("has resumePdfJa file field", () => {
    const field = schema.fields.find((f) => f.name === "resumePdfJa");
    expect(field).toBeDefined();
    expect(field?.type).toBe("file");
  });

  it("resumePdfTw accepts only .pdf", () => {
    const field = schema.fields.find((f) => f.name === "resumePdfTw");
    expect(field?.options?.accept).toBe(".pdf");
  });

  it("resumePdfEn accepts only .pdf", () => {
    const field = schema.fields.find((f) => f.name === "resumePdfEn");
    expect(field?.options?.accept).toBe(".pdf");
  });

  it("resumePdfJa accepts only .pdf", () => {
    const field = schema.fields.find((f) => f.name === "resumePdfJa");
    expect(field?.options?.accept).toBe(".pdf");
  });
});
