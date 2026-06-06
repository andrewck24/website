## Section 1: globals.css token additions

> Prerequisite for all mesh gradient work. Adds `--alt-mesh-bg` and `--alt-mesh-blend` (already present) to enable CSS-only theme switching.

- [x] Add `--alt-mesh-bg: oklch(0.985 0 0)` to `:root` and `--alt-mesh-bg: oklch(0.051 0 0)` to `.dark` in `src/app/globals.css`. Verify: the CSS var resolves correctly in browser DevTools for both themes.
- [x] Run `pnpm type-check`. Fix any errors before proceeding.

Commit: `feat(design-tokens): add --alt-mesh-bg theme var for home hero SVG background`
Artifacts: `src/app/globals.css`

---

## Section 2: MeshGradientBackground component

> Server Component — pure SVG, no `"use client"`. Depends on Section 1 tokens.

- [x] Create `src/components/home/mesh-gradient.tsx`. The component exports `MeshGradientBackground()` — no props, no `"use client"` directive.
- [x] Inside the component, render an `<svg>` with `className` that applies `position:absolute; inset:0; width:100%; height:100%` and `preserveAspectRatio="xMidYMid slice"` and `viewBox="0 0 1400 600"`.
- [x] Add `<rect width="1400" height="600" fill="var(--alt-mesh-bg)" />` as the SVG background element.
- [x] Add a `<defs>` block containing: blur filter (`feGaussianBlur stdDeviation="66"`, `filterUnits="userSpaceOnUse"`, region x="-1200" y="-1200" width="3800" height="3000") and fractalNoise filter (`baseFrequency="0.74"`, `octaves="3"`, `feBlend mode="overlay"`). Use distinct IDs (e.g. `home-mesh-blur`, `home-mesh-noise`).
- [x] [P] Add the six topographic shape elements inside `<g filter="url(#home-mesh-blur)" style={{ mixBlendMode: 'var(--alt-mesh-blend)' }}>`, each with `style={{ transformBox: 'fill-box', transformOrigin: 'center', willChange: 'transform' }}` and an `animation` inline style string. Shape compositions and coordinates as specified in design.md (right-focal, x≥650 concentration). Fill values: outer loop = `var(--alt-grad-dev-s)`, inner loop = `var(--alt-grad-prev-s)`, cross-sweep = `var(--alt-grad-dev-e)`, focal core = `var(--alt-grad-prev-e)`, amber polygon = `var(--alt-grad-ship-e)`, coral ellipse = `var(--alt-grad-ship-s)`.
- [x] [P] Add the noise overlay `<rect>` after the blurred group: `fill="#888"`, `style={{ mixBlendMode: 'overlay', opacity: 0.055 }}`, `filter="url(#home-mesh-noise)"`.
- [x] Define `@keyframes` for each shape animation in `src/app/globals.css` under `@theme inline`: `--animate-mesh-a` through `--animate-mesh-f` with the durations (9–13 s), translate (±68 px), scale (0.93–1.09), and rotate (±8° for rotated rects).
- [x] Run `pnpm type-check`. Verify no type errors.

Commit: `feat(home): add MeshGradientBackground Server Component with topographic SVG mesh`
Artifacts: `src/components/home/mesh-gradient.tsx`, `src/app/globals.css`, `docs/changes/home-animated-mesh-gradient/tasks.md`

---

## Section 3: ProfileHero layout and integration

> Integrates `MeshGradientBackground`, updates grid breakpoint, adds eyebrow.

- [x] In `src/components/home/hero/index.tsx`: update `<section>` to add `overflow-hidden` (or `overflow: hidden` equivalent).
- [x] [P] Mount `<MeshGradientBackground />` as the first child of `<section>`, before all other content. It must NOT be inside the content grid `<div>`.
- [x] [P] Change the grid `<div>` from `lg:grid lg:grid-cols-2` to `md:grid md:grid-cols-2`. The terminal column wrapper should have `hidden md:block` so the terminal is hidden below 768 px.
- [x] [P] Add eyebrow `<p>` above `<h1>` with `caption-mono` typography style and `hairline-strong` color. Content: "Portfolio · Taipei, Taiwan".
- [x] [P] Update `<h1>` font size to use `clamp(48px, 5.5vw, 80px)` at ≥ md; `clamp(36px, 10vw, 56px)` below md (via responsive Tailwind class or inline style).
- [x] Update text color tokens for dark mesh context: h1 name → `text-[var(--alt-ink)]` or `on-primary` equivalent, title → `text-[var(--alt-hairline-strong)]`, bio → `text-foreground`.
- [x] Remove `<BackgroundAnimation />` import and usage from `src/components/home/index.tsx`. `Home` now renders only `<ProfileHero locale={lang} />`.
- [x] Run `pnpm type-check`. Verify no type errors.

