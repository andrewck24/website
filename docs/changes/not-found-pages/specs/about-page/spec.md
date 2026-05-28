## ADDED Requirements

### Requirement: about-page not-found guard

When the Sanity client returns no about document for the requested locale, the system SHALL call `notFound()` to return HTTP 404 instead of rendering a blank page.

#### Scenario: no about document for locale

- **WHEN** the about page is requested for a locale and `client.fetch(getAboutQuery)` returns `null`
- **THEN** `notFound()` is called and the request results in HTTP 404
- **THEN** the `about/[[...slug]]/not-found.tsx` page is rendered
