## Context

The About page currently renders `PersonalInfo` as a sticky aside on large viewports (`lg:flex-row`) and a stacked header on small viewports. The component has three social icon-only buttons outside the gradient card, no resume download, and is a server component. The Sanity `about` schema has no file fields.

The page serves as the primary professional identity surface for recruiters and collaborators. Adding a downloadable resume completes the "contact surface" on this page.

## Goals / Non-Goals

**Goals:**

- Move all social links and the PDF dialog trigger inside the gradient card
- Replace the two-column desktop layout with a single-column stack on all viewports
- Add a scroll-aware collapsed sticky header (IntersectionObserver)
- Add resume PDF download via a dialog sourced from Sanity file assets
- Support a shareable `?resume=open` URL that auto-opens the dialog
- Remove article border and padding on mobile for improved reading comfort

**Non-Goals:**

- Animated text morphing during collapse (layout snaps; CSS `transition` handles opacity/sizing)
- Per-locale PDF selection in the dialog UI (dialog always shows all available PDFs by language label)
- Inline PDF preview (`<iframe>` or `react-pdf`)
- PDF generation from page content
- Changing the gradient card's visual appearance (colours, border-radius) in this change
- Migrating social icon styling to the new design system (deferred to future changes)

## Decisions

### Collapsed header: IntersectionObserver over CSS scroll-driven animations

CSS `animation-timeline: scroll()` is unsupported in Firefox and Safari ≤ 25. IntersectionObserver observes a zero-height sentinel element placed as the **first child** of the BusinessCard wrapper (not after it). The observer uses `rootMargin` to offset detection to the navbar bottom edge, so the card snaps exactly when its top reaches the navbar.

The navbar is `position: fixed` with bottom edge at `--navbar-top-gap + --navbar-height = 4.5rem`. Since `rootMargin` only accepts px/%, the value is read dynamically in `useEffect`:

```ts
const navBottom =
  document.querySelector("nav")?.getBoundingClientRect().bottom ?? 72;
// passed as: rootMargin: `-${navBottom}px 0px 0px 0px`
```

When the sentinel exits the offset root, the card wrapper receives `data-collapsed="true"` and CSS transitions handle the visual change. The collapsed card uses `position: sticky; top: calc(var(--navbar-top-gap) + var(--navbar-height))`.

Future migration path: replace with `@supports (animation-timeline: scroll())` once Firefox ships support.

### Sanity two-field approach for resume PDFs

Two separate optional `file` fields (`resumePdfZh`, `resumePdfEn`) rather than a single field or a localised array. Rationale: the About page already has separate per-locale documents; the resume PDFs are not locale-specific content but are indexed by language. Two flat fields keep the Studio UI simple and make conditional rendering in the component trivial.

GROQ dereference pattern: `"resumePdfZhUrl": resumePdfZh.asset->url` returns the CDN URL string directly. When the field is unset, the projection returns `null`.

### searchParams: client useSearchParams with Suspense over server searchParams prop

The About page uses `generateStaticParams` and is statically generated. Accessing `searchParams` in the Server Component page would force Next.js to mark the route as dynamic (per-request render), abandoning static generation and degrading performance for all visitors.

The correct approach is `useSearchParams()` in a client component wrapped in `<Suspense fallback={null}>`:

- During static generation: the Suspense boundary renders `null` (trigger absent from initial HTML)
- After JS hydration: the component reads actual searchParams and renders the trigger
- On `?resume=open`: dialog opens client-side without any server involvement

This preserves static generation while fully supporting the shareable URL feature. The trade-off (trigger absent in no-JS environments) is acceptable for an interactive element.

### About page layout: single-column on all breakpoints

Remove `lg:flex-row` from the page wrapper. `PersonalInfo`/`BusinessCard` renders full-width above the article on all viewports. The article retains its prose card styling minus the border and mobile padding (see article styling decision below). This eliminates the sticky aside behaviour from the page level; the BusinessCard component handles its own sticky collapsed state independently.

