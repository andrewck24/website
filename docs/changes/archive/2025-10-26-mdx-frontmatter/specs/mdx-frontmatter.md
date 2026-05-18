# @trace 2025-10-26-mdx-frontmatter

## unified-schema [ADD]

`baseArticleSchema` defined in `source.config.ts` SHALL be shared by Projects and Notes schemas.

Projects schema SHALL extend with optional `github` and `demo` link fields; Notes schema SHALL not include them.

## required-image-type [MODIFY]

`imageType` SHALL be required in all article component interfaces.

## zod-type-inference [MODIFY]

Article TypeScript types SHALL be derived from Zod schemas via `z.infer<>` using `type` aliases.

## tag-system [ADD]

Articles SHALL support a `tags` frontmatter field compatible with Fumadocs Orama tag filtering.

## article-info-sidebar [ADD]

At viewport widths ≥ 1024 px, article detail pages SHALL render a right-column info sidebar displaying date, language toggle, tags, and (for Projects only) GitHub and Demo links.

On viewports < 1024 px, info items SHALL appear inline below the article title.

## navbar-refactoring [ADD]

`Header` SHALL be extracted to `src/components/layouts/navbar.tsx`.

Notes and Projects layouts SHALL be able to disable the Navbar language toggle via `hideLanguageToggle` prop.
