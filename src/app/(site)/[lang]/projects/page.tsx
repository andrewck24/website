import { Projects } from "@/components/projects";
import { getFeaturedProjects } from "@/lib/data/projects";
import type { Locale } from "@/types/project";
import type { Metadata } from "next";

interface ProjectsPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { lang } = await params;

  // Fetch featured projects for the locale
  const projects = await getFeaturedProjects(lang as Locale);

  return <Projects projects={projects} locale={lang as Locale} />;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { lang } = await params;

  const titles = {
    "zh-TW": "專案作品集",
    en: "Projects",
    ja: "プロジェクト",
  };

  const descriptions = {
    "zh-TW": "精選專案展示，涵蓋流程改善、介面設計與全端開發等領域",
    en: "Featured projects showcasing process improvement, interface design, and full-stack development",
    ja: "プロセス改善、インターフェース設計、フルスタック開発などの注目プロジェクト",
  };

  return {
    title: titles[lang as Locale] || titles["zh-TW"],
    description: descriptions[lang as Locale] || descriptions["zh-TW"],
  };
}
