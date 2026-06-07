## Context

The home page currently renders via `Home` → `BackgroundAnimation` + `ProfileHero`. `BackgroundAnimation` is a `fixed top-0 left-0 h-screen w-screen` overlay of five CSS radial-gradient divs, disconnected from the topographic-contour mesh gradient brand identity. `ProfileHero` contains `TerminalAnimation`, which is a static `<pre><code>` block with no animation. The hero grid collapses at lg (1024 px) — too wide — and there is no eyebrow above the name.

Design token unification (`globals.css`) is already complete: `--alt-grad-*` tokens and `--alt-mesh-blend` are live.

## Goals / Non-Goals

**Goals:**

- Replace the full-page `BackgroundAnimation` with a hero-scoped topographic SVG mesh gradient.
- Implement once-on-mount sequential terminal reveal animation.
- Collapse the two-column hero grid at md (768 px) and hide the terminal below that breakpoint.
- Zero JS cost for the mesh gradient (Server Component, CSS-driven animation and theming).
- Flash-free dark/light theme switching via CSS custom properties — no `useTheme()` in `MeshGradientBackground`.

**Non-Goals:**

- WebGL, canvas, or GSAP — CSS `@keyframes` only.
- Mouse parallax or scroll-triggered animation.
- Changes to any page other than the home hero.

## Decisions

### 1. `MeshGradientBackground` is a Server Component

The mesh gradient SVG contains only static markup; animation is pure CSS. No state, no effects, no event listeners. Rendered as an inline SVG (`position: absolute; inset: 0; width: 100%; height: 100%`) inside `ProfileHero`'s `<section>`, which keeps `position: relative; overflow: hidden`. The SVG background is provided by `<rect fill="var(--alt-mesh-bg)" />` where `--alt-mesh-bg` is set to `oklch(0.085 0 0)` in `:root` and `oklch(0.985 0 0)` in `.dark` — the inverse of the page background so the hero always contrasts with the rest of the page.

Wait — actually per the design discussion, the hero section is transparent (inherits page background). The SVG rect provides the hero's visual background. So `:root` SVG rect = dark (`#080808`) and `.dark` should also dark... Actually the mesh is always a dark-mode-first surface even on light pages. Let me re-check: from DESIGN.md, the home hero is dark (`#080808` background) OR light (`#fafafa` background) depending on the site's current color mode. So:

```css
:root {
  --alt-mesh-bg: oklch(0.085 0 0);
} /* dark hero on light page? */
```

Wait, per the design session: home hero has `hero-dark` and `hero-light` variants. The mesh gradient's dark/light mode is driven by next-themes. The section's background comes from the SVG rect, which switches via CSS var.

Final decision: Add `--alt-mesh-bg` to `globals.css`:

```css
:root {
  --alt-mesh-bg: oklch(0.051 0 0);
} /* #080808 — dark hero bg */
.dark {
  --alt-mesh-bg: oklch(0.051 0 0);
} /* same — hero is always dark bg */
```

Actually, per preview.html, both dark and light mode heroes were explored. The decision was D3/L3 — there IS a light mode. So hero background must switch. The SVG rect in dark mode = `#080808`; in light mode = `#fafafa`. Since `.dark` means the page is in dark mode, the hero should ALSO be dark:

```css
:root {
  --alt-mesh-bg: oklch(0.985 0 0);
} /* light page → light hero (#fafafa) */
.dark {
  --alt-mesh-bg: oklch(0.051 0 0);
} /* dark page → dark hero (#080808) */
```

### 2. Theme switching: CSS vars, not `useTheme()`

`useTheme()` produces `undefined` on the first SSR render, causing hydration mismatch if used to conditionally render light vs dark SVG shapes. All theme-driven values are CSS custom properties:

```css
:root {
  --alt-mesh-blend: multiply;
  --alt-mesh-bg: oklch(0.985 0 0);
}
.dark {
  --alt-mesh-blend: normal;
  --alt-mesh-bg: oklch(0.051 0 0);
}
```

