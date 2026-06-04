## ADDED Requirements

### Requirement: Sanity siteSettings PDF fields

A singleton Sanity document type `siteSettings` SHALL expose three optional `file` fields: `resumePdfTw` (Traditional Chinese PDF), `resumePdfEn` (English PDF), and `resumePdfJa` (Japanese PDF). All three SHALL accept only `.pdf` files. The document type SHALL use `__experimental_actions: ['update']` to prevent creation and deletion from Studio.

A new `getSiteSettingsQuery` GROQ query SHALL dereference each field to its CDN URL string:

```groq
*[_type == "siteSettings"][0] {
  "resumePdfTwUrl": resumePdfTw.asset->url,
  "resumePdfEnUrl": resumePdfEn.asset->url,
  "resumePdfJaUrl": resumePdfJa.asset->url
}
```

When a field is unset, the projection SHALL return `null` for that URL.

The `about` Sanity document type SHALL have the `resumePdfZh` and `resumePdfEn` fields removed.

#### Scenario: PDF field set in siteSettings

- **WHEN** `resumePdfTw` is set to an uploaded PDF asset in the `siteSettings` document
- **THEN** `getSiteSettingsQuery` returns a non-null `resumePdfTwUrl` string beginning with `https://cdn.sanity.io/files/`

#### Scenario: PDF field unset in siteSettings

- **WHEN** `resumePdfTw` is not set in the `siteSettings` document
- **THEN** `getSiteSettingsQuery` returns `null` for `resumePdfTwUrl`

### Requirement: Resume PDF download dialog

The About page SHALL render a dialog (using shadcn/ui Dialog) that presents download links for available resume PDF versions. The dialog trigger SHALL be a button inside the BusinessCard component rendered as a `<Download />` lucide icon followed by the text `"resume"`. The dialog SHALL be absent (trigger not rendered) when all three PDF URLs are `null`.

Each language's download link SHALL render only when its corresponding URL is non-null. Each link SHALL open in a new tab with `target="_blank" rel="noopener noreferrer"`.

Dialog labels SHALL be localised to the page locale using the following values:

| key           | zh-TW        | en                             | ja                      |
| ------------- | ------------ | ------------------------------ | ----------------------- |
| dialog title  | 下載履歷 PDF | Download Resume PDF            | 履歴書PDFをダウンロード |
| description   | 選擇語言版本 | Choose your preferred language | 言語を選択してください  |
| tw link label | 中文         | Traditional Chinese            | 台湾華語                |
| en link label | 英文         | English                        | 英語                    |
| ja link label | 日文         | Japanese                       | 日本語                  |

#### Scenario: all PDFs available

- **WHEN** all three PDF URLs (`resumePdfTwUrl`, `resumePdfEnUrl`, `resumePdfJaUrl`) are non-null
- **THEN** the dialog renders three download links labelled according to the page locale

#### Scenario: only one PDF available

- **WHEN** `resumePdfTwUrl` is non-null and the other two are null
- **THEN** the dialog renders only the Traditional Chinese download link; no other links are rendered

#### Scenario: no PDFs available

- **WHEN** all three PDF URLs are null
- **THEN** the dialog trigger button is not rendered anywhere on the page

### Requirement: Shareable resume dialog URL

The About page SHALL support a `?resume=open` URL query parameter that causes the PDF dialog to open on initial page load without user interaction.

The dialog trigger button SHALL NOT modify the URL when clicked.

When the user closes a dialog that was opened via `?resume=open`, the system SHALL remove the `resume` query parameter and navigate to the clean pathname without adding a new browser history entry. The implementation SHALL explicitly construct the target URL using `URLSearchParams.delete('resume')` and call `window.history.replaceState` directly — `router.replace(pathname)` is a no-op on statically generated pages in Vercel production when the resulting URL has no query string (Next.js rewrites it back to the original URL).

The client component that reads `useSearchParams` SHALL be wrapped in a `<Suspense>` boundary to preserve static page generation.

#### Scenario: shareable link opens dialog

- **WHEN** a visitor navigates to `/[lang]/about?resume=open`
- **THEN** the resume PDF dialog is open on page load without any user interaction

#### Scenario: closing dialog from shareable link removes param

- **WHEN** the user closes the dialog after arriving via `?resume=open`
- **THEN** the browser URL becomes `/[lang]/about` with no query string
- **THEN** pressing the browser Back button navigates away from the About page (not back to `?resume=open`)

#### Scenario: trigger does not modify URL

- **WHEN** the user opens the dialog by clicking the trigger button
- **THEN** the browser URL remains unchanged

## REMOVED

### Sanity resume PDF fields on `about` document _(removed)_

The original requirement placed `resumePdfZh` and `resumePdfEn` fields on each per-locale `about` document. This was replaced by the `siteSettings` singleton approach above, because resume PDFs are locale-independent assets shared across all locale About pages.
