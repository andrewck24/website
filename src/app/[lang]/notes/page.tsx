/**
 * Notes List Page
 *
 * 顯示精選筆記列表
 * T047: Implementation
 */

import { ArticleCard } from "@/components/article";
import { getFeaturedNotes } from "@/lib/data/notes";
import type { Locale } from "@/types/note";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ lang: string }>;
}

// i18n 標題對照
const pageTitles: Record<Locale, string> = {
  "zh-TW": "筆記",
  en: "Notes",
  ja: "ノート",
};

const pageDescriptions: Record<Locale, string> = {
  "zh-TW": "技術筆記與學習心得",
  en: "Technical notes and learning reflections",
  ja: "技術ノートと学習の振り返り",
};

const emptyMessages: Record<Locale, string> = {
  "zh-TW": "目前沒有精選筆記。",
  en: "No featured notes available at the moment.",
  ja: "現在、注目ノートはありません。",
};

export default async function NotesPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = lang as Locale;

  const featuredNotes = await getFeaturedNotes(locale);

  return (
    <div className="w-full py-12">
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
          {pageTitles[locale]}
        </h1>
        <p className="text-muted-foreground text-xl">
          {pageDescriptions[locale]}
        </p>
      </header>

      {/* Featured Notes Grid */}
      {featuredNotes.length > 0 ? (
        <section
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          data-testid="featured-notes-grid"
          aria-label={pageTitles[locale]}
        >
          {featuredNotes.map((note, index) => (
            <ArticleCard
              key={note.slug}
              article={note}
              variant={index === 0 ? "hero" : "compact"}
              priority={index === 0}
              contentType="notes"
            />
          ))}
        </section>
      ) : (
        <div className="text-muted-foreground py-12 text-center">
          {emptyMessages[locale]}
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  // 為每個語言生成靜態頁面
  return [{ lang: "zh-TW" }, { lang: "en" }, { lang: "ja" }];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;

  return {
    title: pageTitles[locale],
    description: pageDescriptions[locale],
  };
}
