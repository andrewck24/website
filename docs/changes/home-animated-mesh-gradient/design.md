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

## Risks / Trade-offs

- **`transform-box: fill-box` browser support**: All modern browsers support it; Safari 15.4+ is fine. No fallback needed for the target audience.
- **GeistPixelSquare availability**: The `geist` package is already installed (`pnpm i geist`). The pixel font is at `geist/font/pixel`. If the import path changes in a future `geist` release, the ASCII art falls back to the terminal's default monospace.
- **Terminal `useEffect` + `setTimeout` cleanup**: The cleanup function in `useEffect` must clear all pending timeouts and intervals to prevent state updates on unmounted components. Implement with a `stopped` flag and collect all timeout IDs.
