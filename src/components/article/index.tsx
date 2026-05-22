import { ArticleCard, type ArticleCardProps } from "@/components/article/card";
import {
  ArticleImage,
  type ArticleImageProps,
} from "@/components/article/image";
import { GithubInfo } from "@/components/github-info";
import { LanguageToggle } from "@/components/language-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { portableTextComponents } from "@/components/mdx/portable-text";
import type {
  ArticlePageData,
  ArticleTag,
  BaseArticle,
  Locale,
} from "@/types/article";
import { PortableText } from "@portabletext/react";
import { ArrowLeft, ExternalLink, Languages, Tag } from "lucide-react";
import Link from "next/link";

export interface ArticleProps<T extends BaseArticle = BaseArticle> {
  article: ArticlePageData<T>;
  contentType?: "projects" | "notes";
  backLinkText?: string;
  availableLocales: Locale[];
}

export function Article<T extends BaseArticle = BaseArticle>({
  article,
  contentType = "projects",
  backLinkText,
  availableLocales,
}: ArticleProps<T>) {
  const backLinkUrl = `/${article.locale}/${contentType}`;
  const defaultBackLinkText =
    contentType === "projects" ? "返回專案列表" : "返回筆記列表";

  return (
    <div
      className="prose prose-neutral dark:prose-invert mx-4 w-full overflow-x-hidden lg:mx-12"
      data-testid="article-section"
    >
      <header className="mt-12">
        <h1 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
          {article.title}
        </h1>
        {article.description && (
          <p className="text-muted-foreground mb-6 text-xl">
            {article.description}
          </p>
        )}
      </header>

      <ArticleImage
        slug={article.slug}
        title={article.title}
        coverImage={article.coverImage}
        priority={true}
        className="mt-6 aspect-video"
      />

      <article className="bg-background/50 my-4 flex flex-col-reverse lg:mt-8 lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        <div className="prose prose-gray dark:prose-invert mt-6 overflow-x-hidden">
          <PortableText
            value={article.body}
            components={portableTextComponents}
          />
        </div>

        <ArticleInfo
          date={article.date}
          locale={article.locale}
          tags={article.tags || []}
          githubUrl={
            "githubUrl" in article
              ? (article.githubUrl as string | undefined)
              : undefined
          }
          demoUrl={
            "demoUrl" in article
              ? (article.demoUrl as string | undefined)
              : undefined
          }
          contentType={contentType}
          availableLocales={availableLocales}
        />
      </article>

      <footer className="border-border mt-12 border-t py-8">
        <Link
          href={backLinkUrl}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="size-4" />
          {backLinkText || defaultBackLinkText}
        </Link>
      </footer>
    </div>
  );
}

interface ArticleInfoProps {
  date: string;
  locale: Locale;
  tags: ArticleTag[];
  githubUrl?: string;
  demoUrl?: string;
  contentType: "projects" | "notes";
  availableLocales: Locale[];
}

function ArticleInfo({
  date,
  locale,
  tags,
  githubUrl,
  demoUrl,
  contentType,
  availableLocales,
}: ArticleInfoProps) {
  return (
    <aside
      className="border-border mt-6 space-y-6 rounded-lg border p-4"
      data-testid="article-info"
    >
      <div>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          發布日期
        </h3>
        <time
          dateTime={date}
          className="text-muted-foreground text-sm"
          data-testid="article-date"
        >
          {new Date(date).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>

      {tags.length > 0 && (
        <div data-testid="article-tags">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Tag className="size-4" />
            標籤
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.slug} variant="secondary">
                {tag.title}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {contentType === "projects" && (githubUrl || demoUrl) && (
        <div data-testid="project-links">
          <h3 className="mb-2 text-sm font-semibold">專案連結</h3>
          <div className="space-y-2">
            {githubUrl && <GithubInfo url={githubUrl} className="w-full" />}
            {demoUrl && (
              <Button variant="outline" className="w-full" asChild>
                <Link
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View live demo"
                >
                  <ExternalLink className="mr-2 size-4" />
                  Live Demo
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}

      <div data-testid="language-toggle">
        <h3 className="mb-2 text-sm font-semibold">語言</h3>
        <LanguageToggle availableLocales={availableLocales}>
          <Languages className="size-5" />
        </LanguageToggle>
      </div>
    </aside>
  );
}

export {
  ArticleCard,
  ArticleImage,
  type ArticleCardProps,
  type ArticleImageProps,
};
