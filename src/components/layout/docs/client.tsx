"use client";
import type { Option } from "@/components/root-toggle";
import { SearchToggle } from "@/components/search-toggle";
import { SidebarCollapseTrigger, useSidebar } from "@/components/sidebar";
import { buttonVariants } from "@/components/ui/button";
import { isTabActive } from "@/lib/is-active";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sidebar as SidebarIcon } from "lucide-react";
import { type ComponentProps, useMemo } from "react";

export function Navbar(props: ComponentProps<"header">) {
  return (
    <header
      id="nd-subnav"
      {...props}
      className={cn(
        "bg-background/80 fixed top-(--fd-banner-height) right-(--removed-body-scroll-bar-size,0) left-0 z-30 flex items-center border-b ps-4 pe-2.5 backdrop-blur-sm transition-colors",
        props.className
      )}
    >
      {props.children}
    </header>
  );
}

export function LayoutBody(props: ComponentProps<"main">) {
  const { collapsed } = useSidebar();

  return (
    <main
      id="nd-docs-layout"
      {...props}
      className={cn(
        "fd-default-layout flex flex-1 flex-col pt-(--fd-nav-height) transition-[padding]",
        !collapsed && "mx-(--fd-layout-offset)",
        props.className
      )}
      style={{
        ...props.style,
        paddingInlineStart: collapsed
          ? "min(calc(100vw - var(--fd-page-width)), var(--fd-sidebar-width))"
          : "var(--fd-sidebar-width)",
      }}
    >
      {props.children}
    </main>
  );
}

export function CollapsibleControl() {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground fixed z-10 flex rounded-xl border p-0.5 shadow-lg transition-opacity max-xl:end-4 max-md:hidden xl:start-4",
        !collapsed && "pointer-events-none opacity-0"
      )}
      style={{
        top: "calc(var(--fd-banner-height) + var(--fd-tocnav-height) + var(--spacing) * 4)",
      }}
    >
      <SidebarCollapseTrigger
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "icon",
            className: "rounded-lg",
          })
        )}
      >
        <SidebarIcon />
      </SidebarCollapseTrigger>
      <SearchToggle className="rounded-lg" hideIfDisabled />
    </div>
  );
}

export function LayoutTabs({
  options,
  ...props
}: ComponentProps<"div"> & { options: Option[] }) {
  const pathname = usePathname();
  const selected = useMemo(() => {
    return options.findLast((option) => isTabActive(option, pathname));
  }, [options, pathname]);

  return (
    <div
      {...props}
      className={cn(
        "flex flex-row items-end gap-6 overflow-auto",
        props.className
      )}
    >
      {options.map((option) => (
        <LayoutTab
          key={option.url}
          selected={selected === option}
          option={option}
        />
      ))}
    </div>
  );
}

function LayoutTab({
  option: { title, url, unlisted, props },
  selected = false,
}: {
  option: Option;
  selected?: boolean;
}) {
  return (
    <Link
      href={url}
      {...props}
      className={cn(
        "text-muted-foreground hover:text-accent-foreground inline-flex items-center gap-2 border-b-2 border-transparent pb-1.5 text-sm font-medium text-nowrap transition-colors",
        unlisted && !selected && "hidden",
        selected && "border-primary text-primary",
        props?.className
      )}
    >
      {title}
    </Link>
  );
}
