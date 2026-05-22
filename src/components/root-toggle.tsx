"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isTabActive } from "@/lib/is-active";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Check, ChevronsUpDown } from "lucide-react";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";

export interface Option {
  url: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  urls?: Set<string>;
  unlisted?: boolean;
  props?: ComponentProps<"a">;
}

export function RootToggle({
  options,
  placeholder,
  ...props
}: {
  placeholder?: ReactNode;
  options: Option[];
} & ComponentProps<"button">) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const selected = useMemo(() => {
    return options.findLast((item) => isTabActive(item, pathname));
  }, [options, pathname]);

  const item = selected ? (
    <>
      <div className="size-9 shrink-0 md:size-5">{selected.icon}</div>
      <div>
        <p className="text-sm font-medium">{selected.title}</p>
        <p className="text-muted-foreground text-[13px] empty:hidden md:hidden">
          {selected.description}
        </p>
      </div>
    </>
  ) : (
    placeholder
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {item && (
        <PopoverTrigger
          {...props}
          className={cn(
            "bg-secondary/50 text-secondary-foreground hover:bg-accent data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center gap-2 rounded-lg border p-2 text-start transition-colors",
            props.className
          )}
        >
          {item}
          <ChevronsUpDown className="text-muted-foreground ms-auto size-4 shrink-0" />
        </PopoverTrigger>
      )}
      <PopoverContent className="flex w-(--radix-popover-trigger-width) flex-col gap-1 overflow-hidden p-1">
        {options.map((item) => {
          const isActive = selected && item.url === selected.url;
          if (!isActive && item.unlisted) return;

          return (
            <Link
              key={item.url}
              href={item.url}
              onClick={() => setOpen(false)}
              {...item.props}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-lg p-1.5",
                item.props?.className
              )}
            >
              <div className="size-9 shrink-0 md:mt-1 md:mb-auto md:size-5">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-muted-foreground text-[13px] empty:hidden">
                  {item.description}
                </p>
              </div>
              <Check
                className={cn(
                  "text-primary ms-auto size-3.5 shrink-0",
                  !isActive && "invisible"
                )}
              />
            </Link>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
