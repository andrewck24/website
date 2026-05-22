import { Article } from "@/components/article";
import { getAvailableLocales } from "@/lib/data/locales";
import { generateProjectStaticParams, getProject } from "@/lib/data/projects";
import type { Locale } from "@/types/project";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { lang, slug } = await params;

  const project = await getProject(lang as Locale, slug);
  if (!project) notFound();

  const availableLocales = await getAvailableLocales(slug, "projects");
  if (availableLocales.length === 0) availableLocales.push(lang as Locale);

  return (
    <Article
      article={project}
      contentType="projects"
      backLinkText="返回專案列表"
      availableLocales={availableLocales}
    />
  );
}

export async function generateStaticParams() {
  const params = await generateProjectStaticParams();
  return params.map((param) => ({ lang: param.locale, slug: param.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = await getProject(lang as Locale, slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      publishedTime: project.date,
    },
  };
}
