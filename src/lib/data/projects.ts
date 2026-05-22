import { client } from "@/lib/sanity/client";
import {
  getAllProjectsQuery,
  generateProjectStaticParamsQuery,
  getFeaturedProjectsQuery,
  getProjectQuery,
} from "@/lib/sanity/queries";
import type {
  FeaturedProjectCardData,
  Locale,
  ProjectCardData,
  ProjectPageData,
} from "@/types/project";

export async function getFeaturedProjects(
  locale: Locale
): Promise<FeaturedProjectCardData[]> {
  const projects = await client.fetch(getFeaturedProjectsQuery, { locale });
  return (projects as Record<string, unknown>[])
    .filter((project) => Boolean(project.slug))
    .map((project) => ({
      ...(project as unknown as FeaturedProjectCardData),
      featured: true as const,
      locale,
      url: `/${locale}/projects/${project.slug as string}`,
    }));
}

export async function getProject(
  locale: Locale,
  slug: string
): Promise<ProjectPageData | null> {
  const project = await client.fetch(getProjectQuery, { locale, slug });
  if (!project || !project.slug) return null;
  return {
    ...(project as unknown as ProjectPageData),
    locale,
    url: `/${locale}/projects/${project.slug as string}`,
  };
}

export async function getAllProjects(
  locale: Locale
): Promise<ProjectCardData[]> {
  const projects = await client.fetch(getAllProjectsQuery, { locale });
  return (projects as Record<string, unknown>[])
    .filter((project) => Boolean(project.slug))
    .map((project) => ({
      ...(project as unknown as ProjectCardData),
      locale,
      url: `/${locale}/projects/${project.slug as string}`,
    }));
}

export async function generateProjectStaticParams(): Promise<
  { locale: Locale; slug: string }[]
> {
  return client.fetch(generateProjectStaticParamsQuery);
}
