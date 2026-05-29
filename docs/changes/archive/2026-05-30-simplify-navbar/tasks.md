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

- [x] 5.1 Implement the mobile menu in `navbar.tsx` per the spec "Mobile menu uses native details element with CSS animation" and the design decision "Replace Radix NavigationMenu with native `<details>` for mobile menu": use `<details>`/`<summary>` with a full-width panel; animate open via `grid-template-rows: 0fr → 1fr` transition (300 ms) and fade-in via `@starting-style`; animate close by reversing with `transition-behavior: allow-discrete`; show below `lg` breakpoint; verify expand and collapse animations play in Chrome and Safari
- [x] 5.2 Close the mobile menu on route change: add a `useEffect` that watches `usePathname()` and imperatively sets `detailsRef.current.open = false` when the pathname changes; verify the menu closes automatically after navigating to a new route (manual browser assertion)

## 6. Wire up app layout and verify build

- [x] 6.1 Update `src/app/[lang]/layout.tsx` to import `NavLayout` from `@/components/layout` instead of `@/components/layout/home`; pass only `lang` and `children` props (removing `baseOptions` spread); verify `pnpm build` passes with zero TypeScript errors
- [x] 6.2 Delete the seven removed files per the proposal Impact section: `src/components/layout/home/index.tsx`, `src/components/layout/home/navbar.tsx`, `src/components/layout/home/menu.tsx`, `src/components/layout/shared/index.tsx`, `src/components/layout/shared/client.tsx`, `src/lib/layout.shared.tsx`, `src/lib/is-active.ts`, `src/components/search-toggle.tsx`; verify `pnpm build` succeeds and no remaining source file imports from the deleted paths (grep check)

## 7. Fix visual regressions found in browser testing

- [x] [P] 7.1 Add brand icon to `navbar.tsx` per the design decision "Brand icon in navbar (DynamicIcon)": render `<Link href={/${lang}}><DynamicIcon /></Link>` as the leftmost element in the nav bar (before desktop link row and mobile controls); verify the "at\_" mark with blinking cursor is visible on both mobile and desktop viewports in the browser
- [x] 7.2 Fix mobile layout per the design decision "Mobile layout: brand + lang toggle in bar; GitHub + ThemeToggle in expanded menu": on mobile (`< lg`), hide `ThemeToggle` and GitHub link from the nav bar (add `hidden lg:inline-flex` / `hidden lg:flex`); add `ThemeToggle` and GitHub link inside the `<details>` panel; verify in browser at narrow viewport that nav bar shows only brand + LanguageToggle + trigger, and the expanded menu shows nav links + GitHub + ThemeToggle
- [x] [P] 7.3 Fix mobile trigger icon per the design decision "Mobile trigger: ChevronDown rotating 180° (not Menu/X toggle)": replace `<Menu>/<X>` imports and JSX with a single `<ChevronDown className="size-5 transition-transform duration-300 [details[open]_&]:rotate-180" />`; remove `Menu` and `X` from lucide-react imports; verify the chevron rotates 180° on open and returns to 0° on close (manual browser assertion)
- [x] [P] 7.4 Fix mobile panel animation per the design decision "grid-template-rows animation: use Tailwind class, not inline style": on the panel wrapper `<div>`, replace `style={{ gridTemplateRows: '0fr', transition: '...' }}` with Tailwind classes `grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease [details[open]_&]:grid-rows-[1fr]`; verify the panel expands with smooth animation when tapped (manual browser assertion in Chrome and Safari)
