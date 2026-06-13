## Context

`docs/DESIGN.md` was introduced on this branch (commit `19820d6`, not yet merged) as the canonical design-token specification, alongside a two-layer CSS variable system in `src/app/globals.css`: Layer 1 maps shadcn/ui semantic slots (`--background`, `--card`, `--popover`, `--primary`, etc.) to brand colors, and Layer 2 (`--alt-*`) covers tokens with no shadcn equivalent (mesh-gradient stops, opacity ramps, link colors, etc.).

While building the home mesh-gradient hero, several issues accumulated in this still-fresh system:

1. **Surface roles collapse**: `--background` and `--card` resolve to the same color in light mode (`#fafafa`), and `--card`/`--popover` resolve to the same color as `--background` in dark mode (`#171717`). There is no visual "elevation" — a card does not read as popped above the page.
2. **Duplicated background token**: `--alt-mesh-bg` exists purely to give the mesh-gradient SVG a background fill, but it always equals `--background`'s value. It is a redundant indirection.
3. **Dead tokens**: `--alt-canvas-soft`, `--alt-canvas-soft-2`, `--alt-ink`, and the entire `--sidebar`/`--sidebar-*`/`--color-sidebar-*` family are defined but never referenced anywhere in the codebase (confirmed by exhaustive grep during the design discussion that preceded this proposal).
4. **CTA semantic mismatch**: the home hero's primary CTA ("View Portfolio") uses `variant="destructive"` purely to stand out visually — `destructive` carries a "dangerous action" meaning that does not apply here.
5. **Purposeless wrappers**: `article/index.tsx` and the About page content wrapper apply `bg-background/50`, a translucent layer over a background of the same hue, producing no visible effect.
6. **Positional naming**: DESIGN.md names its neutral/surface tokens `canvas`, `canvas-soft`, `canvas-soft-2` — names that describe relative lightness/position rather than what the color looks like, making it hard for a reader (or the `#080808` value, which has no name at all) to reason about the palette.

Because DESIGN.md has zero external consumers yet (unmerged, single branch), this is the lowest-cost moment to correct both the token _values_ and their _names_ — a rename after merge would touch far more call sites and discussions.

## Goals / Non-Goals

**Goals:**

- Reduce the site's surface-color model to exactly two roles — `--background` (page canvas) and `--card` (elevated container, shared by Card/Dialog/Popover/Empty-style components) — with `--card` always reading as visually lighter/elevated relative to `--background` in both light and dark mode.
- Remove redundant and dead CSS variables identified during the design review (`--alt-mesh-bg`, `--alt-canvas-soft`, `--alt-canvas-soft-2`, `--alt-ink`, the `--sidebar-*` family).
- Correct the one CTA variant misuse and remove the two purposeless translucent wrapper backgrounds.
- Rename DESIGN.md's neutral/surface brand tokens to descriptive, perception-based names under a "Paper & Ink" theme, and formalize a brand-token name for the new `#080808` dark-background value.
- Keep DESIGN.md, `globals.css` comments, and the actual token values mutually consistent after the change.

**Non-Goals:**

- Renaming DESIGN.md's chromatic/semantic tokens (mesh-gradient gradient stops, `link`, `destructive`, etc.) — these don't suffer from positional-naming confusion and a rename would be unscoped churn.
- Converting DESIGN.md's brand-token vocabulary to shadcn/ui's vocabulary — this would destroy the translation-layer flexibility between brand identity and shadcn's fixed semantic slots, and the two vocabularies have mismatched cardinality (cannot be mapped 1:1).
- Introducing a vivid/saturated `--primary` brand color ("rebrand") — this would contradict DESIGN.md's documented "stark black-and-ink duet" brand philosophy. The CTA visibility problem is fully solved by switching to the existing `default` variant, which already inverts correctly per theme.
- Changing `Dialog`'s surface token (stays on `--background`, not `--card`) or `Popover`'s (stays on `--popover`, which intentionally holds the same value as `--card` per shadcn/ui convention).
- Adding a card background to `Empty`'s container (its icon badge keeps `bg-muted`; the outer container stays transparent).

## Decisions

### Two-role surface model with elevation

`--background` represents the page canvas; `--card` (and `--popover`, which shares its value) represents any elevated container surface — Card, Dialog content, Popover content, Empty states, and similar "canvas-on-canvas" components. The deciding principle: a card SHALL always be perceptibly lighter/more prominent than the page behind it, in _both_ light and dark mode — not just one.

