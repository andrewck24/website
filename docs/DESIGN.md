---
version: beta
name: andrewck24-design-system
description: Design system for andrewck24.com — a stark black-and-ink duet on near-white canvas, broken at hero and card scale by a topographic-contour SVG mesh gradient (nested organic loops + diagonal cross-sweep band, rendered in cyan / blue / magenta / violet / amber / coral) that acts as the entire decorative system, layered beneath a square grid overlay as the OG brand surface. Typeset in a geometric sans for all narrative text and a monospaced face for technical labels.

colors:
  graphite: "#171717"
  on-primary: "#ffffff"
  ink: "#171717"
  slate: "#4d4d4d"
  smoke: "#888888"
  hairline: "#ebebeb"
  pewter: "#a1a1a1"
  chalk: "#ffffff"
  paper: "#fafafa"
  fog: "#f5f5f5"
  soot: "#080808"
  link: "#0070f3"
  link-deep: "#0761d1"
  link-bg-soft: "#d3e5ff"
  success: "#0070f3"
  error: "#ee0000"
  error-soft: "#f7d4d6"
  error-deep: "#c50000"
  warning: "#f5a623"
  warning-soft: "#ffefcf"
  warning-deep: "#ab570a"
  violet: "#7928ca"
  violet-soft: "#d8ccf1"
  violet-deep: "#4c2889"
  cyan: "#50e3c2"
  cyan-soft: "#aaffec"
  cyan-deep: "#29bc9b"
  highlight-pink: "#ff0080"
  highlight-magenta: "#eb367f"
  gradient-develop-start: "#007cf0"
  gradient-develop-end: "#00dfd8"
  gradient-preview-start: "#7928ca"
  gradient-preview-end: "#ff0080"
  gradient-ship-start: "#ff4d4d"
  gradient-ship-end: "#f9cb28"
  selection-bg: "#171717"
  selection-fg: "#f2f2f2"

typography:
  display-xl:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 48px
    fontWeight: 600
    lineHeight: 48px
    letterSpacing: -2.4px
  display-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 32px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: -1.28px
  display-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: -0.96px
  display-sm:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.6px
  body-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
    letterSpacing: 0px
  body-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
  body-sm:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: -0.28px
  body-sm-strong:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: -0.28px
  caption:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  caption-mono:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  code:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
  button-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  button-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill-sm: 64px
  pill: 100px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 40px
  3xl: 48px
  4xl: 64px
  5xl: 96px
  6xl: 128px
  section: 192px

components:
  nav-bar:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    height: 64px
    padding: "{spacing.sm} {spacing.lg}"
  nav-link:
    textColor: "{colors.slate}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.sm}"
  nav-cta-signup:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.xs}"
    height: 28px
  nav-cta-login:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.xs}"
    height: 28px
  nav-cta-ask-ai:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.xs}"
    height: 28px
  button-primary:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.sm}"
  button-secondary:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.sm}"
  button-primary-sm:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.xs}"
  button-secondary-sm:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "0px {spacing.xs}"
  tab-ghost:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill-sm}"
    padding: "0px {spacing.md}"
  icon-button-circular:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.full}"
  card-marketing:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  card-marketing-large:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  card-soft:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  template-card:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  code-editor-mockup:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.on-primary}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  form-input:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 40px
  form-input-sm:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 32px
  form-input-lg:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 48px
  badge-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.slate}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "0px {spacing.xs}"
  pricing-card:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  pricing-card-featured:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  logo-strip:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.slate}"
    typography: "{typography.body-sm}"
    padding: "{spacing.lg} {spacing.xl}"
  hero-band:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.4xl} {spacing.lg}"
  feature-mesh-band:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.lg}"
  showcase-band-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.lg}"
  showcase-band-dark:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-lg}"
    padding: "{spacing.5xl} {spacing.lg}"
  footer:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.slate}"
    typography: "{typography.body-sm}"
    padding: "{spacing.4xl} {spacing.lg}"
  link-inline:
    textColor: "{colors.link}"
    typography: "{typography.body-md}"
  banner-marketing:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.slate}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.sm}"

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default tier card. Mirrors pricing-card chrome on paper surface with a hairline border."
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-pricing-tier-featured:
    description: "Featured tier — polarity-flipped to ink primary with white text and white CTA."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-product-selector:
    description: "What's Included summary card — repurposed for the brand's GPU / inference / Pro feature tiers."
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  ex-cart-drawer:
    description: "Subscription summary — line items per add-on (NOT a literal e-commerce cart)."
    backgroundColor: "{colors.chalk}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
    item-divider: "{colors.hairline}"
  ex-app-shell-row:
    description: "Sidebar nav row. Active state uses brand primary as a left-edge indicator bar."
    backgroundColor: "{colors.chalk}"
    activeIndicator: "{colors.graphite}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
  ex-data-table-cell:
    description: "Mirrors the brand's table chrome. Header uses caption-mono uppercase mono; body uses body-sm."
    headerBackground: "{colors.paper}"
    headerTypography: "{typography.caption-mono}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.xs} {spacing.sm}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Mirrors card-marketing-large chrome with form-input primitives inside."
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-modal-card:
    description: "Modal dialog surface — same chrome as card-marketing-large with Level 5 modal shadow."
    backgroundColor: "{colors.chalk}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-empty-state-card:
    description: "Empty-state illustration frame. Generous padding on paper."
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "{spacing.3xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification surface — flat-cornered card-marketing chrome with Level 4 shadow."
    backgroundColor: "{colors.chalk}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    typography: "{typography.body-sm}"
---

## Overview

andrewck24.com is a personal portfolio and writing site for a software engineer based in Taipei, Taiwan. The design language is a direct interpretation of Vercel's aesthetic discipline — one of the cleanest stark systems on the web: near-white `{colors.paper}` body background, ink-near-black `{colors.ink}` text, a deliberate gray scale that gives every divider, border, and disabled state its own deliberate step. The site extends this system with a single signature decorative element: a **topographic-contour SVG mesh gradient** rendered in all six brand gradient tokens plus coral accent. That gradient is the entire decoration system.

The surface palette spans four neutral tones built around a strict two-role model — page canvas vs. elevated container, with the elevated surface always perceptibly lighter: `{colors.chalk}` (pure white — cards, dialogs, popovers), `{colors.paper}` 98% (the page body — almost every section sits here), `{colors.fog}` 95% (occasional inset regions, never a surface role of its own), `{colors.graphite}` (the deep ink-near-black used as the polarity-flipped dark band when a section needs to invert). Shadows are exceptionally subtle — every elevated card carries a stacked shadow built from `0px 1px 1px #00000005` + `0px 2px 2px #0000000a` + an inset hairline border. Cards never float on a heavy drop-shadow; they sit on the page held by hairline + soft glow.

