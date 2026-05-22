import { MetadataRoute } from "next";

const LOCALES = ["zh-TW", "en", "ja"] as const;
const BASE_URL = "https://andrewck24.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((lang) => [
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
}
