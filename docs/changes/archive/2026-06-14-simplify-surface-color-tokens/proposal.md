## Why

The home mesh-gradient redesign (`feat/home-animated-mesh-gradient`, not yet merged) introduced `docs/DESIGN.md` as the canonical design-token spec, but it carried over an ad-hoc surface-color system: `--background` and `--card` collapse to the same value in light mode, an extra `--alt-mesh-bg` token duplicates `--background`'s role, several brand-neutral tokens (`--alt-canvas-soft`, `--alt-canvas-soft-2`, `--alt-ink`, the entire `--sidebar-*` family) are dead code, one CTA button uses `variant="destructive"` purely for visual emphasis (a semantic mismatch), and two page wrappers apply a translucent background that serves no visible purpose. DESIGN.md's neutral/surface token names (`canvas`, `canvas-soft`, `canvas-soft-2`) are also positional rather than descriptive, causing real confusion about what color each represents.

Because DESIGN.md was only just introduced on this same branch and has not yet been merged, this is the right moment to fix the surface-color model and its naming before it solidifies into the project's long-term vocabulary.

## What Changes

- Establish exactly two surface roles site-wide: `--background` (page canvas — global layout, mesh-gradient) and `--card` (elevated container surface — Card, Dialog, Popover, Empty-style components), following the principle that a card SHALL always read as visually elevated above the page background in both light and dark mode.
- **BREAKING (visual)**: change surface color values:
  - Light mode: `--background` stays near-white `#fafafa`; `--card`/`--popover` become pure white `#ffffff` (was the same `#fafafa` as background).
  - Dark mode: `--background` becomes near-black `#080808` (was `#171717`, same as card); `--card`/`--popover` become `#171717` (near-black, one step lighter than background).
- Remove `--alt-mesh-bg` (light and dark definitions); `mesh-gradient.tsx` reads `--background` directly instead (values now coincide, so this is a zero-visual-impact consolidation).
- Remove dead tokens: `--alt-canvas-soft`, `--alt-canvas-soft-2`, `--alt-ink`, and the entire unused `--sidebar` / `--sidebar-*` / `--color-sidebar-*` family, including their `@theme inline` mappings.
- Fix CTA semantic mismatch: change the home "View Portfolio" button from `variant="destructive"` to `variant="default"`, relying on `--primary`'s existing light/dark inversion to keep it visually prominent without misusing the destructive variant. The "About Me" `variant="outline"` button keeps its variant; only its surface-token implementation changes (see next point).
- **BREAKING (visual)**: unify the shared `outline` button variant's surface token across modes — replace the current `bg-background` (light) / `dark:bg-input/30` (dark) split, and its matching `hover:bg-accent` / `dark:hover:bg-input/50` split, with a single `bg-background/50` fill and `hover:bg-accent` hover in BOTH modes. This removes a dual-CSS-variable-per-mode pattern that makes the surface hard to reason about, and produces the intended "blends with whatever sits behind it" look consistently in light and dark themes. Affects every consumer of `variant="outline"`: Dialog's "Close" button, the home "About Me" CTA, `GithubInfo` buttons, and the article info button.
- Remove the now-purposeless translucent `bg-background/50` wrapper backgrounds from the article layout and the About page content wrapper.
- Rename DESIGN.md's ~12 neutral/surface brand tokens under a new "Paper & Ink" naming theme so each name reflects what the color actually looks like rather than its layout position:
  - `canvas` (`#ffffff`) → `Chalk`
  - `canvas-soft` (`#fafafa`) → `Paper`
  - `canvas-soft-2` (`#f5f5f5`) → `Fog`
  - _(new)_ `#080808` → `Soot` (formalizes the new dark-mode background value, which previously had no brand-token name)
  - `ink` (`#171717`) → `Ink` (unchanged — already descriptive)
  - `primary` (`#171717`, inverts in dark mode) → `Graphite`
  - `body` (`#4d4d4d`) → `Slate`
  - `mute` (`#888888`) → `Smoke`
  - `hairline` (`#ebebeb`) → `Hairline` (unchanged — already descriptive)
  - `hairline-strong` (`#a1a1a1`) → `Pewter`
  - `on-primary`, `selection-bg`, `selection-fg` → unchanged (relational/functional names that are already self-explanatory)
- Update DESIGN.md throughout to reflect the new names, the corrected surface-role model, the Elevation & Depth table, the Components catalog `backgroundColor` entries, and the terminal-mockup description (currently a hard-coded `rgba(10,10,10,.68)` swatch description that should instead describe the value as derived from the `--background` token).
- Document in both `globals.css` (code comments) and DESIGN.md that `--card` and `--popover` intentionally hold identical values — kept as separate tokens to follow shadcn/ui convention, not because they represent different surfaces.

## Capabilities

### New Capabilities

- `surface-color-tokens`: Defines the site's surface-color model — the two surface roles (`--background` page canvas, `--card`/`--popover` elevated container), the elevation relationship between them in light and dark mode, and the specific brand-token values each role resolves to.

### Modified Capabilities

(none)

## Impact

- Affected code:
  - Modified:
    - `src/app/globals.css` (surface-role token values, removal of dead tokens and `--alt-mesh-bg`, `--sidebar-*` family removal, `@theme inline` mapping cleanup, code comments documenting `--card`/`--popover` value parity)
    - `src/components/home/mesh-gradient.tsx` (background rect `fill` switches from `var(--alt-mesh-bg)` to `var(--background)`)
    - `src/components/home/cta-buttons.tsx` ("View Portfolio" button variant changes from `destructive` to `default`)
    - `src/components/ui/button.tsx` (`outline` variant: replace `bg-background`/`dark:bg-input/30` and `hover:bg-accent`/`dark:hover:bg-input/50` mode-split with a single `bg-background/50` + `hover:bg-accent` rule for both modes — affects every `outline`-variant consumer site-wide)
    - `src/components/article/index.tsx` (remove translucent `bg-background/50` wrapper)
    - `src/app/(site)/[lang]/about/[[...slug]]/page.tsx` (remove translucent `bg-background/50` wrapper)
    - `docs/DESIGN.md` (neutral/surface token renames under "Paper & Ink" theme, CSS Variable Implementation mapping tables, Elevation & Depth table, Components catalog `backgroundColor` entries, terminal-mockup description, `--card`/`--popover` parity documentation)
  - Removed:
    - `--alt-mesh-bg` (light + dark definitions in `src/app/globals.css`)
    - `--alt-canvas-soft`, `--alt-canvas-soft-2`, `--alt-ink` and their `@theme inline` mappings (`src/app/globals.css`)
    - `--sidebar`, `--sidebar-*`, `--color-sidebar-*` token family and mappings (`src/app/globals.css`)