The SVG shape group: `<g filter="…" style={{ mixBlendMode: 'var(--alt-mesh-blend)' }}>`.
Gradient stop fills use `var(--alt-grad-dev-s)` etc. so they automatically resolve to the correct oklch values without any runtime logic.

### 3. Shape animations: CSS `@keyframes` on SVG elements

Each shape has `style={{ transformBox: 'fill-box', transformOrigin: 'center', willChange: 'transform' }}` and an `animation` shorthand. No JS RAF loop. The `MeshGradientBackground` component exports only SVG markup — no side effects.

Shape durations: 9–13 s, translates ±68 px, scale 0.93–1.09, rotate ±8° on rotated rects. Added to `@theme inline` in `globals.css` as `--animate-mesh-*` tokens.

### 4. `TerminalAnimation`: once-on-mount state machine

State is a single `step: number` counter. Each step maps to one animation action (reveal path, start typewriter, reveal output line, show ASCII art, idle). A `useEffect` runs on mount, calling `setTimeout` chains sequenced by the sum of all preceding step durations. No `transitionend` callbacks — durations are known constants.

Typewriter effect: JS `setInterval` building a displayed string character-by-character. Speed: 40 ms/char.

Text-reveal: CSS class toggle (`.is-shown` on parent triggers `opacity/translateY/blur` transitions per the `StaggerReveal` CSS pattern). Applied via `useState` for each line's `shown` flag.

ASCII art: `GeistPixelSquare` font renders "andrewck24" at `clamp(24px, 4vw, 56px)`. Fades in after the `npm start` command completes typing. The font is imported from `geist/font/pixel`.

Terminal content lives in `src/lib/data/terminal.ts` as a typed array of `TerminalLine` objects. The `TerminalAnimation` component imports this and renders purely from the data.

### 5. `ProfileHero` layout

- Grid: `md:grid-cols-2` (was `lg:grid-cols-2`)
- Terminal column: `hidden md:block`
- Eyebrow: new `<p>` above `<h1>` with `caption-mono` typography
- Typography tokens: name uses `display-xl` (clamp 48–80 px), title uses `body-lg` with `--alt-hairline-strong` color, bio uses `body-lg` with `on-primary` color on dark mesh

## Implementation Contract

### `MeshGradientBackground` — Server Component

**Behavior**: Renders a full-bleed SVG with 6 animated topographic shapes inside the hero section. The SVG blends via CSS var so dark/light mode switch is flash-free. No JS is shipped for this component.

**Interface**:

```tsx
// No props. Reads CSS vars from globals.css at runtime.
export function MeshGradientBackground(): JSX.Element;
```

**Acceptance criteria**:

- Component has no `"use client"` directive.
- SVG has `position:absolute; inset:0; width:100%; height:100%`.
- `<g style={{ mixBlendMode: 'var(--alt-mesh-blend)' }}>` wraps all shapes.
- Each shape fill is `var(--alt-grad-*)`, not a hardcoded hex value.
- Shapes animate continuously without JS — verified by disabling JS in browser DevTools.
- `pnpm type-check` passes.

### `TerminalAnimation` — Client Component

**Behavior**: Once mounted, plays through the sequence: path text-reveal → command typewriter → output text-reveal → blank delay → path text-reveal → command typewriter → ASCII art fade-in → cursor blink (loop). Does not replay on route navigation unless the component unmounts/remounts.

**Interface**:

```ts
// src/lib/data/terminal.ts
type TerminalLine =
  | { type: "command"; path: string; cmd: string }
  | { type: "output"; text: string }
  | { type: "blank" }
  | { type: "ascii"; content: string }
  | { type: "final"; path: string };

export const terminalLines: TerminalLine[];
```

```tsx
// No props. Reads from terminalLines.
export function TerminalAnimation(): JSX.Element;
```

