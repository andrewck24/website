import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "resumePdfZh",
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
  ],
});
