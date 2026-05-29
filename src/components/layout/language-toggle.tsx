"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Locale } from "@/types/article";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { type ButtonHTMLAttributes, type HTMLAttributes } from "react";

const LOCALE_NAMES: Record<Locale, string> = {
  "zh-TW": "中文",
  en: "English",
  ja: "日本語",
};

const LOCALE_LABELS: Record<Locale, string> = {
  "zh-TW": "選擇語言",
  en: "Choose Language",
  ja: "言語を選択",
};

export interface LanguageToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  availableLocales: Locale[];
}

export function LanguageToggle({
  availableLocales,
  ...props
}: LanguageToggleProps): React.ReactElement {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = (pathname.split("/")[1] ?? "zh-TW") as Locale;

  const displayLocales = availableLocales.filter(
    (locale) => locale in LOCALE_NAMES
  );

  if (displayLocales.length <= 1) {
    return (
      <div
        className="text-muted-foreground text-sm"
        data-testid="language-toggle-single"
      >
        {LOCALE_NAMES[currentLocale] ?? currentLocale}
      </div>
    );
  }

  const handleLocaleChange = (locale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  return (
    <Popover>
      <PopoverTrigger
        aria-label={LOCALE_LABELS[currentLocale]}
        className={cn(
          buttonVariants({ variant: "ghost", className: "size-9" }),
          props.className
        )}
        {...props}
      >
        {props.children}
      </PopoverTrigger>
      <PopoverContent className="border-border flex flex-col overflow-hidden p-0">
        <p className="text-muted-foreground mb-1 p-2 text-xs font-medium">
          {LOCALE_LABELS[currentLocale]}
        </p>
        {displayLocales.map((locale) => (
          <button
            key={locale}
            type="button"
            className={cn(
              "p-2 text-start text-sm transition-colors",
              locale === currentLocale
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => handleLocaleChange(locale)}
          >
            {LOCALE_NAMES[locale]}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function LanguageToggleText(
  props: HTMLAttributes<HTMLSpanElement>
): React.ReactElement {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] ?? "zh-TW") as Locale;

  return <span {...props}>{LOCALE_NAMES[currentLocale] ?? currentLocale}</span>;
}
