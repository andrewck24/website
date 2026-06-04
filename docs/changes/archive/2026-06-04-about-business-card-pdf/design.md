## Context

The About page currently renders `PersonalInfo` as a sticky aside on large viewports (`lg:flex-row`) and a stacked header on small viewports. The component has three social icon-only buttons outside the gradient card, no resume download, and is a server component. The Sanity `about` schema has no file fields.

The page serves as the primary professional identity surface for recruiters and collaborators. Adding a downloadable resume completes the "contact surface" on this page.

## Goals / Non-Goals

**Goals:**

- Move all social links and the PDF dialog trigger inside the gradient card
- Replace the two-column desktop layout with a single-column stack on all viewports
- Add resume PDF download via a dialog sourced from a global Sanity `siteSettings` singleton
- Support a shareable `?resume=open` URL that auto-opens the dialog
- Remove article border and padding on mobile for improved reading comfort

**Non-Goals:**

- ~~Scroll-aware collapsed sticky header~~ — implemented and removed; see pitfall documentation below
- Animated text morphing
- Per-locale PDF selection in the dialog UI (dialog always shows all available PDFs by language label)
- Inline PDF preview (`<iframe>` or `react-pdf`)
- PDF generation from page content
- Changing the gradient card's visual appearance (colours, border-radius) in this change
- Migrating social icon styling to the new design system (deferred to future changes)

## Decisions

### Collapsed sticky header: attempted and removed _(pitfall record)_

This feature was implemented, debugged through three iterations, and ultimately removed due to irresolvable scroll feedback. The full pitfall record is preserved here for future reference (e.g. volleybro user page).

**Iteration 1 — IntersectionObserver with sentinel inside wrapper:**
The sentinel `<div className="h-0" />` was placed as the first child of the sticky wrapper. When the wrapper received `position: sticky` and moved to the top of the viewport, the sentinel moved with it, re-entering the viewport. This flipped `isIntersecting` back to `true`, removing the sticky state, which caused the sentinel to scroll back out, re-triggering collapse — infinite flicker loop.

**Iteration 2 — Sentinel as Fragment sibling before wrapper:**
Moving the sentinel outside the wrapper (as a preceding sibling via React Fragment) broke the first loop. However, a second flicker appeared at very small scroll values: the `h-0` sentinel with `threshold: 0` has an unstable intersection boundary condition, and the parent's `gap-4` flex layout caused micro-shifts of the sentinel when the card height changed.

**Iteration 3 — Replaced IntersectionObserver with scroll event:**
`triggerY = wrapper.getBoundingClientRect().top + window.scrollY - navBottom` is computed once at mount. A passive `window` scroll listener compares `window.scrollY` against `triggerY`. Since `window.scrollY` is independent of DOM layout changes, the logic cannot oscillate. However, flickering persisted.

**Root cause — browser scroll anchoring:**
When the card collapsed (height ~200px → ~60px), the article below shifted up by ~140px. The browser's scroll anchoring algorithm detected the shift and adjusted `window.scrollY` downward by ~140px to maintain the article's visual position. This pushed `scrollY` below `triggerY`, expanding the card. The height recovered, scroll anchoring compensated upward, `scrollY` crossed `triggerY` again — the same loop, now driven by the browser rather than IntersectionObserver.

Adding `html { overflow-anchor: none; }` to `globals.css` broke the loop, and the sticky effect appeared to work. However, visual quality remained poor: the card's height change caused a jarring layout jump on every collapse/expand transition.

**Decision: remove the feature entirely.** The static BusinessCard is simpler, more robust, and visually cleaner. If a collapsed sticky header is revisited in a future change (e.g. volleybro), the recommended approach is to avoid changing the element's layout height on collapse — use a fixed-height outer wrapper or CSS `max-height` + `overflow: hidden` with transitions to keep the document flow stable.

### siteSettings singleton for resume PDFs

Resume PDFs are locale-independent assets (a Traditional Chinese, English, and Japanese résumé exist regardless of which locale page the visitor is on). Placing them on each per-locale `about` document would require uploading the same file three times.

A new `siteSettings` singleton document type holds `resumePdfTw`, `resumePdfEn`, and `resumePdfJa` as optional `file` fields. The singleton is enforced via `__experimental_actions: ['update']` (no create/delete in Studio).

A separate `getSiteSettingsQuery` fetches the three URLs. The About page fetches `about` and `siteSettings` in parallel via `Promise.all`.

GROQ dereference pattern:

```groq
*[_type == "siteSettings"][0] {
  "resumePdfTwUrl": resumePdfTw.asset->url,
  "resumePdfEnUrl": resumePdfEn.asset->url,
  "resumePdfJaUrl": resumePdfJa.asset->url
}
```

When a field is unset, the projection returns `null`.

### searchParams: client useSearchParams with Suspense over server searchParams prop

The About page uses `generateStaticParams` and is statically generated. Accessing `searchParams` in the Server Component page would force Next.js to mark the route as dynamic (per-request render), abandoning static generation and degrading performance for all visitors.

The correct approach is `useSearchParams()` in a client component wrapped in `<Suspense fallback={<ResumeTriggerSkeleton />}>`:

- During static generation: the Suspense boundary renders the skeleton (visible before hydration)
- After JS hydration: the component reads actual searchParams and renders the trigger
- On `?resume=open`: dialog opens client-side without any server involvement

This preserves static generation while fully supporting the shareable URL feature. The trade-off (trigger absent in no-JS environments) is acceptable for an interactive element.

