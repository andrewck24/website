"use client";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  type PageTree,
  TreeContextProvider,
  useTreeContext,
} from "@/components/sidebar";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  use,
  useMemo,
  useState,
} from "react";

interface SidebarContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContext | null>(null);

export interface DocsLayoutProps {
  tree: PageTree.Root;
  children: ReactNode;
}

export function DocsLayout({ tree, children }: DocsLayoutProps) {
  return (
    <TreeContextProvider tree={tree}>
      <LocalSidebarProvider>
        <header className="bg-background sticky top-0 z-20 h-14">
          <nav className="flex size-full flex-row items-center gap-2 px-4">
            <Link href="/" className="mr-auto font-medium">
              My Docs
            </Link>
            <NavbarSidebarTrigger className="md:hidden" />
          </nav>
        </header>
        <main
          id="nd-docs-layout"
          className="flex flex-1 flex-row [--fd-nav-height:56px]"
        >
          <Sidebar />
          {children}
        </main>
      </LocalSidebarProvider>
    </TreeContextProvider>
  );
}

function LocalSidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarContext value={useMemo(() => ({ open, setOpen }), [open])}>
      {children}
    </SidebarContext>
  );
}

function NavbarSidebarTrigger(props: ComponentProps<"button">) {
  const { open, setOpen } = use(SidebarContext)!;

  return (
    <button
      {...props}
      className={cn("text-sm", props.className)}
      onClick={() => setOpen(!open)}
    >
      Sidebar
    </button>
  );
}

function Sidebar() {
  const { root } = useTreeContext();
  const { open } = use(SidebarContext)!;

  const children = useMemo(() => {
    function renderItems(items: PageTree.Node[]) {
      return items.map((item, i) => (
        <SidebarItem key={i} item={item}>
          {item.type === "folder" ? renderItems(item.children) : null}
        </SidebarItem>
      ));
    }
    return renderItems(root.children);
  }, [root]);

  return (
    <aside
      className={cn(
        "fixed top-14 z-20 flex shrink-0 flex-col overflow-auto p-4 text-sm md:sticky md:h-[calc(100dvh-56px)] md:w-[300px]",
        "max-md:bg-background max-md:inset-x-0 max-md:bottom-0",
        !open && "max-md:invisible"
      )}
    >
      {children}
    </aside>
  );
}

const linkVariants = cva(
  "text-foreground/80 flex w-full items-center gap-2 rounded-lg py-1.5 [&_svg]:size-4",
  {
    variants: {
      active: {
        true: "text-primary font-medium",
        false: "hover:text-accent-foreground",
      },
    },
  }
);

function SidebarItem({
  item,
  children,
}: {
  item: PageTree.Node;
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (item.type === "page") {
    return (
      <Link
        href={item.url}
        className={linkVariants({ active: pathname === item.url })}
      >
        {item.icon}
        {item.name}
      </Link>
    );
  }

  if (item.type === "separator") {
    return (
      <p className="text-muted-foreground mt-6 mb-2 first:mt-0">
        {item.icon}
        {item.name}
      </p>
    );
  }

  return (
    <div>
      {item.index ? (
        <Link
          className={linkVariants({ active: pathname === item.index.url })}
          href={item.index.url}
        >
          {item.index.icon}
          {item.index.name}
        </Link>
      ) : (
        <p className={cn(linkVariants(), "text-start")}>
          {item.icon}
          {item.name}
        </p>
      )}
      <div className="flex flex-col border-l pl-4">{children}</div>
    </div>
  );
}
