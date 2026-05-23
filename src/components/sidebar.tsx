"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea, ScrollViewport } from "@/components/ui/scroll-area";
import { isActive } from "@/lib/is-active";
import { cn } from "@/lib/utils";
import type {
  CollapsibleContentProps,
  CollapsibleTriggerProps,
} from "@radix-ui/react-collapsible";
import { Presence } from "@radix-ui/react-presence";
import { type ScrollAreaProps } from "@radix-ui/react-scroll-area";
import { cva } from "class-variance-authority";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
type LinkProps = ComponentPropsWithoutRef<typeof Link>;
import { ChevronDown, ExternalLink } from "lucide-react";
import {
  type ComponentProps,
  type ComponentType,
  createContext,
  type Dispatch,
  Fragment,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ── Local page-tree types (mirror fumadocs-core/page-tree shape) ──────────
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PageTree {
  export interface Item {
    type: "page";
    url: string;
    name: ReactNode;
    external?: boolean;
    icon?: ReactNode;
  }
  export interface Folder {
    type: "folder";
    name: ReactNode;
    icon?: ReactNode;
    children: Node[];
    index?: Item;
    defaultOpen?: boolean;
  }
  export interface Separator {
    type: "separator";
    name?: ReactNode;
    icon?: ReactNode;
  }
  export type Node = Item | Folder | Separator;
  export interface Root {
    children: Node[];
    $id?: string;
  }
}

// ── Local sidebar context (replaces fumadocs-ui/components/sidebar/base) ──
interface SidebarCtx {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  closeOnRedirect: RefObject<boolean>;
}

const SidebarCtx = createContext<SidebarCtx | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const closeOnRedirect = useRef(true);

  return (
    <SidebarCtx
      value={useMemo(
        () => ({ open, setOpen, collapsed, setCollapsed, closeOnRedirect }),
        [open, collapsed]
      )}
    >
      {children}
    </SidebarCtx>
  );
}

export function useSidebar(): SidebarCtx {
  const ctx = useContext(SidebarCtx);
  if (!ctx) throw new Error("Missing <SidebarProvider />");
  return ctx;
}

// ── Local tree context (replaces fumadocs-ui/contexts/tree) ──────────────
interface TreeCtx {
  root: PageTree.Root;
}

const TreeCtx = createContext<TreeCtx | null>(null);

export function TreeContextProvider({
  tree,
  children,
}: {
  tree: PageTree.Root;
  children: ReactNode;
}) {
  return <TreeCtx value={{ root: tree }}>{children}</TreeCtx>;
}

export function useTreeContext(): TreeCtx {
  const ctx = useContext(TreeCtx);
  if (!ctx) throw new Error("Missing <TreeContextProvider />");
  return ctx;
}

// ── Internal context ──────────────────────────────────────────────────────
interface InternalContext {
  defaultOpenLevel: number;
  prefetch: boolean;
  level: number;
}

const Context = createContext<InternalContext | null>(null);
const FolderContext = createContext<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
} | null>(null);

const itemVariants = cva(
  "text-muted-foreground relative flex flex-row items-center gap-2 rounded-lg p-2 ps-(--sidebar-item-offset) text-start wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      active: {
        true: "bg-primary/10 text-primary",
        false:
          "hover:bg-accent/50 hover:text-accent-foreground/80 transition-colors hover:transition-none",
      },
    },
  }
);

// ── Sidebar components ────────────────────────────────────────────────────

export interface SidebarProps {
  defaultOpenLevel?: number;
  prefetch?: boolean;
  Content: ReactNode;
  Mobile?: ReactNode;
}

