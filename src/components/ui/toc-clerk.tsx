"use client";
import {
  type TOCItemType,
  useActiveAnchors,
  useTOCItems,
} from "@/components/ui/toc";
import { TocThumb } from "@/components/ui/toc-thumb";
import { mergeRefs } from "@/lib/merge-refs";
import { cn } from "@/lib/utils";
import { type ComponentProps, useEffect, useRef, useState } from "react";

export default function ClerkTOCItems({
  ref,
  className,
  ...props
}: ComponentProps<"div">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useTOCItems();

  const [svg, setSvg] = useState<{
    path: string;
    width: number;
    height: number;
  }>();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    function onResize(): void {
      if (container.clientHeight === 0) return;
      let w = 0,
        h = 0;
      const d: string[] = [];
      for (let i = 0; i < items.length; i++) {
        const element = container.querySelector<HTMLElement>(
          `a[href="#${items[i].url.slice(1)}"]`
        );
        if (!element) continue;

        const styles = getComputedStyle(element);
        const offset = getLineOffset(items[i].depth) + 1,
          top = element.offsetTop + parseFloat(styles.paddingTop),
          bottom =
            element.offsetTop +
            element.clientHeight -
            parseFloat(styles.paddingBottom);

        w = Math.max(offset, w);
        h = Math.max(h, bottom);

        d.push(`${i === 0 ? "M" : "L"}${offset} ${top}`);
        d.push(`L${offset} ${bottom}`);
      }

      setSvg({ path: d.join(" "), width: w + 1, height: h });
    }

    const observer = new ResizeObserver(onResize);
    onResize();
    observer.observe(container);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0)
    return (
      <div className="bg-card text-muted-foreground rounded-lg border p-3 text-xs">
        No headings
      </div>
    );

  return (
    <>
      {svg ? (
        <div
          className="absolute start-0 top-0 rtl:-scale-x-100"
          style={{
            width: svg.width,
            height: svg.height,
            maskImage: `url("data:image/svg+xml,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1" fill="none" /></svg>`
            )}")`,
          }}
        >
          <TocThumb
            containerRef={containerRef}
            className="bg-primary mt-(--fd-top) h-(--fd-height) transition-all"
          />
        </div>
      ) : null}
      <div
        ref={mergeRefs(containerRef, ref)}
        className={cn("flex flex-col", className)}
        {...props}
      >
        {items.map((item, i) => (
          <TOCItem
            key={item.url}
            item={item}
            upper={items[i - 1]?.depth}
            lower={items[i + 1]?.depth}
          />
        ))}
      </div>
    </>
  );
}

function getItemOffset(depth: number): number {
  if (depth <= 2) return 14;
  if (depth === 3) return 26;
  return 36;
}

function getLineOffset(depth: number): number {
  return depth >= 3 ? 10 : 0;
}

function TOCItem({
  item,
  upper = item.depth,
  lower = item.depth,
}: {
  item: TOCItemType;
  upper?: number;
  lower?: number;
}) {
  const active = useActiveAnchors().includes(item.url.slice(1));
  const offset = getLineOffset(item.depth),
    upperOffset = getLineOffset(upper),
    lowerOffset = getLineOffset(lower);

  return (
    <a
      href={item.url}
      data-active={active}
      style={{ paddingInlineStart: getItemOffset(item.depth) }}
      className="text-muted-foreground hover:text-accent-foreground data-[active=true]:text-primary relative py-1.5 text-sm wrap-anywhere transition-colors first:pt-0 last:pb-0"
    >
      {offset !== upperOffset ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className="absolute start-0 -top-1.5 size-4 rtl:-scale-x-100"
        >
          <line
            x1={upperOffset}
            y1="0"
            x2={offset}
            y2="12"
            className="stroke-foreground/10"
            strokeWidth="1"
          />
        </svg>
      ) : null}
      <div
        className={cn(
          "bg-foreground/10 absolute inset-y-0 w-px",
          offset !== upperOffset && "top-1.5",
          offset !== lowerOffset && "bottom-1.5"
        )}
        style={{ insetInlineStart: offset }}
      />
      {item.title}
    </a>
  );
}
