#!/usr/bin/env python3
"""
Convert DESIGN.md hex color tokens to oklch for globals.css.

Outputs three blocks:
  1. :root  — shadcn base vars remapped to DESIGN.md neutral values
  2. :root  — --alt-* overflow tokens (no shadcn equivalent)
  3. .dark  — dark-mode overrides for shadcn base vars

Usage:
  python3 scripts/hex-to-oklch.py
"""

import math
import re


# ── Conversion functions (from user-provided algorithm) ──────────────────────

def hex_to_rgb(hex_str: str) -> tuple[int, int, int]:
    hex_str = hex_str.lstrip("#")
    if len(hex_str) == 3:
        hex_str = "".join(c * 2 for c in hex_str)
    if not re.match(r"^[0-9a-fA-F]{6}$", hex_str):
        raise ValueError(f"Invalid hex: {hex_str}")
    return int(hex_str[0:2], 16), int(hex_str[2:4], 16), int(hex_str[4:6], 16)


def rgb_to_oklch(r: int, g: int, b: int) -> tuple[float, float, float]:
    r_s, g_s, b_s = r / 255.0, g / 255.0, b / 255.0

    def linearize(c: float) -> float:
        return ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92

    r_l, g_l, b_l = linearize(r_s), linearize(g_s), linearize(b_s)

    l_con = 0.4122214708 * r_l + 0.5363325363 * g_l + 0.0514459929 * b_l
    m_con = 0.2119034982 * r_l + 0.6806995451 * g_l + 0.1073969566 * b_l
    s_con = 0.0883024619 * r_l + 0.2817188376 * g_l + 0.6299787005 * b_l

    l_ = l_con ** (1 / 3)
    m_ = m_con ** (1 / 3)
    s_ = s_con ** (1 / 3)

    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    b = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_

    C = math.sqrt(a**2 + b**2)
    H = math.degrees(math.atan2(b, a))
    if H < 0:
        H += 360.0

    return L, C, H


def oklch(hex_str: str) -> str:
    """Convert hex to a formatted oklch() string."""
    r, g, b = hex_to_rgb(hex_str)
    L, C, H = rgb_to_oklch(r, g, b)
    # Round C to 3 decimals; if effectively zero (neutral gray), collapse to 0
    c_fmt = f"{C:.3f}" if C > 0.0005 else "0"
    h_fmt = f"{H:.1f}" if C > 0.0005 else "0"
    return f"oklch({L:.3f} {c_fmt} {h_fmt})"


# ── DESIGN.md token definitions ───────────────────────────────────────────────

DESIGN_TOKENS: dict[str, str] = {
    # ── Neutral surface / text ──
    "canvas":           "#ffffff",
    "canvas-soft":      "#fafafa",
    "canvas-soft-2":    "#f5f5f5",
    "primary":          "#171717",
    "on-primary":       "#ffffff",
    "ink":              "#171717",
    "body":             "#4d4d4d",
    "mute":             "#888888",
    "hairline":         "#ebebeb",
    "hairline-strong":  "#a1a1a1",
    "selection-bg":     "#171717",
    "selection-fg":     "#f2f2f2",
    # ── Link ──
    "link":             "#0070f3",
    "link-deep":        "#0761d1",
    "link-bg-soft":     "#d3e5ff",
    # ── Semantic ──
    "success":          "#0070f3",
    "error":            "#ee0000",
    "error-soft":       "#f7d4d6",
    "error-deep":       "#c50000",
    "warning":          "#f5a623",
    "warning-soft":     "#ffefcf",
    "warning-deep":     "#ab570a",
    # ── Brand accent ──
    "violet":           "#7928ca",
    "violet-soft":      "#d8ccf1",
    "violet-deep":      "#4c2889",
    "cyan":             "#50e3c2",
    "cyan-soft":        "#aaffec",
    "cyan-deep":        "#29bc9b",
    "highlight-pink":   "#ff0080",
    "highlight-magenta":"#eb367f",
    # ── Mesh gradient stops ──
    "gradient-develop-start":  "#007cf0",
    "gradient-develop-end":    "#00dfd8",
    "gradient-preview-start":  "#7928ca",
    "gradient-preview-end":    "#ff0080",
    "gradient-ship-start":     "#ff4d4d",
    "gradient-ship-end":       "#f9cb28",
}