### Article styling: remove border and reduce mobile padding

The article card currently has `border border-border rounded-2xl px-4 py-12 lg:px-8`. On mobile, the border and padding add visual noise without improving readability. Remove the border entirely and change to `px-0 py-6 lg:px-8 lg:py-12` so mobile content spans full width.

## Implementation Contract

**BusinessCard component (`src/components/about/business-card.tsx`)**

Props:

```ts
interface BusinessCardProps {
  lang: "zh-TW" | "en" | "ja";
  pdfUrls: { zh: string | null; en: string | null };
}
```

Collapsed state trigger: a `<div data-sentinel className="h-0" />` placed as the **first child** of the BusinessCard wrapper div. A `useEffect` reads `document.querySelector('nav')?.getBoundingClientRect().bottom ?? 72` and creates an `IntersectionObserver` with `{ rootMargin: '-${navBottom}px 0px 0px 0px', threshold: 0 }` observing the sentinel. When `isIntersecting` is false, the wrapper receives `data-collapsed="true"`; when true, the attribute is removed.

Collapsed layout (lg+): `position: sticky; top: calc(var(--navbar-top-gap) + var(--navbar-height)); z-index: 50`; single row — name, title, flex-grow spacer, all icon buttons.
Collapsed layout (< lg): same sticky position; single row — name only, title and buttons hidden.

Click-to-top: when `data-collapsed="true"`, clicking the card calls `window.scrollTo({ top: 0, behavior: 'smooth' })` and adds `cursor-pointer` to the card.

**ResumeDialog component (`src/components/about/resume-dialog.tsx`)**

- Exported as a client component
- Accepts `lang`, `pdfUrls`, and `defaultOpen: boolean` props
- `defaultOpen` is derived from `searchParams.get('resume') === 'open'` in the parent Suspense wrapper
- On close when `defaultOpen` was true: `router.replace(pathname, { scroll: false })`
- Renders zh download link only when `pdfUrls.zh !== null`; same for en
- When both URLs are null, the trigger button is not rendered

**Sanity GROQ query (`getAboutQuery`)**

Must include:

```groq
"resumePdfZhUrl": resumePdfZh.asset->url,
"resumePdfEnUrl": resumePdfEn.asset->url,
```

**Acceptance criteria:**

1. Visiting `/zh-TW/about?resume=open` opens the dialog without clicking the trigger
2. Closing the dialog from a `?resume=open` URL results in `/zh-TW/about` (no param) in the browser bar, and pressing Back goes to the previous non-about page
3. Opening the dialog via the trigger does not change the URL
4. When `resumePdfZh` is unset in Sanity, the Traditional Chinese download link is absent from the dialog
5. When both PDF fields are unset, the PDF trigger button is not rendered
6. The card snaps to collapsed state when its top edge reaches the navbar bottom; clicking it scrolls to top
7. On narrow viewport (< lg), collapsed state shows name only
8. `pnpm build` completes without errors; About page is statically generated (not dynamic)
9. On mobile, article content spans full width with no border

## Risks / Trade-offs

- [IntersectionObserver rootMargin requires px] — `rootMargin` does not accept CSS custom properties; navbar height is read dynamically via `getBoundingClientRect()` in `useEffect`. If the navbar is not yet mounted when the effect runs, the fallback of `72` (= `4.5rem` at 16px root) is used. Mitigation: the effect runs after mount, when the fixed navbar is already in the DOM.
- [Suspense boundary] — the `ResumeDialogWithParams` subtree renders a `ResumeTriggerSkeleton` (button-shaped placeholder) during SSR/pre-render; replaced with the actual trigger on hydration. An `ErrorBoundary` wrapping the `<Suspense>` renders `null` on error (edge case), silently hiding the trigger.
- [Sanity CDN cache] — with `useCdn: true`, Sanity query results have up to ~2 min CDN cache. The existing `/api/revalidate` webhook mitigates this by triggering Next.js ISR revalidation on Sanity publish events.
