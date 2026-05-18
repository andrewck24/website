# Design: About Page

## Summary

MDX-based About page using Fumadocs `defineDocs` collection, served via Next.js App Router at `/[lang]/about`. No custom React timeline components; content is prose MDX with standard Fumadocs UI layout.

## Architecture Decisions

**Content system**: Fumadocs MDX with `defineDocs` (consistent with existing docs infrastructure). Content stored in `content/about/{locale}/index.mdx`. No CMS, no database.

**Routing**: `src/app/[lang]/about/[[...slug]]/page.tsx` with `DocsLayout` reused for consistent chrome.

**i18n**: Fumadocs `defineI18n` (already configured). Three locale files, locale-aware date formatting.

**No timeline component**: MDX prose with semantic HTML (`h2`, `h3`, `ul`) — avoids complex React state, simpler to maintain.

## Implementation Contract

### `source.config.ts` — `about` collection

```ts
export const about = defineDocs({ dir: "content/about" });
```

### `src/lib/source.ts` — `aboutSource` loader

```ts
export const aboutSource = loader({
  baseUrl: "/about",
  source: about.toFumadocsSource(),
  i18n,
});
```

### Page component

- `generateStaticParams`: `aboutSource.generateParams()`
- `generateMetadata`: extract `title`, `description` from page frontmatter
- Not-found: `notFound()` when `aboutSource.getPage(slug, lang)` returns null
- `data-testid="about-page"` on root container

### Navigation

`src/lib/layout.shared.tsx` `baseOptions()` adds locale-aware About link:

```ts
{ type: 'main', text: getAboutText(locale), url: `/${locale}/about` }
```

## Test Scenarios

1. Navigate to `/zh-TW/about` → sections Introduction, Skills, Education, Certifications visible
2. Switch language from zh-TW → en → URL becomes `/en/about`, content in English
3. View on 375 px width → no horizontal scroll, font ≥ 14 px
