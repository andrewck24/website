import { ArticleImage } from "@/components/article/image";
import { cn } from "@/lib/utils";
import type { ArticleCardData, BaseArticle } from "@/types/article";
import Link from "next/link";

export interface ArticleCardProps<T extends BaseArticle = BaseArticle> {
  article: ArticleCardData<T>;
  variant?: "hero" | "compact";
  priority?: boolean;
  contentType?: "projects" | "notes";
  className?: string;
}

export function ArticleCard<T extends BaseArticle = BaseArticle>({
  article,
  variant = "compact",
  priority = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  contentType = "projects",
  className,
}: ArticleCardProps<T>) {
  const isHero = variant === "hero";

  return (
    <Link
      href={article.url}
      className={cn(
        "group border-border block rounded-lg border shadow-sm transition-all hover:shadow-md",
        "flex overflow-hidden",
        isHero ? "flex-col md:col-span-2 lg:flex-row" : "flex-col md:flex-row",
        className
      )}
      data-testid="article-card"
    >
      <div
        className={cn("relative overflow-hidden", {
          "aspect-square w-full md:aspect-video": isHero,
          "aspect-video w-full md:aspect-square md:w-1/3": !isHero,
        })}
      >
        <ArticleImage
          slug={article.slug}
          title={article.title}
          coverImage={article.coverImage}
          priority={priority}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div
        className={cn("flex flex-col p-6", {
          "md:w-2/3": !isHero,
        })}
      >
        <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
          {article.title}
        </h3>
        <p className="mb-4 grow text-sm text-gray-600 dark:text-gray-400">
          {article.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString(article.locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
    </Link>
  );
}
