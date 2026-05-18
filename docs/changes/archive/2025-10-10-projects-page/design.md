# Design: Projects Page

## Summary

Portfolio Projects section with MDX content managed via fumadocs-mdx, featuring curated homepage cards, project detail pages, and View Transitions API card-to-hero animation.

## Architecture Decisions

**Content**: `content/projects/{locale}/{slug}/index.mdx` with fumadocs-mdx `defineDocs`.

**Featured ordering**: `meta.json` in `content/projects/` controls display order (manual curation).

**View Transitions**: Next.js `experimental.viewTransition: true` in `next.config.ts`. Shared `viewTransitionName` CSS property on card image and detail hero image using the project slug as the unique identifier. Direct-navigation fallback when API is unsupported.

**Responsive card layout (mobile)**:

- Single-column stack
- First card: tall image-above-text (`aspect-ratio: 16/9`, `flex-col`)
- Other cards: standard image-left-text-right (`flex-row`, `aspect-ratio: 4/3`)

## Implementation Contract

### Types (`src/types/project.ts`)

```ts
interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  locale: string;
  order?: number;
}
```

### Data layer

`getFeaturedProjects(locale)` — reads from `projectSource`, returns top 3–5 by `order` field.

`getProject(slug, locale)` — returns single project or null.

### View Transitions

Card image: `style={{ viewTransitionName: `project-hero-${slug}` }}`.
Detail hero: same `viewTransitionName`. Next.js handles the rest.

### Routes

- `/[lang]/projects` — list page
- `/[lang]/projects/[slug]` — detail page

## Test Scenarios

1. Homepage shows 3–5 cards with title, description, image
2. Click card (VT supported) → image animates into detail hero
3. Click card (VT unsupported) → direct navigation to detail page
4. Detail page shows four content sections
