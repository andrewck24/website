<!--
Each task description MUST state:
- the behavior or contract being delivered (what is observably true when the
  task is complete), and
- the verification target that proves completion (test, CLI invocation,
  analyzer check, manual assertion, or content review).

File paths are supporting context for locating the work, never the task
itself. "Edit file X" is not a valid task — it is missing both behavior and
verification.
-->

## 1. Relocate internal toggle components

- [x] [P] 1.1 Move `theme-toggle.tsx` into `src/components/layout/theme-toggle.tsx` so it is internal to the layout module per the design decision "Split layout into index.tsx (structure) and navbar.tsx (presentation)"; verify `pnpm build` resolves the import without errors
- [x] [P] 1.2 Move `language-toggle.tsx` into `src/components/layout/language-toggle.tsx`; update the import in `src/components/article/info.tsx` to `@/components/layout/language-toggle`; verify `pnpm build` resolves both files without errors

## 2. Create NavLayout with IntersectionObserver scroll detection

- [x] 2.1 Implement `NavLayout` in `src/components/layout/index.tsx` per the spec "NavLayout renders layout structure with scroll detection": export `NavLayout({ lang, children })` that renders a fixed `<Navbar>` and a `<main>` whose first child is `<div id="nav-sentinel" className="h-[88px] shrink-0" />`; no `pt-*` padding on `<main>`; verify the sentinel renders as first child in browser dev tools
- [x] 2.2 Add native `IntersectionObserver` to `NavLayout` per the design decision "Replace motion/react useScroll with IntersectionObserver + sentinel element": observe `#nav-sentinel` and set `isScrolled` state to `true` when the sentinel is not intersecting; pass `isScrolled` to `<Navbar>`; verify that scrolling past the sentinel triggers `isScrolled: true` and scrolling back sets it to `false` (manual browser assertion)

## 3. Implement Navbar with hard-coded locale links

- [x] 3.1 Implement `Navbar({ lang, isScrolled })` in `src/components/layout/navbar.tsx` per the spec "Desktop nav shows hard-coded links per locale" and the design decision "Hard-code nav links; remove BaseLayoutProps": derive link text and URLs from `lang` (Projects/專案/プロジェクト, About/關於/私について, GitHub icon) with no `links` prop or `LinkItemType` variant; render as a desktop link row hidden below `lg`; verify correct text renders for `zh-TW`, `en`, and `ja` with no TypeScript errors
- [x] 3.2 Apply scroll-aware backdrop blur per the spec "Navbar shows scroll-aware backdrop blur": when `isScrolled` is `true` apply `bg-background/60 backdrop-blur-sm shadow-xl` to the nav container; when `false` the container is transparent; verify visually at both scroll positions
- [x] 3.3 Implement active link detection per the spec "Active link highlights current route and sub-routes": use `usePathname()` with normalized trailing-slash comparison; a link is active when `pathname === url` or `pathname.startsWith(url + '/')`; inline the `isActive` helper (replaces `src/lib/is-active.ts`) directly in `navbar.tsx`; verify with the boundary-case table in the spec (exact match, sub-route match, no cross-route activation)

## 4. Add CSS anchor positioning active indicator

- [x] 4.1 Implement the desktop active indicator per the spec "Desktop active indicator uses CSS anchor positioning" and the design decision "CSS anchor positioning for desktop active-link indicator": assign `anchor-name: --nav-link-<index>` to each desktop link; render a `<span>` positioned via `position-anchor`, `anchor()`, `anchor-size()` with `bg-muted/60 backdrop-blur-sm rounded-md` and CSS `transition` on position/size; wrap in `@supports (anchor-name: --x)`; verify the pill slides to the active link on route change and is absent on unsupported browsers (test with devtools override)

## 5. Implement mobile menu with native details and CSS animation

- [ ] 5.1 Implement the mobile menu in `navbar.tsx` per the spec "Mobile menu uses native details element with CSS animation" and the design decision "Replace Radix NavigationMenu with native `<details>` for mobile menu": use `<details>`/`<summary>` with a full-width panel; animate open via `grid-template-rows: 0fr → 1fr` transition (300 ms) and fade-in via `@starting-style`; animate close by reversing with `transition-behavior: allow-discrete`; show below `lg` breakpoint; verify expand and collapse animations play in Chrome and Safari
- [ ] 5.2 Close the mobile menu on route change: add a `useEffect` that watches `usePathname()` and imperatively sets `detailsRef.current.open = false` when the pathname changes; verify the menu closes automatically after navigating to a new route (manual browser assertion)

## 6. Wire up app layout and verify build

- [ ] 6.1 Update `src/app/[lang]/layout.tsx` to import `NavLayout` from `@/components/layout` instead of `@/components/layout/home`; pass only `lang` and `children` props (removing `baseOptions` spread); verify `pnpm build` passes with zero TypeScript errors
- [ ] 6.2 Delete the seven removed files per the proposal Impact section: `src/components/layout/home/index.tsx`, `src/components/layout/home/navbar.tsx`, `src/components/layout/home/menu.tsx`, `src/components/layout/shared/index.tsx`, `src/components/layout/shared/client.tsx`, `src/lib/layout.shared.tsx`, `src/lib/is-active.ts`, `src/components/search-toggle.tsx`; verify `pnpm build` succeeds and no remaining source file imports from the deleted paths (grep check)
