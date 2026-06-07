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
- [x] Manually verify in browser (light + dark mode):
  - Mesh gradient animates on the home hero, shapes concentrated on the right.
  - Left text column is clearly readable with no colour bleed.
  - Terminal plays through full sequence, cursor blinks at the end.
  - At 767 px width: single column, terminal hidden, mesh still visible.
  - At 768 px width: two columns, terminal visible.
  - Switching between dark and light mode: mesh background and blend mode switch without flash.

Commit: `feat(home): animated mesh gradient hero — all sections complete`
Artifacts: `docs/changes/home-animated-mesh-gradient/tasks.md`

---

## Section 8: D-3 reference alignment corrections

> Visual comparison confirmed the initial implementation deviates from the D-3/L-3 reference. This section corrects all deviations. See design.md § "Correction Pass" for the full implementation contract.

### 8a: globals.css — CSS vars and keyframe corrections

- [x] Add `--alt-mesh-op-1` through `--alt-mesh-op-6` to `:root` (light values: 0.17, 0.21, 0.14, 0.19, 0.17, 0.12) and `.dark` (dark values: 0.66, 0.84, 0.44, 0.64, 0.36, 0.40) in `src/app/globals.css`.
- [x] Add `--alt-mesh-noise-opacity: 0.04` to `:root` and `--alt-mesh-noise-opacity: 0.055` to `.dark`.
- [x] Change `.dark { --alt-mesh-blend }` from `normal` to `overlay` (`:root` stays `multiply`). This makes the noise rect use `overlay` blend in dark, `multiply` in light.
- [x] In `@theme inline`: update `--animate-mesh-a..f` to remove `alternate` and set correct durations: `mesh-a 10s ease-in-out infinite`, `mesh-b 11s`, `mesh-c 13s`, `mesh-d 9s`, `mesh-e 8s`, `mesh-f 9s`.
- [x] Replace `@keyframes mesh-a..f` content with 3-stop `infinite` keyframes matching the reference (see design.md § "Updated Keyframes"). `mesh-f` becomes a vertical-sway-only animation (`translateY` 0 → -28px → 0).
- [x] Run `pnpm type-check`. Fix any errors.

Commit: `fix(design-tokens): add mesh opacity vars, correct blend mode, add term color vars, update keyframes`
Artifacts: `src/app/globals.css`, `docs/changes/home-animated-mesh-gradient/tasks.md`

---

### 8b: mesh-gradient.tsx — D-3 bezier paths

- [ ] Rewrite `src/components/home/mesh-gradient.tsx`: replace all 6 shapes with the exact D-3 bezier paths specified in design.md § "SVG Shape Contract". Use `<path>`, `<polygon>`, and `<ellipse>` per the table.
- [ ] Remove `mixBlendMode` from `<g>` entirely. The group is `<g filter="url(#home-mesh-blur)">` only.
- [ ] Each shape must use `style={{ opacity: 'var(--alt-mesh-op-N)' as any, transformBox: 'fill-box', transformOrigin: 'center', willChange: 'transform', animation: 'var(--animate-mesh-N)' }}`.
- [ ] Fix the noise `<filter>`: add `result="t"` to `<feTurbulence>` and `in2="t"` to `<feBlend>`. `<feBlend mode="overlay"/>` is kept in the filter definition.
- [ ] Noise overlay rect: `fill="#888"` with `style={{ mixBlendMode: 'var(--alt-mesh-blend)' as any, opacity: 'var(--alt-mesh-noise-opacity)' as any }}`.
- [ ] Verify in browser: dark mode shapes match D-3 (saturated, right-biased blobs); light mode matches L-3 (pastel, same positions). Disable JS to confirm CSS animation still runs.

Commit: `fix(home): rewrite MeshGradientBackground with D-3 bezier paths and per-shape opacity vars`
Artifacts: `src/components/home/mesh-gradient.tsx`, `docs/changes/home-animated-mesh-gradient/tasks.md`

---

### 8c: hero/index.tsx — layout and text color

- [ ] In `src/components/home/hero/index.tsx`: change `min-h-[65vh]` to `min-h-screen` on the `<section>`.
- [ ] On the inner grid `<div>`: add `md:items-center` (replace or add to existing `md:items-start` if present).
- [ ] Change `text-(--alt-ink)` on `<h1>` to `text-foreground`. Verify `data-testid="profile-name"` text is white in dark mode, `#171717` in light mode.
- [ ] Run `pnpm type-check`. Fix any errors.

