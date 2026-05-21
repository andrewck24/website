## 1. Sanity Project Setup

- [x] 1.1 Install Sanity packages and configure environment: run `pnpm create sanity@latest` to create the Sanity project and obtain `SANITY_PROJECT_ID` and `SANITY_DATASET`; install `next-sanity`, `@sanity/client`, `@sanity/image-url`, `@sanity/document-internationalization`, `@sanity/code-input`, and `@portabletext/react`; add all required env vars to `.env.local`. Verified by: `pnpm list next-sanity @sanity/client` shows packages installed; `.env.local` contains `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`.

- [x] 1.2 Create Sanity client and image helper utilities: `src/lib/sanity/client.ts` exports a configured `@sanity/client` instance with `projectId`, `dataset`, `apiVersion`, `useCdn: true`; `src/lib/sanity/image.ts` exports a `urlFor(source)` helper using `@sanity/image-url`. Verified by: TypeScript compilation passes (`pnpm type-check`); `urlFor` can be imported in data layer files.

## 2. Sanity Schema — Document Types

- [x] 2.1 [P] Create `schemas/tag.ts` to implement the Tags as Array of Reference to Tag Document decision: the `tag` document type has `title` (string, required) and `slug` (slug, `source: "title"`, required) fields. Verified by: Studio loads with `tag` in the document list and enforces required fields on publish attempt.

- [x] 2.2 [P] Create `schemas/block/card.ts`: the `card` object type has `title` (string, required) and `href` (url, required) fields; this type is registered as a custom block in Portable Text arrays. Verified by: Studio Portable Text editor shows "Insert Card" option; card block saves title and href correctly.

- [x] 2.3 Create `schemas/note.ts` (depends on 2.1, 2.2): the `note` document type implements the Sanity document schema with fields `title`, `slug`, `description`, `date`, `tags` (array of reference to `tag`), `featured` (boolean, default false), `coverImage` (image with hotspot), and `body` (Portable Text array including `block`, `code` via `@sanity/code-input`, and `card` custom block). Verified by: Studio creates a note with all fields, tags reference correctly, code block shows language selector.

- [x] 2.4 Create `schemas/project.ts` (depends on 2.1, 2.2): the `project` document type extends note fields with `githubUrl` (url, optional), `demoUrl` (url, optional), and `order` (number 1–99, optional). Verified by: Studio creates a project with note fields plus the three additional fields.

- [x] 2.5 Create `schemas/about.ts` implementing the About as Singleton Document decision: the `about` singleton document has `title` (string) and `body` (Portable Text array); Studio structure is configured to show about as a singleton (one entry per locale, no create/delete). Verified by: Studio shows `about` as a singleton entry, not as a list.

- [x] 2.6 Create `schemas/index.ts` and `sanity.config.ts` (depends on 2.1–2.5) to fulfil the Sanity document schemas and Sanity Schema Contract requirements: `schemas/index.ts` exports all schema types; `sanity.config.ts` registers all schemas, enables `@sanity/document-internationalization` plugin (implementing Document-level i18n over field-level i18n decision) with `supportedLanguages: ["zh-TW", "en", "ja"]` applied to `note`, `project`, and `about`, and enables `@sanity/code-input`. Verified by: Studio loads all four document types; each has a language selector injected by the i18n plugin satisfying the Document-level i18n requirement.

## 3. Sanity Studio Embedded Route

- [x] 3.1 Create `src/app/studio/[[...tool]]/page.tsx` fulfilling the Sanity Studio embedded at /studio requirement and Studio Route Contract: render `<NextStudio config={config} />` from `next-sanity`; add studio path exception to the i18n middleware in `src/proxy.ts` (or `src/middleware.ts`) so the studio route is not locale-prefixed. Verified by: `GET /studio` returns HTTP 200 and the Sanity Studio UI loads in the browser; navigating to `/studio` does not redirect to `/zh-TW/studio`.

## 4. Content Migration

- [ ] 4.1 [P] Migrate `about` multilingual-content to Sanity Studio: create one singleton `about` document per locale (zh-TW, en, ja) in Studio, re-entering content from `content/about/zh-TW/index.mdx`, `content/about/en/index.mdx`, `content/about/ja/index.mdx` as Portable Text. Verified by: Studio shows three linked `about` documents; each locale's body content matches the original MDX.

