"use client";
import { useActiveAnchors } from "@/components/ui/toc";
import { type HTMLAttributes, type RefObject, useEffect, useRef } from "react";

export type TOCThumb = [top: number, height: number];

function calc(container: HTMLElement, active: string[]): TOCThumb {
  if (active.length === 0 || container.clientHeight === 0) return [0, 0];

  let upper = Number.MAX_VALUE,
    lower = 0;

  for (const item of active) {
    const element = container.querySelector<HTMLElement>(`a[href="#${item}"]`);
    if (!element) continue;

    const styles = getComputedStyle(element);
    upper = Math.min(upper, element.offsetTop + parseFloat(styles.paddingTop));
    lower = Math.max(
      lower,
      element.offsetTop +
        element.clientHeight -
        parseFloat(styles.paddingBottom)
    );
  }

  return [upper, lower - upper];
}

function updateThumb(element: HTMLElement, info: TOCThumb): void {
  element.style.setProperty("--fd-top", `${info[0]}px`);
  element.style.setProperty("--fd-height", `${info[1]}px`);
}

export function TocThumb({
  containerRef,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const active = useActiveAnchors();
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !thumbRef.current) return;
    updateThumb(thumbRef.current, calc(containerRef.current, active));
  }, [active, containerRef]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const observer = new ResizeObserver(() => {
      if (thumbRef.current)
        updateThumb(thumbRef.current, calc(container, active));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [active, containerRef]);

  return <div ref={thumbRef} role="none" {...props} />;
}
