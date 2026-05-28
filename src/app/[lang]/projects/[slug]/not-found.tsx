import Link from "next/link";
import { headers } from "next/headers";
import { getLocaleFromHeaders } from "@/lib/locale-from-headers";
import { getAvailableLocales } from "@/lib/data/locales";
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
    title: "找不到這個專案",
    back: "返回專案列表",
    switcherLabel: "此內容也提供以下語言版本：",
  },
  en: {
    title: "Project not found",
    back: "Back to Projects",
    switcherLabel: "This content is also available in:",
  },
  ja: {
    title: "このプロジェクトは見つかりません",
    back: "プロジェクト一覧に戻る",
    switcherLabel: "このコンテンツは以下の言語でもご覧いただけます：",
  },
};

function getLabel(locale: string) {
  return labels[locale] ?? labels["zh-TW"];
}

export default async function NotFound() {
  const locale = await getLocaleFromHeaders();

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const slug = pathname.split("/")[3] ?? "";

  let availableLocales: string[] = [];
  try {
    availableLocales = await getAvailableLocales(slug, "projects");
  } catch {
    availableLocales = [];
  }

  const otherLocales = availableLocales.filter((l) => l !== locale);
  const { title, back, switcherLabel } = getLabel(locale);

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
              <Link key={l} href={`/${l}/projects/${slug}`}>
                {LOCALE_NAMES[l] ?? l}
              </Link>
            ))}
          </div>
        )}
        <Link href={`/${locale}/projects`}>{back}</Link>
      </EmptyContent>
    </Empty>
  );
}
