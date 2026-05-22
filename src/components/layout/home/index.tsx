import { LanguageToggle } from "@/components/language-toggle";
import { Menu } from "@/components/layout/home/menu";
import { Navbar, NavbarLinkItem } from "@/components/layout/home/navbar";
import {
  type BaseLayoutProps,
  getLinks,
  type LinkItemType,
  type NavOptions,
} from "@/components/layout/shared/index";
import { LargeSearchToggle } from "@/components/search-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import Link from "next/link";
import { type HTMLAttributes, useMemo } from "react";

export interface NavLayoutProps extends BaseLayoutProps {
  nav?: Partial<
    NavOptions & {
      /**
       * Open mobile menu when hovering the trigger
       */
      enableHoverToOpen?: boolean;
    }
  >;
}

export function NavLayout(props: NavLayoutProps & HTMLAttributes<HTMLElement>) {
  const {
    nav = {},
    links,
    githubUrl,
    i18n,
    themeSwitch = { enabled: true },
    searchToggle,
    ...rest
  } = props;

  return (
    <>
      {nav.enabled !== false &&
        (nav.component ?? (
          <Header
            links={links}
            nav={nav}
            themeSwitch={themeSwitch}
            searchToggle={searchToggle}
            i18n={i18n}
            githubUrl={githubUrl}
          />
        ))}
      <main
        id="nd-home-layout"
        {...rest}
        className={cn(
          "flex w-full max-w-7xl flex-1 flex-col items-center justify-start px-6 pt-22 lg:px-12",
          rest.className
        )}
      >
        {props.children}
      </main>
    </>
  );
}

function Header({
  nav = {},
  i18n = false,
  links,
  githubUrl,
  themeSwitch = {},
  searchToggle = {},
}: NavLayoutProps) {
  const finalLinks = useMemo(
    () => getLinks(links, githubUrl),
    [links, githubUrl]
  );

  const navItems = finalLinks.filter((item) =>
    ["nav", "all"].includes(item.on ?? "all")
  );
  const menuItems = finalLinks.filter((item) =>
    ["menu", "all"].includes(item.on ?? "all")
  );

  return (
    <Navbar>
      <Link
        href={nav.url ?? "/"}
        className="inline-flex items-center gap-2.5 font-semibold"
      >
        {nav.title}
      </Link>
      {nav.children}
      <ul className="flex flex-row items-center gap-2 px-6 max-sm:hidden">
        {navItems
          .filter((item) => !isSecondary(item))
          .map((item, i) => (
            <NavbarLinkItem key={i} item={item} className="text-sm" />
          ))}
      </ul>
      <div className="flex flex-1 flex-row items-center justify-end gap-1.5 max-lg:hidden">
        {searchToggle.enabled !== false &&
          (searchToggle.components?.lg ?? (
            <LargeSearchToggle
              className="w-full max-w-60 rounded-full ps-2.5"
              hideIfDisabled
            />
          ))}
        {themeSwitch.enabled !== false &&
          (themeSwitch.component ?? <ThemeToggle mode={themeSwitch?.mode} />)}
        {i18n ? (
          <LanguageToggle availableLocales={["zh-TW", "en", "ja"]}>
            <Languages className="size-5" />
          </LanguageToggle>
        ) : null}
        <div className="flex flex-row items-center empty:hidden">
          {navItems.filter(isSecondary).map((item, i) => (
            <NavbarLinkItem key={i} item={item} />
          ))}
        </div>
      </div>
      <Menu
        searchToggle={searchToggle}
        themeSwitch={themeSwitch}
        i18n={i18n}
        nav={nav}
        menuItems={menuItems}
      />
    </Navbar>
  );
}

export function isSecondary(item: LinkItemType): boolean {
  if ("secondary" in item && item.secondary != null) return item.secondary;

  return item.type === "icon";
}
