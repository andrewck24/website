import { GithubInfo } from "@/components/github-info";
import { LanguageToggle } from "@/components/language-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ArticleTag, Locale } from "@/types/article";
import { ExternalLink, Languages } from "lucide-react";
import Link from "next/link";

export interface ArticleInfoProps {
  date: string;
  locale: Locale;
  tags: ArticleTag[];
  githubUrl?: string;
  demoUrl?: string;
  contentType: "projects" | "notes";
  availableLocales: Locale[];
}

export function ArticleInfo({
  date,
  locale,
  tags,
  githubUrl,
  demoUrl,
  contentType,
  availableLocales,
}: ArticleInfoProps) {
  return (
    <div
      className="border-border not-prose space-y-4 rounded-lg border p-4"
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
    </div>
  );
}