### About page layout: single-column on all breakpoints

Remove `lg:flex-row` from the page wrapper. BusinessCard renders full-width above the article on all viewports. The article retains its prose card styling minus the border and mobile padding.

### Article styling: remove border and reduce mobile padding

The article card currently has `border border-border rounded-2xl px-4 py-12 lg:px-8`. Remove the border entirely and change to `px-0 py-6 lg:px-8 lg:py-12` so mobile content spans full width.

## Implementation Contract

**BusinessCard component (`src/components/about/business-card.tsx`)**

Static client component. No `useEffect`, no `useRef` (beyond what child components need), no scroll listeners.

Props:

```ts
interface BusinessCardProps {
  lang: "zh-TW" | "en" | "ja";
  pdfUrls: { tw: string | null; en: string | null; ja: string | null };
}
```

The gradient card (`from-gradient-3 to-gradient-5 bg-linear-to-br`) contains `<h1>` (name), `<p>` (title), and a bottom row with GitHub, LinkedIn, Cake icon buttons and the `ResumeDialogTrigger`. When all three `pdfUrls` values are null, `ResumeDialogTrigger` is not rendered.

**ResumeDialogTrigger component (`src/components/about/resume-dialog-trigger.tsx`)**

Renamed from `ResumeDialogWithParams`. Renders `<Suspense fallback={<ResumeTriggerSkeleton />}>` wrapping `ResumeDialogTriggerInner` (renamed from `ResumeDialogWithParamsInner`).

`ResumeDialogTriggerInner` calls `useSearchParams()`, derives `openedViaParam = searchParams.get('resume') === 'open'`, passes `open` state and `onOpenChange` to `ResumeDialog`, and calls `router.replace(pathname, { scroll: false })` on dialog close when `openedViaParam` was true.

The `DialogTrigger` button renders: `<Button variant="ghost" size="sm"><Download className="..." /> resume</Button>`.

**ResumeDialog component (`src/components/about/resume-dialog.tsx`)**

Controlled dialog. Props: `lang`, `pdfUrls: { tw, en, ja }`, `open`, `onOpenChange`.

i18n table:

| key         | zh-TW        | en                             | ja                      |
| ----------- | ------------ | ------------------------------ | ----------------------- |
| title       | 下載履歷 PDF | Download Resume PDF            | 履歴書PDFをダウンロード |
| description | 選擇語言版本 | Choose your preferred language | 言語を選択してください  |
| tw label    | 中文         | Traditional Chinese            | 台湾華語                |
| en label    | 英文         | English                        | 英語                    |
| ja label    | 日文         | Japanese                       | 日本語                  |

Each link: `target="_blank" rel="noopener noreferrer"`, rendered only when the corresponding URL is non-null.

**siteSettings Sanity schema (`schemas/site-settings.ts`)**

```ts
defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  __experimental_actions: ["update"],
  fields: [
    defineField({
      name: "title",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "resumePdfTw",
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
    defineField({
      name: "resumePdfJa",
      title: "Resume PDF (Japanese)",
      type: "file",
      options: { accept: ".pdf" },
    }),
  ],
});
```

**getSiteSettingsQuery (`src/lib/sanity/queries.ts`)**

```groq
*[_type == "siteSettings"][0] {
  "resumePdfTwUrl": resumePdfTw.asset->url,
  "resumePdfEnUrl": resumePdfEn.asset->url,
  "resumePdfJaUrl": resumePdfJa.asset->url
}
```

**About page (`src/app/(site)/[lang]/about/[[...slug]]/page.tsx`)**

```ts
const [about, siteSettings] = await Promise.all([
  client.fetch(getAboutQuery, { locale }),
  client.fetch(getSiteSettingsQuery),
]);
```

Pass `pdfUrls={{ tw: siteSettings?.resumePdfTwUrl ?? null, en: siteSettings?.resumePdfEnUrl ?? null, ja: siteSettings?.resumePdfJaUrl ?? null }}` to `BusinessCard`.

**Acceptance criteria:**

1. Visiting `/zh-TW/about?resume=open` opens the dialog without clicking the trigger
2. Closing the dialog from a `?resume=open` URL results in `/zh-TW/about` (no param); pressing Back navigates away from the About page
3. Opening the dialog via the trigger does not change the URL
4. When `resumePdfTw` is unset in `siteSettings`, the Traditional Chinese download link is absent from the dialog
5. When all three PDF fields are unset, the PDF trigger button is not rendered
6. `pnpm build` completes without errors; About page is statically generated (not dynamic)
7. On mobile, article content spans full width with no border

## Risks / Trade-offs

- [siteSettings not yet created in dataset] — `getSiteSettingsQuery` returns `null` when no `siteSettings` document exists. The `??` null-coalescing in page.tsx handles this: all `pdfUrls` values default to `null`, and the trigger is simply absent until the document is created in Studio.
- [Suspense boundary] — the `ResumeDialogTrigger` subtree renders a `ResumeTriggerSkeleton` (button-shaped placeholder) during SSR/pre-render; replaced with the actual trigger on hydration. An `ErrorBoundary` wrapping the `<Suspense>` renders `null` on error, silently hiding the trigger.
- [Sanity CDN cache] — with `useCdn: true`, Sanity query results have up to ~2 min CDN cache. The existing `/api/revalidate` webhook mitigates this by triggering Next.js ISR revalidation on Sanity publish events.
