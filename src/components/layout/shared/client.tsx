"use client";
import type { BaseLinkType } from "@/components/layout/shared";
import { isActive } from "@/lib/is-active";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ComponentProps } from "react";

export function BaseLinkItem({
  ref,
  item,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { item: BaseLinkType }) {
  const pathname = usePathname();
  const activeType = item.active ?? "url";
  const active =
    activeType !== "none" &&
    isActive(item.url, pathname, activeType === "nested-url");

  return (
    <Link
      ref={ref}
      href={item.url}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      {...props}
      data-active={active}
    >
      {props.children}
    </Link>
  );
}