Type is the second decisive voice. Geist (geometric sans) carries display, body, and button — everything narrative — at weight 600 for display, 500 for buttons, 400 for body. Geist Mono carries technical labels: terminal mockups, code blocks, filename captions. Headlines are sentence-case with aggressive negative letter-spacing (`-2.4px` at 48 px hero) — the system never letter-spaces positively, never goes uppercase outside of mono labels.

**Key Characteristics:**

- A single black-ink primary CTA `{colors.graphite}` carries every conversion target, paired with `button-secondary` for secondary actions. Marketing CTAs use the 100 px pill shape; nav-scale buttons use the 6 px square radius.
- The **topographic-contour mesh gradient** is the only decorative chrome — used at hero and BusinessCard scale only, never miniaturised. Switching a section from `{colors.paper}` to `{colors.graphite}` (the polarity-flipped dark band) is the chief depth cue between sections.
- OG images pair the mesh gradient with a **square grid overlay** (95 px grid, hairline lines at 4–6% opacity) as the second brand surface element.
- Every section eyebrow and technical label uses `{typography.caption-mono}` or `{typography.code}`; everything narrative is in the geometric sans.
- Subtle stacked-shadow elevation — three small offsets layered with 4–12% black opacity, plus an inset hairline ring — never a single heavy drop-shadow.
- The gradient colour system uses six tokens across three development-rhythm pairs (Develop / Preview / Ship) that collapse into a single multi-colour mesh in hero contexts.

## Colors

### Brand & Accent

- **Graphite** (`{colors.graphite}` — `#171717`, inverts to near-white in dark mode): The single primary CTA color. Black-near-pure ink that carries every Sign Up pill, every footer CTA, the dark-band polarity-flip. Distinct from the non-inverting `{colors.ink}` despite sharing its light-mode hex — the two serve different roles (theme-inverting accent vs. permanent text color). (Resolved from `--alt-gray-1000`.)
- **Cyan** (`{colors.cyan}` — `#50e3c2`): A signature mint-cyan used in the brand gradient and inside Geist-system spotlight tokens. Visible inside the hero gradient stops.
- **Highlight Pink** (`{colors.highlight-pink}` — `#ff0080`): The brand's highlight magenta, used as the high-saturation stop in the preview-gradient pair.
- **Violet** (`{colors.violet}` — `#7928ca`): The deep purple used as the start of the preview-gradient and inside developer-console highlights.
- **Link Blue** (`{colors.link}` — `#0070f3`): The brand's primary link color and the legacy `--geist-success` semantic.

### Surface

The site defines exactly two surface roles — the page canvas (`{colors.paper}` light / `{colors.soot}` dark) and the elevated container surface (`{colors.chalk}` light / `{colors.ink}` dark) — with the elevated surface always perceptibly lighter than the page behind it, in both modes.

**Component token assignments**: Card, Popover, and Empty-state all sit on the elevated surface — `--card` / `--popover` (Chalk on Paper in light mode, Ink on Soot in dark mode), which shadcn/ui keeps as parity-valued per-slot tokens. **Dialog is the deliberate exception**: its content surface is `--background` (Paper / Soot), not `--card` — a Dialog overlays the page rather than nesting inside another elevated surface, so it inherits the canvas role directly. Don't "fix" this by switching Dialog to `--card`; that would make the dialog indistinguishable from a card floating on its own backdrop.

- **Chalk** (`{colors.chalk}` — `#ffffff`): Brightest, coolest white. The elevated card / dialog / popover / empty-state surface in light mode — pure white against the `{colors.paper}` page, so it reads as "popped above" the canvas.
- **Paper** (`{colors.paper}` — `#fafafa`): Warm near-white. The default page background — 98% white. Almost every section sits on this tone.
- **Fog** (`{colors.fog}` — `#f5f5f5`): Inset/recessed grayish-white. A slightly deeper inset surface for "code editor inner background", template-card hover states, and dropdown menus.
- **Soot** (`{colors.soot}` — `#080808`): Near-black. The dark-mode page background — the canvas role's dark-mode counterpart to `{colors.paper}`, one step darker than `{colors.ink}` so elevated surfaces still read as "popped above" the page.
- **Hairline** (`{colors.hairline}` — `#ebebeb`): 1 px dividers — table rows, card borders, input borders.
- **Pewter** (`{colors.pewter}` — `#a1a1a1`): Stronger divider / de-emphasized text. The 500-level gray, used as the slightly-stronger divider on light bands and as the deemphasised text color.

### Text

- **Ink** (`{colors.ink}` — `#171717`): Every heading and body paragraph on light surfaces. Also the elevated card / dialog / popover surface color in dark mode — one step lighter than `{colors.soot}`, preserving the "card pops off the page" relationship across modes.
- **Slate** (`{colors.slate}` — `#4d4d4d`): Secondary text — sub-headings, body captions, nav-link inactive text, footer column body.
- **Smoke** (`{colors.smoke}` — `#888888`): Lowest-priority text — placeholder text, fine print, low-key labels.
- **On Primary** (`{colors.on-primary}` — `#ffffff`): All text on `{colors.graphite}` surfaces.

### Semantic

- **Success / Link** (`{colors.success}` — `#0070f3`): The brand's legacy success indicator doubles as the primary link color. Visible underline-on-hover for inline body links.
- **Link Deep** (`{colors.link-deep}` — `#0761d1`): The pressed / visited tone for inline links.
- **Link Bg Soft** (`{colors.link-bg-soft}` — `#d3e5ff`): Soft pastel blue fill for "what's new" pill banners and informational badges.
- **Error** (`{colors.error}` — `#ee0000`): Validation red for destructive actions and form errors.
- **Error Soft** (`{colors.error-soft}` — `#f7d4d6`): Soft pastel red for destructive-state backgrounds.
- **Error Deep** (`{colors.error-deep}` — `#c50000`): Pressed / deep destructive state.
- **Warning** (`{colors.warning}` — `#f5a623`): Caution / pending status indicator.
- **Warning Soft** (`{colors.warning-soft}` — `#ffefcf`) / **Warning Deep** (`{colors.warning-deep}` — `#ab570a`): Background + pressed variants.

### Brand Gradient

The brand's signature decoration is a three-pair gradient stack:

