# home-terminal-animation Specification

## Purpose

Defines the sequential reveal animation for the home hero terminal mockup.

## ADDED Requirements

### Requirement: terminal-data-layer

Terminal line content SHALL be defined in `src/lib/data/terminal.ts` as an exported `terminalLines` array of typed `TerminalLine` objects. `TerminalAnimation` SHALL read from this array — no hardcoded strings in the component.

```ts
type TerminalLine =
  | { type: "command"; path: string; cmd: string }
  | { type: "output"; text: string }
  | { type: "blank" }
  | { type: "ascii"; content: string }
  | { type: "final"; path: string };
```

#### Scenario: Data isolation

WHEN the terminal content changes
THEN only `src/lib/data/terminal.ts` SHALL need to be edited — no changes to `TerminalAnimation` component logic.

### Requirement: sequential-playback

`TerminalAnimation` SHALL play once on mount in strict sequential order:

1. Path text-reveal (stagger CSS transition: opacity + translateY + blur)
2. Command typewriter (after path reveal completes)
3. Each output line reveal in order (after previous line completes)
4. Blank delay (300 ms)
5. Repeat from step 1 for the next command block
6. ASCII art fade-in (after final command's typewriter completes)
7. Final-line path reveal
8. Cursor blink loop (infinite)

No step SHALL start before its predecessor completes. The animation SHALL NOT restart unless the component unmounts and remounts.

#### Scenario: Sequential order enforced

WHEN the component mounts
THEN the first visible character of the command typewriter SHALL NOT appear before the path text-reveal transition duration has elapsed.

#### Scenario: Once-on-mount

WHEN the animation reaches the cursor blink state
THEN the sequence SHALL remain in that state indefinitely — no automatic replay.

### Requirement: path-text-reveal

The terminal path (e.g. `~/projects`) SHALL use a CSS stagger reveal animation:

- `opacity: 0 → 1`
- `transform: translateY(12px) → translateY(0)`
- `filter: blur(3px) → blur(0)`
- Duration: 600 ms, `cubic-bezier(0.22, 1, 0.36, 1)`

The path SHALL reveal as a single element (not character by character).

#### Scenario: Path reveal timing

WHEN a path reveal starts
THEN the full path text SHALL be visible (opacity 1, no blur, no Y offset) within 700 ms.

### Requirement: command-typewriter

After the preceding path reveal completes, the command string SHALL be appended character by character at 40 ms per character. A blinking cursor SHALL appear at the end of the growing string during typing.

#### Scenario: Typewriter speed

WHEN a command contains 10 characters
THEN the full command SHALL be visible approximately 400 ms after the path reveal finishes.

### Requirement: output-text-reveal

Each output line SHALL use the same stagger CSS animation as the path reveal, but with a 40 ms stagger delay between successive lines. Output lines SHALL reveal after the command typewriter finishes.

#### Scenario: Staggered output

WHEN two consecutive output lines reveal
THEN the second line's reveal SHALL start 40 ms after the first line's reveal starts.

### Requirement: ascii-art-display

The final output block SHALL include an ASCII art element rendering "andrewck24" using `GeistPixelSquare` from `geist/font/pixel`. The font size SHALL use `clamp(24px, 4vw, 56px)` to adapt to the terminal panel width. The element SHALL fade in (opacity 0 → 1, 500 ms) after the final command's typewriter completes.

#### Scenario: Font fallback

WHEN `GeistPixelSquare` fails to load
THEN the text SHALL render in the terminal's default monospace face — no layout break or runtime error.

### Requirement: cursor-blink

After all animation steps complete, the terminal SHALL show a blinking cursor on the final prompt line. The cursor SHALL blink using the existing `--animate-blink` keyframe from `globals.css` (1.2 s, opacity 1 → 0).

#### Scenario: Cursor idle state

WHEN the animation sequence finishes
THEN a cursor block (7 × 13 px) SHALL blink indefinitely at the end of the final prompt.

### Requirement: cleanup-on-unmount

`useEffect` SHALL return a cleanup function that clears all pending `setTimeout` and `setInterval` calls and sets a `stopped` flag to prevent state updates after unmount.

#### Scenario: No stale state updates

WHEN the component unmounts while an animation step is in progress
THEN no React state setter SHALL be called after unmount — verified by absence of React "Can't perform a state update on an unmounted component" console warnings.
