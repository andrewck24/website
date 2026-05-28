## REMOVED Requirements

### Requirement: unified-schema

**Reason**: fumadocs-mdx and `source.config.ts` are removed. Article schema is now defined as Sanity document types in `schemas/note.ts` and `schemas/project.ts`. Field definitions move from Zod to Sanity schema DSL.
**Migration**: See `sanity-content-layer` spec for Sanity document field definitions.

#### Scenario: Schema defined in Sanity not source.config.ts

- **WHEN** the project is built after this change
- **THEN** `source.config.ts` does not exist and article schema is defined solely in `schemas/note.ts` and `schemas/project.ts`

### Requirement: zod-type-inference

**Reason**: Zod schemas were used to infer TypeScript types from fumadocs frontmatter. With Sanity, TypeScript types in `src/types/article.ts` are defined as plain interfaces aligned with the Sanity document shape returned by GROQ queries.
**Migration**: `src/types/article.ts` replaces `z.infer<>` types with explicit TypeScript interfaces. The `baseArticleSchema`, `noteArticleSchema`, and `projectArticleSchema` Zod objects are removed.

#### Scenario: Types are plain interfaces not Zod inferences

- **WHEN** `src/types/article.ts` is imported after this change
- **THEN** `BaseArticle`, `NoteArticle`, and `ProjectArticle` are plain TypeScript interfaces with no Zod dependency

### Requirement: tag-system

**Reason**: The tag system was integrated with fumadocs Orama search for filtering. Orama and fumadocs search are removed in this change. Tags are now stored as Sanity references and fetched via GROQ join queries.
**Migration**: Tag filtering will be re-implemented in the follow-up search change using Sanity reference queries.

#### Scenario: Tags returned as expanded references

- **WHEN** a note or project is fetched via GROQ after this change
- **THEN** the `tags` field is an array of `{ title: string, slug: string }` objects expanded from Sanity references, not Orama-indexed strings

## MODIFIED Requirements

### Requirement: required-image-type

The `coverImage` field SHALL be a Sanity image asset reference (type `image` with `hotspot: true`) in `note` and `project` Sanity document schemas.

The `imageType`, `image` (static path), and `ogImageConfig` fields SHALL be removed from the article type system.

Article components that previously accepted `imageType: "static" | "generated"` SHALL accept a `coverImage` object conforming to the Sanity image reference shape, and use `@sanity/image-url` `urlFor()` to construct display URLs.

#### Scenario: Article card renders cover image

- **WHEN** an `ArticleCard` component receives an article with a `coverImage` Sanity asset reference
- **THEN** the card renders an `<img>` with `src` constructed via `urlFor(coverImage).width(800).url()`

#### Scenario: Missing cover image handled gracefully

- **WHEN** an article has no `coverImage` set
- **THEN** the `ArticleCard` renders without an image element rather than throwing
