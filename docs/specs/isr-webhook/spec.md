# isr-webhook Specification

## Purpose

TBD - created by archiving change 'fumadocs-to-sanity-migration'. Update Purpose after archive.

## Requirements

### Requirement: Webhook endpoint for on-demand revalidation

The system SHALL expose a `POST /api/revalidate` endpoint that accepts Sanity webhook payloads and triggers Next.js on-demand ISR revalidation.

The endpoint SHALL validate the incoming request using the `sanity-webhook-signature` header against the `SANITY_WEBHOOK_SECRET` environment variable. Requests with an invalid or missing signature SHALL be rejected with HTTP 401.

On a valid request the endpoint SHALL parse the `_type` and `slug.current` fields from the webhook body, call `revalidatePath` for all locale-prefixed URL paths corresponding to the document, and return `{ revalidated: true }` with HTTP 200.

If `SANITY_WEBHOOK_SECRET` is not set the endpoint SHALL return HTTP 500.

#### Scenario: Valid webhook triggers revalidation

- **WHEN** Sanity sends a POST to `/api/revalidate` with a valid signature and body `{ "_type": "note", "slug": { "current": "react-hooks-guide" } }`
- **THEN** the endpoint calls `revalidatePath("/zh-TW/notes/react-hooks-guide")`, `revalidatePath("/en/notes/react-hooks-guide")`, and `revalidatePath("/ja/notes/react-hooks-guide")`
- **THEN** returns HTTP 200 with body `{ "revalidated": true }`

#### Scenario: Invalid signature rejected

- **WHEN** Sanity sends a POST to `/api/revalidate` with a missing or incorrect `sanity-webhook-signature` header
- **THEN** the endpoint returns HTTP 401 with no body
- **THEN** no `revalidatePath` calls are made

#### Scenario: Missing environment variable

- **WHEN** `SANITY_WEBHOOK_SECRET` is not set in the runtime environment
- **THEN** the endpoint returns HTTP 500

##### Example: revalidation paths per document type

| `_type`   | `slug.current`      | Paths revalidated                                                                              |
| --------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| `note`    | `react-hooks-guide` | `/zh-TW/notes/react-hooks-guide`, `/en/notes/react-hooks-guide`, `/ja/notes/react-hooks-guide` |
| `project` | `volleybro`         | `/zh-TW/projects/volleybro`, `/en/projects/volleybro`, `/ja/projects/volleybro`                |
| `about`   | (no slug)           | `/zh-TW/about`, `/en/about`, `/ja/about`                                                       |

<!-- @trace
source: fumadocs-to-sanity-migration
updated: 2026-05-28
code:
  - src/lib/sanity/image.ts
  - src/components/projects/index.tsx
  - src/app/[lang]/about/[[...slug]]/page.tsx
  - src/app/[lang]/projects/[slug]/page.tsx
  - src/components/about/personal-info.tsx
  - src/app/globals.css
  - src/app/[lang]/projects/[slug]/not-found.tsx
  - src/lib/data/locales.ts
  - src/lib/sanity/queries.ts
  - schemas/note.ts
  - .husky/pre-push
  - src/components/ui/empty.tsx
  - src/components/mdx/portable-text.tsx
  - src/components/article/index.tsx
  - src/app/[lang]/about/[[...slug]]/not-found.tsx
  - src/lib/locale-from-headers.ts
  - src/proxy.ts
  - package.json
  - src/components/language-toggle.tsx
  - src/components/article/info.tsx
  - src/app/layout.tsx
  - sanity.config.ts
  - schemas/project.ts
  - src/components/ui/navigation-menu.tsx
  - src/app/[lang]/notes/[slug]/not-found.tsx
  - src/components/article/image.tsx
  - src/components/layout/shared/index.tsx
tests:
  - src/components/home/hero/__tests__/cta-buttons.test.tsx
  - src/lib/sanity/__tests__/queries.test.ts
  - src/app/[lang]/about/[[...slug]]/__tests__/page.test.tsx
  - src/app/[lang]/projects/[slug]/__tests__/not-found.test.tsx
  - src/components/home/hero/__tests__/terminal-animation.test.tsx
  - src/components/article/__tests__/index.test.tsx
  - src/components/about/__tests__/skill-tags.test.tsx
  - src/lib/__tests__/locale-from-headers.test.ts
  - src/components/article/__tests__/info.test.tsx
  - src/components/home/hero/__tests__/index.test.tsx
  - src/app/[lang]/notes/[slug]/__tests__/not-found.test.tsx
  - src/lib/data/__tests__/locales.test.ts
  - src/app/[lang]/about/[[...slug]]/__tests__/not-found.test.tsx
  - src/app/__tests__/layout.test.tsx
-->

---

### Requirement: Sanity webhook configuration

The Sanity project SHALL have a webhook configured to POST to `https://<domain>/api/revalidate` on document publish and unpublish events for `note`, `project`, and `about` document types.

The webhook SHALL include the `sanity-webhook-signature` header using a shared secret stored in `SANITY_WEBHOOK_SECRET`.

#### Scenario: Content update propagation

- **WHEN** a user publishes a note in Sanity Studio
- **THEN** the Sanity webhook fires a POST to `/api/revalidate` within 5 seconds
- **THEN** the next request to the corresponding note page returns the updated content without a redeploy

<!-- @trace
source: fumadocs-to-sanity-migration
updated: 2026-05-28
code:
  - src/lib/sanity/image.ts
  - src/components/projects/index.tsx
  - src/app/[lang]/about/[[...slug]]/page.tsx
  - src/app/[lang]/projects/[slug]/page.tsx
  - src/components/about/personal-info.tsx
  - src/app/globals.css
  - src/app/[lang]/projects/[slug]/not-found.tsx
  - src/lib/data/locales.ts
  - src/lib/sanity/queries.ts
  - schemas/note.ts
  - .husky/pre-push
  - src/components/ui/empty.tsx
  - src/components/mdx/portable-text.tsx
  - src/components/article/index.tsx
  - src/app/[lang]/about/[[...slug]]/not-found.tsx
  - src/lib/locale-from-headers.ts
  - src/proxy.ts
  - package.json
  - src/components/language-toggle.tsx
  - src/components/article/info.tsx
  - src/app/layout.tsx
  - sanity.config.ts
  - schemas/project.ts
  - src/components/ui/navigation-menu.tsx
  - src/app/[lang]/notes/[slug]/not-found.tsx
  - src/components/article/image.tsx
  - src/components/layout/shared/index.tsx
tests:
  - src/components/home/hero/__tests__/cta-buttons.test.tsx
  - src/lib/sanity/__tests__/queries.test.ts
  - src/app/[lang]/about/[[...slug]]/__tests__/page.test.tsx
  - src/app/[lang]/projects/[slug]/__tests__/not-found.test.tsx
  - src/components/home/hero/__tests__/terminal-animation.test.tsx
  - src/components/article/__tests__/index.test.tsx
  - src/components/about/__tests__/skill-tags.test.tsx
  - src/lib/__tests__/locale-from-headers.test.ts
  - src/components/article/__tests__/info.test.tsx
  - src/components/home/hero/__tests__/index.test.tsx
  - src/app/[lang]/notes/[slug]/__tests__/not-found.test.tsx
  - src/lib/data/__tests__/locales.test.ts
  - src/app/[lang]/about/[[...slug]]/__tests__/not-found.test.tsx
  - src/app/__tests__/layout.test.tsx
-->
