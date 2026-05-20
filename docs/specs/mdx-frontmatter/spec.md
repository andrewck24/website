# mdx-frontmatter

## Purpose

A unified MDX frontmatter schema shared by Projects and Notes collections, with type-safe TypeScript inference, tag-based filtering, an Article Info sidebar, and a consolidated Navbar component.

## Capabilities

### unified-schema

The system SHALL define a `baseArticleSchema` in `source.config.ts` shared by both Projects and Notes frontmatter schemas.

Notes schema SHALL extend `baseArticleSchema` without GitHub/Demo link fields.

Projects schema SHALL extend `baseArticleSchema` with optional `github` and `demo` link fields.

### required-image-type

The `imageType` field SHALL be required in all article component interfaces, since `source.config.ts` already provides a default value ensuring runtime safety.

### zod-type-inference

TypeScript interfaces for article components SHALL be derived from Zod schemas via `z.infer<>` rather than defined as separate interfaces.

The system SHALL use `type` aliases (not `interface`) when the type is directly inferred from a Zod schema.

### tag-system

Articles SHALL support a `tags` field in frontmatter compatible with Fumadocs Orama's tag filter.

The tag system SHALL support both suggested tags and author-defined custom tags.

### article-info-sidebar

At viewport widths ≥ 1024px, the Article detail page SHALL render an info sidebar in the right column displaying:

- Publication date
- Language toggle
- Tags
- Project links (GitHub, Live Demo) for Project articles only

On viewports < 1024px, info items SHALL be displayed inline below the article title.

### navbar-refactoring

The `Header` component SHALL be extracted from `src/components/layouts/home/` into `src/components/layouts/navbar.tsx` as a standalone component.

Notes and Projects layout pages SHALL be able to disable the Navbar language toggle via layout props.

##### Example:

| GIVEN                                                 | WHEN                    | THEN                                                                    |
| ----------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------- |
| A Notes MDX file has `tags: ["TypeScript", "React"]`  | Article list page loads | Tag filters for TypeScript and React are available in Orama search      |
| Visitor views a Project detail page at ≥ 1024px width | Page loaded             | Right sidebar shows date, language toggle, tags, GitHub link, Demo link |
| Visitor views a Note detail page at ≥ 1024px width    | Page loaded             | Right sidebar shows date, language toggle, tags (no project links)      |
| Notes layout is rendered                              | Navbar loaded           | Language toggle button in Navbar is hidden                              |
