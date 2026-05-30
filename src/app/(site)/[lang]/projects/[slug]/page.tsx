import { Article } from "@/components/article";
import { getAvailableLocales } from "@/lib/data/locales";
import { generateProjectStaticParams, getProject } from "@/lib/data/projects";
import type { Locale } from "@/types/project";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const backLinkTexts: Record<Locale, string> = {
  "zh-TW": "返回專案列表",
  en: "Back to Projects",
  ja: "プロジェクト一覧に戻る",
};

interface ProjectPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { lang, slug } = await params;
  const locale = lang as Locale;

  const project = await getProject(locale, slug);
  if (!project) notFound();

  const availableLocales = await getAvailableLocales(slug, "projects");
  if (availableLocales.length === 0) availableLocales.push(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    author: { "@type": "Person", name: "Andrew Tseng" },
    ...(project._updatedAt ? { dateModified: project._updatedAt } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Article
        article={project}
        contentType="projects"
        backLinkText={backLinkTexts[locale]}
        availableLocales={availableLocales}
      />
    </>
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

  const availableLocales = await getAvailableLocales(slug, "projects");
  const languages: Record<string, string> = {};
  for (const locale of availableLocales) {
    languages[locale] = `/${locale}/projects/${slug}`;
  }
  const xDefaultLocale = availableLocales.includes("zh-TW")
    ? "zh-TW"
    : availableLocales[0];
  languages["x-default"] = `/${xDefaultLocale}/projects/${slug}`;

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/${lang}/projects/${slug}`,
      languages,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      publishedTime: project.date,
    },
  };
}
