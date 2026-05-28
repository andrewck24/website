import { cache } from "react";
import { client } from "@/lib/sanity/client";
import {
  getAvailableAboutLocalesQuery,
  getAvailableLocalesQuery,
} from "@/lib/sanity/queries";
import type { Locale } from "@/types/article";

const SANITY_TYPE_MAP: Record<string, string> = {
  notes: "note",
  projects: "project",
};

export const getAvailableLocales = cache(
  async (
    slug: string,
    contentType: "projects" | "notes"
  ): Promise<Locale[]> => {
    const type = SANITY_TYPE_MAP[contentType];
    return client.fetch(getAvailableLocalesQuery, { type, slug });
  }
);

export const getAvailableAboutLocales = cache(async (): Promise<Locale[]> => {
  return client.fetch(getAvailableAboutLocalesQuery);
});

export async function hasLocale(
  slug: string,
  locale: Locale,
  contentType: "projects" | "notes"
): Promise<boolean> {
  const availableLocales = await getAvailableLocales(slug, contentType);
  return availableLocales.includes(locale);
}