**Acceptance criteria**:

- Path text reveals after previous output completes (not simultaneously).
- Command types character-by-character at ~40 ms/char after path reveal finishes.
- ASCII art ("andrewck24" in GeistPixelSquare) fades in after `npm start` typewriter finishes.
- Cursor blinks on the final line after all content is shown.
- `pnpm type-check` passes.
- Component renders correctly with JS disabled (SSR fallback shows static final state or empty terminal — no crash).

### `ProfileHero` layout

**Acceptance criteria**:

- At ≥768 px: two-column grid, terminal visible.
- At <768 px: single column, terminal hidden, name font clamps.
- Eyebrow text ("Portfolio · Taipei, Taiwan") appears above `<h1>` in `caption-mono` style.

### globals.css additions

Two new custom properties added to `:root` and `.dark`:

- `--alt-mesh-bg`: oklch value for the SVG background rect
- The existing `--alt-mesh-blend` and `--alt-grad-*` are already present

**Acceptance criteria**:

- `pnpm type-check` and `pnpm build` pass with no errors.

## Correction Pass — D-3 Reference Alignment

### SVG Shape Contract (replaces original Section 2 shapes)

**Exact bezier paths from D-3 (viewBox 0 0 1400 600):**

| #   | Element     | d / points / attrs                                                                                                                              | Fill var            | Dark opacity | Light opacity | Animation    |
| --- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------ | ------------- | ------------ |
| 1   | `<path>`    | `M654,290 C718,158 898,114 1028,172 C1126,216 1152,316 1152,346 C1152,428 1088,494 898,476 C692,454 604,382 664,316 C724,258 654,290 654,290 Z` | `--alt-grad-dev-s`  | 0.66         | 0.17          | `mesh-a 10s` |
| 2   | `<path>`    | `M798,254 C870,160 1034,150 1124,226 C1188,280 1172,366 1106,394 C1028,420 966,376 922,320 C888,282 798,254 798,254 Z`                          | `--alt-grad-prev-s` | 0.84         | 0.21          | `mesh-b 11s` |
| 3   | `<path>`    | `M460,432 L1024,132 L1168,232 L604,532 Z`                                                                                                       | `--alt-grad-dev-e`  | 0.44         | 0.14          | `mesh-c 13s` |
| 4   | `<path>`    | `M858,278 C922,210 1044,228 1100,292 C1160,360 1096,426 988,416 C888,408 804,336 858,278 Z`                                                     | `--alt-grad-prev-e` | 0.64         | 0.19          | `mesh-d 9s`  |
| 5   | `<polygon>` | `points="916,186 1110,190 1150,308 1070,406 898,360 844,254"`                                                                                   | `--alt-grad-ship-e` | 0.36         | 0.17          | `mesh-e 8s`  |
| 6   | `<ellipse>` | `cx="758" cy="238" rx="178" ry="76" transform="rotate(-34 758 238)"`                                                                            | `--alt-grad-ship-s` | 0.40         | 0.12          | `mesh-f 9s`  |

**Group rule**: `<g filter="url(#home-mesh-blur)">` — NO `mixBlendMode` on the group.

**Per-shape opacity via CSS vars** (instead of static `opacity` attribute):

```css
/* :root (light mode) */
--alt-mesh-op-1: 0.17;
--alt-mesh-op-2: 0.21;
--alt-mesh-op-3: 0.14;
--alt-mesh-op-4: 0.19;
--alt-mesh-op-5: 0.17;
--alt-mesh-op-6: 0.12;
--alt-mesh-blend: multiply;
--alt-mesh-noise-opacity: 0.04;

/* .dark */
--alt-mesh-op-1: 0.66;
--alt-mesh-op-2: 0.84;
--alt-mesh-op-3: 0.44;
--alt-mesh-op-4: 0.64;
--alt-mesh-op-5: 0.36;
--alt-mesh-op-6: 0.4;
--alt-mesh-blend: overlay;
--alt-mesh-noise-opacity: 0.055;
```

