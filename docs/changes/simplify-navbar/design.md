## Context

The current `src/components/layout/` was ported from the `fumadocs` documentation framework. It exposes a generic plugin API designed for multi-project reuse: a five-variant `LinkItemType` union, `secondary`/`on` routing properties, opt-in search toggle infrastructure, and an override-capable `NavOptions` type. None of these generics are exercised by this site — every option is either hard-coded or disabled in `src/lib/layout.shared.tsx`.

The mobile menu runs through Radix `NavigationMenu`, and the scroll-aware backdrop uses `motion/react`'s `useScroll` hook — both are heavier than needed for a fixed nav on a personal site.

## Goals / Non-Goals

**Goals:**

- Reduce the layout surface to two files with clear, separated responsibilities
- Remove all external dependencies for scroll detection (Intersection Observer) and mobile menu (native `<details>`)
- Implement a CSS anchor positioning active-link indicator as a visual enhancement
- Preserve the expand animation on the mobile menu

**Non-Goals:**

- Dropdown / submenu support (YAGNI)
- Changing navigation items or routes
- Modifying `src/components/article/info.tsx` (language-toggle migration deferred)
- Any page layout change beyond navbar and `<main>` wrapper

## Decisions

### Split layout into index.tsx (structure) and navbar.tsx (presentation)

`index.tsx` owns `NavLayout`: the `<main>` wrapper, the sentinel element, the `IntersectionObserver` setup, and the `isScrolled` state. It passes `isScrolled` as a prop to `Navbar`.

`navbar.tsx` owns `Navbar`: the `<nav>` element, desktop link row, mobile `<details>` menu, and all toggle components. It receives `lang` and `isScrolled` as props and has no layout side effects.

Rejected alternative — single file: simpler to start, but the observer setup and the visual component become tangled as the file grows.

### Replace motion/react useScroll with IntersectionObserver + sentinel element

A `<div id="nav-sentinel" className="h-[88px] shrink-0" />` is placed as the first child of `<main>`. Its height matches the navbar visual offset (56 px height + 16 px top margin + 16 px gap). The `IntersectionObserver` in `NavLayout` watches it: when the sentinel is not intersecting (user scrolled past), `isScrolled` becomes `true`.

This removes the `motion/react` import from the layout path entirely and doubles as the replacement for the current `pt-22` padding — no separate spacer needed.

Rejected alternative — CSS `position: sticky` sentinel with `:not(:visible)`: does not work reliably cross-browser for the observer pattern; IntersectionObserver is the standard.

### Replace Radix NavigationMenu with native `<details>` for mobile menu

The mobile menu (`lg:hidden`) uses a `<details>`/`<summary>` element. The `<summary>` contains the hamburger/chevron trigger; the panel content sits in a sibling `<div class="menu-panel">`.

Expand animation uses the CSS grid trick (`grid-template-rows: 0fr` → `1fr`) so height animates without JS. Fade-in on open uses `@starting-style` + `transition-behavior: allow-discrete` on `display`. Both are supported in Chrome 117+, Firefox 129+, Safari 17.5+.

**Original Radix implementation reference** (preserved here for fallback): The previous menu used `NavigationMenuTrigger` / `NavigationMenuContent` from `@/components/ui/navigation-menu`, with a `ChevronDown` trigger rotating 180° on `group-data-[state=open]`. Content was positioned with Radix's floating panel and animated via `data-[state=open]:animate-in` / `data-[state=closed]:animate-out`. If the CSS-only approach proves insufficient, the Radix `NavigationMenu` pattern in `src/components/layout/home/menu.tsx` is the reference to restore from.

Rejected alternative — Radix DropdownMenu: lighter than NavigationMenu but still an extra dependency for what is now a simple show/hide.

### CSS anchor positioning for desktop active-link indicator

