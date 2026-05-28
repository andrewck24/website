## ADDED Requirements

### Requirement: locale-aware not-found page

When a note or project slug is requested for a locale that has no matching document, the system SHALL return HTTP 404 and render a not-found page that:

- Displays the content type name and a message that the page does not exist
- Provides a button to return to the content list for the current locale
- Conditionally renders locale switcher buttons for each locale in which the slug does exist, linking to `/<locale>/<content-type>/<slug>`
- Does NOT render a locale switcher button for the current locale

When an about page is requested for a locale that has no matching Sanity document, the system SHALL return HTTP 404 and render a not-found page that:

- Provides a button to return to the homepage for the current locale
- Conditionally renders locale switcher buttons for each locale that has an about document, linking to `/<locale>/about`

#### Scenario: note slug missing in requested locale

- **WHEN** a visitor navigates to `/en/notes/my-slug` and no English document with that slug exists
- **THEN** the server returns HTTP 404 and renders the Notes not-found page

#### Scenario: locale switcher shown when slug exists in other languages

- **WHEN** the slug `my-slug` exists in `zh-TW` but not in `en`
- **THEN** the not-found page renders a button linking to `/zh-TW/notes/my-slug`
- **THEN** no button linking to `/en/notes/my-slug` is shown

#### Scenario: no locale switcher when slug exists nowhere

- **WHEN** `my-slug` does not exist in any locale
- **THEN** only the "back to list" button is rendered; no locale switcher buttons appear

#### Scenario: about page missing for requested locale

- **WHEN** a visitor navigates to `/en/about` and no English about document exists in Sanity
- **THEN** the server returns HTTP 404 and renders the About not-found page with a "back to home" button

#### Scenario: about locale switcher shown when other locales have content

- **WHEN** Sanity has about documents for `zh-TW` and `ja` but not `en`
- **THEN** the About not-found page renders buttons linking to `/zh-TW/about` and `/ja/about`

##### Example: locale button rendering

| Slug exists in | Requested locale | Locale buttons rendered                |
| -------------- | ---------------- | -------------------------------------- |
| zh-TW, en, ja  | zh-TW            | en, ja                                 |
| zh-TW only     | en               | zh-TW                                  |
| zh-TW only     | zh-TW            | (none, page renders normally — no 404) |
| nowhere        | en               | (none)                                 |

### Requirement: not-found locale derivation

The not-found pages SHALL derive the current locale from the `x-pathname` request header set by `proxy.ts`, using the first path segment.

If the `x-pathname` header is absent, the system SHALL fall back to `zh-TW` as the default locale.

#### Scenario: locale extracted from header

- **WHEN** the `x-pathname` header is `/en/notes/missing`
- **THEN** the not-found page treats `en` as the current locale and renders English UI labels

#### Scenario: fallback when header absent

- **WHEN** the `x-pathname` header is absent
- **THEN** the not-found page falls back to `zh-TW` and renders Traditional Chinese UI labels

### Requirement: not-found data fetch resilience

If a Sanity query inside a not-found page throws an error, the system SHALL still render the not-found page without locale switcher buttons rather than returning HTTP 500.

#### Scenario: Sanity unavailable during not-found render

- **WHEN** `getAvailableLocales` or `getAvailableAboutLocales` throws
- **THEN** the not-found page renders with only the fixed navigation button (back to list or back to home)
- **THEN** no HTTP 500 is returned