This requires breaking the current value collapse:

- Light mode: background stays `#fafafa` (near-white), card becomes `#ffffff` (pure white) — card is now whiter/brighter than the page.
- Dark mode: background becomes `#080808` (near-black, darker than the previous `#171717`), card becomes `#171717` (one step lighter than background) — card now visibly "lifts" off the page, matching the light-mode relationship inverted.

Alternative considered: keep `--background` at `#171717` in dark mode and make `--card` even darker (e.g. `#080808`). Rejected — this would make cards recede _into_ the page rather than pop off it, violating the elevation principle and reading as visually "wrong" relative to the light-mode behavior.

### Consolidate `--alt-mesh-bg` into `--background`

`--alt-mesh-bg`'s light/dark values already equal `--background`'s values (this is what made the collapse issue easy to spot). Removing it and pointing `mesh-gradient.tsx`'s background `<rect fill>` directly at `var(--background)` is a zero-visual-impact simplification — one fewer token to keep in sync.

Alternative considered: keep `--alt-mesh-bg` as an explicit "hero background" token in case the mesh hero ever needs a background distinct from the page. Rejected as speculative — YAGNI; nothing in the current design calls for that distinction, and a token can be reintroduced later if a real need appears.

### CTA variant fix over color-system fix

The home hero's "View Portfolio" button currently borrows `variant="destructive"` to look prominent. The correct fix is switching it to `variant="default"` (`bg-primary text-primary-foreground`), which already inverts between light/dark mode via the existing `--primary` token — no new color is needed, and the semantic mismatch disappears. The "About Me" `variant="outline"` button keeps the `outline` variant — its surface-token implementation is corrected separately, see "Unify the outline button's surface token across modes" below.

### Unify the outline button's surface token across modes

The shared `outline` button variant (`src/components/ui/button.tsx`) currently fills its background using two different CSS variables depending on theme — `bg-background` in light mode, `dark:bg-input/30` in dark mode — with a matching `hover:bg-accent` / `dark:hover:bg-input/50` split for the hover state. This dual-token-per-mode pattern is exactly the kind of management overhead this change is trying to eliminate elsewhere: a reader must track two unrelated tokens to understand one surface, and the two can drift independently over time.

The fix: reference `--background` alone, with a translucency modifier (`bg-background/50`), in both modes. Because `--background` already carries the correct per-mode value (near-white `Paper` in light, near-black `Soot` in dark — see "Paper & Ink" naming below), a single translucent reference produces the intended "blend with whatever sits behind the button" look in both themes — matching the previously-confirmed semantic that "outline = border-only; its fill should recede into its surroundings" — without needing a second token to compensate for `--background` becoming visually indistinguishable from the page in dark mode. The hover state already has a single mode-aware token available (`--accent`, which carries distinct light/dark values via its own `:root`/`.dark` definitions); removing its `dark:bg-input/50` override lets `hover:bg-accent` alone do the job consistently across themes.

This change applies to the shared `outline` button variant, so it affects every consumer uniformly: Dialog's "Close" button, the home "About Me" CTA, the `GithubInfo` buttons, and the article info "outline" button — which is the intended outcome of a token-system cleanup: one token, one rule, everywhere.

Alternative considered: keep the existing dual-token split, reasoning by analogy to `BusinessCard` (`src/components/about/business-card.tsx`), which also renders with colors that stay constant across theme switches. Rejected — `BusinessCard`'s background is a fixed brand gradient that is _intentionally_ identical in both themes (a deliberate, documented exception, not a reusable pattern), whereas the outline button's background is explicitly meant to be theme-aware and blend with its surroundings. It has no comparable reason to deviate from the single-token convention, so importing `BusinessCard`'s exception would just relocate the same management problem rather than solve it.

### "Paper & Ink" naming theme for neutral/surface tokens

DESIGN.md's neutral palette currently uses positional names (`canvas`, `canvas-soft`, `canvas-soft-2`) that describe _where_ a color sits relative to others rather than _what it looks like_. This is replaced with a theme of paper/ink-adjacent material names that are immediately legible against their hex values:

| Old name                                     | Hex               | New name   | Rationale                                                                                                                                                |
| -------------------------------------------- | ----------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `canvas`                                     | `#ffffff`         | `Chalk`    | brightest, coolest white                                                                                                                                 |
| `canvas-soft`                                | `#fafafa`         | `Paper`    | warm near-white, default page background                                                                                                                 |
| `canvas-soft-2`                              | `#f5f5f5`         | `Fog`      | inset/recessed grayish-white                                                                                                                             |
| _(new)_                                      | `#080808`         | `Soot`     | dark-mode page background — previously had no brand-token name despite being promoted to a core role by this change                                      |
| `ink`                                        | `#171717`         | `Ink`      | unchanged — brand-iconic near-black, already descriptive                                                                                                 |
| `primary`                                    | `#171717`/inverts | `Graphite` | same hex as Ink in light mode, but a distinct _role_ (CTA / theme-inverting accent) — needs its own name to avoid confusion with the non-inverting `Ink` |
| `body`                                       | `#4d4d4d`         | `Slate`    | mid-gray secondary text                                                                                                                                  |
| `mute`                                       | `#888888`         | `Smoke`    | tertiary text                                                                                                                                            |
| `hairline`                                   | `#ebebeb`         | `Hairline` | unchanged — already a functional, self-describing name                                                                                                   |
| `hairline-strong`                            | `#a1a1a1`         | `Pewter`   | stronger divider / de-emphasized text                                                                                                                    |
| `on-primary`, `selection-bg`, `selection-fg` | —                 | unchanged  | relational/functional names that are already self-explanatory; renaming would add noise, not clarity                                                     |

Alternative considered: align names to the Vercel reference palette this project's design system was originally modeled on (e.g. "Marble White", "Graphite", "Felt Gray", "Smoke", "Ash"). Rejected wholesale — some of those names collide with different hex values than this project uses (e.g. Vercel's "Graphite" ≠ this project's intended `#171717` role split between `Ink`/`Graphite`), which would import confusion rather than remove it; the "Paper & Ink" theme borrows the _spirit_ (material, perception-first naming) while choosing values that map cleanly onto this project's actual 12-token set.

Alternative considered: rename the entire DESIGN.md palette (all ~35 tokens, including chromatic/semantic ones) in one pass. Rejected as scope creep — chromatic tokens (`link`, gradient stops, `destructive`) already carry descriptive or functional names and don't exhibit the positional-confusion problem that motivated this rename; touching them would be unscoped churn with no clarity payoff (see Non-Goals).

### Keep `--card` / `--popover` as separate-but-identical tokens

`--card` and `--popover` will hold the same value after this change (as they effectively did before). They remain separate CSS variables — this matches shadcn/ui's convention of giving each component family its own semantic slot, which keeps future per-component overrides possible without restructuring. The identity is documented explicitly (in `globals.css` comments and DESIGN.md) so it reads as an intentional decision, not an oversight.

### Dialog stays on `--background`, not `--card`

