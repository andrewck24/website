import { defineField } from "sanity";
import type { SchemaTypeDefinition } from "sanity";

export const siteSettings = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  __experimental_actions: ["update"],
  fields: [
    defineField({
      name: "title",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "resumePdfTw",
      title: "Resume PDF (Traditional Chinese)",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "resumePdfEn",
      title: "Resume PDF (English)",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "resumePdfJa",
      title: "Resume PDF (Japanese)",
      type: "file",
      options: { accept: ".pdf" },
    }),
  ],
} as unknown as SchemaTypeDefinition;
