import { getAllNotes } from "@/lib/data/notes";
import { getAllProjects } from "@/lib/data/projects";
import { MetadataRoute } from "next";

const LOCALES = ["zh-TW", "en", "ja"] as const;
const BASE_URL = "https://andrewck24.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((lang) => [
    {
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/${lang}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/${lang}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/${lang}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  const [noteEntries, projectEntries] = await Promise.all([
    Promise.all(
      LOCALES.map(async (lang) => {
        const notes = await getAllNotes(lang);
        return notes.map((note) => ({
          url: `${BASE_URL}/${lang}/notes/${note.slug}`,
          lastModified: note._updatedAt
            ? new Date(note._updatedAt)
            : new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }));
      })
    ).then((r) => r.flat()),
    Promise.all(
      LOCALES.map(async (lang) => {
        const projects = await getAllProjects(lang);
        return projects.map((project) => ({
          url: `${BASE_URL}/${lang}/projects/${project.slug}`,
          lastModified: project._updatedAt
            ? new Date(project._updatedAt)
            : new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }));
      })
    ).then((r) => r.flat()),
  ]);

  return [...staticEntries, ...noteEntries, ...projectEntries];
}
