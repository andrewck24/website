import { Article } from "@/components/article";
import { getAvailableLocales } from "@/lib/data/locales";
import { getNote, generateNoteStaticParams } from "@/lib/data/notes";
import type { Locale } from "@/types/note";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

const backLinkTexts: Record<Locale, string> = {
  "zh-TW": "返回筆記列表",
  en: "Back to Notes",
  ja: "ノート一覧に戻る",
};

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params;
  const locale = lang as Locale;

  const note = await getNote(locale, slug);
  if (!note) notFound();

  const availableLocales = await getAvailableLocales(slug, "notes");
  if (availableLocales.length === 0) availableLocales.push(locale);

  return (
    <Article
      article={note}
      contentType="notes"
      backLinkText={backLinkTexts[locale]}
      availableLocales={availableLocales}
    />
  );
}

export async function generateStaticParams() {
  const params = await generateNoteStaticParams();
  return params.map((param) => ({ lang: param.locale, slug: param.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const note = await getNote(lang as Locale, slug);
  if (!note) return {};

  return {
    title: note.title,
    description: note.description,
  };
}