Each shape: `style={{ opacity: 'var(--alt-mesh-op-N)' as any, transformBox: 'fill-box', transformOrigin: 'center', willChange: 'transform', animation: 'var(--animate-mesh-N)' }}`

**Noise filter** (corrected SVG):

```html
<filter id="home-mesh-noise">
  <feTurbulence
    type="fractalNoise"
    baseFrequency="0.74"
    numOctaves="{3}"
    stitchTiles="stitch"
    result="t"
  />
  <feBlend in="SourceGraphic" in2="t" mode="overlay" />
</filter>
```

Noise overlay rect: `fill="#888"` `style={{ mixBlendMode: 'var(--alt-mesh-blend)' as any, opacity: 'var(--alt-mesh-noise-opacity)' as any }}`

### Updated Keyframes (replaces 2-stop alternate animations)

3-stop `infinite` keyframes matching reference motion (no `alternate`):

```css
@keyframes mesh-a {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(68px, -50px) scale(1.07);
  }
  66% {
    transform: translate(-42px, 38px) scale(0.94);
  }
}
@keyframes mesh-b {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  40% {
    transform: translate(-58px, 64px) scale(1.09);
  }
  70% {
    transform: translate(48px, -32px) scale(0.93);
  }
}
@keyframes mesh-c {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  35% {
    transform: translate(44px, 52px) rotate(8deg);
  }
  70% {
    transform: translate(-54px, -38px) rotate(-7deg);
  }
}
@keyframes mesh-d {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-56px, 50px) scale(1.06);
  }
}
@keyframes mesh-e {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  45% {
    transform: translate(52px, -60px) scale(1.08);
  }
  80% {
    transform: translate(-36px, 32px) scale(0.94);
  }
}
@keyframes mesh-f {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-28px);
  }
}
```

`@theme inline` token updates:

```css
--animate-mesh-a: mesh-a 10s ease-in-out infinite;
--animate-mesh-b: mesh-b 11s ease-in-out infinite;
--animate-mesh-c: mesh-c 13s ease-in-out infinite;
--animate-mesh-d: mesh-d 9s ease-in-out infinite;
--animate-mesh-e: mesh-e 8s ease-in-out infinite;
--animate-mesh-f: mesh-f 9s ease-in-out infinite;
```

### h1 Text Color Fix

`text-(--alt-ink)` (`oklch(0.205 0 0)` = `#171717`, always dark) is invisible on the `#080808` dark hero background. Replace with `text-foreground` which resolves to `oklch(0.205 0 0)` in light mode and `oklch(1 0 0)` (white) in dark mode.

### Section Layout Fix

- `min-h-[65vh]` → `min-h-screen` (matches reference 100vh hero)
- Grid inner div: add `md:items-center` (was `md:items-start`)

### Terminal Styling & Font Fix

**Content stays unchanged** — the original `npm install andrewck24@latest` → `npm start` → ASCII art sequence is an intentional feature added beyond the D-3 reference (D-3 shows a `pnpm build`/`git push` sequence, but the ASCII art was a deliberate addition the user layered on top of the reference design). `terminal.ts`'s `TerminalLine` type (including the `ascii` variant) and `terminalLines` data remain exactly as originally implemented — no content or type changes.

**What's actually wrong**:

1. **`GeistPixelSquare` font never applied**: the `geist` package is NOT installed (`grep -n "geist" package.json` → 0 matches; `find node_modules -maxdepth 1 -iname "*geist*"` → 0 results), so `ascii.content` renders with plain `font-mono` instead of the pixel font the design called for. Fix: add the `geist` dependency (`pnpm add geist`), import `GeistPixelSquare` from `geist/font/pixel`, and apply `className={GeistPixelSquare.className}` to the ASCII `<span>`.
2. **Container styling diverges from D-3 frosted glass**: the current container uses a gradient-tinted card (`from-alt-grad-dev-s/20 via-alt-grad-prev-s/20 to-alt-grad-ship-s/20 ... bg-linear-to-r`). D-3 uses a neutral frosted-glass surface with a 3-dot `.term-bar` above the content — both are absent from the current implementation.

