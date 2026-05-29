"use client";
import { BrandIcon } from "@/components/icons/brand-icon";
import { GithubIcon } from "@/components/icons/github-icon";
import {
  LanguageToggle,
  LanguageToggleText,
} from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { socialLinks } from "@/lib/data/social-links";
import { cn } from "@/lib/utils";
import { ChevronDown, Languages } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SUPPORTED_LOCALES = ["zh-TW", "en", "ja"] as const;
const NAV_ITEMS = [
  {
    path: "projects",
    labels: {
      "zh-TW": "專案",
      en: "Projects",
      ja: "プロジェクト",
    },
  },
  {
    path: "about",
    labels: {
      "zh-TW": "關於",
      en: "About",
      ja: "私について",
    },
  },
] as const;

type Locale = (typeof SUPPORTED_LOCALES)[number];
type NavLink = { text: string; path: string };

function normalizeLocale(lang: string): Locale {
  return SUPPORTED_LOCALES.includes(lang as Locale) ? (lang as Locale) : "en";
}

function buildNavHref(lang: Locale, path: string) {
  return `/${lang}/${path}`;
}

function buildNavLinks(lang: Locale): readonly NavLink[] {
  return NAV_ITEMS.map(({ path, labels }) => ({
    path,
    text: labels[lang],
  }));
}

function getNavLinkState(pathname: string, href: string) {
  return {
    href,
    active: isActive(pathname, href),
  };
}

export function Navbar({
  lang,
  isScrolled,
}: {
  lang: string;
  isScrolled: boolean;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Derived-state reset: close menu when route changes without an effect
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const locale = normalizeLocale(lang);
  const links = buildNavLinks(locale);
  const activeIndex = links.findIndex((link) =>
    isActive(pathname, buildNavHref(locale, link.path))
  );

  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex justify-center">
      <div className="w-full max-w-7xl px-6 lg:px-12">
        <div
          style={
            activeIndex >= 0
              ? ({
                  "--active-anchor": `--nav-link-${activeIndex}`,
                } as React.CSSProperties)
              : undefined
          }
          onMouseLeave={() => setIsOpen(false)}
          className={cn(
            "mt-(--navbar-top-gap) w-full rounded-xl bg-transparent transition-all duration-300",
            (isScrolled || isOpen) &&
              "bg-background/60 shadow-secondary/60 shadow-xl backdrop-blur-sm"
          )}
        >
          <div className="flex h-(--navbar-height) w-full items-center px-4">
            <Link
              href={`/${locale}`}
              className="mr-2 inline-flex items-center"
              aria-label="Home"
            >
              <BrandIcon />
            </Link>
            <DesktopLinks
              lang={locale}
              links={links}
              pathname={pathname}
              activeIndex={activeIndex}
            />
            <RightControls
              isOpen={isOpen}
              onToggle={() => setIsOpen((v) => !v)}
            />
          </div>
          <MobilePanel
            lang={locale}
            links={links}
            pathname={pathname}
            isOpen={isOpen}
          />
        </div>
      </div>
    </nav>
  );
}

function isActive(pathname: string, url: string): boolean {
  const n = pathname.replace(/\/$/, "");
  const u = url.replace(/\/$/, "");
  return n === u || n.startsWith(u + "/");
}

function DesktopLinks({
  lang,
  links,
  pathname,
  activeIndex,
}: {
  lang: Locale;
  links: readonly NavLink[];
  pathname: string;
  activeIndex: number;
}) {
  return (
    <div className="relative hidden items-center gap-1 lg:flex">
      {links.map((link, i) => {
        const { href: url, active } = getNavLinkState(
          pathname,
          buildNavHref(lang, link.path)
        );
        return (
          <Link
            key={link.path}
            href={url}
            data-active={active || undefined}
            style={{ anchorName: `--nav-link-${i}` } as React.CSSProperties}
            className={cn(
              "text-muted-foreground hover:text-foreground relative z-10 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active && "text-foreground"
            )}
          >
            {link.text}
          </Link>
        );
      })}
      {/* CSS anchor-positioning pill — absent in unsupported browsers */}
      {activeIndex >= 0 && (
        <span
          data-indicator
          className="bg-muted/60 pointer-events-none absolute hidden rounded-md backdrop-blur-sm supports-[anchor-name:--x]:block"
          style={
            {
              positionAnchor: "var(--active-anchor)",
              top: "anchor(top)",
              left: "anchor(left)",
              width: "anchor-size(width)",
              height: "anchor-size(height)",
              transition: "top 150ms, left 150ms, width 150ms, height 150ms",
            } as React.CSSProperties
          }
        />
      )}
    </div>
  );
}

function RightControls({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-end gap-1.5">
      <ThemeToggle className="hidden lg:inline-flex" />
      <a
        href={socialLinks.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="text-muted-foreground hover:text-foreground hidden size-9 items-center justify-center rounded-md transition-colors lg:inline-flex"
      >
        <GithubIcon className="size-5" />
      </a>
      <LanguageToggle availableLocales={["zh-TW", "en", "ja"]}>
        <Languages className="size-5" />
        <LanguageToggleText className="sr-only" />
      </LanguageToggle>
      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={cn(
          buttonVariants({ size: "icon", variant: "ghost" }),
          "lg:hidden"
        )}
      >
        <ChevronDown
          className={cn(
            "size-5 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>
    </div>
  );
}

function MobilePanel({
  lang,
  links,
  pathname,
  isOpen,
}: {
  lang: Locale;
  links: readonly NavLink[];
  pathname: string;
  isOpen: boolean;
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 lg:hidden",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
    >
      <div className="overflow-hidden">
        <div className="flex flex-col gap-1 px-4 pb-4">
          {links.map((link) => {
            const { href: url, active } = getNavLinkState(
              pathname,
              buildNavHref(lang, link.path)
            );
            return (
              <Link
                key={link.path}
                href={url}
                data-active={active || undefined}
                className={cn(
                  "text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active && "bg-muted text-foreground"
                )}
              >
                {link.text}
              </Link>
            );
          })}
          <div className="-ms-1.5 mt-2 flex justify-between gap-1.5">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors"
            >
              <GithubIcon className="size-5" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