export function Sidebar({
  defaultOpenLevel = 0,
  prefetch = true,
  Mobile,
  Content,
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(width < 768px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const context = useMemo<InternalContext>(
    () => ({ defaultOpenLevel, prefetch, level: 1 }),
    [defaultOpenLevel, prefetch]
  );

  return (
    <Context.Provider value={context}>
      {isMobile && Mobile != null ? Mobile : Content}
    </Context.Provider>
  );
}

export function SidebarContent(props: ComponentProps<"aside">) {
  const { collapsed } = useSidebar();
  const [hover, setHover] = useState(false);
  const timerRef = useRef(0);
  const closeTimeRef = useRef(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHover(false);
    closeTimeRef.current = Date.now() + 150;
  }, [collapsed]);

  return (
    <aside
      id="nd-sidebar"
      {...props}
      data-collapsed={collapsed}
      className={cn(
        "bg-card fixed top-(--fd-sidebar-top) bottom-(--fd-sidebar-margin) left-0 z-20 flex flex-col items-end border-e text-sm transition-[top,opacity,translate,width] duration-200 *:w-(--fd-sidebar-width) max-md:hidden",
        collapsed && [
          "translate-x-(--fd-sidebar-offset) rounded-xl border",
          hover ? "z-50 shadow-lg" : "opacity-0",
        ],
        props.className
      )}
      style={
        {
          ...props.style,
          "--fd-sidebar-offset": hover
            ? "calc(var(--spacing) * 2)"
            : "calc(16px - 100%)",
          "--fd-sidebar-margin": collapsed ? "0.5rem" : "0px",
          "--fd-sidebar-top": `calc(var(--fd-banner-height) + var(--fd-nav-height) + var(--fd-sidebar-margin))`,
          width: collapsed
            ? "var(--fd-sidebar-width)"
            : "calc(var(--spacing) + var(--fd-sidebar-width) + var(--fd-layout-offset))",
        } as object
      }
      onPointerEnter={(e) => {
        if (
          !collapsed ||
          e.pointerType === "touch" ||
          closeTimeRef.current > Date.now()
        )
          return;
        window.clearTimeout(timerRef.current);
        setHover(true);
      }}
      onPointerLeave={(e) => {
        if (!collapsed || e.pointerType === "touch") return;
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(
          () => {
            setHover(false);
            closeTimeRef.current = Date.now() + 150;
          },
          Math.min(e.clientX, document.body.clientWidth - e.clientX) > 100
            ? 0
            : 500
        );
      }}
    >
      {props.children}
    </aside>
  );
}

export function SidebarContentMobile({
  className,
  children,
  ...props
}: ComponentProps<"aside">) {
  const { open, setOpen } = useSidebar();
  const state = open ? "open" : "closed";

  return (
    <>
      <Presence present={open}>
        <div
          data-state={state}
          className="data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in fixed inset-0 z-40 backdrop-blur-xs"
          onClick={() => setOpen(false)}
        />
      </Presence>
      <Presence present={open}>
        {({ present }) => (
          <aside
            id="nd-sidebar-mobile"
            {...props}
            data-state={state}
            className={cn(
              "bg-background data-[state=closed]:animate-out data-[state=closed]:slide-out-to-end data-[state=open]:animate-in data-[state=open]:slide-in-from-end fixed inset-y-0 end-0 z-40 flex w-[85%] max-w-[380px] flex-col border-s text-[15px] shadow-lg",
              !present && "invisible",
              className
            )}
          >
            {children}
          </aside>
        )}
      </Presence>
    </>
  );
}

export function SidebarHeader(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex flex-col gap-3 p-4 pb-2", props.className)}
    >
      {props.children}
    </div>
  );
}

export function SidebarFooter(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex flex-col border-t p-4 pt-2", props.className)}
    >
      {props.children}
    </div>
  );
}

export function SidebarViewport(props: ScrollAreaProps) {
  return (
    <ScrollArea {...props} className={cn("h-full", props.className)}>
      <ScrollViewport
        className="overscroll-contain p-4"
        style={
          {
            "--sidebar-item-offset": "calc(var(--spacing) * 2)",
            maskImage:
              "linear-gradient(to bottom, transparent, white 12px, white calc(100% - 12px), transparent)",
          } as object
        }
      >
        {props.children}
      </ScrollViewport>
    </ScrollArea>
  );
}

export function SidebarSeparator(props: ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn(
        "mb-1.5 inline-flex items-center gap-2 px-2 ps-(--sidebar-item-offset) empty:mb-0 [&_svg]:size-4 [&_svg]:shrink-0",
        props.className
      )}
    >
      {props.children}
    </p>
  );
}

export function SidebarItem({
  icon,
  external,
  ...props
}: LinkProps & { icon?: ReactNode; external?: boolean }) {
  const pathname = usePathname();
  const active =
    props.href !== undefined && isActive(String(props.href), pathname, false);
  const { prefetch } = useInternalContext();

  return (
    <Link
      {...props}
      data-active={active}
      className={cn(itemVariants({ active }), props.className)}
      prefetch={prefetch}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {icon ?? (external ? <ExternalLink /> : null)}
      {props.children}
    </Link>
  );
}

export function SidebarFolder({
  defaultOpen = false,
  ...props
}: ComponentProps<"div"> & { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (defaultOpen) setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} {...props}>
      <FolderContext.Provider
        value={useMemo(() => ({ open, setOpen }), [open])}
      >
        {props.children}
      </FolderContext.Provider>
    </Collapsible>
  );
}

export function SidebarFolderTrigger({
  className,
  ...props
}: CollapsibleTriggerProps) {
  const { open } = useFolderContext();

  return (
    <CollapsibleTrigger
      className={cn(itemVariants({ active: false }), "w-full", className)}
      {...props}
    >
      {props.children}
      <ChevronDown
        data-icon
        className={cn("ms-auto transition-transform", !open && "-rotate-90")}
      />
    </CollapsibleTrigger>
  );
}