- **Develop** (`{colors.gradient-develop-start}` `#007cf0` → `{colors.gradient-develop-end}` `#00dfd8`) — the blue-to-teal pair used to mark the "deploy" / "develop" rhythm.
- **Preview** (`{colors.gradient-preview-start}` `#7928ca` → `{colors.gradient-preview-end}` `#ff0080`) — the violet-to-pink pair used for "preview" surfaces.
- **Ship** (`{colors.gradient-ship-start}` `#ff4d4d` → `{colors.gradient-ship-end}` `#f9cb28`) — the coral-to-amber pair used for "ship" surfaces.

The six stops collapse into a single multi-color mesh gradient when used as the hero atmospheric backdrop. Treat the gradient as one unified object — do not crop down to a single colour, do not reorder the stops, and do not miniaturise. Used at hero scale and BusinessCard scale only.

**Coral accent** (`#ff4d4d`) is used as a seventh accent in mesh gradient compositions specifically — not exposed as a standalone UI token — to add warmth and counterbalance the cooler blue/cyan pool.

## CSS Variable Implementation

Design tokens are implemented as two layers of CSS custom properties in `globals.css`. Use Tailwind utilities for Layer 1 and `var(--alt-*)` directly for Layer 2.

### Layer 1 — Shadcn Base Vars

Remapped from the default blue-gray tint to DESIGN.md neutral values. Consumed via Tailwind utilities (`bg-background`, `text-foreground`, `border-border`, etc.).

| DESIGN.md token      | Shadcn var                             | Light mode                | Dark mode                   |
| -------------------- | -------------------------------------- | ------------------------- | --------------------------- |
| `paper` / `soot`     | `--background`                         | `oklch(0.985 0 0)`        | `oklch(0.051 0 0)`          |
| `chalk` / `ink`      | `--card` / `--popover`                 | `oklch(1 0 0)`            | `oklch(0.205 0 0)`          |
| `ink` / `on-primary` | `--foreground`                         | `oklch(0.205 0 0)`        | `oklch(1 0 0)`              |
| `graphite`           | `--primary`                            | `oklch(0.205 0 0)`        | `oklch(0.940 0 0)` ¹        |
| `on-primary`         | `--primary-foreground`                 | `oklch(1 0 0)`            | `oklch(0.205 0 0)`          |
| `fog`                | `--secondary` / `--muted` / `--accent` | `oklch(0.970 0 0)`        | `oklch(0.279 0 0)`          |
| `smoke`              | `--muted-foreground`                   | `oklch(0.627 0 0)`        | `oklch(0.709 0 0)`          |
| `error`              | `--destructive`                        | `oklch(0.596 0.245 29.2)` | `oklch(0.700 0.191 22.2)` ² |
| `hairline`           | `--border` / `--input`                 | `oklch(0.940 0 0)`        | `oklch(1 0 0 / 10%)`        |
| `pewter`             | `--ring`                               | `oklch(0.709 0 0)`        | `oklch(0.556 0 0)`          |

> ¹ `--primary` flips polarity in dark mode (near-white) so shadcn Button remains readable on dark surfaces.  
> ² Dark mode destructive is intentionally brighter than the light-mode error token for readability on dark surfaces.

`--card` and `--popover` intentionally hold identical values in both modes — Chalk on Paper (light) and Ink on Soot (dark) — per shadcn/ui's per-component-slot convention. This is the elevated-surface role: it must always read as perceptibly _lighter_ than `--background` so cards, popovers, and dialogs visually separate from the page canvas.

### Layer 2 — `--alt-*` Overflow Vars

Tokens with no shadcn equivalent. Use `var(--alt-*)` directly in component styles.

| DESIGN.md token          | CSS var                 | oklch                      | Hex       |
| ------------------------ | ----------------------- | -------------------------- | --------- |
| `slate`                  | `--alt-body`            | `oklch(0.420 0 0)`         | `#4d4d4d` |
| `pewter`                 | `--alt-hairline-strong` | `oklch(0.709 0 0)`         | `#a1a1a1` |
| `link`                   | `--alt-link`            | `oklch(0.573 0.214 258.2)` | `#0070f3` |
| `link-deep`              | `--alt-link-deep`       | `oklch(0.516 0.189 258.3)` | `#0761d1` |
| `link-bg-soft`           | `--alt-link-bg-soft`    | `oklch(0.917 0.040 257.5)` | `#d3e5ff` |
| `selection-bg`           | `--alt-selection-bg`    | `oklch(0.205 0 0)`         | `#171717` |
| `selection-fg`           | `--alt-selection-fg`    | `oklch(0.961 0 0)`         | `#f2f2f2` |
| `gradient-develop-start` | `--alt-grad-dev-s`      | `oklch(0.596 0.197 255.1)` | `#007cf0` |
| `gradient-develop-end`   | `--alt-grad-dev-e`      | `oklch(0.816 0.141 190.7)` | `#00dfd8` |
| `gradient-preview-start` | `--alt-grad-prev-s`     | `oklch(0.491 0.228 300.4)` | `#7928ca` |
| `gradient-preview-end`   | `--alt-grad-prev-e`     | `oklch(0.645 0.260 2.5)`   | `#ff0080` |
| `gradient-ship-start`    | `--alt-grad-ship-s`     | `oklch(0.673 0.215 25.0)`  | `#ff4d4d` |
| `gradient-ship-end`      | `--alt-grad-ship-e`     | `oklch(0.858 0.167 91.2)`  | `#f9cb28` |

`--alt-mesh-blend` is set to `multiply` in `:root` and `normal` in `.dark` — not a color token, but a mode switch for the mesh gradient's `<g>` blend mode.

### Chart Tokens

`--chart-1..5` reference the `--alt-grad-*` subset, ensuring chart data series colours are always drawn from the brand gradient palette:

| shadcn var  | `--alt-grad-*` token | Color            |
| ----------- | -------------------- | ---------------- |
| `--chart-1` | `--alt-grad-dev-s`   | Blue `#007cf0`   |
| `--chart-2` | `--alt-grad-prev-s`  | Violet `#7928ca` |
| `--chart-3` | `--alt-grad-ship-s`  | Coral `#ff4d4d`  |
| `--chart-4` | `--alt-grad-dev-e`   | Teal `#00dfd8`   |
| `--chart-5` | `--alt-grad-ship-e`  | Amber `#f9cb28`  |

Magenta (`--alt-grad-prev-e` `#ff0080`) is excluded from chart use — it is too perceptually similar to coral at small data-point sizes.

---

## Typography

### Font Family

Two custom faces carry the entire system:

1. **A custom geometric sans** (extracted as `Geist`) for every display, body, button, link, and label. Weights 400 / 500 / 600 are the working set; the face never appears in 700 or heavier. Display sizes are tracked aggressively negative (`-2.4 px` at 48 px hero, `-1.28 px` at 32 px section); body stays at neutral or slightly-negative tracking.
2. **A custom monospaced face** (extracted as `Geist Mono`) for terminal mockups, code blocks, and small mono-caption labels — anything that wants to signal "technical." Weight 400 only at 12 – 13 px. Tracking neutral.

A condensed display sans (`Space Grotesk`) is loaded as a third face for occasional editorial moments but does not render as the primary face anywhere in the captured surfaces.

### Hierarchy

| Token                         | Size | Weight | Line Height | Letter Spacing | Use                                                                                    |
| ----------------------------- | ---- | ------ | ----------- | -------------- | -------------------------------------------------------------------------------------- |
| `{typography.display-xl}`     | 48px | 600    | 48px        | -2.4px         | Hero headline ("Build and deploy on the AI Cloud.").                                   |
| `{typography.display-lg}`     | 32px | 600    | 40px        | -1.28px        | Section headlines ("Your frontend, delivered.", "A compute model for all workloads."). |
| `{typography.display-md}`     | 24px | 600    | 32px        | -0.96px        | Card-cluster headlines, pricing-tier names.                                            |
| `{typography.display-sm}`     | 20px | 600    | 28px        | -0.6px         | Inline display micro-headings.                                                         |
| `{typography.body-lg}`        | 18px | 400    | 28px        | 0              | Lead paragraphs under section headlines.                                               |
| `{typography.body-md}`        | 16px | 400    | 24px        | 0              | Default body paragraph.                                                                |
| `{typography.body-md-strong}` | 16px | 500    | 24px        | 0              | Bolded inline body.                                                                    |
| `{typography.body-sm}`        | 14px | 400    | 20px        | -0.28px        | Secondary body, nav-link text, button-md labels.                                       |
| `{typography.body-sm-strong}` | 14px | 500    | 20px        | -0.28px        | Nav CTA labels, table-row emphasis.                                                    |
| `{typography.caption}`        | 12px | 400    | 16px        | 0              | Footer secondary lines, badge labels.                                                  |
| `{typography.caption-mono}`   | 12px | 400    | 16px        | 0              | Section eyebrows and label captions that want a technical voice.                       |
| `{typography.code}`           | 13px | 400    | 20px        | 0              | Inline code, terminal mockups, command snippets.                                       |
| `{typography.button-md}`      | 14px | 500    | 20px        | 0              | Small / nav-scale button labels.                                                       |
| `{typography.button-lg}`      | 16px | 500    | 24px        | 0              | Marketing-scale pill button labels.                                                    |

### Principles

- **Negative tracking is part of the voice.** Display sizes use aggressive `-2.4` to `-0.6` px tracking. Reverting to default tracking breaks the brand.
- **Sentence-case headlines, period-terminated.** Headlines like "Build and deploy on the AI Cloud." end with a deliberate period — that punctuation is part of the brand's voice.
- **Mono for the technical layer only.** Section eyebrows, code blocks, terminal mockups. Body paragraphs never set in mono.
- **Weight 600 is the display ceiling.** The geometric sans never appears at 700 / 800. The brand reads as a calmer system because of this.

### Note on Font Substitutes

The two primary faces are proprietary (custom-cut for the brand). Open-source substitutes:

- **Geometric sans** — _Inter_ (400 / 500 / 600) is the closest stylistic match; `font-feature-settings: "ss01", "ss02"` enables the geometric alternates. _Satoshi_ is a passable second choice.
- **Monospace** — _JetBrains Mono_ (400) at 12 – 13 px matches the technical voice. _IBM Plex Mono_ is the second-best option.

## Layout

### Spacing System

- **Base unit**: 4 px. The brand's `--geist-space` token is exactly 4 px and every captured value is a multiple of 4.
- **Tokens**: `{spacing.xxs}` 4 px · `{spacing.xs}` 8 px · `{spacing.sm}` 12 px · `{spacing.md}` 16 px · `{spacing.lg}` 24 px · `{spacing.xl}` 32 px · `{spacing.2xl}` 40 px · `{spacing.3xl}` 48 px · `{spacing.4xl}` 64 px · `{spacing.5xl}` 96 px · `{spacing.6xl}` 128 px · `{spacing.section}` 192 px.
- **Section padding**: marketing bands use `{spacing.4xl}` to `{spacing.5xl}` top/bottom. Hero bands stretch to `{spacing.section}` to give the mesh gradient room to breathe.
- **Card interior padding**: marketing cards sit at `{spacing.lg}` to `{spacing.xl}`; template-grid cards stay tighter at `{spacing.md}` because they sit in a denser grid.
- **Inline gap**: button rows, nav rows, and chip rows use `{spacing.sm}` to `{spacing.md}` between siblings. The brand's `--geist-gap` is exactly 24 px.

### Grid & Container

- **Max width**: ~1400 px (`--alt-page-width`); the legacy `--geist-page-width` is 1200 px. Content centres with horizontal gutters of `{spacing.lg}` 24 px on desktop, `{spacing.md}` 16 px on mobile.
- **Column patterns**:
  - Three-feature row: 3-up at desktop, 1-up at mobile (rows like "Web Apps / Composable Commerce / Multi-tenant Platforms").
  - Tab pill row: 5-up centred row of `tab-ghost` pills.
  - Template-grid cluster: 5-up at desktop, scaling to 1-up at mobile.
  - Pricing tier grid: 3-up at desktop with the middle tier polarity-flipped.
  - Logo strip: ~5 logos wide, single row.

### Whitespace Philosophy

The mesh gradient does most of the heavy decorative lifting; whitespace separates the bands. Section spacing is generous — `{spacing.4xl}` to `{spacing.5xl}` between bands lets the gradient breathe. Inside a card, the headline/paragraph stack is tight (`{spacing.xs}` 8 px gap), then a wider gap before the CTA cluster. The page reads as engineered — large gaps + tight interior, never the other way around.

### Responsive Strategy

#### Breakpoints

| Name       | Width       | Key Changes                                                                                                       |
| ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| Mobile     | < 600px     | Hero stacks; nav collapses to hamburger; 3-up feature grids drop to 1-up; tab pill row enables horizontal scroll. |
| Tablet     | 600–959px   | 3-up grids drop to 2-up; nav still horizontal.                                                                    |
| Desktop    | 960–1199px  | Full 3-up grids; pricing 3-up.                                                                                    |
| Wide       | 1200–1399px | Container caps at 1400 px content width.                                                                          |
| Ultra-wide | ≥ 1400px    | Content stays centred at 1400 px; bands stretch edge-to-edge in colour but content holds the max-width.           |

