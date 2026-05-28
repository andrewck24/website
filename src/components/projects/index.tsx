import type { FeaturedProjectCardData, Locale } from "@/types/project";
import { FeaturedProjects } from "@/components/projects/featured-projects";

export interface ProjectsProps {
  projects: FeaturedProjectCardData[];
  locale: Locale;
}

export async function Projects({ projects, locale }: ProjectsProps) {
  return (
    <div className="w-full py-12">
      {/* Page Header */}
      <header>
        <h1 className="text-foreground mb-4 text-4xl font-bold">
          {locale === "zh-TW" && "專案作品集"}
          {locale === "en" && "Projects"}
          {locale === "ja" && "プロジェクト"}
        </h1>
      </header>

      {/* Featured Projects Section */}
      <FeaturedProjects projects={projects} locale={locale} />
    </div>
  );
}
