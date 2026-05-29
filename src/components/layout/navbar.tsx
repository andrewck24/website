"use client";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  LanguageToggle,
  LanguageToggleText,
} from "@/components/layout/language-toggle";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = {
  "zh-TW": [
    { text: "專案", path: "projects" },
    { text: "關於", path: "about" },
  ],
  en: [
    { text: "Projects", path: "projects" },
    { text: "About", path: "about" },
  ],
  ja: [
    { text: "プロジェクト", path: "projects" },
    { text: "私について", path: "about" },
  ],
} as const;

function isActive(pathname: string, url: string): boolean {
  const normalized = pathname.replace(/\/$/, "");
  const normalizedUrl = url.replace(/\/$/, "");
  return (
    normalized === normalizedUrl || normalized.startsWith(normalizedUrl + "/")
  );
}

export function Navbar({
  lang,
  isScrolled,
}: {
  lang: string;
  isScrolled: boolean;
}) {
  const pathname = usePathname();
  const links = NAV_LINKS[lang as keyof typeof NAV_LINKS] ?? NAV_LINKS.en;
  const activeIndex = links.findIndex((link) =>
    isActive(pathname, `/${lang}/${link.path}`)
  );

  return (
    <nav
      style={
        activeIndex >= 0
          ? ({
              "--active-anchor": `--nav-link-${activeIndex}`,
            } as React.CSSProperties)
          : undefined
      }
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex justify-center transition-all duration-300",
        isScrolled && "bg-background/60 shadow-xl backdrop-blur-sm"
      )}
    >
      <div className="flex w-full max-w-7xl items-center px-6 lg:px-12">
        <div className="mt-4 flex h-14 w-full items-center rounded-xl px-4">
          {/* Desktop link row */}
          <div className="relative hidden items-center gap-1 lg:flex">
            {links.map((link, i) => {
              const url = `/${lang}/${link.path}`;
              const active = isActive(pathname, url);
              return (
                <Link
                  key={link.path}
                  href={url}
                  data-active={active || undefined}
                  style={
                    { anchorName: `--nav-link-${i}` } as React.CSSProperties
                  }
                  className={cn(
                    "text-muted-foreground hover:text-foreground relative z-10 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active && "text-foreground"
                  )}
                >
                  {link.text}
                </Link>
              );
            })}
            {/* CSS anchor positioning indicator — silently absent in unsupported browsers */}
            <span
              data-indicator
              className="bg-muted/60 pointer-events-none absolute hidden rounded-md backdrop-blur-sm supports-[anchor-name:--x]:block"
              style={
                {
                  positionAnchor: `var(--active-anchor)`,
                  top: "anchor(top)",
                  left: "anchor(left)",
                  width: "anchor-size(width)",
                  height: "anchor-size(height)",
                  transition:
                    "top 150ms, left 150ms, width 150ms, height 150ms",
                } as React.CSSProperties
              }
            />
          </div>

          <div className="flex flex-1 items-center justify-end gap-1.5">
            <ThemeToggle />
            <LanguageToggle availableLocales={["zh-TW", "en", "ja"]}>
              <Languages className="size-5" />
              <LanguageToggleText className="sr-only" />
            </LanguageToggle>
            <a
              href="https://github.com/andrewck24"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors"
            >
              <GithubIcon className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
