## Why

The layout components under `src/components/layout/` were originally ported from `fumadocs` UI and carry its full generic plugin API — five files, a five-variant `LinkItemType` union, secondary/on routing logic, and search toggle infrastructure — none of which are used by this site. The dead complexity makes the nav hard to reason about and unnecessarily inflates the bundle.

## What Changes

- Replace the five-file fumadocs layout with two focused files: `index.tsx` (layout structure + scroll detection) and `navbar.tsx` (visual presentation)
- Remove the entire `LinkItemType` type system; nav links are hard-coded per locale
- Replace `motion/react` scroll detection with a native `IntersectionObserver` sentinel element that also replaces the `pt-22` top padding on `<main>`
- Replace Radix `NavigationMenu` with a native `<details>` element for the mobile menu, with CSS grid-template-rows expand animation and `@starting-style` fade-in
- Add CSS anchor positioning for the active-link indicator (backdrop pill with transition)
- Move `theme-toggle.tsx` and `language-toggle.tsx` into `src/components/layout/` as internal components
- Inline the `isActive` helper from `src/lib/is-active.ts` directly into `navbar.tsx`; always use nested-url matching (sub-routes also show active)
- Delete `src/lib/layout.shared.tsx`, `src/components/search-toggle.tsx`, `src/lib/is-active.ts`, and the entire `src/components/layout/home/` and `src/components/layout/shared/` subdirectories

## Non-Goals

- No new navigation items or routes
- No dropdown / submenu capability (YAGNI — add later if needed)
- `language-toggle` usage in `src/components/article/info.tsx` is intentionally left unchanged (planned for a separate change)
- No changes to page-level layout beyond the navbar and `<main>` wrapper

## Capabilities

### New Capabilities

- `responsive-navbar`: A single RWD navbar with desktop link row, scroll-aware backdrop blur, CSS anchor positioning active indicator, and a native `<details>` mobile menu with CSS expand/collapse animation

### Modified Capabilities

(none)

## Impact

- Affected specs: `responsive-navbar` (new)
- Affected code:
  - New: `src/components/layout/index.tsx`
  - New: `src/components/layout/navbar.tsx`
  - Modified: `src/app/[lang]/layout.tsx` (update import path from layout/home to layout)
  - Modified: `src/components/article/info.tsx` (update import path after language-toggle move)
  - Moved: `src/components/theme-toggle.tsx` → `src/components/layout/theme-toggle.tsx`
  - Moved: `src/components/language-toggle.tsx` → `src/components/layout/language-toggle.tsx`
  - Removed: `src/components/layout/home/index.tsx`
  - Removed: `src/components/layout/home/navbar.tsx`
  - Removed: `src/components/layout/home/menu.tsx`
  - Removed: `src/components/layout/shared/index.tsx`
  - Removed: `src/components/layout/shared/client.tsx`
  - Removed: `src/lib/layout.shared.tsx`
  - Removed: `src/lib/is-active.ts`
  - Removed: `src/components/search-toggle.tsx`
