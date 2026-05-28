import { headers } from "next/headers";
import Link from "next/link";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyContent,
} from "@/components/ui/empty";
import { getLocaleFromHeaders } from "@/lib/locale-from-headers";
import { getAvailableLocales } from "@/lib/data/locales";

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
    title: "找不到這篇筆記",
    back: "返回筆記列表",
    switcherLabel: "此內容也提供以下語言版本：",
  },
  en: {
    title: "Note not found",
    back: "Back to Notes",
    switcherLabel: "This content is also available in:",
  },
  ja: {
    title: "このノートは見つかりません",
    back: "ノート一覧に戻る",
    switcherLabel: "のコンテンツは以下の言語でもご覧いただけます：",
  },
};

async function getSlugFromHeaders(): Promise<string> {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  return pathname.split("/")[3] ?? "";
}

export default async function NotFound() {
  const locale = await getLocaleFromHeaders();
  const slug = await getSlugFromHeaders();

  let availableLocales: string[] = [];
  try {
    availableLocales = await getAvailableLocales(slug, "notes");
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
              <Link key={l} href={`/${l}/notes/${slug}`}>
                {LOCALE_NAMES[l] ?? l}
              </Link>
            ))}
          </div>
        )}
        <Link href={`/${locale}/notes`}>{back}</Link>
      </EmptyContent>
    </Empty>
  );
}
