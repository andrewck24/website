# Design: Article Components

## Summary

Refactor four project-specific components (`generated-hero`, `featured-project-card`, `project-detail`, `project-detail-image`) into a generic Article component system shared by Projects and Notes, with a unified `ArticleMetadata` type and flexible hero visual modes.

## Architecture Decisions

**Shared type hierarchy** (`src/types/article.ts`):

```ts
type ImageType = "static" | "generated";

interface OGImageConfig {
  background: string; // CSS gradient, hex colour, or image path
}

interface ArticleMetadata {
  title: string;
  description: string;
  date: string;
  locale: string;
  imageType: ImageType;
  image?: string; // used when imageType === 'static'
  ogImage?: OGImageConfig; // used when imageType === 'generated'
  tags?: string[];
}
```

**Hero visual resolution** (runtime logic):

1. `imageType === 'static'` → render `<img src={image}>`
2. `imageType === 'generated'` → render div with `ogImage.background` as CSS `background`
3. Invalid/missing → fall back to default gradient

**Component set** (`src/components/article/`):

- `ArticleHero` — renders hero visual (both modes)
- `ArticleCard` — Hero and Compact variants controlled by `variant` prop
- `ArticleDetail` — detail page shell

**Open Graph image**: Next.js `ImageResponse` receives `ArticleMetadata`; applies same background resolution logic.

**Notes section**: Mirror Projects routing pattern at `/[lang]/notes/[slug]`. Featured notes on homepage reuses `ArticleCard` with `variant="hero"` / `variant="compact"`.

## Test Scenarios

1. Article with `imageType: generated`, gradient background → gradient shown on card and detail
2. Article with invalid image path → default gradient fallback
3. Notes article in three languages → correct locale content, consistent hero visual