- [ ] 4.2 [P] Migrate `notes` content to Sanity Studio: create linked multilingual `note` documents for each existing note (zh-TW, en, ja versions) using content from `content/notes/*/index.mdx`; set `slug`, `date`, `tags`, `featured`, and `body` fields. Verified by: Studio shows note documents with correct language linking and shared slug.

- [ ] 4.3 [P] Migrate `projects` content to Sanity Studio: create `project` documents for each of the three existing projects (`music-hits`, `portfolio-website`, `volleybro`) in all available locales; set `order`, `featured`, `coverImage`, `githubUrl`, `demoUrl`, and `body` fields. Verified by: Studio shows project documents with correct language linking and cover images uploaded.

- [ ] 4.4 Update `portfolio-website` project content to reflect the post-migration tech stack in all three locales: the current zh-TW body references fumadocs and SSG (「Next.js 與 Fumadocs 為核心架構，透過靜態頁面生成（SSG）」) which will be inaccurate after this change; when entering the Sanity document for `portfolio-website`, rewrite the body to reference Sanity.io and ISR instead, and update `tags` to remove `"fumadocs"` and add `"sanity"`; write corresponding en and ja body versions (currently absent from `content/projects/en/` and `content/projects/ja/`). Verified by: Sanity Studio shows three linked `portfolio-website` documents; zh-TW/en/ja body text describes Sanity.io + ISR and no longer references fumadocs or SSG; `tags` field does not contain `"fumadocs"`.

## 5. GROQ Queries and Data Layer

- [ ] 5.1 Create `src/lib/sanity/queries.ts` implementing GROQ-based data fetching: defines GROQ query strings as named constants for `getNoteQuery`, `getFeaturedNotesQuery`, `generateNoteStaticParamsQuery`, `getProjectQuery`, `getFeaturedProjectsQuery`, `generateProjectStaticParamsQuery`, and `getAboutQuery`. Each query expands `tags[]->{ title, "slug": slug.current }` and includes `coverImage`. Verified by: TypeScript compilation passes; query constants are importable from the data layer.

- [ ] 5.2 Update `src/types/article.ts` to remove unified-schema Zod definitions and fulfil the zod-type-inference removal: delete `fumadocs-mdx/config` import and all Zod schema objects (`baseArticleSchema`, `noteArticleSchema`, `projectArticleSchema`); replace with plain TypeScript interfaces `BaseArticle`, `NoteArticle`, `ProjectArticle` aligned with Sanity GROQ response shape (implementing the tag-system reference shape `{ title, slug }`); update `NotePageData.body` type from `ComponentType<MDXProps>` to `PortableTextBlock[]` and remove required-image-type fields (`imageType`, `image`, `ogImageConfig`). Verified by: `pnpm type-check` passes; no fumadocs imports remain in the file.

- [ ] 5.3 [P] Rewrite `src/lib/data/notes.ts` preserving the Data Layer Interface (unchanged externally): implement `getNote`, `getFeaturedNotes`, `getAllNotes`, and `generateNoteStaticParams` using `@sanity/client` and GROQ queries from `queries.ts`; remove all fumadocs source loader imports; function signatures MUST remain identical to the existing interface. Verified by: `pnpm type-check` passes; `/zh-TW/notes` page renders featured notes from Sanity; `/zh-TW/notes/[slug]` renders note body via Portable Text.

- [ ] 5.4 [P] Rewrite `src/lib/data/projects.ts` to support projects-page multilingual-content from Sanity: implement `getProject`, `getFeaturedProjects`, and `generateProjectStaticParams` using Sanity client and GROQ; remove fumadocs source loader imports. Verified by: `pnpm type-check` passes; `/zh-TW/projects` page renders featured projects from Sanity in all three locales.

- [ ] 5.5 [P] Rewrite `src/lib/data/locales.ts`: replace fumadocs `source.getPage()` calls with Sanity GROQ queries that check existence of a document with `_type`, `language`, and `slug.current` for each locale. `getAvailableLocales(slug, contentType)` MUST return the same `Locale[]` shape. Verified by: language toggle on note and project detail pages correctly shows only available locales.

