## Why

The home hero background is a CSS radial-gradient animation fixed to the full viewport — visually disconnected from the site's topographic-contour mesh gradient brand identity and technically incompatible with the new design system. The `BackgroundAnimation` component and its CSS file will be removed entirely, replaced by an inline SVG mesh gradient that is scoped to the hero section, zero-JS (Server Component), and theme-switched via CSS custom properties (`--alt-mesh-blend`, `--alt-grad-*` tokens defined in `globals.css`).

The terminal mockup is currently static text with no animation, and its layout collapses at the wrong breakpoint (lg/1024 px instead of md/768 px). The terminal needs a sequential reveal animation and the grid must collapse earlier.

## What Changes

1. **`BackgroundAnimation` removed** — component + CSS file deleted; `Home` simplifies to a single `<ProfileHero>`.
2. **`MeshGradientBackground` added** — Server Component, inline SVG with topographic-contour shapes, CSS `@keyframes` animation, theme switching via `--alt-*` CSS vars. Mounted inside `ProfileHero`'s `<section>` as `position:absolute`.
3. **`ProfileHero` layout updated** — grid collapses at md (768 px) instead of lg; terminal hidden at ≤768 px; eyebrow added above name; typography tokens aligned to DESIGN.md.
4. **`TerminalAnimation` rewritten** — Client Component, once-on-mount sequential state machine: path text-reveal → command typewriter → output text-reveal → GeistPixelSquare ASCII art fade-in → cursor blink loop. Content extracted to `src/lib/data/terminal.ts`.
5. **`globals.css` token integration** — `--gradient-1..5` removed (BackgroundAnimation废弃), `--alt-*` tokens already applied; no further changes needed.

## Non-Goals

- WebGL or GSAP animation — CSS `@keyframes` only.
- Mouse parallax on the mesh gradient.
- Scroll-triggered terminal animation — once-on-mount only.
- Changes to Notes, Projects, or About pages (covered by Change 3 and Change 4).
- OG image generation (covered by Change 3).

## Capabilities

### New Capabilities

- `home-mesh-gradient`: Topographic-contour SVG mesh gradient background for the home hero section, animated via CSS keyframes, theme-switched via CSS custom properties.
- `home-terminal-animation`: Sequential terminal reveal animation with path text-reveal, command typewriter, output text-reveal, GeistPixelSquare ASCII art, and cursor blink.

### Modified Capabilities

- `responsive-navbar`: Home hero grid breakpoint changes from lg (1024 px) to md (768 px); terminal hidden at ≤768 px.

## Impact

- Affected specs: `home-mesh-gradient` (new), `home-terminal-animation` (new), `responsive-navbar` (delta)
- Affected code:
  - New:
    - `src/components/home/mesh-gradient.tsx`
    - `src/lib/data/terminal.ts`
  - Modified:
    - `src/components/home/index.tsx`
    - `src/components/home/hero/index.tsx`
    - `src/components/home/hero/terminal-animation.tsx`
    - `src/app/globals.css`
  - Removed:
    - `src/components/home/background-animation.tsx`
    - `src/components/home/background-animation.css`
