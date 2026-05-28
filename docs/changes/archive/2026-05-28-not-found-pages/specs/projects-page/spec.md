## ADDED Requirements

### Requirement: project detail not-found page

When a project slug is requested for a locale with no matching document, the system SHALL render a not-found page consistent with the `not-found-pages` capability.

#### Scenario: project slug missing in locale

- **WHEN** a visitor navigates to `/en/projects/my-project` and no English project with that slug exists
- **THEN** the server returns HTTP 404 and renders the Projects not-found page with a "Back to Projects" button