Commit: `fix(home): full-height section, centered grid, fix h1 text color for dark mesh`
Artifacts: `src/components/home/hero/index.tsx`, `docs/changes/home-animated-mesh-gradient/tasks.md`

---

### 8d: add `geist` dependency

- [ ] Run `pnpm add geist` to install the `geist` package (verified absent: `grep -n "geist" package.json` and `find node_modules -maxdepth 1 -iname "*geist*"` both return zero matches). `terminal.ts`'s `TerminalLine` type and `terminalLines` content stay exactly as originally implemented — no changes to that file.
- [ ] Run `pnpm type-check`. Verify the `geist/font/pixel` import resolves with no type errors.

Commit: `chore(deps): add geist dependency for GeistPixelSquare pixel font`
Artifacts: `package.json`, `pnpm-lock.yaml`, `docs/changes/home-animated-mesh-gradient/tasks.md`

---

### 8e: terminal-animation.tsx — styling fix and data-driven rewrite

- [ ] In `src/components/home/hero/terminal-animation.tsx`: import `GeistPixelSquare` from `geist/font/pixel` and apply `className={GeistPixelSquare.className}` to the ASCII art `<span>` (replacing the plain `font-mono`), per design.md § "Terminal Styling & Font Fix".
- [ ] Replace the terminal container className — remove the gradient border / colored backdrop (`from-alt-grad-dev-s/20 via-alt-grad-prev-s/20 to-alt-grad-ship-s/20 ... bg-linear-to-r`) and apply the neutral frosted-glass styling from design.md: `border-border bg-background/65 grid min-h-75 w-full overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-md md:h-full`.
- [ ] Add a 3-dot `.term-bar` above the terminal lines: `<div className="mb-3 flex gap-1.5">` wrapping three `<div className="bg-muted-foreground/40 size-2.5 rounded-full" />` elements — reusing existing `bg-muted-foreground` token (no new `--alt-term-*` vars; see design.md § "Color token resolution" for why the existing token set already covers every role).
- [ ] Rewrite the render to be data-driven: derive a `steps` array directly from `terminalLines` (in the same order/shape) and render via `steps.map((step, i) => ...)` gated by a single `cursor: number` counter compared as `cursor > i`, replacing the current hardcoded `terminalLines[0]`/`terminalLines[3]`/`terminalLines[4]`/`terminalLines[5]` index lookups and their matching per-line `useState` flags. Use `switch (step.type)` with exhaustiveness checking to render each `TerminalLine` variant (`command | output | blank | ascii | final`).
- [ ] Keep the existing animation timing/sequence (path reveal → command typewriter → output reveal → ASCII fade-in → cursor blink) — only the index-lookup mechanism changes to `cursor`-driven iteration over `steps`; the sequence content and durations are unchanged.
- [ ] Verify: animation plays through the full `npm install` → `npm start` → ASCII art → cursor sequence without console errors; cursor blinks at the end; no "state update on unmounted component" warnings when navigating away; ASCII art renders in the `GeistPixelSquare` pixel font (visually distinct from `font-mono`).

Commit: `fix(home): apply GeistPixelSquare font, frosted-glass styling, and data-driven steps render to TerminalAnimation`
Artifacts: `src/components/home/hero/terminal-animation.tsx`, `docs/changes/home-animated-mesh-gradient/tasks.md`

---

### 8f: Final validation

- [ ] Run `pnpm type-check` — must pass with zero errors.
- [ ] Run `pnpm build` — must complete with zero errors.
- [ ] Browser verification (dark + light mode):
  - Dark mode: mesh matches D-3 (saturated blobs, right-biased, no blend mode artifact on text column).
  - Light mode: mesh matches L-3 (pastel tones, same positions).
  - Terminal plays `npm install` → `npm start` → ASCII art sequence; ASCII art renders in `GeistPixelSquare` pixel font; cursor blinks.
  - h1 text is white in dark, `#171717` in light.
  - Section is full viewport height.

Commit: `fix(home): D-3 reference alignment complete`
Artifacts: `docs/changes/home-animated-mesh-gradient/tasks.md`
