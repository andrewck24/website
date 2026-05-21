import { defineField, defineType } from "sanity";

export const card = defineType({
  name: "card",
  title: "Card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
