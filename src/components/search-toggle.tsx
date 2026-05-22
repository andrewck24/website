"use client";
import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { type ComponentProps } from "react";

interface SearchToggleProps
  extends Omit<ComponentProps<"button">, "color">, ButtonProps {
  hideIfDisabled?: boolean;
}

export function SearchToggle({
  hideIfDisabled,
  size = "icon",
  variant = "ghost",
  ...props
}: SearchToggleProps) {
  // Search is disabled — separate change after Sanity migration
  if (hideIfDisabled) return null;

  return (
    <button
      type="button"
      className={cn(buttonVariants({ size, variant }), props.className)}
      data-search=""
      aria-label="Open Search"
      disabled
    >
      <Search />
    </button>
  );
}

export function LargeSearchToggle({
  hideIfDisabled,
  ...props
}: ComponentProps<"button"> & { hideIfDisabled?: boolean }) {
  if (hideIfDisabled) return null;

  return (
    <button
      type="button"
      data-search-full=""
      {...props}
      className={cn(
        "bg-secondary/50 text-muted-foreground border-border inline-flex items-center gap-2 rounded-lg border p-1.5 ps-2 text-sm",
        props.className
      )}
      disabled
    >
      <Search className="size-4" />
      Search
    </button>
  );
}