export function SidebarFolderLink(props: LinkProps & { external?: boolean }) {
  const { open, setOpen } = useFolderContext();
  const { prefetch } = useInternalContext();

  const pathname = usePathname();
  const active =
    props.href !== undefined && isActive(String(props.href), pathname, false);

  return (
    <Link
      {...props}
      data-active={active}
      className={cn(itemVariants({ active }), "w-full", props.className)}
      onClick={(e) => {
        if (
          e.target instanceof Element &&
          e.target.matches("[data-icon], [data-icon] *")
        ) {
          setOpen(!open);
          e.preventDefault();
        } else {
          setOpen(active ? !open : true);
        }
      }}
      prefetch={prefetch}
    >
      {props.children}
      <ChevronDown
        data-icon
        className={cn("ms-auto transition-transform", !open && "-rotate-90")}
      />
    </Link>
  );
}

export function SidebarFolderContent(props: CollapsibleContentProps) {
  const { level, ...ctx } = useInternalContext();

  return (
    <CollapsibleContent
      {...props}
      className={cn(
        "relative",
        level === 1 && [
          "before:bg-border before:absolute before:inset-y-1 before:start-2.5 before:w-px before:content-['']",
          "**:data-[active=true]:before:bg-primary **:data-[active=true]:before:absolute **:data-[active=true]:before:inset-y-2.5 **:data-[active=true]:before:start-2.5 **:data-[active=true]:before:w-px **:data-[active=true]:before:content-['']",
        ],
        props.className
      )}
      style={
        {
          "--sidebar-item-offset": `calc(var(--spacing) * ${(level + 1) * 3})`,
          ...props.style,
        } as object
      }
    >
      <Context.Provider
        value={useMemo(() => ({ ...ctx, level: level + 1 }), [ctx, level])}
      >
        {props.children}
      </Context.Provider>
    </CollapsibleContent>
  );
}

export function SidebarTrigger({
  children,
  ...props
}: ComponentProps<"button">) {
  const { setOpen } = useSidebar();

  return (
    <button
      {...props}
      aria-label="Open Sidebar"
      onClick={() => setOpen((prev) => !prev)}
    >
      {children}
    </button>
  );
}

export function SidebarCollapseTrigger(props: ComponentProps<"button">) {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <button
      type="button"
      aria-label="Collapse Sidebar"
      data-collapsed={collapsed}
      {...props}
      onClick={() => setCollapsed((prev) => !prev)}
    >
      {props.children}
    </button>
  );
}

function useFolderContext() {
  const ctx = useContext(FolderContext);
  if (!ctx) throw new Error("Missing sidebar folder");
  return ctx;
}

function useInternalContext() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("<Sidebar /> component required.");
  return ctx;
}

export interface SidebarComponents {
  Item: ComponentType<{ item: PageTree.Item }>;
  Folder: ComponentType<{
    item: PageTree.Folder;
    level: number;
    children: ReactNode;
  }>;
  Separator: ComponentType<{ item: PageTree.Separator }>;
}

export function SidebarPageTree(props: {
  components?: Partial<SidebarComponents>;
}) {
  const { root } = useTreeContext();

  return useMemo(() => {
    const { Separator, Item, Folder } = props.components ?? {};

    function renderSidebarList(
      items: PageTree.Node[],
      level: number
    ): ReactNode[] {
      return items.map((item, i) => {
        if (item.type === "separator") {
          if (Separator) return <Separator key={i} item={item} />;
          return (
            <SidebarSeparator key={i} className={cn(i !== 0 && "mt-6")}>
              {item.icon}
              {item.name}
            </SidebarSeparator>
          );
        }

        if (item.type === "folder") {
          const children = renderSidebarList(item.children, level + 1);
          if (Folder)
            return (
              <Folder key={i} item={item} level={level}>
                {children}
              </Folder>
            );
          return (
            <PageTreeFolder key={i} item={item}>
              {children}
            </PageTreeFolder>
          );
        }

        if (Item) return <Item key={item.url} item={item} />;
        return (
          <SidebarItem
            key={item.url}
            href={item.url}
            external={item.external}
            icon={item.icon}
          >
            {item.name}
          </SidebarItem>
        );
      });
    }

    return (
      <Fragment key={root.$id}>{renderSidebarList(root.children, 1)}</Fragment>
    );
  }, [props.components, root]);
}

function PageTreeFolder({
  item,
  ...props
}: {
  item: PageTree.Folder;
  children: ReactNode;
}) {
  const { defaultOpenLevel, level } = useInternalContext();

  return (
    <SidebarFolder defaultOpen={item.defaultOpen ?? defaultOpenLevel >= level}>
      {item.index ? (
        <SidebarFolderLink href={item.index.url} external={item.index.external}>
          {item.icon}
          {item.name}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger>
          {item.icon}
          {item.name}
        </SidebarFolderTrigger>
      )}
      <SidebarFolderContent>{props.children}</SidebarFolderContent>
    </SidebarFolder>
  );
}