## 6. Portable Text Rendering

- [ ] 6.1 Create `src/components/mdx/portable-text.tsx` implementing Portable Text rendering (Portable Text over Markdown string field decision): exports a `portableTextComponents` object with `types.code` mapped to a syntax-highlighted code block (using Shiki or Prism), `types.card` mapped to a `CardBlock` component rendering title and href as a styled link card, and `marks.link` mapped to an `<a>` element with `target="_blank" rel="noopener noreferrer"`. Verified by: a note with code block, card block, and link mark renders all three correctly at `/[lang]/notes/[slug]`.

- [ ] 6.2 Update the `Article` component in `src/components/article/` to accept `body: PortableTextBlock[]` instead of `body: ComponentType<MDXProps>`; replace `<article.body />` with `<PortableText value={article.body} components={portableTextComponents} />`. Verified by: note and project detail pages render Portable Text body without TypeScript errors; `pnpm type-check` passes.

- [ ] 6.3 [P] Update `src/app/[lang]/notes/[slug]/opengraph-image.tsx` implementing Cover image via Sanity CDN and the Single coverImage for Card and OG Image decision: replace fumadocs `getNote` call with Sanity data layer; replace static/generated image path logic (`required-image-type` removal) with `urlFor(note.coverImage).width(1200).height(675).fit("crop").url()` passed to `ImageResponse`; render fallback gradient when `coverImage` is null. Verified by: OG image route returns a 1200×675 PNG for a note with a cover image, and a gradient PNG for a note without one.

- [ ] 6.4 [P] Update `src/app/[lang]/projects/[slug]/opengraph-image.tsx`: same changes as 6.3 for the project OG image route. Verified by: project OG image returns correct image from Sanity CDN.

## 7. ISR Webhook

- [ ] 7.1 Create `src/app/api/revalidate/route.ts` fulfilling the Webhook endpoint for on-demand revalidation requirement, ISR Webhook Contract, and ISR with Sanity Webhook over SSG or SSR decision: the POST handler validates `sanity-webhook-signature` against `SANITY_WEBHOOK_SECRET`; returns HTTP 401 on invalid signature; parses `_type` and `slug.current` from body; calls `revalidatePath` for all three locale variants of the affected document type; returns `{ revalidated: true }` with HTTP 200. Returns HTTP 500 if `SANITY_WEBHOOK_SECRET` is unset. Verified by: manual POST with valid signature triggers revalidation; POST with invalid signature returns 401.

- [ ] 7.2 Configure Sanity webhook configuration in Sanity project settings: add webhook pointing to `https://<domain>/api/revalidate`, triggered on publish and unpublish for `note`, `project`, and `about` document types, with `SANITY_WEBHOOK_SECRET` as the signing secret. Verified by: publishing a document in Studio triggers the webhook and the corresponding page updates within 30 seconds.

## 8. fumadocs UI Component Replacement

- [ ] 8.1 Replace `fumadocs-core/link` with `next/link` as part of fumadocs UI Components Replaced with Next.js Primitives in all files: `src/components/layout/home/menu.tsx`, `src/components/layout/home/index.tsx`, `src/components/layout/home/navbar.tsx`, `src/components/layout/shared/client.tsx`, `src/components/root-toggle.tsx`, `src/components/sidebar.tsx`. Verified by: `grep -r "fumadocs-core/link" src/` returns no matches; `pnpm type-check` passes.

- [ ] 8.2 Replace `fumadocs-core/framework` `usePathname` with `next/navigation` `usePathname` in all files: `src/components/layout/docs/page.tsx`, `src/components/layout/docs/client.tsx`, `src/components/layout/docs/index.tsx`, `src/components/layout/shared/client.tsx`, `src/components/root-toggle.tsx`, `src/components/sidebar.tsx`. Verified by: `grep -r "fumadocs-core/framework" src/` returns no matches; `pnpm type-check` passes.

- [ ] 8.3 Replace `fumadocs-ui/provider/next` `RootProvider` in `src/components/provider.tsx` with `next-themes` `ThemeProvider`; update `src/app/[lang]/layout.tsx` to remove `defineI18nUI` import and pass locale directly. Verified by: dark mode toggle functions correctly; `grep -r "fumadocs-ui/provider" src/` returns no matches.

