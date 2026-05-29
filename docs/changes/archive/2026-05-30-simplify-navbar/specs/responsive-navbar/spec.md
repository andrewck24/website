## ADDED Requirements

### Requirement: NavLayout renders layout structure with scroll detection

`NavLayout` SHALL accept `{ lang: string; children: ReactNode }` and render a fixed `Navbar` above a `<main>` element. `NavLayout` SHALL place a sentinel `<div id="nav-sentinel">` as the first child of `<main>` to provide both the top spacing offset and the IntersectionObserver target. `NavLayout` SHALL use a native `IntersectionObserver` to track sentinel visibility and pass `isScrolled: boolean` to `Navbar`. `NavLayout` SHALL NOT use any motion library for scroll detection.

#### Scenario: Sentinel provides top spacing

- **WHEN** the page renders
- **THEN** `<main>` contains a sentinel element as its first child with height equal to the navbar visual offset, and `<main>` itself has no top padding

#### Scenario: Scroll state changes on sentinel visibility

- **WHEN** the user scrolls so that the sentinel element leaves the viewport
- **THEN** `isScrolled` becomes `true` and the navbar shows the backdrop blur style

#### Scenario: Scroll state resets on scroll back

- **WHEN** the user scrolls back so that the sentinel re-enters the viewport
- **THEN** `isScrolled` becomes `false` and the backdrop blur style is removed

### Requirement: Navbar shows scroll-aware backdrop blur

`Navbar` SHALL accept `{ lang: string; isScrolled: boolean }`. When `isScrolled` is `true`, the nav container SHALL apply `bg-background/60 backdrop-blur-sm shadow-xl`. When `isScrolled` is `false`, the nav container SHALL be visually transparent.

#### Scenario: Backdrop appears on scroll

- **WHEN** `isScrolled` prop is `true`
- **THEN** the nav container has a semi-transparent blurred background

#### Scenario: Backdrop absent at top

- **WHEN** `isScrolled` prop is `false`
- **THEN** the nav container has no background or shadow

### Requirement: Desktop nav shows hard-coded links per locale

`Navbar` SHALL render a desktop link row (hidden below `lg` breakpoint) with the following links derived from the `lang` prop:

| Route                           | zh-TW  | en       | ja           |
| ------------------------------- | ------ | -------- | ------------ |
| `/{lang}/projects`              | 專案   | Projects | プロジェクト |
| `/{lang}/about`                 | 關於   | About    | 私について   |
| `https://github.com/andrewck24` | (icon) | (icon)   | (icon)       |

`Navbar` SHALL NOT accept a `links` prop or any `LinkItemType` variant.

#### Scenario: Links render for zh-TW locale

- **WHEN** `lang` is `"zh-TW"`
- **THEN** the desktop row shows "專案" linking to `/zh-TW/projects` and "關於" linking to `/zh-TW/about`

#### Scenario: Links render for en locale

- **WHEN** `lang` is `"en"`
- **THEN** the desktop row shows "Projects" linking to `/en/projects` and "About" linking to `/en/about`

### Requirement: Active link highlights current route and sub-routes

A nav link SHALL be marked active when the current pathname equals the link URL or starts with the link URL followed by `/`. Active state SHALL be detected via `usePathname()` with normalized trailing-slash comparison.

#### Scenario: Exact route match

- **WHEN** the current pathname is `/en/projects`
- **THEN** the Projects link is active

#### Scenario: Sub-route match

- **WHEN** the current pathname is `/en/projects/my-project`
- **THEN** the Projects link is active

#### Scenario: No cross-route activation

- **WHEN** the current pathname is `/en/about`
- **THEN** the Projects link is NOT active

##### Example: active detection boundary cases

| Pathname           | Active link |
| ------------------ | ----------- |
| `/en/projects`     | Projects    |
| `/en/projects/foo` | Projects    |
| `/en/about`        | About       |
| `/en`              | none        |

### Requirement: Desktop active indicator uses CSS anchor positioning

`Navbar` SHALL render a `<span>` indicator positioned over the active desktop link using CSS anchor positioning. The indicator SHALL have a `bg-muted/60 backdrop-blur-sm rounded-md` appearance (backdrop pill). The indicator SHALL smoothly transition position and size when the active link changes. The indicator SHALL be wrapped in `@supports (anchor-name: --x)` so it is silently absent in unsupported browsers without affecting link functionality.

#### Scenario: Indicator appears on active link

- **WHEN** the Projects link is active
- **THEN** the indicator pill is visually positioned over the Projects link

#### Scenario: Indicator transitions on route change

- **WHEN** the active link changes from Projects to About
- **THEN** the indicator animates from the Projects link position to the About link position

#### Scenario: Graceful degradation

- **WHEN** the browser does not support CSS anchor positioning
- **THEN** the active link has no indicator pill, but all links remain visible and functional

### Requirement: Mobile menu uses native details element with CSS animation

`Navbar` SHALL render a mobile menu (visible below `lg` breakpoint) using a native `<details>`/`<summary>` element. Opening the menu SHALL animate the panel expanding downward (height from `0` to full via `grid-template-rows: 0fr → 1fr`). The content SHALL fade in on open using `@starting-style`. Closing SHALL reverse the animation before hiding. The mobile menu SHALL be full-width below the navbar.

#### Scenario: Menu expands with animation

- **WHEN** the user taps the summary trigger
- **THEN** `<details>` gains the `open` attribute and the panel animates open

#### Scenario: Menu collapses with animation

- **WHEN** the user taps the summary trigger again while the menu is open
- **THEN** the panel animates closed before `display: none` is applied

#### Scenario: Menu closes on route change

- **WHEN** the route changes while the mobile menu is open
- **THEN** the `<details>` `open` attribute is removed imperatively
