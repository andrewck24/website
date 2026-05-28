"use client";
import { LanguageToggle } from "@/components/language-toggle";
import { isSecondary } from "@/components/layout/home";
import {
  BaseLinkItem,
  NavOptions,
  type BaseLayoutProps,
  type LinkItemType,
} from "@/components/layout/shared";
import { SearchToggle } from "@/components/search-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { ChevronDown, Languages } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

interface MenuProps extends BaseLayoutProps {
  nav?: Partial<
    NavOptions & {
      /**
       * Open mobile menu when hovering the trigger
       */
      enableHoverToOpen?: boolean;
    }
  >;
  menuItems?: LinkItemType[];
}

export function Menu({
  searchToggle = {},
  themeSwitch = {},
  i18n,
  nav = {},
  menuItems = [],
}: MenuProps) {
  return (
    <ul className="ms-auto -me-1.5 flex flex-row items-center gap-1.5 lg:hidden">
      {i18n && (
        <LanguageToggle availableLocales={["zh-TW", "en", "ja"]}>
          <Languages className="size-5" />
        </LanguageToggle>
      )}
      <NavigationMenuItem>
        <MenuTrigger
          aria-label="Toggle Menu"
          className={cn(
            buttonVariants({
              size: "icon",
              variant: "ghost",
              className: "group",
            })
          )}
          enableHover={nav.enableHoverToOpen}
        >
          <ChevronDown className="size-5.5! transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </MenuTrigger>
        <MenuContent className="sm:flex-row sm:items-center sm:justify-end">
          {menuItems
            .filter((item) => !isSecondary(item))
            .map((item, i) => (
              <MenuLinkItem key={i} item={item} className="sm:hidden" />
            ))}
          <div className="-ms-1.5 flex flex-row items-center gap-1.5 max-sm:mt-2">
            {menuItems.filter(isSecondary).map((item, i) => (
              <MenuLinkItem key={i} item={item} className="-me-1.5" />
            ))}
            <div role="separator" className="flex-1" />
            {searchToggle.enabled !== false &&
              (searchToggle.components?.sm ?? (
                <SearchToggle className="p-2" hideIfDisabled />
              ))}
            {themeSwitch.enabled !== false &&
              (themeSwitch.component ?? (
                <ThemeToggle mode={themeSwitch?.mode} />
              ))}
          </div>
        </MenuContent>
      </NavigationMenuItem>
    </ul>
  );
}

const menuItemVariants = cva("", {
  variants: {
    variant: {
      main: "hover:text-popover-foreground/50 data-[active=true]:text-primary inline-flex items-center gap-2 py-1.5 transition-colors data-[active=true]:font-medium [&_svg]:size-4",
      icon: buttonVariants({
        size: "icon",
        variant: "ghost",
      }),
      button: buttonVariants({
        variant: "secondary",
        className: "gap-1.5 [&_svg]:size-4",
      }),
    },
  },
  defaultVariants: {
    variant: "main",
  },
});

function MenuLinkItem({
  item,
  ...props
}: {
  item: LinkItemType;
  className?: string;
}) {
  if (item.type === "custom")
    return <div className={cn("grid", props.className)}>{item.children}</div>;

  if (item.type === "menu") {
    const header = (
      <>
        {item.icon}
        {item.text}
      </>
    );

    return (
      <div className={cn("mb-4 flex flex-col", props.className)}>
        <p className="text-muted-foreground mb-1 text-sm">
          {item.url ? (
            <NavigationMenuLink asChild>
              <Link
                href={item.url}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {header}
              </Link>
            </NavigationMenuLink>
          ) : (
            header
          )}
        </p>
        {item.items.map((child, i) => (
          <MenuLinkItem key={i} item={child} />
        ))}
      </div>
    );
  }

  return (
    <NavigationMenuLink asChild>
      <BaseLinkItem
        item={item}
        className={cn(
          menuItemVariants({ variant: item.type }),
          props.className
        )}
        aria-label={item.type === "icon" ? item.label : undefined}
      >
        {item.icon}
        {item.type === "icon" ? undefined : item.text}
      </BaseLinkItem>
    </NavigationMenuLink>
  );
}

export function MenuTrigger({
  enableHover = false,
  ...props
}: ComponentPropsWithoutRef<typeof NavigationMenuTrigger> & {
  /**
   * Enable hover to trigger
   */
  enableHover?: boolean;
}) {
  return (
    <NavigationMenuTrigger
      {...props}
      onPointerMove={enableHover ? undefined : (e) => e.preventDefault()}
    >
      {props.children}
    </NavigationMenuTrigger>
  );
}

function MenuContent(
  props: ComponentPropsWithoutRef<typeof NavigationMenuContent>
) {
  return (
    <NavigationMenuContent
      {...props}
      className={cn("flex flex-col p-4", props.className)}
    >
      {props.children}
    </NavigationMenuContent>
  );
}
