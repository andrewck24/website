import Link from "next/link";
import { getLocaleFromHeaders } from "@/lib/locale-from-headers";
import { getAvailableAboutLocales } from "@/lib/data/locales";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyContent,
} from "@/components/ui/empty";

const labels: Record<string, { title: string; back: string }> = {
  "zh-TW": { title: "找不到關於頁面", back: "返回首頁" },
  en: { title: "About page not found", back: "Back to Home" },
  ja: { title: "Aboutページが見つかりません", back: "ホームに戻る" },
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
  const { title, back } = labels[locale] ?? labels["zh-TW"];

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        {otherLocales.length > 0 && (
          <div>
            {otherLocales.map((l) => (
              <Link key={l} href={`/${l}/about`}>
                {l}
              </Link>
            ))}
          </div>
        )}
        <Link href={`/${locale}`}>{back}</Link>
      </EmptyContent>
    </Empty>
  );
}