**Color token resolution**: D-3's terminal mockup CSS (`preview.html` `.tp`/`.tc`/`.tok`/`.ti`/`.term-dot` rules) uses raw hex values (`#4ade80`, `#16a34a`, `#d4d4d4`, `#86efac`, `#93c5fd`, `rgba(0,0,0,.1)`, etc.) that exist in neither `globals.css`'s `--alt-*`/shadcn token set nor `DESIGN.md`'s color table. Introducing brand-new `--alt-term-*` vars would smuggle undocumented hex values into the token layer for a single component, violating "never use raw hex in component code". Because the _kept_ content has no `info`/`ok` semantic lines (those belonged to the discarded D-3 `pnpm build`/`git push` sequence), the existing token set already covers every role the kept terminal needs — reuse it directly instead of adding new tokens:

| Element                | Token                                | Notes                                                                          |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------ |
| Path/prompt (`.tp`)    | `text-muted-foreground`              | Already applied in current code — unchanged                                    |
| Command text (`.tc`)   | default `text-foreground`            | Already applied (implicit) — unchanged                                         |
| Output text (`.tok`)   | default `text-foreground`            | Already applied (implicit); palette has no green equivalent and none is needed |
| `.term-bar` background | `bg-muted`                           | Existing neutral inset-surface token                                           |
| `.term-dot` (3 dots)   | `bg-muted-foreground/40`             | Existing mute token at reduced opacity                                         |
| `.term-cur` (cursor)   | existing `animate-blink` + `▋` glyph | Already implemented — unchanged                                                |

**Container styling fix** (replaces the gradient-tinted card with a neutral frosted-glass surface, reusing existing `bg-background`/`border-border` tokens):

```tsx
className =
  "border-border bg-background/65 grid min-h-75 w-full overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-md md:h-full";
```

**3-dot term-bar** (new — rendered above the terminal lines, inside the `<pre>`):

```tsx
<div className="mb-3 flex gap-1.5">
  {[0, 1, 2].map((i) => (
    <div key={i} className="bg-muted-foreground/40 size-2.5 rounded-full" />
  ))}
</div>
```

### Animation render pattern: data-driven `steps.map()`

Replace the hardcoded positional indices (`terminalLines[0]`, `terminalLines[3]`, `terminalLines[4]`, … and per-line `useState` flags matched to those guessed positions) with a `steps` array derived directly from `terminalLines` and rendered via `steps.map((step, i) => ...)`, gated by a single `cursor: number` counter compared as `cursor > i`. The state machine advances `cursor` on a timer; the render loop and the sequencing loop both walk the same array by the same index, so reordering or extending `terminalLines` can never desynchronize them — there is no second hardcoded index to fall out of step. A `switch (step.type)` with exhaustiveness checking (`satisfies never` on the default branch) renders each `TerminalLine` variant (`command | output | blank | ascii | final`).

## Risks / Trade-offs

- **`transform-box: fill-box` browser support**: All modern browsers support it; Safari 15.4+ is fine. No fallback needed for the target audience.
- **`geist` is a new dependency**: not currently installed (verified via `grep -n "geist" package.json` and `find node_modules -maxdepth 1 -iname "*geist*"`, both returning zero matches). Must be added with `pnpm add geist`; the pixel font is at `geist/font/pixel`. If the import path changes in a future `geist` release, the ASCII art falls back to the terminal's default monospace.
- **Terminal `useEffect` + `setTimeout` cleanup**: The cleanup function in `useEffect` must clear all pending timeouts and intervals to prevent state updates on unmounted components. Implement with a `stopped` flag and collect all timeout IDs.
