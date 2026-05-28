import { ArticleCard, type ArticleCardProps } from "@/components/article/card";
import {
  ArticleImage,
  type ArticleImageProps,
} from "@/components/article/image";
import { ArticleInfo, type ArticleInfoProps } from "@/components/article/info";
import { portableTextComponents } from "@/components/mdx/portable-text";
import type { ArticlePageData, BaseArticle, Locale } from "@/types/article";
import { PortableText } from "@portabletext/react";
import { ArrowLeft } from "lucide-react";
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
        className="aspect-video"
      />

      <article className="bg-background/50 my-4 flex flex-col-reverse lg:mt-8">
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

export {
  ArticleCard,
  ArticleImage,
  ArticleInfo,
  type ArticleCardProps,
  type ArticleImageProps,
  type ArticleInfoProps,
};