Commit: `feat(home): integrate MeshGradientBackground into ProfileHero, update layout breakpoints`
Artifacts: `src/components/home/hero/index.tsx`, `src/components/home/index.tsx`, `docs/changes/home-animated-mesh-gradient/tasks.md`

---

## Section 4: Remove BackgroundAnimation

> Removes the old component and CSS file.

- [x] Delete `src/components/home/background-animation.tsx`.
- [x] Delete `src/components/home/background-animation.css`.
- [x] Search for any remaining imports of `BackgroundAnimation` or `background-animation` in the codebase and remove them. Verify: `grep -r "BackgroundAnimation\|background-animation" src/` returns no results.
- [x] Run `pnpm type-check`. Fix any broken imports.

Commit: `chore(home): remove BackgroundAnimation component and CSS (replaced by MeshGradientBackground)`
Artifacts: `src/components/home/background-animation.tsx` (deleted), `src/components/home/background-animation.css` (deleted), `docs/changes/home-animated-mesh-gradient/tasks.md`

---

## Section 5: Terminal data layer

> Extracts terminal content to typed data file. Prerequisite for Section 6.

- [x] Create `src/lib/data/terminal.ts`. Export type `TerminalLine` (discriminated union: `command | output | blank | ascii | final`) and constant `terminalLines: TerminalLine[]`.
- [x] Populate `terminalLines` with the terminal sequence: `~/projects $ npm install andrewck24@latest` → output `added andrewck24 in Taipei, Taiwan` → blank → `~/projects $ npm start` → ascii `andrewck24` → final `~/projects $`.
- [x] Run `pnpm type-check`. Verify exported types are correct.

Commit: `feat(data): add terminal.ts with typed TerminalLine data for home terminal animation`
Artifacts: `src/lib/data/terminal.ts`, `docs/changes/home-animated-mesh-gradient/tasks.md`

---

## Section 6: TerminalAnimation rewrite

> Rewrites the static terminal as a sequential state-machine Client Component. Depends on Section 5.

- [x] In `src/components/home/hero/terminal-animation.tsx`, add `"use client"`. Replace static `<pre><code>` with a structured component that reads from `terminalLines`.
- [x] Implement `useEffect` on mount that sequences through `terminalLines`. Use a `stopped` ref + closure to prevent stale state updates after unmount. Return a cleanup function from `useEffect` that sets `stopped = true` and clears all pending `setTimeout` / `setInterval` IDs.
- [x] Implement path reveal: each path element (`type: 'command'` → `path` field) has a CSS class applied after a `setTimeout` that adds the `.is-shown` class, triggering the stagger CSS transition (opacity 0→1, translateY 12px→0, blur 3px→0, duration 600 ms, cubic-bezier(0.22, 1, 0.36, 1)). Stagger CSS rules are added to `globals.css` under `@layer base`.
- [x] Implement command typewriter: after path reveal delay (700 ms), set an interval at 40 ms/char. Build the displayed command string character by character via `useState`. Clear the interval when the full command is shown.
- [x] Implement output reveal: after typewriter finishes, reveal each output line with the same stagger CSS, with 40 ms stagger between lines.
- [x] Implement ASCII art fade-in: import `GeistPixelSquare` from `geist/font/pixel`. After the `npm start` typewriter finishes, add the ASCII art element with `opacity: 0 → 1` (500 ms transition) using a CSS class toggle. Font size: `clamp(24px, 4vw, 56px)`. Font family: `GeistPixelSquare`.
- [x] Implement cursor blink: after all lines and ASCII art are shown, display a cursor `<span>` using `animate-blink` (already in `globals.css`).
- [x] Verify `pnpm type-check` passes. Manually test: animation plays through without console errors, cursor blinks at the end, no "state update on unmounted component" warning when navigating away.

Commit: `feat(home): rewrite TerminalAnimation with sequential state machine and ASCII art`
Artifacts: `src/components/home/hero/terminal-animation.tsx`, `src/app/globals.css`, `docs/changes/home-animated-mesh-gradient/tasks.md`

---

## Section 7: Final validation

- [x] Run `pnpm type-check` — must pass with zero errors.
- [x] Run `pnpm build` — must complete with zero errors.
- [ ] Manually verify in browser (light + dark mode):
  - Mesh gradient animates on the home hero, shapes concentrated on the right.
  - Left text column is clearly readable with no colour bleed.
  - Terminal plays through full sequence, cursor blinks at the end.
  - At 767 px width: single column, terminal hidden, mesh still visible.
  - At 768 px width: two columns, terminal visible.
  - Switching between dark and light mode: mesh background and blend mode switch without flash.

Commit: `feat(home): animated mesh gradient hero — all sections complete`
Artifacts: `docs/changes/home-animated-mesh-gradient/tasks.md`
