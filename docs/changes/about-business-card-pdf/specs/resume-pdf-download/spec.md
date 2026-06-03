## ADDED Requirements

### Requirement: Sanity resume PDF fields

The `about` Sanity document type SHALL expose two optional `file` fields: `resumePdfZh` (Traditional Chinese PDF) and `resumePdfEn` (English PDF). Both SHALL accept only `.pdf` files.

The `getAboutQuery` GROQ projection SHALL dereference each field to its CDN URL string: `"resumePdfZhUrl": resumePdfZh.asset->url` and `"resumePdfEnUrl": resumePdfEn.asset->url`. When a field is unset, the projection SHALL return `null` for that URL.

#### Scenario: PDF field set in Sanity

- **WHEN** `resumePdfZh` is set to an uploaded PDF asset in the `about` document
- **THEN** `getAboutQuery` returns a non-null `resumePdfZhUrl` string beginning with `https://cdn.sanity.io/files/`

#### Scenario: PDF field unset in Sanity

- **WHEN** `resumePdfZh` is not set in the `about` document
- **THEN** `getAboutQuery` returns `null` for `resumePdfZhUrl`

### Requirement: Resume PDF download dialog

The About page SHALL render a dialog (using shadcn/ui Dialog) that presents download links for available resume PDF versions. The dialog trigger SHALL be a button inside the BusinessCard component. The dialog SHALL be absent (trigger not rendered) when both `resumePdfZhUrl` and `resumePdfEnUrl` are `null`.

Each language's download link SHALL render only when its corresponding URL is non-null. Each link SHALL open in a new tab with `target="_blank" rel="noopener noreferrer"`.

Dialog labels SHALL be localised to the page locale using the following values:

| key           | zh-TW        | en                             | ja                      |
| ------------- | ------------ | ------------------------------ | ----------------------- |
| dialog title  | 下載履歷 PDF | Download Resume PDF            | 履歴書PDFをダウンロード |
| description   | 選擇語言版本 | Choose your preferred language | 言語を選択してください  |
| zh link label | 中文         | Traditional Chinese            | 台湾華語                |
| en link label | 英文         | English                        | 英語                    |

#### Scenario: both PDFs available

- **WHEN** both `resumePdfZhUrl` and `resumePdfEnUrl` are non-null
- **THEN** the dialog renders two download links labelled according to the page locale

#### Scenario: only one PDF available

- **WHEN** `resumePdfZhUrl` is non-null and `resumePdfEnUrl` is null
- **THEN** the dialog renders only the Traditional Chinese download link; no English link is rendered

#### Scenario: no PDFs available

- **WHEN** both `resumePdfZhUrl` and `resumePdfEnUrl` are null
- **THEN** the dialog trigger button is not rendered anywhere on the page

### Requirement: Shareable resume dialog URL

The About page SHALL support a `?resume=open` URL query parameter that causes the PDF dialog to open on initial page load without user interaction.

The dialog trigger button SHALL NOT modify the URL when clicked.

When the user closes a dialog that was opened via `?resume=open`, the system SHALL call `router.replace(pathname, { scroll: false })` to remove the query parameter without adding a new browser history entry.

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
