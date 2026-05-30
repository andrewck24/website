<!-- SPECTRA:START v1.0.2 -->

# Spectra Instructions

This project uses Spectra for Spec-Driven Development(SDD). Specs live in `docs/specs/`, change proposals in `docs/changes/`.

## Use `/spectra-*` skills when:

- A discussion needs structure before coding → `/spectra-discuss`
- User wants to plan, propose, or design a change → `/spectra-propose`
- Tasks are ready to implement → `/spectra-apply`
- There's an in-progress change to continue → `/spectra-ingest`
- User asks about specs or how something works → `/spectra-ask`
- Implementation is done → `/spectra-archive`
- Commit only files related to a specific change → `/spectra-commit`

## Workflow

discuss? → propose → apply ⇄ ingest → archive

- `discuss` is optional — skip if requirements are clear
- Requirements change mid-work? Plan mode → `ingest` → resume `apply`

## Parked Changes

Changes can be parked（暫存）— temporarily moved out of `docs/changes/`. Parked changes won't appear in `spectra list` but can be found with `spectra list --parked`. To restore: `spectra unpark <name>`. The `/spectra-apply` and `/spectra-ingest` skills handle parked changes automatically.

<!-- SPECTRA:END -->

- Colors must use CSS variables defined in [globals.css](/src/app/globals.css)
- Components must use existing components in `@/components/ui`, or add new shadcn/ui components
- When `/spectra-apply`ing a change:
  - Commit after each task section; message states the section purpose and includes related artifacts (tasks.md, spec files, etc.)
  - Run `pnpm type-check` before each commit; `pnpm build` before the final commit
  - Skip checks only if the section is intentionally incomplete; final commit MUST pass both
- For complex commits, include a body focused on **why**; "what" may be included as supporting context
