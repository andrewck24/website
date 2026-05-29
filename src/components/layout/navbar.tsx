"use client";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  LanguageToggle,
  LanguageToggleText,
} from "@/components/layout/language-toggle";
import { cn } from "@/lib/utils";
import { ChevronDown, Languages } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { BrandIcon } from "@/components/layout/brand-icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

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
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const links = NAV_LINKS[lang as keyof typeof NAV_LINKS] ?? NAV_LINKS.en;
  const activeIndex = links.findIndex((link) =>
    isActive(pathname, `/${lang}/${link.path}`)
  );

  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

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
          {/* Brand icon — all viewports */}
          <Link
            href={`/${lang}`}
            className="mr-2 inline-flex items-center"
            aria-label="Home"
          >
            <BrandIcon />
          </Link>

          {/* Desktop link row — lg+ only */}
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
            {/* ThemeToggle + GitHub: desktop only — shown inside mobile menu */}
            <ThemeToggle className="hidden lg:inline-flex" />
            <a
              href="https://github.com/andrewck24"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground hidden size-9 items-center justify-center rounded-md transition-colors lg:inline-flex"
            >
              <GithubIcon className="size-5" />
            </a>

            {/* LanguageToggle: always visible */}
            <LanguageToggle availableLocales={["zh-TW", "en", "ja"]}>
              <Languages className="size-5" />
              <LanguageToggleText className="sr-only" />
            </LanguageToggle>

            {/* Mobile trigger — lg:hidden */}
            <details ref={detailsRef} className="relative lg:hidden">
              <summary className="text-muted-foreground hover:text-foreground inline-flex size-9 cursor-pointer list-none items-center justify-center rounded-md transition-colors [&::-webkit-details-marker]:hidden">
                <ChevronDown className="size-5 transition-transform duration-300 [details[open]_&]:rotate-180" />
              </summary>
              {/* Panel — full-width, CSS grid expand animation */}
              <div className="bg-background/95 border-border fixed inset-x-0 top-[72px] grid grid-rows-[0fr] border-b backdrop-blur-sm transition-[grid-template-rows] duration-300 ease-in-out [details[open]_&]:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <nav className="flex flex-col gap-1 px-6 py-4">
                    {links.map((link) => {
                      const url = `/${lang}/${link.path}`;
                      const active = isActive(pathname, url);
                      return (
                        <Link
                          key={link.path}
                          href={url}
                          data-active={active || undefined}
                          className={cn(
                            "text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            active && "text-foreground bg-muted"
                          )}
                        >
                          {link.text}
                        </Link>
                      );
                    })}
                    {/* GitHub + ThemeToggle — only inside mobile menu */}
                    <div className="mt-2 flex items-center gap-2 border-t pt-3">
                      <a
                        href="https://github.com/andrewck24"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="text-muted-foreground hover:text-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors"
                      >
                        <GithubIcon className="size-5" />
                      </a>
                      <ThemeToggle />
                    </div>
                  </nav>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}
