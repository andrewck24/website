# Archived home-hero background components

Reference copies of the mesh-gradient exploration and the terminal mockup, moved out of `src/` once the home hero settled on a single background. **These files are not compiled** (`docs/` is excluded from tsconfig/build); they are kept for reference and easy restoration.

<!-- 現行背景動畫為 WebGL stripe-like swoosh（原方案 F）。其餘探索方案（A–E、原始 SVG）
與 TerminalAnimation 已封存於 docs/changes/home-animated-mesh-gradient/archived-components/
（方案 E 與 TerminalAnimation 仍可用，僅暫不啟用——還原方式見該資料夾 README）。 -->

## What's active vs archived

| Component                                                                      | Status                      | Notes                                                                                                                                                         |
| ------------------------------------------------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/home/mesh-gradient.tsx` (+ `mesh-gradient-shaders.ts`)         | **ACTIVE**                  | The current background — WebGL stripe-like "swoosh" (formerly "Plan F"). Renamed from `mesh-gradient-f*` → `mesh-gradient*`, export `MeshGradientBackground`. |
| `mesh-gradient-e.tsx` (+ `-e-shaders.ts`)                                      | **ARCHIVED — still usable** | Aurora-noise band, same architecture as the active one. Kept as a ready alternative.                                                                          |
| `terminal-animation.tsx` (+ `terminal.ts` data, `terminal-animation.test.tsx`) | **ARCHIVED — still usable** | The `~/projects $ npm…` terminal mockup that used to sit on the right of the hero. Currently the hero shows only the mesh background.                         |
| `mesh-gradient.tsx` (here)                                                     | archived (dead)             | The **original** SVG `feGaussianBlur` version (pre-WebGL). Superseded.                                                                                        |
| `mesh-gradient-a/b/c.tsx`                                                      | archived (dead)             | Rejected SVG/CSS prototypes (see table below).                                                                                                                |
| `mesh-gradient-d.tsx` (+ `-d-shaders.ts`)                                      | archived (dead)             | Radial-blob WebGL prototype, superseded by E/F.                                                                                                               |

> **Decision:** currently using **only the swoosh mesh (ex-F)**, without the terminal. Plan E and TerminalAnimation are intentionally available for future use — only temporarily disabled.

## How to restore a component

1. Move the file(s) back into `src/components/home/` (and `terminal.ts` back to `src/lib/data/`, its test back to `src/components/home/__tests__/`).
2. Fix imports if needed: archived files use `@/…` / `./…` paths that resolve once back in `src`.
3. **TerminalAnimation** also needs the `geist` package (uninstalled when archived): `pnpm add geist` (it imports `GeistPixelSquare` from `geist/font/pixel`). Then re-add `<TerminalAnimation className="min-h-75 w-full grow-3 md:h-full" />` inside the hero flex row in `index.tsx`.
4. **Plan E**: import `{ MeshGradientBackgroundE }` from the restored file in `index.tsx` instead of the active `MeshGradientBackground`. Uses `ogl` (already a dependency).

## Why each prototype was abandoned (do not retry without new reason)

| Approach                                                                 | Verdict                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Original SVG `feGaussianBlur` over animated shapes                       | ❌ per-frame filter recompute = mobile jank (the original problem)                                                                                                                                                       |
| A — static filtered group + drift                                        | ❌ loses per-shape organic motion                                                                                                                                                                                        |
| B — CSS radial-gradients                                                 | ❌ fills viewport, wrong composition                                                                                                                                                                                     |
| C — CSS `blur()` wrapping animation                                      | ❌ same "filter wraps animation" cost; jank on real device                                                                                                                                                               |
| D — radial-blob WebGL                                                    | superseded by the swoosh look (E/F)                                                                                                                                                                                      |
| `shadergradient` (r3f + Three.js)                                        | ❌ overkill: Three.js bundle + per-pixel PBR                                                                                                                                                                             |
| Intro reveal (shader `uReveal` / CSS `@keyframes` / gate-on-first-frame) | ❌ none worked reliably on real mobile; removed. A JS/rAF-timed reveal can't guarantee visibility (rAF throttling); a fade started at DOM-mount plays over a still-blank canvas (WebGL first-frame can exceed the fade). |
| 30fps FPS throttle                                                       | ❌ visible choppiness (halves temporal resolution); dpr→1 used instead                                                                                                                                                   |
| Static CSS-gradient placeholder                                          | ❌ a static gradient can't resemble the curved/animated/noise swoosh — read as a mismatched smudge                                                                                                                       |

## Active implementation — key facts (the swoosh / ex-F)

- **OGL** (not Three.js — ~tens of KB). Client component, full-bleed, `h-dvh` (not `100vh`, to avoid mobile overshoot).
- **Stripe-style swoosh band**: quadratic centerline `xc(t)=0.16+0.50t+0.50t²`; right-anchored aspect correction `px = 1 - (1-uv.x)*(aspect/1.6)` (narrow screens keep the bottom-right tail); width tapers narrow→wide top→bottom via `w = mix(0.18,0.46, vT)`.
- **Hybrid vertex/fragment**: vertex computes only smooth fields (band coords + low-freq snoise); fragment does the sharp shaping (sin/smoothstep/pow) + color mix per-pixel. (Sharp shaping in the vertex shader caused Gouraud-interpolation aliasing.) Mesh 96×96.
- **Un-premultiply**: `outColor = color / max(coverage, 1e-3)` before output (GL SRC_ALPHA blending would otherwise square alpha → muddy).
- **Theme handling — no MutationObserver**: colors (`--alt-grad-*`, :root only) and opacities (`--alt-mesh-op-*`, unified across themes) are theme-independent → read once. Only `uSaturation` differs per theme (light boosts chroma vs white bg), driven by a cheap `classList.contains('dark')` check in the loop reading `--alt-mesh-saturation` (replaced a per-frame CSS `saturate()` filter).
- **Perf**: dpr capped to 1 on touch devices / 1.5 desktop; `antialias/depth/stencil: false`; pause via `document.visibilitychange` (NOT IntersectionObserver — that broke on mobile scroll); eager init (no requestIdleCallback — deferring made the gradient appear later).
- **OGL lifecycle gotcha**: `Program.setShaders` early-returns on link failure → `program.uniformLocations` undefined → `program.use()` throws `…forEach`. Guard: `if (gl.isContextLost() || !program.uniformLocations) return;`. Do NOT call `loseContext()` in cleanup (poisons the canvas for dev StrictMode re-mount).

## Core principles

- **Where the math runs sets the ceiling**: vertex shader runs ~vertex-count times (hundreds); fragment ~pixel-count (millions, ∝ dpr²). Smooth fields per-vertex; only genuinely sharp detail per-pixel.
- **A filter wrapping animated content re-rasterizes every frame** — true for SVG `<filter>`, CSS `filter`, and CSS `filter` on an animating canvas.
- **Mount latency ≠ sustained smoothness** — independent axes.

## Open / unresolved

- **Mount latency (gradient appears later than the rest).** Measured (desktop dev): the component's effect runs ~381ms after navigation; WebGL init+compile+first-draw is only ~42ms. **The dominant cost is the ~381ms before the effect runs — JS bundle download/parse + React hydration** (the rest of the page is server-rendered HTML/CSS, instant; the mesh is client-only). On mobile over the LAN **dev** server this inflates (uncompressed bundle, on-demand Turbopack compile). Production confirmed somewhat faster but still has room. Not-yet-tried levers: reduce page client-JS/hydration cost; persistent WebGL canvas across navigation (keep one canvas, update uniforms) — also enables shader-program reuse.
- **iOS fixed-navbar + dynamic URL bar**: scroll-state detection switched from IntersectionObserver-sentinel to a `scrollY` check (more reliable on mobile). A separate "navbar clicks dead after scroll on mobile" report is still under investigation (suspect: `viewTransition: true` experimental flag, or iOS fixed-element hit-area desync).