- [ ] 8.4 Replace fumadocs TOC primitives in `src/components/ui/toc.tsx`, `src/components/ui/toc-thumb.tsx`, `src/components/ui/toc-clerk.tsx`: remove `fumadocs-core/toc` imports; implement scroll tracking using Intersection Observer API and `@radix-ui/react-scroll-area`. Verified by: TOC highlights the active section on note/project detail pages; `grep -r "fumadocs-core/toc" src/` returns no matches.

- [ ] 8.5 Replace `fumadocs-ui/components/dynamic-codeblock` `DynamicCodeBlock` in `src/components/home/hero/terminal-animation.tsx` with a custom `<code>` or `<pre>` element matching existing visual behavior. Verified by: hero terminal animation renders correctly; `grep -r "fumadocs-ui" src/components/home" src/` returns no matches.

- [ ] 8.6 Replace `fumadocs-ui/contexts/i18n` `useI18n` and `fumadocs-ui/contexts/search` `useSearchContext` in `src/components/search-toggle.tsx`, `src/components/language-toggle.tsx`, `src/components/ui/toc-clerk.tsx`, `src/components/ui/toc.tsx`: remove fumadocs context hooks; implement with React context or URL-based locale reading from `next/navigation`. Verified by: language toggle and search toggle render correctly; `grep -r "fumadocs-ui/contexts" src/` returns no matches.

- [ ] 8.7 Replace `fumadocs-ui/components/sidebar` and fumadocs sidebar/tree context usage in `src/components/sidebar.tsx`, `src/components/root-toggle.tsx`, `src/components/layout/docs/`: remove `useSidebar`, `useTreeContext`, `useTreePath`, `TreeContextProvider` imports; replace with project-owned sidebar state (React context or Zustand if already used). Verified by: sidebar functions on mobile and desktop; `grep -r "fumadocs-ui/components/sidebar\|fumadocs-ui/contexts/tree" src/` returns no matches.

- [ ] 8.8 Replace `fumadocs-core/i18n` `defineI18n` in `src/lib/i18n.ts` and `createI18nMiddleware` in `src/proxy.ts`: implement a custom Next.js middleware in `src/middleware.ts` that detects locale from the URL path prefix and redirects `/` to `/zh-TW/` as the default locale; ensure `/studio` is excluded from locale prefixing. Verified by: navigating to `/` redirects to `/zh-TW/`; all three locale prefixes route correctly; `/studio` is unaffected.

- [ ] 8.9 Remove `fumadocs-ui/css/shadcn.css` and `fumadocs-ui/css/preset.css` imports from `src/app/globals.css`: verify all CSS variables used by project components are defined directly in `globals.css` (colors, radii, spacing) and that removing fumadocs CSS does not break the visual layout. Verified by: `pnpm dev` shows no missing CSS variable warnings; primary pages render with correct colors and spacing.

## 9. Cleanup and Verification

- [ ] 9.1 [P] Remove fumadocs packages from `package.json` (`fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui`) and remove `@orama/stopwords`, `@orama/tokenizers`; run `pnpm install`. Verified by: `pnpm list fumadocs-core` returns "not installed"; `pnpm install` succeeds.

- [ ] 9.2 [P] Delete removed files completing mdx-content-management removal: `source.config.ts`, `src/lib/source.ts`, `src/lib/i18n.ts`, `src/app/api/search/route.ts`, `content/` directory. Verified by: `git status` shows these paths as deleted; no import in `src/` references them.

- [ ] 9.3 [P] Update `pnpm-workspace.yaml`: remove `esbuild: true` from `allowBuilds`; update `package.json` `postinstall` script to remove `fumadocs-mdx` call. Verified by: `pnpm install` completes without esbuild build step.

- [ ] 9.4 Final verification against acceptance criteria: run `grep -r "fumadocs" src/` and confirm zero matches; run `pnpm build` and confirm it completes without errors; manually visit `/zh-TW/notes`, `/zh-TW/notes/[slug]`, `/zh-TW/projects`, `/zh-TW/projects/[slug]`, `/zh-TW/about`, and `/studio` to confirm all pages return HTTP 200 with correct Sanity-sourced content in all three locales.