# ── Mapping: DESIGN.md token → shadcn CSS variable (light mode) ──────────────
# Only covers vars where the value changes (removes the blue-gray tint).

SHADCN_LIGHT: list[tuple[str, str, str]] = [
    # (css-var, design-token, comment)
    ("--background",       "canvas",      "page body"),
    ("--foreground",       "ink",         "primary text"),
    ("--card",             "canvas",      "card surface"),
    ("--card-foreground",  "ink",         "card text"),
    ("--popover",          "canvas",      "popover surface"),
    ("--popover-foreground","ink",        "popover text"),
    ("--primary",          "primary",     "CTA ink — dark mode flips to near-white"),
    ("--primary-foreground","on-primary", "text on primary"),
    ("--secondary",        "canvas-soft-2","secondary surface"),
    ("--secondary-foreground","ink",      "text on secondary"),
    ("--muted",            "canvas-soft-2","muted surface"),
    ("--muted-foreground", "mute",        "muted text"),
    ("--accent",           "canvas-soft-2","accent surface"),
    ("--accent-foreground","ink",         "text on accent"),
    ("--destructive",      "error",       "destructive action"),
    ("--border",           "hairline",    "dividers / card borders"),
    ("--input",            "hairline",    "input borders"),
    ("--ring",             "hairline-strong","focus ring"),
]

# Dark mode overrides for shadcn base vars
SHADCN_DARK: list[tuple[str, str, str]] = [
    ("--background",        "primary",     "dark surface = ink"),
    ("--foreground",        "on-primary",  "dark text = white"),
    ("--card",              "primary",     "dark card surface"),
    ("--card-foreground",   "on-primary",  "dark card text"),
    ("--popover",           "primary",     "dark popover"),
    ("--popover-foreground","on-primary",  "dark popover text"),
    ("--primary",           "hairline",    "flipped: near-white for buttons on dark"),
    ("--primary-foreground","primary",     "flipped: ink text on white button"),
    ("--secondary",         "ink",         "dark secondary surface"),
    ("--secondary-foreground","on-primary","dark secondary text"),
    ("--muted",             "ink",         "dark muted surface"),
    ("--muted-foreground",  "hairline-strong","dark muted text"),
    ("--accent",            "ink",         "dark accent surface"),
    ("--accent-foreground", "on-primary",  "dark accent text"),
    ("--destructive",       "error",       "destructive (same)"),
    ("--border",            "primary",     "dark border = subtle white at 10%"),
    ("--input",             "primary",     "dark input border"),
    ("--ring",              "hairline-strong","dark focus ring"),
]