#### Touch Targets

The `button-primary` pill renders at ~32 px tall in nav and ~48 px tall in marketing contexts. Marketing CTAs comfortably meet WCAG AAA at all breakpoints; nav buttons inflate touch area through `{spacing.xs}` padding on mobile to meet the 44 × 44 px floor.

#### Collapsing Strategy

- **Nav**: full link row + Ask AI / Log In / Sign Up pills at desktop. Collapses to logo + hamburger at mobile with the menu opening as a full-overlay.
- **Hero**: mesh gradient stays centred; headline + body stack vertically at all breakpoints (the brand doesn't use a split-hero pattern).
- **Three-feature row**: 3-up → 2-up → 1-up at the breakpoints above; cards keep their `{rounded.md}` 8 px shape across all viewports.
- **Pricing card grid**: 3-up at desktop, vertical stack at mobile with `pricing-card-featured` always sitting in the middle.
- **Template grid**: 5-up → 3-up → 2-up → 1-up. Each `template-card` keeps its 16:9 aspect on the image.

#### Image Behavior

- **Mesh gradient**: rendered as inline SVG or canvas-painted gradient; scales fluidly with the hero container; never crops, never tiles.
- **Customer logos**: rendered as monochrome SVGs in the logo strip; consistent 24 px height.
- **Code editor mockup**: dark `{colors.graphite}` rectangle with mono text rendered inside; treated as an image at the layout level.
- **Template thumbnails**: 16:9 landscape inside `{rounded.md}` card chrome; lazy-loaded; consistent grayscale palette in the placeholder state.

## Elevation & Depth

| Level                    | Treatment                                                                                               | Use                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Level 0 — Flat           | No shadow, no border.                                                                                   | Full-bleed hero bands and the polarity-flipped dark sections.            |
| Level 1 — Inset Hairline | `0 0 0 1px #00000014` inset 1 px border.                                                                | Default card chrome — the brand's universal "you can see this card" cue. |
| Level 2 — Subtle Drop    | `0px 1px 1px #00000005, 0px 2px 2px #0000000a` plus inset hairline.                                     | Slightly elevated cards (template-grid, marketing-card).                 |
| Level 3 — Soft Stack     | `0px 2px 2px #0000000a, 0px 8px 8px -8px #0000000a` plus inset hairline.                                | The "medium" elevation — feature-grid cards.                             |
| Level 4 — Float Stack    | `0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a` plus inset hairline.                               | "Large" elevation — pricing cards, callout panels.                       |
| Level 5 — Modal          | `0px 1px 1px #00000005, 0px 8px 16px -4px #0000000a, 0px 24px 32px -8px #0000000f` plus inset hairline. | Modal / dialog surfaces and dropdown menus.                              |

The brand uses STACKED shadows — multiple small offsets layered to fake natural light — never a single 8-px-blur generic drop. Inset hairline rings are always added so the card edge stays crisp.

### Decorative Depth

- **Mesh gradient as atmospheric depth**: the hero's multi-stop gradient is the brand's only "atmospheric" effect — applied as a flat 2-D backdrop rather than a 3-D illustration.
- **Polarity-flipped dark band as section-depth**: switching the surface from `{colors.paper}` to `{colors.graphite}` (the brand's deep neutral) is the brand's chief depth cue between bands.
- **Inset-shadow + drop-shadow combo**: the cards' combination of an inset 1 px ring and a multi-stop drop produces a "card sits on the page" effect without ever feeling material-heavy.

## Shapes

### Border Radius Scale

| Token               | Value  | Use                                                                                                  |
| ------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `{rounded.none}`    | 0px    | Full-bleed hero / footer bands.                                                                      |
| `{rounded.xs}`      | 4px    | Tightest inline pill — the `nav-cta-signup` 6-px-radius button (mapped to `xs/sm`).                  |
| `{rounded.sm}`      | 6px    | The brand's `--geist-radius` token — base UI radius for in-app buttons, form inputs, dropdown menus. |
| `{rounded.md}`      | 8px    | The brand's `--geist-marketing-radius` token — feature cards, template cards.                        |
| `{rounded.lg}`      | 12px   | Slightly larger card chrome (pricing-card variants).                                                 |
| `{rounded.xl}`      | 16px   | Largest card chrome — when a card hosts a hero image cap.                                            |
| `{rounded.pill-sm}` | 64px   | Tab-ghost pills inside the "AI Apps / Web Apps / Ecommerce / Marketing / Platforms" row.             |
| `{rounded.pill}`    | 100px  | The marketing CTA pill — `button-primary`, `button-secondary`, "Start Deploying" pill.               |
| `{rounded.full}`    | 9999px | Icon-button circular containers, nav-link ghost pills.                                               |

### Photography Geometry

- **Mesh gradient**: full-bleed 2-D atmospheric backdrop, never cropped to a frame; treated as the page's wallpaper.
- **Customer logos**: monochrome SVG, consistent 24 px height in a flex row.
- **Code editor mockup**: 16:10 dark rectangle, `{rounded.md}` corners.
- **Template thumbnails**: 16:9 landscape inside `{rounded.md}` chrome.
- **Showcase imagery**: 2:1 or 16:9 inside `{rounded.lg}` to `{rounded.xl}` chrome with a stacked shadow.

## Components

### Buttons

**`button-primary`** — the canonical 100-px-radius black pill, marketing scale.

- Background `{colors.graphite}`, text `{colors.on-primary}`, label set in `{typography.button-lg}`, padding `0px {spacing.sm}` 12 px, shape `{rounded.pill}` 100 px. Renders ~48 px tall when paired with the marketing flex layout.

**`button-secondary`** — the white pill paired with the black primary inside marketing bands.

- Background `{colors.chalk}`, text `{colors.ink}`, same typography + padding as `button-primary`, shape `{rounded.pill}`.

**`button-primary-sm`** — the smaller-scale primary pill used inside nav and pricing-card CTAs.

- Background `{colors.graphite}`, text `{colors.on-primary}`, label set in `{typography.button-md}` (14 px / 500), shape `{rounded.pill}`.

**`button-secondary-sm`** — the smaller-scale white pill paired with `button-primary-sm`.

- Background `{colors.chalk}`, text `{colors.ink}`, same typography + shape as `button-primary-sm`.

**`tab-ghost`** — the centred-row tab pill ("AI Apps / Web Apps / Ecommerce / Marketing / Platforms").

- Background `{colors.chalk}`, text `{colors.ink}`, label set in `{typography.body-sm}`, padding `0px {spacing.md}`, shape `{rounded.pill-sm}` 64 px.

**`icon-button-circular`** — the circular icon container (often a "?" or arrow inside).

- Background `{colors.chalk}`, dark icon, 1 px solid hairline border, shape `{rounded.full}`.

**Nav CTAs:**

**`nav-cta-signup`** — the small black "Sign Up" button in the nav row.

- Background `{colors.graphite}`, text `{colors.on-primary}`, label `{typography.body-sm-strong}`, padding `0px {spacing.xs}`, height 28 px, shape `{rounded.sm}` 6 px (the brand's `--geist-radius`).

**`nav-cta-login`** — the white "Log In" button in the nav.

- Background `{colors.chalk}`, text `{colors.ink}`, same typography / height / shape as `nav-cta-signup`.

**`nav-cta-ask-ai`** — the small "Ask AI" button with a faint border.

- Background `{colors.chalk}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border (extracted as `0px solid rgb(235, 235, 235)`), same typography / height / shape.

### Cards & Containers

**`card-marketing`** — the canonical marketing feature card (3-up section cards).

- Background `{colors.chalk}`, text `{colors.ink}`, padding `{spacing.lg}` 24 px, shape `{rounded.md}` 8 px (the `--geist-marketing-radius`). Carries Level 3 soft-stack shadow.

**`card-marketing-large`** — the larger marketing card used for "compute model" / "AI Gateway" callouts.

- Background `{colors.chalk}`, text `{colors.ink}`, padding `{spacing.xl}`, shape `{rounded.lg}` 12 px. Carries Level 4 float-stack shadow.

**`card-soft`** — the soft-tinted card used inside cluster groups (lighter than fog).

- Background `{colors.paper}`, text `{colors.ink}`, padding `{spacing.lg}`, shape `{rounded.md}`.

**`template-card`** — the deploy-template card in the "Deploy your first app" grid.

- Background `{colors.chalk}`, text `{colors.ink}`, padding `{spacing.md}` 16 px, shape `{rounded.md}` 8 px. Hosts a 16:9 thumbnail at the top.

**`code-editor-mockup`** — the dark code-preview surface inside marketing bands.

- Background `{colors.graphite}`, text `{colors.on-primary}`, body in `{typography.code}` (13 px / Geist Mono), padding `{spacing.lg}` 24 px, shape `{rounded.md}` 8 px.

**`pricing-card`** — the default pricing-tier card.

- Background `{colors.chalk}`, text `{colors.ink}`, padding `{spacing.xl}` 32 px, shape `{rounded.lg}` 12 px. Inside: tier name in `{typography.display-md}`, price in `{typography.display-xl}`, feature list in `{typography.body-md}` rows, CTA at the bottom.

**`pricing-card-featured`** — the polarity-flipped "Pro" tier card.

- Background `{colors.graphite}`, text `{colors.on-primary}`, same shape + padding as `pricing-card`. CTA inverts to `button-secondary-sm` (white pill on black card).

### Inputs & Forms

**`form-input`** — the canonical text input.

- Background `{colors.chalk}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, body in `{typography.body-sm}` (14 px), padding `0px {spacing.sm}`, height 40 px (the brand's `--geist-form-height`), shape `{rounded.sm}` 6 px.

**`form-input-sm`** — small-height variant (32 px tall) for tight forms.

- Same as `form-input` but height 32 px (the `--geist-form-small-height`).

**`form-input-lg`** — large-height variant (48 px tall) for hero CTAs.

- Same as `form-input` but height 48 px (the `--geist-form-large-height`); body in `{typography.body-md}` 16 px.

### Navigation

**`nav-bar`** — the sticky top nav.

- Background `{colors.chalk}`, text `{colors.ink}`, height 64 px (the brand's `--header-height`), padding `{spacing.sm} {spacing.lg}`. Layout: logo left, link row centre, "Ask AI / Log In / Sign Up" cluster right.

**`nav-link`** — the centred link row inside `nav-bar`.

- Text `{colors.slate}`, set in `{typography.body-sm}`, padding `{spacing.xs} {spacing.sm}`, shape `{rounded.full}` (ghost pill — visible only on hover or active, but the radius is documented).

**`footer`** — the bottom 4-column nav.

- Background `{colors.chalk}`, text `{colors.slate}`, padding `{spacing.4xl} {spacing.lg}`. Eyebrow column labels in `{typography.caption-mono}` (uppercase mono effect); link rows in `{typography.body-sm}`.

### Signature Components

**`hero-band`** — the white hero with the mesh gradient backdrop.

- Background `{colors.chalk}` (or `{colors.paper}` on some surfaces), text `{colors.ink}`, padding `{spacing.4xl} {spacing.lg}`. Inside: a small mono badge above the headline, the headline in `{typography.display-xl}` (sentence-case, period-terminated), a body lead in `{typography.body-lg}`, then a CTA row with `button-primary` + `button-secondary`. The mesh gradient sits behind, scaled to occupy roughly the top half of the band.

**`feature-mesh-band`** — the secondary section that hosts a mesh-gradient atmospheric backdrop with feature copy on top.

- Background `{colors.chalk}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.lg}`. Section headline in `{typography.display-lg}`; supporting body in `{typography.body-md}`.

**`showcase-band-light`** — a soft-canvas section ("Deploy your first app in seconds").

- Background `{colors.paper}`, text `{colors.ink}`, padding `{spacing.5xl} {spacing.lg}`.

**`showcase-band-dark`** — the polarity-flipped dark band ("A compute model for all workloads").

- Background `{colors.graphite}`, text `{colors.on-primary}`, padding `{spacing.5xl} {spacing.lg}`. Section headline in `{typography.display-lg}` (white on black). Often contains a `code-editor-mockup` flush with the band.

**`logo-strip`** — the customer-logo wrapping row near the top of the page.

- Background `{colors.chalk}`, text `{colors.slate}`, padding `{spacing.lg} {spacing.xl}`. Logos rendered as monochrome SVGs at consistent height.

**`badge-secondary`** — the small inline metadata pill ("New", "Beta", "Live").

- Background `{colors.paper}`, text `{colors.slate}`, body in `{typography.caption}`, padding `0px {spacing.xs}`, shape `{rounded.full}`.

**`banner-marketing`** — the "Introducing X" announcement pill at the top of pages.

- Background `{colors.paper}`, text `{colors.slate}`, body in `{typography.body-sm}`, padding `{spacing.xs} {spacing.sm}`, shape `{rounded.full}`.

**`link-inline`** — body-copy inline links.

- Text `{colors.link}` (`#0070f3`), body in `{typography.body-md}`, underlined.

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references brand-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default Pricing tier card. Re-uses feature-card chrome with brand paper surface.

- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).

- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — What's Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery).

- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).

- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.

- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.

- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.

- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as feature-card with elevated shadow.

- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.

- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — feature-card shape + medium shadow.

- Properties: `backgroundColor`, `rounded`, `padding`, `typography`

## Signature Decorative System

### Topographic Contour Mesh Gradient

The decorative core of this site. A multi-layer SVG composition rendered via `feGaussianBlur` that evokes topographic map contour lines.

**Shape language:**

- **Outer organic loop** — a large irregular closed path that wraps the composition like an outer elevation contour (fill: `{colors.gradient-develop-start}` #007cf0)
- **Inner organic loop** — a smaller nested path inside the outer, slightly offset in tone (fill: `{colors.gradient-preview-start}` #7928ca)
- **Cross-sweep diagonal band** — a quadrilateral `<path>` that diagonally cuts through the composition from lower-left to upper-right (fill: `{colors.gradient-develop-end}` #00dfd8)
- **Focal inner core** — a compact organic shape at the visual focal point (fill: `{colors.gradient-preview-end}` #ff0080)
- **Accent polygon** — an angular polygon near the focal zone (fill: `{colors.gradient-ship-end}` #f9cb28)
- **Coral ellipse** — a small rotated ellipse providing warmth (fill: `#ff4d4d` coral accent)

**SVG technique:**

```svg
<filter id="mesh-blur" filterUnits="userSpaceOnUse"
  x="-1200" y="-1200" width="3800" height="3000">
  <feGaussianBlur stdDeviation="66-90"/>
</filter>
<!-- All shapes in one <g filter="url(#mesh-blur)"> before blur is applied -->
<g filter="url(#mesh-blur)">
  <path ... fill="#007cf0" opacity="0.64-0.90"/>
  <!-- etc. -->
</g>
```

The filter region MUST be significantly larger than the viewport (negative x/y, oversized width/height) to prevent the Gaussian blur from clipping at shape edges near the SVG boundary.

**Noise overlay:** `<feTurbulence type="fractalNoise" baseFrequency="0.74" octaves="3">` + `<feBlend mode="overlay">` adds organic texture. Use `mode="multiply"` for light-mode overlays.

**Dark mode** (background `#080808`–`#0a0a0a`):

- Normal alpha compositing on `<g>`
- Shape opacity: 0.34–0.86
- Text over mesh: use `{colors.on-primary}` (#fff) for body text; `{colors.pewter}` (#a1a1a1) for eyebrows — `{colors.smoke}` (#888) is insufficient contrast over bright gradient pools

**Light mode** (background `#fafafa`):

- `style="mix-blend-mode: multiply"` on the shape `<g>` — white is multiply's neutral element, so colors render near full-saturation rather than being washed out
- Shape opacity: 0.32–0.72 (higher than naïve light-mode approach because multiply preserves saturation)

**Theme switching (next-themes):**
Do NOT use `useTheme()` + inline React props — `resolvedTheme` is `undefined` on first render, causing hydration flash. Use CSS custom properties switched by the `.dark` class. The complete token set lives in `globals.css`:

```css
/* globals.css */
:root {
  /* Mesh gradient stops */
  --alt-grad-dev-s: oklch(0.596 0.197 255.1); /* #007cf0 blue    */
  --alt-grad-dev-e: oklch(0.816 0.141 190.7); /* #00dfd8 teal    */
  --alt-grad-prev-s: oklch(0.491 0.228 300.4); /* #7928ca violet  */
  --alt-grad-prev-e: oklch(0.645 0.26 2.5); /* #ff0080 magenta */
  --alt-grad-ship-s: oklch(0.673 0.215 25); /* #ff4d4d coral   */
  --alt-grad-ship-e: oklch(0.858 0.167 91.2); /* #f9cb28 amber   */
  /* Mesh blend mode — multiply on white preserves saturation */
  --alt-mesh-blend: multiply;
}
.dark {
  --alt-mesh-blend: normal; /* standard alpha compositing on dark bg */
}
```

```svg
<g filter="url(#mesh-blur)" style="mix-blend-mode: var(--alt-mesh-blend)">
  <path fill="var(--alt-grad-dev-s)"  opacity="0.68" .../>
  <path fill="var(--alt-grad-prev-s)" opacity="0.84" .../>
  <!-- etc. — all six stops as separate shapes -->
</g>
```

Using `var(--alt-grad-*)` for `fill` instead of inline hex ensures the SVG reacts to any future token updates without touching component code.

**Animation (CSS @keyframes):**

- Each shape has its own `@keyframes` with `transform-box: fill-box; transform-origin: center`
- Hero shapes: 9–14 s cycle, translate ±68 px, scale 0.93–1.09, rotate ±8° (on rotated shapes)
- BusinessCard shapes: 7–11 s cycle, translate ±72 px, scale 0.87–1.14 (larger for card-scale visibility)
- Trigger: hero = always-on; BusinessCard = paused by default, running on `:hover`; always-on on `@media (hover: none)` (mobile)

**σ values by context:**

| Context                   | σ     | Notes                                                |
| ------------------------- | ----- | ---------------------------------------------------- |
| OG (1200×630) right-focal | 90    | Shapes at x≥560; left side 6.2σ away → pure black    |
| OG (1200×630) contained   | 80    | Shapes within 200px of all edges                     |
| Home hero (1400×600)      | 66    | Topographic style                                    |
| BusinessCard (860×240)    | 48–58 | Lower σ to preserve contour definition at card scale |

---

### Square Grid Overlay

The OG brand surface pairs the mesh gradient with a square grid overlay rendered as a `::before` pseudo-element:

```css
.og-grid::before {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 95px 95px;
}
```

Grid parameters:

- **Cell size**: 95 px — chosen so that 1140÷95 = 12 cols, 570÷95 = 6 rows, and all four corners align
- **Line opacity**: 4–6% on dark backgrounds; `box-shadow: 0 0 0 1px` closes the 13th/7th line at right/bottom edges
- **z-index**: 2 (above the mesh SVG at z-index 0, below text at z-index 3)
- **Corner marks**: 4 small L-shaped marks at the OG frame corners (1px lines, 12px legs, rgba(255,255,255,0.25))

The grid is used exclusively on OG images. Home and About page surfaces do not use the grid overlay.

---

## Page Design Decisions

These are the converged production directions for each page surface. Prototype variants are in `preview.html` under each section's v4 tab.

### OG Image

**Style**: Topographic contour, right-focal composition — mesh occupies the right two-thirds; left third remains near-black at 6σ distance from the nearest shape edge  
**Implementation**: `next/og` `ImageResponse`, inline SVG

| Parameter    | Value                                                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Dimensions   | 1200 × 630 px                                                                                                                    |
| Background   | `#0a0a0a`                                                                                                                        |
| Grid         | 95 px square grid, 4–6% opacity lines                                                                                            |
| Mesh σ       | 90                                                                                                                               |
| Shape focus  | x ≥ 560; left third is pure black (6.2σ away)                                                                                    |
| Grid corners | tl / tr / bl / br L-marks at `rgba(255,255,255,0.25)`                                                                            |
| Text layout  | Center-left: eyebrow (display-sm, hairline-strong) · name (display-xl, on-primary) · separator · desc (body-md, hairline-strong) |
| Noise        | fractalNoise baseFrequency=0.74, overlay blend                                                                                   |

Text contrast rule: eyebrow and desc use `{colors.pewter}` (#a1a1a1), NOT `{colors.smoke}` — mesh gradient behind text locally lightens the background.

The same composition applies to the general (home/about) static OG image. Notes and Projects OG images use the same topographic composition with a dynamic seed derived from the article slug for shape variation.

---

### Home Hero

**Style**: Topographic contour, right-focal — shapes concentrated in the right column (behind the terminal mockup), left text column stays dark  
**Layout**: Two-column grid (`1fr 1fr`), 80 px side padding; collapses to single column at ≤ 768 px (md), terminal hidden on mobile

| Surface | Background | Blend             | σ   | Shape focus                                       |
| ------- | ---------- | ----------------- | --- | ------------------------------------------------- |
| Dark    | `#080808`  | normal            | 66  | x=[650,1152], shapes taper into text col via blur |
| Light   | `#fafafa`  | multiply on `<g>` | 66  | Same x range, opacity 0.12–0.21                   |

**Terminal mockup**: frosted glass panel floating above mesh

- Dark: `background: rgba(8,8,8,.68)` (68% `{colors.soot}` — derived from `--background`, not a standalone swatch) + `backdrop-filter: blur(12px)` + box-shadow `0 0 0 1px rgba(255,255,255,.04), 0 8px 28px rgba(0,0,0,.55), 0 20px 48px rgba(0,0,0,.22)`
- Light: `background: rgba(255,255,255,.78)` + same backdrop-filter + box-shadow `0 0 0 1px rgba(255,255,255,.9), 0 4px 16px rgba(0,0,0,.10), 0 16px 40px rgba(0,0,0,.07)`

**Text tokens over dark mesh**:

| Role      | Token                             | Value          |
| --------- | --------------------------------- | -------------- |
| Name (h1) | `display-xl`, `on-primary`        | 48px / #fff    |
| Eyebrow   | `caption-mono`, `hairline-strong` | 12px / #a1a1a1 |
| Title     | `body-lg`, `hairline-strong`      | 18px / #a1a1a1 |
| Bio       | `body-lg`, `on-primary`           | 18px / #fff    |

---

### About BusinessCard

**Style**: Topographic contour, center-spread — mesh fills the full card area, no focal zone offset  
**Dimensions**: content-width card, max-width 860 px, min-height 240 px, `border-radius: 16px`

| Surface | Background | Blend             | σ   | Notes                                                                  |
| ------- | ---------- | ----------------- | --- | ---------------------------------------------------------------------- |
| Dark    | `#0d0d0d`  | normal            | 48  | `clip-path: inset(0 round 16px)` to prevent filter overflow at corners |
| Light   | `#fafafa`  | multiply on `<g>` | 52  | Same clip-path                                                         |

**Content layout**: Name (display-lg, on-primary) · Role (body-lg, rgba(255,255,255,.82)) · Links row (right-aligned ghost buttons)

**Text tokens over dark mesh** (mesh is full-bleed — all text needs maximum contrast):

| Role        | Dark card             | Light card                |
| ----------- | --------------------- | ------------------------- |
| Name        | `on-primary` #fff     | `ink` #171717             |
| Role        | rgba(255,255,255,.82) | `body` #4d4d4d            |
| Link text   | rgba(255,255,255,.75) | `body` #4d4d4d            |
| Link border | rgba(255,255,255,.22) | `hairline-strong` #a1a1a1 |

**Animation**: paused by default → running on `:hover` (desktop) or `@media (hover: none)` (mobile, always-on)

---

## Do's and Don'ts

### Do

- Reserve `{colors.graphite}` (`#171717`) for primary CTAs. Black ink IS the conversion target.
- Use `{rounded.pill}` 100 px for marketing-scale CTAs and `{rounded.sm}` 6 px for nav-scale buttons.
- Set every headline in `{typography.display-*}` weight 600, sentence-case. Aggressive negative tracking is part of the voice.
- Use the topographic-contour mesh gradient at hero/card scale only — home hero, About BusinessCard, and OG images. Nowhere else.
- On dark surfaces with mesh gradient behind text, upgrade muted text: use `{colors.on-primary}` for body/bio, `{colors.pewter}` for eyebrows. `{colors.smoke}` (#888) fails contrast over bright gradient pools.
- Use `mix-blend-mode: multiply` on the shape `<g>` for light-mode mesh — the only way to preserve color saturation on white.
- Use CSS custom properties (`--mesh-blend`, `--mesh-op-*`) for theme switching — never `useTheme()` inline, which causes hydration flash.
- Layer stacked shadows (multiple small offsets with inset hairline) rather than single heavy drops.
- Cycle surfaces in `{colors.paper}` → `{colors.chalk}` → `{colors.graphite}` polarity-flipped bands; the dark band IS the depth cue.
- Set every code block and technical eyebrow in `{typography.code}` / `{typography.caption-mono}`.

### Don't

- Don't use the mesh gradient outside home hero, About BusinessCard, and OG images. It belongs to those three surfaces and nowhere else.
- Don't use only a single colour from the gradient token pairs. The topographic composition requires all six gradient stops + coral accent to be coherent.
- Don't change the shape language away from topographic contour (nested organic loops + cross-sweep band). Other shape styles (geometric blobs, Aurora ribbons, dot grids) were explored and rejected.
- Don't use `{colors.smoke}` (#888) as text colour over mesh gradient backgrounds in dark mode — insufficient contrast.
- Don't render the mesh gradient via `useTheme()` + conditional props. Use CSS custom properties to avoid flash.
- Don't render headlines in all-caps. Sentence-case + negative tracking is non-negotiable.
- Don't use a single heavy drop-shadow on cards. Stacked small offsets + inset hairline ring only.
- Don't promote the geometric sans to weight 700. Display ceiling is 600.
- Don't set body paragraphs in the mono face. Mono is for code + technical labels only.
