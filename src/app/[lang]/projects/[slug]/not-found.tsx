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

const labels: Record<string, { title: string; back: string }> = {
  "zh-TW": { title: "找不到這個專案", back: "返回專案列表" },
  en: { title: "Project not found", back: "Back to Projects" },
  ja: {
    title: "このプロジェクトは見つかりません",
    back: "プロジェクト一覧に戻る",
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
  const { title, back } = getLabel(locale);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        {otherLocales.length > 0 && (
          <div>
            {otherLocales.map((l) => (
              <Link key={l} href={`/${l}/projects/${slug}`}>
                {l}
              </Link>
            ))}
          </div>
        )}
        <Link href={`/${locale}/projects`}>{back}</Link>
      </EmptyContent>
    </Empty>
  );
}
