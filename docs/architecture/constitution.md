<!--
Sync Impact Report - Constitution Update
Version: 1.0.0 → 1.1.0 (MINOR)
Ratification: 2025-10-01
Last Amended: 2025-10-01

Changes Made (v1.1.0):
- Expanded Principle III to use hybrid testing strategy (Outside-In TDD)
- Defined test pyramid: E2E (acceptance) → Component (behavior) → Unit (logic)
- Added test selection criteria based on scope and execution speed

Modified Principles:
- Principle III: "Test-Driven Development" → "Test-Driven Development (Hybrid Strategy)"

Templates Status:
✅ .specify/templates/plan-template.md - reviewed, constitutional check section aligns
✅ .specify/templates/spec-template.md - reviewed, requirement standards compatible
✅ .specify/templates/tasks-template.md - TDD workflow compatible with hybrid strategy
⚠ .specify/templates/commands/*.md - no command templates found, will align when created
✅ README.md - reviewed, no updates needed

Follow-up TODOs:
- None - all placeholders resolved
-->

# andrewck24 Portfolio Constitution

## Core Principles

### I. Type Safety & Explicit Contracts

All data structures and component interfaces must be explicitly typed. Type definitions are the source of truth for data flow across the application.

**Rules:**

- All React component props must have typed interfaces
- Data types defined in `types/` directory (`profile.ts`, `project.ts`)
- Use TypeScript strict mode with no implicit `any`
- Type definitions must include JSDoc comments for complex structures

**Rationale:** Explicit types catch errors at compile time, serve as living documentation, and enable reliable refactoring in a growing codebase.

### II. Component Standards & Conventions

React components follow strict naming, structure, and testing conventions to maintain consistency across the codebase.

**Rules:**

- Files: kebab-case (e.g., `hero-section.tsx`, `social-links.ts`)
- Components: PascalCase exported functions (e.g., `export function Hero()`)
- Test IDs: semantic naming pattern
  - Page level: `[page-name]-page`
  - Section level: `[component-name]-section`
  - Card level: `[item-type]-card`
  - Button level: `[action]-[element-type]`
- Each component must include `data-testid` attributes for E2E testing
- Component file structure: imports → interface → main component function → helper functions
- File structure: see [docs/architecture/source-tree.md](docs/architecture/source-tree.md)

**Rationale:** Consistent conventions reduce cognitive load, enable automated testing, and facilitate team collaboration.

### III. Test-Driven Development - Hybrid Strategy (NON-NEGOTIABLE)

Tests must be written before implementation using Outside-In TDD with a hybrid testing strategy. Test selection depends on scope and execution speed.

**Rules:**

- TDD cycle: Red → Green → Refactor (strictly enforced)
- All tests must FAIL before implementation begins
- Use appropriate test level based on scope:

**Test Pyramid Strategy:**

1. **E2E Tests (Playwright)** - Acceptance level
   - **When to use:** Critical user flows from living docs
   - **Scope:** Full page interactions, multi-step workflows
   - **Examples:** Language switching, form submission, navigation flows
   - **Selectors:** `data-testid` attributes required

2. **Component Tests (React Testing Library)** - Behavior level
   - **When to use:** Component behavior and state management
   - **Scope:** Individual component logic, user interactions, conditional rendering
   - **Examples:** Dropdown state, button clicks, prop-driven rendering
   - **Speed:** Faster than E2E, use as primary development driver

3. **Unit Tests (Vitest/Jest)** - Logic level
   - **When to use:** Pure functions and business logic
   - **Scope:** Data transformations, calculations, utilities
   - **Examples:** Date formatting, validation functions, data parsing
   - **Speed:** Fastest, highest volume

**Test Selection Criteria:**

- Living docs user stories → E2E tests
- Component interactions → Component tests
- Pure logic functions → Unit tests
- Pre-commit hooks run all test levels

**Rationale:** Hybrid strategy balances comprehensive coverage with fast feedback loops. E2E validates acceptance criteria, component tests drive development, unit tests ensure logic correctness.

### IV. Internationalization First

All user-facing content must support multi-language (zh-TW, en, ja) via Fumadocs i18n system with static data approach.

**Rules:**

- Use Fumadocs `defineI18n` for configuration
- Static content in `content/docs/{locale}/` MDX files
- Dynamic content from `lib/data/` typed objects with locale keys
- Components receive `locale` prop and query static data via `source.getPage([path], locale)`
- Default language: zh-TW, fallback: en

**Rationale:** Static i18n enables build-time optimization, type-safe translations, and simplified data flow without runtime complexity.

### V. Performance & Optimization

Optimize for Core Web Vitals with image optimization, code splitting, and Tailwind CSS utilities.

**Rules:**

- Use Next.js `Image` component with explicit width/height
- Lazy load components with `React.lazy` and `Suspense`
- Mobile-first responsive design (default → md → lg → xl breakpoints)
- Tailwind CSS with OKLCH color system for animations
- Lighthouse score target: >90 across all metrics

**Rationale:** Performance directly impacts user experience and SEO. Static optimization and progressive enhancement ensure fast, accessible delivery.

## Code Quality Standards

### Pre-commit Quality Gates

Every commit must pass automated checks before being accepted.

**Required Checks:**

```bash
pnpm type-check  # TypeScript compilation
pnpm lint        # ESLint rules
pnpm test        # Unit/integration tests
```

**Enforcement:**

- Husky pre-commit hook runs `lint-staged`
- Failed checks block commit
- No `--no-verify` bypasses allowed without team approval

### Build & Deployment Pipeline

Continuous integration with environment-specific deployments.

**Workflow:**

- `feature/*` branches → Vercel Preview Deploy → Manual testing
- `main` branch → Vercel Production Deploy → Automatic release
- All PRs must pass CI: build + test + type-check

## Development Workflow

### Feature Development Process

1. Create feature spec with acceptance criteria (living docs)
2. **Write tests first (Outside-In TDD)**:
   - E2E tests for user flows (if critical flow)
   - Component tests for behavior (primary)
   - Unit tests for pure logic
   - All tests must FAIL
3. Implement components with TypeScript interfaces
4. Verify tests pass (green)
5. Refactor for code quality
6. Run quality checks (`pnpm type-check && pnpm lint && pnpm test`)
7. Create PR with test evidence at all levels

### API Design Standards

Next.js Route Handlers follow consistent response structure.

**Response Format:**

```typescript
// Success
Response.json({
  status: "success",
  data: { /* payload */ },
  "data-testid": "success-response"
})