Each desktop nav link sets `anchor-name: --nav-<index>`. A `<span class="nav-indicator">` uses `position: absolute; position-anchor: var(--active-anchor)` with `top/left/width/height` bound to `anchor()` / `anchor-size()`. Switching the active link changes the `--active-anchor` custom property on the nav, and `transition` animates the indicator sliding across.

The indicator is a backdrop-blur pill (`bg-muted/60 backdrop-blur-sm rounded-md`) so it reads as a soft highlight rather than a hard underline.

Wrapped in `@supports (anchor-name: --x)` — browsers without support see no indicator, but links remain fully functional.

### Hard-code nav links; remove BaseLayoutProps

`NavLayout` accepts `{ lang: string; children: ReactNode }`. Link text and URLs are derived from `lang` inside `navbar.tsx` via a local lookup. `baseOptions`, `layout.shared.tsx`, and the entire `LinkItemType` type tree are deleted.

Inline `isActive` helper (nested-url mode only) replaces `src/lib/is-active.ts`, which is then deleted.

## Implementation Contract

**NavLayout interface:**

```ts
function NavLayout({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}): JSX.Element;
```

- Renders a fixed `<Navbar>` and a `<main>` with a sentinel `<div id="nav-sentinel">` as the first child
- `isScrolled` is `true` when the sentinel is not intersecting the viewport
- `<main>` has no `pt-*` padding; the sentinel element provides the visual offset

**Navbar interface:**

```ts
function Navbar({
  lang,
  isScrolled,
}: {
  lang: string;
  isScrolled: boolean;
}): JSX.Element;
```

- Desktop: horizontal link row, `ThemeToggle`, `LanguageToggle`, hidden on `lg:hidden`
- Mobile: `<details>` trigger + full-width panel, hidden on `lg:flex` equivalent
- `isScrolled` toggles `bg-background/60 backdrop-blur-sm shadow-xl` on the nav container
- Active link: `usePathname()` with nested-url matching (`/projects/foo` activates the `/projects` link)
- CSS anchor positioning indicator present on desktop; silently absent if unsupported

**Nav links (hard-coded per locale):**

- `/{lang}/projects` — text: Projects / 專案 / プロジェクト
- `/{lang}/about` — text: About / 關於 / 私について
- `https://github.com/andrewck24` — icon link, external

**Mobile menu animation:**

- Open: `grid-template-rows` transitions from `0fr` to `1fr` over 300 ms; content fades in via `@starting-style`
- Close: reverse transition; `display: none` applied after transition via `allow-discrete`

**Acceptance criteria:**

1. `pnpm build` passes with no TypeScript errors
2. Desktop nav shows active pill indicator on the current route and its sub-routes
3. Mobile menu opens and closes with visible animation on viewport < `lg` breakpoint
4. Scrolling past the sentinel adds backdrop blur to the navbar; scrolling back removes it
5. No import from `layout/home`, `layout/shared`, `layout.shared`, `search-toggle`, or `is-active` remains in the codebase

## Risks / Trade-offs

- [Risk] CSS anchor positioning lacks Safari < 18.2 support → Mitigation: `@supports` wrapper; indicator is a visual enhancement only, not functional
- [Risk] `<details>` open/close cannot be controlled by React state (e.g., close on route change) → Mitigation: add a `usePathname` effect that imperatively sets `open = false` on the `<details>` ref when the route changes
- [Risk] Sentinel height hard-coded to 88 px may drift if navbar height changes → Mitigation: use a CSS custom property `--navbar-offset: 88px` defined alongside the navbar styles, referenced in both the sentinel and any other spacing that depends on navbar height

## Migration Plan

1. Create new `src/components/layout/index.tsx` and `src/components/layout/navbar.tsx`
2. Move `theme-toggle.tsx` and `language-toggle.tsx` into `src/components/layout/`; update imports in `article/info.tsx`
3. Update `src/app/[lang]/layout.tsx` to import from `@/components/layout`
4. Verify `pnpm build` passes
5. Delete the seven removed files in a single commit

Rollback: revert the branch. No database or API changes — rollback is a git operation only.
