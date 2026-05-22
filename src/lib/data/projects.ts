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
  return projects.map((project: Record<string, unknown>) => ({
    ...project,
    featured: true as const,
    locale,
    url: `/${locale}/projects/${project.slug}`,
  }));
}

export async function getProject(
  locale: Locale,
  slug: string
): Promise<ProjectPageData | null> {
  const project = await client.fetch(getProjectQuery, { locale, slug });
  if (!project) return null;
  return {
    ...project,
    locale,
    url: `/${locale}/projects/${project.slug}`,
  };
}

export async function getAllProjects(
  locale: Locale
): Promise<ProjectCardData[]> {
  const projects = await client.fetch(getAllProjectsQuery, { locale });
  return projects.map((project: Record<string, unknown>) => ({
    ...project,
    locale,
    url: `/${locale}/projects/${project.slug}`,
  }));
}

export async function generateProjectStaticParams(): Promise<
  { locale: Locale; slug: string }[]
> {
  return client.fetch(generateProjectStaticParamsQuery);
}
