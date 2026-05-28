import Link from "next/link";
import { getLocaleFromHeaders } from "@/lib/locale-from-headers";
import { getAvailableAboutLocales } from "@/lib/data/locales";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyContent,
} from "@/components/ui/empty";

const LOCALE_NAMES: Record<string, string> = {
  "zh-TW": "繁體中文",
  en: "English",
  ja: "日本語",
};

const labels: Record<
  string,
  { title: string; back: string; switcherLabel: string }
> = {
  "zh-TW": {
    title: "找不到關於頁面",
    back: "返回首頁",
    switcherLabel: "此內容也提供以下語言版本：",
  },
  en: {
    title: "About page not found",
    back: "Back to Home",
    switcherLabel: "This content is also available in:",
  },
  ja: {
    title: "Aboutページが見つかりません",
    back: "ホームに戻る",
    switcherLabel: "このコンテンツは以下の言語でもご覧いただけます：",
  },
};

export default async function NotFound() {
  const locale = await getLocaleFromHeaders();

  let availableLocales: string[] = [];
  try {
    availableLocales = await getAvailableAboutLocales();
  } catch {
    availableLocales = [];
  }

  const otherLocales = availableLocales.filter((l) => l !== locale);
  const { title, back, switcherLabel } = labels[locale] ?? labels["zh-TW"];

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        {otherLocales.length > 0 && (
          <div>
            <p>{switcherLabel}</p>
            {otherLocales.map((l) => (
              <Link key={l} href={`/${l}/about`}>
                {LOCALE_NAMES[l] ?? l}
              </Link>
            ))}
          </div>
        )}
        <Link href={`/${locale}`}>{back}</Link>
      </EmptyContent>
    </Empty>
  );
}
