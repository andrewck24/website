## ADDED Requirements

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

### Requirement: Sanity webhook configuration

The Sanity project SHALL have a webhook configured to POST to `https://<domain>/api/revalidate` on document publish and unpublish events for `note`, `project`, and `about` document types.

The webhook SHALL include the `sanity-webhook-signature` header using a shared secret stored in `SANITY_WEBHOOK_SECRET`.

#### Scenario: Content update propagation

- **WHEN** a user publishes a note in Sanity Studio
- **THEN** the Sanity webhook fires a POST to `/api/revalidate` within 5 seconds
- **THEN** the next request to the corresponding note page returns the updated content without a redeploy