# --alt-* overflow tokens (no shadcn equivalent)
ALT_TOKENS: list[tuple[str, str, str]] = [
    # (css-var, design-token, comment)
    ("--alt-canvas-soft",     "canvas-soft",     "page body tint"),
    ("--alt-canvas-soft-2",   "canvas-soft-2",   "inset surface"),
    ("--alt-ink",             "ink",             "non-inverting ink (always #171717)"),
    ("--alt-body",            "body",            "secondary text"),
    ("--alt-hairline-strong", "hairline-strong", "stronger divider / deemphasised text"),
    ("--alt-link",            "link",            "inline link"),
    ("--alt-link-deep",       "link-deep",       "visited / pressed link"),
    ("--alt-link-bg-soft",    "link-bg-soft",    "link highlight bg"),
    ("--alt-selection-bg",    "selection-bg",    "text selection bg"),
    ("--alt-selection-fg",    "selection-fg",    "text selection fg"),
    # Mesh gradient stops (replaces old --gradient-1..5)
    ("--alt-grad-dev-s",      "gradient-develop-start",  "mesh blue"),
    ("--alt-grad-dev-e",      "gradient-develop-end",    "mesh cyan/teal"),
    ("--alt-grad-prev-s",     "gradient-preview-start",  "mesh violet"),
    ("--alt-grad-prev-e",     "gradient-preview-end",    "mesh magenta"),
    ("--alt-grad-ship-s",     "gradient-ship-start",     "mesh coral (also coral accent)"),
    ("--alt-grad-ship-e",     "gradient-ship-end",       "mesh amber"),
    # Semantic
    ("--alt-error",           "error",           "validation red"),
    ("--alt-error-soft",      "error-soft",      "error bg tint"),
    ("--alt-warning",         "warning",         "caution amber"),
    ("--alt-violet",          "violet",          "brand violet"),
    ("--alt-cyan",            "cyan",            "brand cyan"),
    ("--alt-highlight-pink",  "highlight-pink",  "brand magenta"),
]


# ── Output ────────────────────────────────────────────────────────────────────

def pad(s: str, width: int) -> str:
    return s + " " * max(0, width - len(s))


def print_block(
    title: str,
    entries: list[tuple[str, str, str]],
    tokens: dict[str, str],
) -> None:
    print(f"  /* ── {title} ───── */")
    var_w = max(len(v) for v, _, _ in entries) + 2  # +2 for colon+space
    for css_var, token, comment in entries:
        val = oklch(tokens[token])
        line = f"  {css_var}: {val};"
        print(f"{pad(line, var_w + 40)}  /* {token} — {comment} */")
    print()


if __name__ == "__main__":
    print("/* ════════════════════════════════════════════════════════════")
    print("   globals.css — generated by scripts/hex-to-oklch.py")
    print("   Source: docs/DESIGN.md color tokens")
    print("   All values converted from hex → oklch")
    print("════════════════════════════════════════════════════════════ */")
    print()

    # ── :root ────────────────────────────────────────────────────────────────
    print(":root {")
    print_block("shadcn base — remapped to DESIGN.md neutral values", SHADCN_LIGHT, DESIGN_TOKENS)
    print_block("--alt-* overflow tokens (no shadcn equivalent)", ALT_TOKENS, DESIGN_TOKENS)

    # Mesh theme switching (not color conversion, printed as-is)
    print("  /* ── Mesh gradient theme switching ───── */")
    print("  --alt-mesh-blend: multiply;                   /* light mode: preserve saturation on white */")
    print()
    print("}")
    print()

    # ── .dark ────────────────────────────────────────────────────────────────
    print(".dark {")
    print_block("shadcn dark mode overrides", SHADCN_DARK, DESIGN_TOKENS)

    # --border / --input in dark mode are conventionally expressed as
    # `oklch(1 0 0 / 10%)` — cannot be derived from a single token hex,
    # so we print a manual note instead.
    print("  /* NOTE: --border and --input in dark mode use alpha:               */")
    print("  /* --border: oklch(1 0 0 / 10%);  --input: oklch(1 0 0 / 15%);     */")
    print()

    print("  /* ── Mesh gradient theme switching (dark) ───── */")
    print("  --alt-mesh-blend: normal;                     /* dark mode: standard alpha compositing */")
    print()
    print("}")
    print()

    # ── Reference table ──────────────────────────────────────────────────────
    print("/* ── Full DESIGN.md token reference ────────────────────────── */")
    print("/*")
    token_w = max(len(t) for t in DESIGN_TOKENS) + 1
    for token, hex_val in DESIGN_TOKENS.items():
        val = oklch(hex_val)
        print(f"   {pad(token+':', token_w)}  {hex_val}  →  {val}")
    print("*/")