// Error
Response.json({
  status: "error",
  error: "Error message",
  code: "ERROR_CODE",
  "data-testid": "error-response"
}, { status: 4xx | 5xx })
```

### State Management

Redux Toolkit for complex state, React Context for simple state.

**Redux Slice Pattern:**

- Organized by feature domain (e.g., `demo-slice.ts`)
- Typed state interfaces
- PayloadAction for type-safe reducers
- Separated UI state from business logic

## Governance

### Amendment Process

Constitution changes require:

1. Documented rationale for change
2. Impact assessment on existing code
3. Update to all dependent templates
4. Team review and approval
5. Version bump following semantic versioning

### Versioning Policy

- **MAJOR**: Breaking principle changes (e.g., removing TDD requirement)
- **MINOR**: New principles or sections added
- **PATCH**: Clarifications, typo fixes, non-semantic updates

### Compliance Verification

All PRs must verify constitutional compliance:

- Code review checklist includes principle adherence
- Automated checks enforce quality gates
- Complexity deviations require documented justification

### Runtime Guidance

For implementation-specific guidance aligned with these principles, refer to agent-specific files (e.g., `.claude/CLAUDE.md`, `.github/copilot-instructions.md`).

---

**Version**: 1.1.0 | **Ratified**: 2025-10-01 | **Last Amended**: 2025-10-01
