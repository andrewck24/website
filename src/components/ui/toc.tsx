"use client";
import { TocThumb } from "@/components/ui/toc-thumb";
import { mergeRefs } from "@/lib/merge-refs";
import { cn } from "@/lib/utils";
import {
  type ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface TOCItemType {
  title: string;
  url: string;
  depth: number;
}

const TOCContext = createContext<TOCItemType[]>([]);
const ActiveAnchorsContext = createContext<string[]>([]);

export function useTOCItems(): TOCItemType[] {
  return useContext(TOCContext);
}

export function useActiveAnchors(): string[] {
  return useContext(ActiveAnchorsContext);
}

export function TOCProvider({
  toc,
  children,
}: {
  toc: TOCItemType[];
  children: React.ReactNode;
}) {
  const [activeAnchors, setActiveAnchors] = useState<string[]>([]);

  useEffect(() => {
    const ids = toc.map((item) => item.url.slice(1));
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setActiveAnchors((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            if (entry.isIntersecting) {
              next.add(entry.target.id);
            } else {
              next.delete(entry.target.id);
            }
          }
          return Array.from(next);
        });
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [toc]);

  return (
    <TOCContext value={toc}>
      <ActiveAnchorsContext value={activeAnchors}>
        {children}
      </ActiveAnchorsContext>
    </TOCContext>
  );
}

export function TOCScrollArea({
  ref,
  className,
  ...props
}: ComponentProps<"div">) {
  const viewRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={mergeRefs(viewRef, ref)}
      className={cn(
        "relative ms-px min-h-0 overflow-auto [mask-image:linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3 text-sm [scrollbar-width:none]",
        className
      )}
      {...props}
    />
  );
}

export function TOCItems({ ref, className, ...props }: ComponentProps<"div">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useTOCItems();

  if (items.length === 0)
    return (
      <div className="bg-card text-muted-foreground rounded-lg border p-3 text-xs">
        No headings
      </div>
    );

  return (
    <>
      <TocThumb
        containerRef={containerRef}
        className="bg-primary absolute top-(--fd-top) h-(--fd-height) w-px transition-all"
      />
      <div
        ref={mergeRefs(ref, containerRef)}
        className={cn("border-foreground/10 flex flex-col border-s", className)}
        {...props}
      >
        {items.map((item) => (
          <TOCItem key={item.url} item={item} />
        ))}
      </div>
    </>
  );
}

function TOCItem({ item }: { item: TOCItemType }) {
  const active = useActiveAnchors().includes(item.url.slice(1));

  return (
    <a
      href={item.url}
      data-active={active}
      className={cn(
        "text-muted-foreground data-[active=true]:text-primary py-1.5 text-sm [overflow-wrap:anywhere] transition-colors first:pt-0 last:pb-0",
        item.depth <= 2 && "ps-3",
        item.depth === 3 && "ps-6",
        item.depth >= 4 && "ps-8"
      )}
    >
      {item.title}
    </a>
  );
}
