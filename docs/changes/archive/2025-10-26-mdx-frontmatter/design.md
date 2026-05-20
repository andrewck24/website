# Design: MDX Frontmatter Unification

## Summary

Extract a shared `baseArticleSchema` in `source.config.ts`; derive TypeScript types from Zod via `z.infer<>`; add `tags` with Fumadocs Orama integration; add Article Info sidebar at ≥ 1024 px; extract Navbar to standalone component.

## Architecture Decisions

**Schema hierarchy** (`source.config.ts`):

```ts
const baseArticleSchema = frontmatterSchema.extend({
  imageType: z.enum(["static", "generated"]).default("generated"),
  tags: z.array(z.string()).optional(),
});

const projectSchema = baseArticleSchema.extend({
  github: z.string().url().optional(),
  demo: z.string().url().optional(),
});

const noteSchema = baseArticleSchema; // no project links
```

**Type inference** (`src/types/article.ts`):

```ts
type BaseArticle = z.infer<typeof baseArticleSchema>;
type ProjectArticle = z.infer<typeof projectSchema>;
type NoteArticle = z.infer<typeof noteSchema>;
```

**`imageType` required**: Zod `default('generated')` ensures runtime safety; component props mark it required.

**Tag system**: `tags` field maps to Fumadocs Orama `tag` index. Tag index built at compile time via `createSearchAPI` in `src/lib/search.ts`.

**Article Info sidebar**:

- Component: `src/components/article/ArticleInfo.tsx`
- Layout: `lg:grid-cols-[1fr_240px]` on detail page wrapper
- Contents: publication date, `LanguageToggle`, tag badges, GitHub/Demo buttons (Projects only)
- Mobile: inline below article title

**Navbar refactoring**:

- New: `src/components/layouts/navbar.tsx` (extracted from `home/index.tsx`)
- Layout prop `hideLanguageToggle?: boolean` threads down to Navbar
- Notes layout: `<Layout hideLanguageToggle>`; Projects layout: `<Layout hideLanguageToggle>`

## Test Scenarios

1. Notes article with `tags: ["TypeScript"]` → Orama tag filter shows TypeScript option
2. Project detail at 1280 px → right sidebar with date, tags, GitHub, Demo
3. Note detail at 1280 px → right sidebar with date, tags (no GitHub/Demo)
4. Notes layout → Navbar language toggle absent from DOM