Even though Dialog is an "elevated" surface conceptually, it is explicitly kept on `--background` (its current token) rather than migrated to `--card`. This preserves its current visual relationship to the page (a dialog overlays the page but is not meant to look like a "card floating on the page" — it _is_ the page's foreground content in that moment) and avoids a behavior change beyond what this proposal's surface-role cleanup requires.

## Implementation Contract

**Behavior**: After this change ships, the rendered site SHALL exhibit:

- A page background (`bg-background` / `--background`) of `#fafafa` in light mode and `#080808` in dark mode.
- Card-family surfaces (Card, Dialog content via its current `--background` token — see Decisions — Popover content, Empty) of `#ffffff` (light) / `#171717` (dark) wherever they use `--card` or `--popover`.
- The home hero's "View Portfolio" button rendered with the `default` button variant (solid `--primary`-colored background, theme-inverting), not `destructive` (red/error-colored).
- Every `outline`-variant button (Dialog "Close", home "About Me" CTA, `GithubInfo` buttons, article info button) rendered with a translucent `bg-background/50` fill and `hover:bg-accent` hover fill in BOTH light and dark mode — no mode-specific `bg-input`/`dark:bg-input` override remains.
- No visible translucent overlay panel behind article content or About page content (the `bg-background/50` wrapper divs are gone; their children render directly against the page background).
- The mesh-gradient SVG's background rect filled with the resolved `--background` value (visually identical to its current `--alt-mesh-bg`-filled appearance).

**Interface / data shape** (CSS custom properties in `src/app/globals.css`):

- `--background` and `--card`/`--popover` retain their existing variable names; only their `:root` (light) and `.dark` values change as specified in Decisions.
- `--alt-mesh-bg`, `--alt-canvas-soft`, `--alt-canvas-soft-2`, `--alt-ink`, `--sidebar`, every `--sidebar-*` variable, and their `@theme inline` `--color-sidebar-*` / `--color-alt-canvas-soft*` / `--color-alt-ink` mappings are deleted entirely from both `:root` and `.dark` blocks (and from `@theme inline` where applicable).
- `--alt-mesh-op-1` through `--alt-mesh-op-6` and `--alt-mesh-noise-opacity` are explicitly NOT touched — they control mesh-shape/noise opacity, not background color, and remain exactly as-is.

**Failure modes**: This is a pure styling/token change with no runtime logic — there are no new error states. The only "failure" mode is a visual regression (wrong color rendered, missing token causing a CSS variable to resolve to `initial`/transparent), which is caught by the acceptance criteria below, not by runtime error handling.

**Acceptance criteria**:

- `pnpm type-check` and `pnpm build` pass (per project convention for Spectra-applied changes).
- Visual check in both light and dark mode, at minimum on: the home page (mesh-gradient background + both CTA buttons), a page using `Card` (e.g. Projects or About), `Dialog` (e.g. resume download dialog), `Popover`, an `Empty` state (e.g. a 404/not-found page), and at least one `outline`-variant button — confirming card-family surfaces read as visually elevated relative to the page background in both modes, the CTA button is no longer red/destructive-colored, the outline button's fill blends translucently with its surroundings identically in both themes, and the article/About wrappers show no translucent panel.
- `grep -rn "dark:bg-input\|dark:hover:bg-input" src/components/ui/button.tsx` returns no matches (confirms the outline variant no longer splits its surface token by mode).
- `grep -r "alt-mesh-bg\|alt-canvas-soft\|alt-ink\|sidebar" src/app/globals.css` returns no matches (confirms dead-token removal).
- DESIGN.md's neutral/surface token table, CSS Variable Implementation mapping tables, Elevation & Depth table, Components catalog `backgroundColor` entries, and terminal-mockup description all reference the new "Paper & Ink" names and the corrected two-role surface model — no stale references to `canvas`/`canvas-soft`/`canvas-soft-2`/`alt-mesh-bg` remain.

**Scope boundaries**:

- In scope: `globals.css` token value/name/structure changes; the one CTA variant fix; the shared `outline` button variant's surface-token unification (a single `bg-background/50` + `hover:bg-accent` rule replacing the `bg-background`/`dark:bg-input` split — applies uniformly to all of its consumers); removal of the two translucent wrapper `div`s; `mesh-gradient.tsx`'s background-rect fill source; DESIGN.md prose and table updates describing all of the above.
- Out of scope: any change to `Dialog`, `Popover`, or `Empty` component _structure_ or token _assignment_ (only their resolved colors change, as a side effect of the `--card`/`--background` value updates — no token reassignment); any chromatic/semantic token rename; any change to mesh-gradient shapes, animation, or opacity tokens; any change to `BusinessCard`'s fixed-gradient background (its mode-independent colors are an intentional, documented exception — not part of this cleanup); any visual/brand redesign beyond the surface-color, CTA-variant, and outline-button fixes described here.

## Risks / Trade-offs

- [Risk] Changing `--background`'s dark-mode value from `#171717` to `#080808` is a global, highly visible change — any component that assumed the old value (via hardcoded color, screenshot-based test, or visual-regression baseline) could appear to "break." → Mitigation: the value change is the explicit subject of this proposal (not a side effect), the CSS variable indirection means every consumer updates automatically and consistently, and the acceptance criteria call for a manual visual pass across all major surface types in both modes before this is considered done.
- [Risk] Renaming DESIGN.md tokens could leave stale cross-references in prose sections that aren't caught by a mechanical search-and-replace (e.g., descriptive sentences that spell out a color's role without using its token name). → Mitigation: the acceptance criteria explicitly call out the Elevation table, Components catalog, and terminal-mockup description as sections requiring manual review, not just the token definition table.
- [Trade-off] Keeping `--card` and `--popover` as separate-but-identical tokens (rather than merging them) adds one line of indirection that a newcomer might initially read as redundant. → Accepted: the `globals.css` comment and DESIGN.md documentation added by this change make the intentionality explicit, and preserving shadcn/ui's per-component slot convention keeps future divergence cheap.
